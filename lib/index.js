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
var __rest =
    (this && this.__rest) ||
    function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (
                var i = 0, p = Object.getOwnPropertySymbols(s);
                i < p.length;
                i++
            ) {
                if (
                    e.indexOf(p[i]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(s, p[i])
                )
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const brs_1 = require("brs");
const fast_glob_1 = __importDefault(require("fast-glob"));
const path = __importStar(require("path"));
const c = __importStar(require("ansi-colors"));
const coverage_1 = require("./coverage");
const util_1 = require("./util");
const runner_1 = require("./runner");
const { isBrsBoolean, isBrsString, RoArray, RoAssociativeArray } = brs_1.types;
async function findBrsFiles(sourceDir) {
    let searchDir = sourceDir || "source";
    const pattern = path
        .join(process.cwd(), searchDir, "**", "*.brs")
        .replace(/\\/g, "/");
    return fast_glob_1.default(pattern);
}
/**
 * Generates an execution scope and runs the tests.
 * @param files List of filenames to load into the execution scope
 * @param options BRS interpreter options
 */
async function run(brsSourceFiles, options) {
    var _a;
    let {
        reporter,
        requireFilePath,
        forbidFocused,
        coverageReporters = [],
        filePatterns,
    } = options;
    let coverageEnabled = coverageReporters.length > 0;
    // Get the list of files that we should load into the execution scope.
    // Loading them here ensures that they only get lexed/parsed once.
    let inScopeFiles = [
        "roca_lib.brs",
        "assert_lib.brs",
        path.join("tap", "tap.brs"),
    ].map((basename) => path.join(__dirname, "..", "resources", basename));
    if (requireFilePath) {
        inScopeFiles.push(requireFilePath);
    }
    inScopeFiles.push(...brsSourceFiles);
    let testRunner = await runner_1.createTestRunner(reporter);
    // Create an execution scope using the project source files and roca files.
    let execute;
    try {
        execute = await brs_1.createExecuteWithScope(inScopeFiles, {
            root: process.cwd(),
            stdout: testRunner.reporterStream,
            stderr: process.stderr,
            generateCoverage: coverageEnabled,
            componentDirs: ["test", "tests"],
        });
    } catch (e) {
        console.error(
            `Stopping execution. Interpreter encountered errors:\n\t${util_1.formatInterpreterError(
                e
            )}`
        );
        process.exit(1);
    }
    let { testFiles, focusedCasesDetected } = await getTestFiles(
        execute,
        filePatterns
    );
    // Fail if we find focused test cases and there weren't supposed to be any.
    if (forbidFocused && focusedCasesDetected) {
        let formattedList = testFiles
            .map((filename) => `\t${filename}`)
            .join("\n");
        console.error(
            c.red(
                `Error: used command line arg ${c.cyan(
                    "--forbid-focused"
                )} but found focused tests in these files:\n${formattedList}`
            )
        );
        process.exit(1);
    }
    testRunner.run(execute, testFiles, focusedCasesDetected);
    testRunner.reporterStream.end();
    if (coverageEnabled) {
        coverage_1.reportCoverage(coverageReporters);
    }
    return (
        ((_a = testRunner.reporterStream.runner) === null || _a === void 0
            ? void 0
            : _a.testResults) || {}
    );
}
/**
 * Returns the appropriate set of *.test.brs files, depending on whether it detects any focused tests.
 * Runs through the entire test suite (in non-exec mode) to determine this.
 * Also returns a boolean indicating whether focused tests were found.
 * @param execute The scoped execution function to run with each file
 * @param filePatterns A list of strings to match files against
 */
async function getTestFiles(execute, filePatterns) {
    let testFiles = await util_1.globMatchFiles(filePatterns);
    let focusedSuites = [];
    let emptyRunArgs = new RoAssociativeArray([]);
    testFiles.forEach((filename) => {
        try {
            // Run the file in non-exec mode.
            let suite = execute([filename], [emptyRunArgs]);
            // Keep track of which files have focused cases.
            let subSuites =
                suite instanceof RoArray ? suite.getElements() : [suite];
            if (hasFocusedCases(subSuites)) {
                focusedSuites.push(filename);
            }
        } catch (_a) {
            // This is the pre-execution phase; report interpreter errors during execution instead.
        }
    });
    let focusedCasesDetected = focusedSuites.length > 0;
    return {
        focusedCasesDetected,
        testFiles: focusedCasesDetected ? focusedSuites : testFiles,
    };
}
/**
 * Checks to see if any suites in a given array of suites are focused.
 * @param subSuites An array of Roca suite objects to check
 */
function hasFocusedCases(subSuites) {
    for (let subSuite of subSuites) {
        if (!(subSuite instanceof RoAssociativeArray)) continue;
        let mode = subSuite.elements.get("mode");
        if (mode && isBrsString(mode) && mode.value === "focus") {
            return true;
        }
        let state = subSuite.elements.get("__state");
        if (state instanceof RoAssociativeArray) {
            let hasFocusedDescendants = state.elements.get(
                "hasfocuseddescendants"
            );
            if (
                hasFocusedDescendants &&
                isBrsBoolean(hasFocusedDescendants) &&
                hasFocusedDescendants.toBoolean()
            ) {
                return true;
            }
        }
    }
    return false;
}
module.exports = async function (args) {
    let { sourceDir } = args,
        options = __rest(args, ["sourceDir"]);
    let files = await findBrsFiles(sourceDir);
    return await run(files, options);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBc0U7QUFDdEUsMERBQWlDO0FBQ2pDLDJDQUE2QjtBQUM3QiwrQ0FBaUM7QUFFakMseUNBQTRDO0FBQzVDLGlDQUFnRTtBQUNoRSxxQ0FBMEQ7QUFFMUQsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLEdBQUcsV0FBSyxDQUFDO0FBb0J6RSxLQUFLLFVBQVUsWUFBWSxDQUFDLFNBQWtCO0lBQzFDLElBQUksU0FBUyxHQUFHLFNBQVMsSUFBSSxRQUFRLENBQUM7SUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBSTtTQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7U0FDN0MsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6QixPQUFPLG1CQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxLQUFLLFVBQVUsR0FBRyxDQUFDLGNBQXdCLEVBQUUsT0FBbUI7O0lBQzVELElBQUksRUFDQSxRQUFRLEVBQ1IsZUFBZSxFQUNmLGFBQWEsRUFDYixpQkFBaUIsR0FBRyxFQUFFLEVBQ3RCLFlBQVksR0FDZixHQUFHLE9BQU8sQ0FBQztJQUNaLElBQUksZUFBZSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFbkQsc0VBQXNFO0lBQ3RFLGtFQUFrRTtJQUNsRSxJQUFJLFlBQVksR0FBRztRQUNmLGNBQWM7UUFDZCxnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDO0tBQzlCLENBQUMsR0FBRyxDQUFDLENBQUMs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
