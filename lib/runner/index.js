"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestRunner = void 0;
const jest_config_1 = require("jest-config");
const JestRunner_1 = require("./JestRunner");
const Parser = require("tap-parser");
const TapMochaReporter = require("tap-mocha-reporter");
const TestRunner_1 = require("./TestRunner");
function isJestReporter(reporterName) {
    return reporterName === "jest" || reporterName === "jest-verbose";
}
async function createTestRunner(reporterType) {
    if (isJestReporter(reporterType)) {
        // Let Jest generate the configs that it'll use for reporting.
        let { projectConfig, globalConfig } = await jest_config_1.readConfig(
            {},
            process.cwd()
        );
        return new JestRunner_1.JestRunner(
            new Parser(),
            projectConfig,
            globalConfig,
            reporterType
        );
    } else {
        return new TestRunner_1.TestRunner(new TapMochaReporter(reporterType));
    }
}
exports.createTestRunner = createTestRunner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnVubmVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZDQUF5QztBQUN6Qyw2Q0FBMEM7QUFDMUMscUNBQXNDO0FBQ3RDLHVEQUF3RDtBQUN4RCw2Q0FBMEM7QUFzQjFDLFNBQVMsY0FBYyxDQUNuQixZQUEwQjtJQUUxQixPQUFPLFlBQVksS0FBSyxNQUFNLElBQUksWUFBWSxLQUFLLGNBQWMsQ0FBQztBQUN0RSxDQUFDO0FBRU0sS0FBSyxVQUFVLGdCQUFnQixDQUFDLFlBQTBCO0lBQzdELElBQUksY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQzlCLDhEQUE4RDtRQUM5RCxJQUFJLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sd0JBQVUsQ0FDbEQsRUFBaUIsRUFDakIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUNoQixDQUFDO1FBQ0YsT0FBTyxJQUFJLHVCQUFVLENBQ2pCLElBQUksTUFBTSxFQUFFLEVBQ1osYUFBYSxFQUNiLFlBQVksRUFDWixZQUFZLENBQ2YsQ0FBQztLQUNMO1NBQU07UUFDSCxPQUFPLElBQUksdUJBQVUsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7S0FDN0Q7QUFDTCxDQUFDO0FBaEJELDRDQWdCQyJ9
