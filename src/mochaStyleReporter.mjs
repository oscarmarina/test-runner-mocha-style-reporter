/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const colors = {
  reset: '\x1b[0m',
  brightBlue: '\x1b[94m',
  brightCyan: '\x1b[96m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  bright: '\x1b[1m',
  white: '\x1b[37m',
  grey: '\x1b[90m',
};

function outputSuite(suite, indent = '', browser = '') {
  const heading = `${colors.white}${suite.name}${browser ? ` [${browser}]` : '\n'}`;

  function getTestResult(test) {
    if (test.skipped) {
      return `${colors.grey} ⤵  ${test.name}`;
    }
    if (test.passed) {
      return `${colors.green} ✓ ${colors.reset}${colors.bright}${test.name}`;
    }
    return `${colors.red} ✕ ${test.name}`;
  }

  function getTestDuration(test) {
    if (test.duration > 100) {
      return ` ${colors.reset}${colors.red}(${test.duration}ms)`;
    }
    if (test.duration > 50) {
      return ` ${colors.reset}${colors.yellow}(${test.duration}ms)`;
    }
    return '';
  }

  const testResults = suite.tests
    .map(test => {
      const result = getTestResult(test);
      const duration = getTestDuration(test);
      return `${indent}${result}${duration}${colors.reset}`;
    })
    .join('\n');

  const subSuites = suite.suites
    ? suite.suites.map(subSuite => outputSuite(subSuite, `${indent} `)).join('')
    : '';

  return `${indent}${heading}${colors.reset}${testResults}\n${subSuites}`;
}

function generateTestReport(testFile, sessionsForTestFile) {
  let results = '';

  sessionsForTestFile.forEach(session => {
    const browserName = session.browser?.name ?? '';
    results += session.testResults.suites.map(suite => outputSuite(suite, '', browserName));
    results += '\n';
  });
  return results;
}

export function mochaStyleReporter({ reportResults = true, reportCoverage = true } = {}) {
  return {
    /**
     * Called when a test run is finished. Each file change in watch mode
     * triggers a test run. This can be used to report the end of a test run,
     * or to write a test report to disk in watch mode for each test run.
     *
     * @param testRun the test run
     */
    onTestRunFinished({ testRun, sessions, testCoverage, focusedTestFile }) {
      if (testCoverage?.summary) {
        const summaryCopy = { ...testCoverage.summary };
        if (summaryCopy.branchesTrue?.pct === 'Unknown') {
          delete summaryCopy.branchesTrue;
        }
        const totalSkipped = Object.keys(summaryCopy).reduce(
          (prev, next) =>
            prev + (testCoverage.summary[next]?.skipped ? testCoverage.summary[next].skipped : 0),
          0,
        );
        if (totalSkipped === 0) {
          Object.keys(summaryCopy).forEach(key => {
            delete summaryCopy[key]?.skipped;
          });
        }

        if (reportCoverage) {
          console.table(summaryCopy);
        }
      }
    },
    /**
     * Called when results for a test file can be reported. This is called
     * when all browsers for a test file are finished, or when switching between
     * menus in watch mode.
     *
     * If your test results are calculated async, you should return a promise from
     * this function and use the logger to log test results. The test runner will
     * guard against race conditions when re-running tests in watch mode while reporting.
     *
     * @param logger the logger to use for logging tests
     * @param testFile the test file to report for
     * @param sessionsForTestFile the sessions for this test file. each browser is a
     * different session
     */
    reportTestFileResults({ logger, sessionsForTestFile, testFile }) {
      if (!reportResults) {
        return;
      }
      const testReport = generateTestReport(testFile, sessionsForTestFile);

      logger.group();
      logger.log(testReport);
      logger.groupEnd();
    },
  };
}
