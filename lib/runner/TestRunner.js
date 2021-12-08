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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunner = void 0;
const path = __importStar(require("path"));
const brs_1 = require("brs");
const util_1 = require("../util");
class TestRunner {
    constructor(reporterStream) {
        this.reporterStream = reporterStream;
    }
    /**
     * Executes and reports a given list of test files.
     * @param execute The scoped execution function
     * @param testFiles The list of files to run
     * @param focusedCasesDetected Whether or not focused cases were detected
     */
    run(execute, testFiles, focusedCasesDetected) {
        // Create an instance of the BrightScript TAP object so we can pass it to the tests for reporting.
        let tap = execute(
            [path.join(__dirname, "..", "..", "resources", "tap", "main.brs")],
            [new brs_1.types.Int32(testFiles.length)]
        );
        let executeArgs = this.generateExecuteArgs(tap, focusedCasesDetected);
        this._run(execute, executeArgs, testFiles);
    }
    /**
     * Executes and reports a given test file. Subclasses should override this method
     * with custom implementations as needed.
     * @param execute The scoped execution function
     * @param executeArgs Args to pass to the execution function
     * @param filename The file to execute
     */
    _run(execute, executeArgs, testFiles) {
        testFiles.forEach((filename, index) => {
            // Set the index so that our TAP reporting is correct.
            executeArgs.elements.set("index", new brs_1.types.Int32(index));
            try {
                execute([filename], [executeArgs]);
            } catch (e) {
                console.error(
                    `Stopping execution. Interpreter encountered errors:\n\t${util_1.formatInterpreterError(
                        e
                    )}`
                );
                process.exit(1);
            }
        });
    }
    /**
     * Generates the execute arguments for roca, to pass to test files when executing them.
     * @param tap The return value from tap.brs (an instance of the Tap object)
     * @param focusedCasesDetected Whether or not there are focused cases in this run
     */
    generateExecuteArgs(tap, focusedCasesDetected) {
        return new brs_1.types.RoAssociativeArray([
            {
                name: new brs_1.types.BrsString("exec"),
                value: brs_1.types.BrsBoolean.True,
            },
            {
                name: new brs_1.types.BrsString("focusedCasesDetected"),
                value: brs_1.types.BrsBoolean.from(focusedCasesDetected),
            },
            {
                name: new brs_1.types.BrsString("index"),
                value: new brs_1.types.Int32(0),
            },
            {
                name: new brs_1.types.BrsString("tap"),
                value: tap,
            },
        ]);
    }
}
exports.TestRunner = TestRunner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFJ1bm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvVGVzdFJ1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTZCO0FBQzdCLDZCQUEwRDtBQUMxRCxrQ0FBaUQ7QUFFakQsTUFBYSxVQUFVO0lBQ25CLFlBQXFCLGNBQXdDO1FBQXhDLG1CQUFjLEdBQWQsY0FBYyxDQUEwQjtJQUFHLENBQUM7SUFFakU7Ozs7O09BS0c7SUFDSSxHQUFHLENBQ04sT0FBeUIsRUFDekIsU0FBbUIsRUFDbkIsb0JBQTZCO1FBRTdCLGtHQUFrRztRQUNsRyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQ2IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFDbEUsQ0FBQyxJQUFJLFdBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3pDLENBQUM7UUFDRixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTyxJQUFJLENBQ1YsT0FBeUIsRUFDekIsV0FBd0MsRUFDeEMsU0FBbUI7UUFFbkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNsQyxzREFBc0Q7WUFDdEQsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksV0FBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzdELElBQUk7Z0JBQ0EsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLEtBQUssQ0FDVCwwREFBMEQsNkJBQXNCLENBQzVFLENBQUMsQ0FDSixFQUFFLENBQ04sQ0FBQztnQkFDRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25CO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLG1CQUFtQixDQUN2QixHQUFxQixFQUNyQixvQkFBNkI7UUFFN0IsT0FBTyxJQUFJLFdBQVEsQ0FBQyxrQkFBa0IsQ0FBQztZQUNuQztnQkFDSSxJQUFJLEVBQUUsSUFBSSxXQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztnQkFDcEMsS0FBSyxFQUFFLFdBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTthQUNsQztZQUNEO2dCQUNJLElBQUksRUFBRSxJQUFJLFdBQVEsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUM7Z0JBQ3BELEtBQUssRUFBRSxXQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQzthQUN4RDtZQUNEO2dCQUNJLElBQUksRUFBRSxJQUFJLFdBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUNyQyxLQUFLLEVBQUUsSUFBSSxXQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUMvQjtZQUNEO2dCQUNJLElBQUksRUFBRSxJQUFJLFdBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO2dCQUNuQyxLQUFLLEVBQUUsR0FBRzthQUNiO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBL0VELGdDQStFQyJ9
