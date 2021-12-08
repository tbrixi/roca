"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JestRunner = void 0;
const brs_1 = require("brs");
const JestReporter_1 = require("../reporter/JestReporter");
const TestRunner_1 = require("./TestRunner");
class JestRunner extends TestRunner_1.TestRunner {
    constructor(reporterStream, projectConfig, globalConfig, reporterType) {
        super(reporterStream);
        this.reporterStream = reporterStream;
        this.reporter = new JestReporter_1.JestReporter(
            reporterStream,
            projectConfig,
            globalConfig,
            reporterType
        );
    }
    /** @override */
    _run(execute, executeArgs, testFiles) {
        this.reporter.onRunStart(testFiles.length);
        testFiles.forEach((filename, index) => {
            this.reporter.onFileStart(filename);
            try {
                execute([filename], [executeArgs]);
            } catch (reason) {
                this.reporter.onFileExecError(filename, index, reason);
                process.exitCode = 1;
            }
            this.reporter.onFileComplete();
            // Update the index so that our TAP reporting is correct.
            executeArgs.elements.set("index", new brs_1.types.Int32(index + 1));
        });
        this.reporter.onRunComplete();
    }
}
exports.JestRunner = JestRunner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSmVzdFJ1bm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvSmVzdFJ1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2QkFBMEQ7QUFDMUQsMkRBQXdEO0FBQ3hELDZDQUEwQztBQUUxQyxNQUFhLFVBQVcsU0FBUSx1QkFBVTtJQUd0QyxZQUNhLGNBQXdDLEVBQ2pELGFBQW1DLEVBQ25DLFlBQWlDLEVBQ2pDLFlBQW9CO1FBRXBCLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUxiLG1CQUFjLEdBQWQsY0FBYyxDQUEwQjtRQU9qRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksMkJBQVksQ0FDNUIsY0FBYyxFQUNkLGFBQWEsRUFDYixZQUFZLEVBQ1osWUFBWSxDQUNmLENBQUM7SUFDTixDQUFDO0lBRUQsZ0JBQWdCO0lBQ04sSUFBSSxDQUNWLE9BQXlCLEVBQ3pCLFdBQXdDLEVBQ3hDLFNBQW1CO1FBRW5CLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BDLElBQUk7Z0JBQ0EsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1lBQUMsT0FBTyxNQUFNLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7YUFDeEI7WUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRS9CLHlEQUF5RDtZQUN6RCxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxXQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0NBQ0o7QUEzQ0QsZ0NBMkNDIn0=
