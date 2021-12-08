"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFailureMessage = exports.createAssertionResult = exports.createContext = void 0;
const chalk_1 = __importDefault(require("chalk"));
const jest_matcher_utils_1 = require("jest-matcher-utils");
/**
 * This generates a Jest Context-like object. We are coercing the type
 * because Jest expects some internal stuff that we have no need for, and doesn't
 * affect the execution of the functions we're using.
 * @param config The Jest Project config
 */
function createContext(config) {
    return { config };
}
exports.createContext = createContext;
/**
 * Utility function that creates a Jest AssertionResult for a test suite.
 * @param status The result status of the test suite
 * @param name The name of the test case
 * @param ancestorName Any ancestor suite names
 * @param failureMessage The optional failure message for the suite
 */
function createAssertionResult(status, name, failureMessage) {
    return {
        status,
        title: name,
        fullName: name,
        failureMessages: failureMessage ? [failureMessage] : [],
        failureDetails: [],
        ancestorTitles: [],
        numPassingAsserts: 0,
    };
}
exports.createAssertionResult = createAssertionResult;
/**
 * Jest expects a specific format for the stack trace and error message
 * in order to generate the code frame, so this is a utility to generate it.
 * @param diag The diagnostics object from an assert
 */
function createFailureMessage(diag) {
    let {
        error: { stack_frames, message, name },
        wanted,
        found,
    } = diag;
    try {
        wanted = JSON.parse(wanted);
        found = JSON.parse(found);
    } catch (_a) {}
    let diff = null;
    diff = jest_matcher_utils_1.printDiffOrStringify(
        wanted,
        found,
        "Expected",
        "Received",
        /* expand */ false
    );
    let formattedStackTrace = stack_frames
        .map((line, index) => {
            if (index === 0 && name) {
                return "at " + name + " (" + line + ")";
            } else {
                return "at " + line;
            }
        })
        .join("\n");
    let fullMessage = chalk_1.default.red(message) + "\n\n";
    if (diff) {
        fullMessage += diff + "\n";
    }
    fullMessage += formattedStackTrace;
    return fullMessage;
}
exports.createFailureMessage = createFailureMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3J0ZXIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLDJEQUEwRDtBQTBCMUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixhQUFhLENBQUMsTUFBcUI7SUFDL0MsT0FBTyxFQUFFLE1BQU0sRUFBYSxDQUFDO0FBQ2pDLENBQUM7QUFGRCxzQ0FFQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLHFCQUFxQixDQUNqQyxNQUFjLEVBQ2QsSUFBWSxFQUNaLGNBQXVCO0lBRXZCLE9BQU87UUFDSCxNQUFNO1FBQ04sS0FBSyxFQUFFLElBQUk7UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDdkQsY0FBYyxFQUFFLEVBQUU7UUFDbEIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsaUJBQWlCLEVBQUUsQ0FBQztLQUN2QixDQUFDO0FBQ04sQ0FBQztBQWRELHNEQWNDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLG9CQUFvQixDQUFDLElBQVU7SUFDM0MsSUFBSSxFQUNBLEtBQUssRUFBRSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQ3RDLE1BQU0sRUFDTixLQUFLLEdBQ1IsR0FBRyxJQUFJLENBQUM7SUFFVCxJQUFJO1FBQ0EsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0I7SUFBQyxXQUFNLEdBQUU7SUFFVixJQUFJLElBQUksR0FBa0IsSUFBSSxDQUFDO0lBQy9CLElBQUksR0FBRyx5Q0FBb0IsQ0FDdkIsTUFBTSxFQUNOLEtBQUssRUFDTCxVQUFVLEVBQ1YsVUFBVTtJQUNWLFlBQVksQ0FBQyxLQUFLLENBQ3JCLENBQUM7SUFFRixJQUFJLG1CQUFtQixHQUFHLFlBQVk7U0FDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2pCLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDckIsT0FBTyxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQzNDO2FBQU07WUFDSCxPQUFPLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDTCxDQUFDLENBQUM7U0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFaEIsSUFBSSxXQUFXLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDOUMsSUFBSSxJQUFJLEVBQUU7UUFDTixXQUFXLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztLQUM5QjtJQUNELFdBQVcsSUFBSSxtQkFBbUIsQ0FBQztJQUNuQyxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDO0FBckNELG9EQXFDQyJ9
