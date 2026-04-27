/**
 * Page object for the Retirement Calculator results section.
 * Handles assertions on the results panel that appears after calculation.
 */
import Page from './base.page.js'
import type { ChainablePromiseElement } from 'webdriverio'

class RetirementCalculatorResultPage extends Page {
    // Results section heading displayed after a successful calculation
    get resultsSection (): ChainablePromiseElement { return $('//h3[text()="Results"]') }

    /**
     * Asserts that the Results section heading is visible on the page.
     * Used to confirm a calculation completed successfully.
     */
    async verifyResultsDisplayed () {
        await this.verifyVisible(this.resultsSection, 'Verify Results section is displayed')
    }
}

export default new RetirementCalculatorResultPage()
