"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JestReporter = void 0;
const reporters_1 = require("@jest/reporters");
const test_result_1 = require("@jest/test-result");
const jest_message_util_1 = require("jest-message-util");
const utils_1 = require("./utils");
function isBrsError(error) {
    let maybeBrsError = error;
    return !!maybeBrsError.location && !!maybeBrsError.message;
}
class JestReporter {
    constructor(reporterStream, projectConfig, globalConfig, reporterType) {
        this.reporterStream = reporterStream;
        this.projectConfig = projectConfig;
        /** The results from the test file that is currently being run. */
        this.currentResults = test_result_1.createEmptyTestResult();
        this.subscribeToParser(reporterStream);
        // Create aggregated results for reporting
        this.aggregatedResults = test_result_1.makeEmptyAggregatedTestResult();
        // Create a summary reporter and either a default or verbose reporter.
        this.reporters = [];
        if (reporterType === "jest-verbose") {
            this.reporters.push(new reporters_1.VerboseReporter(globalConfig));
        } else {
            this.reporters.push(new reporters_1.DefaultReporter(globalConfig));
        }
        this.reporters.push(new reporters_1.SummaryReporter(globalConfig));
    }
    /**
     * Subscribe to a TAP Parser's events.
     * @param parser Parser instance to subscribe
     */
    subscribeToParser(parser) {
        parser.on("fail", this.onTestFailure.bind(this));
        parser.on("child", this.subscribeToParser.bind(this));
        parser.on("pass", (assert) => {
            this.currentResults.numPassingTests++;
            this.addNonFailureTestResult(assert, "passed");
        });
        parser.on("skip", (assert) => {
            this.currentResults.numTodoTests++;
            this.addNonFailureTestResult(assert, "skipped");
        });
        parser.on("todo", (assert) => {
            this.currentResults.numTodoTests++;
            this.addNonFailureTestResult(assert, "todo");
        });
        parser.on("extra", (extra) => {
            if (!this.currentResults.console) {
                this.currentResults.console = [];
            }
            this.currentResults.console.push({
                message: extra,
                origin: "",
                type: "info",
            });
        });
    }
    /**
     * Callback for when a test run is starting.
     * @param numSuites The number of suites in the run
     */
    onRunStart(numSuites) {
        this.aggregatedResults.startTime = Date.now();
        this.aggregatedResults.numTotalTestSuites = numSuites;
        this.reporters.forEach((reporter) => {
            reporter.onRunStart(this.aggregatedResults, {
                estimatedTime: 0,
                showStatus: false,
            });
        });
    }
    /**
     * Callback for when all test files have been executed.
     */
    onRunComplete() {
        let contextSet = new Set([utils_1.createContext(this.projectConfig)]);
        this.reporters.forEach((reporter) => {
            reporter.onRunComplete(contextSet, this.aggregatedResults);
        });
    }
    /**
     * Callback for when brs encounters an execution error.
     * @param filename The name of the file that failed
     * @param index The TAP index of the file
     * @param reason The error that was thrown to cause the execution error
     */
    onFileExecError(filename, index, reason) {
        // If we get an array of errors, report the first one.
        reason = Array.isArray(reason) ? reason[0] : reason;
        if (isBrsError(reason)) {
            this.currentResults.testExecError = {
                stack: `\nat ${reason.location.file}:${reason.location.start.line}:${reason.location.start.column}`,
                message: reason.message,
            };
        } else {
            this.currentResults.testExecError = {
                stack: reason.stack,
                message: reason.message,
            };
        }
    }
    /**
     * Callback for when a file starts test execution. Creates empty results
     * for the new file and sets it as the current results for this parser.
     * @param filePath The path to the file that is starting its run.
     */
    onFileStart(filePath) {
        this.currentResults = test_result_1.createEmptyTestResult();
        this.currentResults.testFilePath = filePath;
        this.currentResults.perfStats.start = Date.now();
    }
    /**
     * Callback for when a file ends execution. Adds the results from the current
     * file to the aggregated results, and tells each Jest reporter that this file has completed.
     */
    onFileComplete() {
        // Flatten console output because tap-parser splits output by newline in the "extra" event.
        // We don't know which lines are supposed to go together, so just print them all together.
        if (this.currentResults.console) {
            this.currentResults.console = [
                {
                    message: this.currentResults.console
                        .map((entry) => entry.message)
                        .join(""),
                    origin: "",
                    type: "print",
                },
            ];
        }
        if (this.currentResults.testExecError) {
            this.currentResults.failureMessage = jest_message_util_1.formatExecError(
                this.currentResults.testExecError,
                this.projectConfig,
                { noStackTrace: false, noCodeFrame: false }
            );
        } else {
            // Generate the failure message if there is one.
            this.currentResults.failureMessage = jest_message_util_1.formatResultsErrors(
                this.currentResults.testResults,
                this.projectConfig,
                {
                    noStackTrace: false,
                    noCodeFrame: false,
                },
                this.currentResults.testFilePath
            );
        }
        this.currentResults.perfStats.end = Date.now();
        this.currentResults.perfStats.runtime =
            this.currentResults.perfStats.start -
            this.currentResults.perfStats.end;
        // Add our file results to the overall aggregated results
        test_result_1.addResult(this.aggregatedResults, this.currentResults);
        // Tell our reporters that this file is complete.
        this.reporters.forEach((reporter) => {
            reporter.onTestResult(
                {
                    path: this.currentResults.testFilePath,
                    context: utils_1.createContext(this.projectConfig),
                },
                this.currentResults,
                this.aggregatedResults
            );
        });
    }
    /**
     * Utility function for non-failed test results.
     * @param assert Metadata object about the failed test.
     * @param status The test result status
     */
    addNonFailureTestResult(assert, status) {
        this.currentResults.testResults.push(
            utils_1.createAssertionResult(status, assert.name)
        );
    }
    /**
     * Callback when a test case fails.
     * @param assert Metadata object about the failed test.
     */
    onTestFailure(assert) {
        let failureMessage = assert.diag
            ? utils_1.createFailureMessage(assert.diag)
            : "Test case failed";
        // Add the failed test case to our ongoing results.
        this.currentResults.numFailingTests++;
        this.currentResults.testResults.push(
            utils_1.createAssertionResult("failed", assert.name, failureMessage)
        );
        process.exitCode = 1;
    }
}
exports.JestReporter = JestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSmVzdFJlcG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9ydGVyL0plc3RSZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQ0FPeUI7QUFDekIsbURBSzJCO0FBQzNCLHlEQUF5RTtBQUN6RSxtQ0FLaUI7QUFJakIsU0FBUyxVQUFVLENBQUMsS0FBdUI7SUFDdkMsSUFBSSxhQUFhLEdBQUcsS0FBaUIsQ0FBQztJQUN0QyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO0FBQy9ELENBQUM7QUFFRCxNQUFhLFlBQVk7SUFVckIsWUFDYSxjQUF3QyxFQUN6QyxhQUFtQyxFQUMzQyxZQUFpQyxFQUNqQyxZQUFvQjtRQUhYLG1CQUFjLEdBQWQsY0FBYyxDQUEwQjtRQUN6QyxrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFSL0Msa0VBQWtFO1FBQzFELG1CQUFjLEdBQWUsbUNBQXFCLEVBQUUsQ0FBQztRQVd6RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFdkMsMENBQTBDO1FBQzFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRywyQ0FBNkIsRUFBRSxDQUFDO1FBRXpELHNFQUFzRTtRQUN0RSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLFlBQVksS0FBSyxjQUFjLEVBQUU7WUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSwyQkFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDMUQ7YUFBTTtZQUNILElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksMkJBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSwyQkFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLENB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
