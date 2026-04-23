import ReportEvents from '@rpii/wdio-report-events'

const reportEvents = new ReportEvents()

export const step = (message: string): void => {
    reportEvents.logMessage(message)
}
