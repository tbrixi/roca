"use strict";
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              Object.defineProperty(o, k2, {
                  enumerable: true,
                  get: function () {
                      return m[k];
                  },
              });
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, "default", {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o["default"] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.globMatchFiles = exports.formatInterpreterError = void 0;
const c = __importStar(require("ansi-colors"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
function formatInterpreterError(error) {
    if (!Array.isArray(error)) {
        return error.toString();
    }
    return error
        .map(
            (e) =>
                `${e}\n\t\t` +
                c.dim(
                    `at ${e.location.file}:${e.location.start.line}:${e.location.start.column}`
                )
        )
        .join("\n\t");
}
exports.formatInterpreterError = formatInterpreterError;
/**
 * Finds all the test files that match a given list of strings. If the list is empty,
 * it finds all *.test.brs files.
 * @param filePatterns A list of file path matches from the command line
 */
async function globMatchFiles(filePatterns) {
    let parsedPatterns = [];
    filePatterns.forEach((match) => {
        if (path.parse(match).ext === ".brs") {
            // If the string is a brs file, match anything that ends with this file name.
            parsedPatterns.push(`*${match}`);
        } else {
            // Do a partial match on any files with this string in their name.
            parsedPatterns.push(`*${match}*.test.brs`);
            // Do a partial match on any directories with this string in their name.
            parsedPatterns.push(`*${match}*/**/*.test.brs`);
        }
    });
    let testsPattern = `${process.cwd()}/**/`;
    if (parsedPatterns.length === 0) {
        // If the user didn't specify any pattern, just look for .test.brs files.
        testsPattern += "*.test.brs";
    } else if (parsedPatterns.length === 1) {
        testsPattern += parsedPatterns[0];
    } else {
        testsPattern += `{${parsedPatterns.join(",")}}`;
    }
    testsPattern = testsPattern.replace(/\\/g, "/");
    // exclude node_modules from the test search
    return fast_glob_1.default([
        testsPattern,
        `!${process.cwd()}/node_modules/**/*`,
    ]);
}
exports.globMatchFiles = globMatchFiles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBaUM7QUFDakMsMkNBQTZCO0FBQzdCLDBEQUFpQztBQUVqQyxTQUFnQixzQkFBc0IsQ0FBQyxLQUFVO0lBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzNCO0lBRUQsT0FBTyxLQUFLO1NBQ1AsR0FBRyxDQUNBLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDRixHQUFHLENBQUMsUUFBUTtRQUNaLENBQUMsQ0FBQyxHQUFHLENBQ0QsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQzlFLENBQ1I7U0FDQSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQWRELHdEQWNDO0FBRUQ7Ozs7R0FJRztBQUNJLEtBQUssVUFBVSxjQUFjLENBQUMsWUFBc0I7SUFDdkQsSUFBSSxjQUFjLEdBQWEsRUFBRSxDQUFDO0lBQ2xDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUMzQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLE1BQU0sRUFBRTtZQUNsQyw2RUFBNkU7WUFDN0UsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDcEM7YUFBTTtZQUNILGtFQUFrRTtZQUNsRSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsQ0FBQztZQUUzQyx3RUFBd0U7WUFDeEUsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssaUJBQWlCLENBQUMsQ0FBQztTQUNuRDtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxZQUFZLEdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQztJQUNsRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzdCLHlFQUF5RTtRQUN6RSxZQUFZLElBQUksWUFBWSxDQUFDO0tBQ2hDO1NBQU0sSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNwQyxZQUFZLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO1NBQU07UUFDSCxZQUFZLElBQUksSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7S0FDbkQ7SUFDRCxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEQsNENBQTRDO0lBQzVDLE9BQU8sbUJBQVEsQ0FBQyxDQUFDLFlBQVksRUFBRSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUEzQkQsd0NBMkJDIn0=
