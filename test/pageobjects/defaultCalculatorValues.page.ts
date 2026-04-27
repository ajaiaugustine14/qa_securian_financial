/**
 * Page object for the Adjust Default Calculator Values panel.
 * This panel opens when the user clicks "Adjust default values" on the main form.
 * Covers all default value fields, inflation toggle, save action, and panel-level assertions.
 *
 * open() and saveChanges() manage the full open/close lifecycle of the panel,
 * so callers never need to verify dialog state separately.
 */
import Page from './base.page.js'
import { step } from '../helpers/step.js'
import RetirementCalculatorPage from './preRetirementCalculatorForm.page.js'
import type { ChainablePromiseElement } from 'webdriverio'

class DefaultCalculatorValuesPage extends Page {
    // ── Panel Entry Point ────────────────────────────────────────────────────
    // Button lives on the main form but the defaults panel owns its open lifecycle
    get adjustDefaultsButton (): ChainablePromiseElement { return $('aria/Adjust default values') }

    // ── Panel Header ─────────────────────────────────────────────────────────
    // Used internally to assert the panel is open or closed
    get headerForDefaultCalculatorValues (): ChainablePromiseElement { return $('//h1[text()="Default calculator values"]') }

    // ── Default Value Fields ─────────────────────────────────────────────────
    // additionalIncome is currency-masked — uses browser.keys() instead of setValue()
    get additionalIncome (): ChainablePromiseElement { return $('#additional-income') }
    get retirementDuration (): ChainablePromiseElement { return $('#retirement-duration') }
    get retirementAnnualIncome (): ChainablePromiseElement { return $('#retirement-annual-income') }
    get preRetirementRoi (): ChainablePromiseElement { return $('#pre-retirement-roi') }
    get postRetirementRoi (): ChainablePromiseElement { return $('#post-retirement-roi') }

    // ── Inflation Toggles ────────────────────────────────────────────────────
    // XPath used because labels lack unique IDs; div[1] = Yes, div[2] = No
    get includeInflationYes (): ChainablePromiseElement { return $('//*[@id="include-inflation-container"]/div/div[1]/label') }
    get includeInflationNo (): ChainablePromiseElement { return $('//*[@id="include-inflation-container"]/div/div[2]/label') }

    // Inflation rate input — only visible when Include Inflation is set to Yes
    get expectedInflationRate (): ChainablePromiseElement { return $('#expected-inflation-rate') }

    // ── Panel Actions ────────────────────────────────────────────────────────
    get saveChangesButton (): ChainablePromiseElement { return $('//button[text()="Save changes"]') }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    /**
     * Clicks "Adjust default values" and verifies the panel header is visible.
     * Encapsulates the open action and its confirmation in one call.
     */
    async open () {
        await this.clickElement(this.adjustDefaultsButton, 'Click Adjust default values button')
        await this.verifyVisible(this.headerForDefaultCalculatorValues, 'Verify Default calculator values dialog is open')
    }

    /**
     * Clicks "Save changes" and waits for the panel to close.
     * Encapsulates the save action and its confirmation in one call.
     */
    async saveChanges () {
        await this.clickElement(this.saveChangesButton, 'Click Save changes button')
        await this.waitUntilHidden(this.headerForDefaultCalculatorValues, 'Verify Default calculator values dialog is closed')
    }

    /** Saves changes and verifies the Calculate button on the main form is enabled. */
    async clickSaveAndVerifyDefaultValuesSaved () {
        try {
            await this.saveChanges()
            step('Verify Calculate button is enabled after saving defaults')
            await expect(RetirementCalculatorPage.calculateButton).toBeEnabled()
        } catch (error) {
            throw new Error(`Failed to save default values: ${(error as Error).message}`)
        }
    }

    // ── Inflation Configuration ───────────────────────────────────────────────

    /**
     * Configures the inflation section in one action.
     * Selects Yes or No on the Include Inflation toggle; when include is true
     * and a rate is provided, also fills the expected inflation rate field.
     * @param options.include - Whether to include inflation in calculations
     * @param options.rate    - Optional annual inflation rate e.g. '2.5'
     */
    async configureInflation (options: { include: boolean, rate?: string }) {
        try {
            if (options.include) {
                await this.clickElement(this.includeInflationYes, 'Select Include Inflation: Yes')
                if (options.rate) {
                    step(`Enter expected inflation rate: ${options.rate}`)
                    await this.expectedInflationRate.setValue(options.rate)
                }
            } else {
                await this.clickElement(this.includeInflationNo, 'Select Include Inflation: No')
            }
        } catch (error) {
            throw new Error(`Failed to configure inflation: ${(error as Error).message}`)
        }
    }

    // ── Form Fill ─────────────────────────────────────────────────────────────

    /**
     * Fills all editable fields in the default calculator values panel.
     * additionalIncome uses click + Ctrl+A + keys due to currency masking.
     * When expectedInflationRate is present in data, also configures inflation
     * to Yes and sets the rate — avoiding a separate configureInflation call.
     * @param data - Default field values; include expectedInflationRate to configure inflation inline
     */
    async adjustDefaults (data: {
        additionalIncome: string
        retirementDuration: string
        retirementAnnualIncome: string
        preRetirementRoi: string
        postRetirementRoi: string
        expectedInflationRate?: string
    }) {
        try {
            step('Fill default calculator values')
            await this.additionalIncome.click()
            await browser.keys(['Control', 'a'])
            await browser.keys(data.additionalIncome.split(''))
            await this.retirementDuration.setValue(data.retirementDuration)
            await this.retirementAnnualIncome.setValue(data.retirementAnnualIncome)
            await this.preRetirementRoi.setValue(data.preRetirementRoi)
            await this.postRetirementRoi.setValue(data.postRetirementRoi)
            if (data.expectedInflationRate) {
                await this.configureInflation({ include: true, rate: data.expectedInflationRate })
            }
        } catch (error) {
            throw new Error(`Failed to fill default calculator values: ${(error as Error).message}`)
        }
    }

    // ── Assertions ────────────────────────────────────────────────────────────

    /** Opens the panel, toggles inflation Yes/No verifying the rate field shows then hides, and saves. */
    async verifyInflationToggle () {
        await this.open()
        await this.configureInflation({ include: true })
        await this.verifyVisible(this.expectedInflationRate, 'Verify expected inflation rate field is visible')
        await this.configureInflation({ include: false })
        await this.verifyHidden(this.expectedInflationRate, 'Verify expected inflation rate field is hidden')
    }
}

export default new DefaultCalculatorValuesPage()
