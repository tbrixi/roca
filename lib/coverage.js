"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportCoverage = void 0;
const istanbul_lib_report_1 = require("istanbul-lib-report");
const istanbul_reports_1 = require("istanbul-reports");
const istanbul_lib_coverage_1 = require("istanbul-lib-coverage");
const brs_1 = require("brs");
/*
 * Generates coverage reports using the given list of reporters.
 * @param {array} reporters the istanbul reporters to use
 */
function reportCoverage(reporters) {
    let coverageData = brs_1.getCoverageResults();
    if (!coverageData) return;
    let context = istanbul_lib_report_1.createContext({
        coverageMap: istanbul_lib_coverage_1.createCoverageMap(coverageData),
    });
    reporters.forEach((reporter) => {
        istanbul_reports_1.create(reporter).execute(context);
    });
}
exports.reportCoverage = reportCoverage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY292ZXJhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY292ZXJhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkRBQW9EO0FBQ3BELHVEQUF5RTtBQUN6RSxpRUFBMEQ7QUFDMUQsNkJBQXlDO0FBRXpDOzs7R0FHRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxTQUFrQztJQUM3RCxJQUFJLFlBQVksR0FBRyx3QkFBa0IsRUFBRSxDQUFDO0lBQ3hDLElBQUksQ0FBQyxZQUFZO1FBQUUsT0FBTztJQUUxQixJQUFJLE9BQU8sR0FBRyxtQ0FBYSxDQUFDO1FBQ3hCLFdBQVcsRUFBRSx5Q0FBaUIsQ0FBQyxZQUFZLENBQUM7S0FDL0MsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzFCLHlCQUFZLENBQUMsUUFBUSxDQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVhELHdDQVdDIn0=
