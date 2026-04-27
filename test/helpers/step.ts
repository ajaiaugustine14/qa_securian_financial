/**
 * Step logger helper for wdio-html-nice-reporter.
 * Emits a message via process events that the reporter captures
 * and displays as a step log inside each test in the HTML report.
 */
import ReportEvents from '@rpii/wdio-report-events'

const reportEvents = new ReportEvents()

/**
 * Logs a named step to the HTML report.
 * Call this at the start of each page object method to document what action is being performed.
 * @param message - Human-readable description of the step
 */
export const step = (message: string): void => {
    reportEvents.logMessage(message)
}
