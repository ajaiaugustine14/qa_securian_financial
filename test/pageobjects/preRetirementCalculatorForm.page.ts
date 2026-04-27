/**
 * Page object for the Securian Retirement Calculator main form.
 * Covers all input fields, toggles, social security options,
 * marital status, cookie consent, and form-level assertions.
 *
 * Related toggles and their associated field interactions are grouped into
 * single configuration methods so the spec reads as a user action rather
 * than a sequence of low-level clicks.
 */
import Page from './base.page.js'
import { step } from '../helpers/step.js'
import RetirementCalculatorResultPage from './preRetirementCalculatorResult.page.js'
import type { ChainablePromiseElement } from 'webdriverio'

class RetirementCalculatorPage extends Page {
    // ── Basic Info Fields ────────────────────────────────────────────────────
    get currentAge (): ChainablePromiseElement { return $('#current-age') }
    get retirementAge (): ChainablePromiseElement { return $('#retirement-age') }
    // Currency-masked fields — use browser.keys() instead of setValue()
    get currentAnnualIncome (): ChainablePromiseElement { return $('#current-income') }
    get spouseAnnualIncome (): ChainablePromiseElement { return $('#spouse-income') }
    get currentRetirementSavingsBalance (): ChainablePromiseElement { return $('#current-total-savings') }
    get savingEachYearForRetirement (): ChainablePromiseElement { return $('#current-annual-savings') }
    get rateOfIncreaseInSavings (): ChainablePromiseElement { return $('#savings-increase-rate') }

    // ── Social Security Toggles ──────────────────────────────────────────────
    // XPath used because the labels lack unique IDs; div[1] = Yes, div[2] = No
    get includeSocialSecurityYes (): ChainablePromiseElement { return $('//*[@id="include-social-container"]/div/div[1]/label') }
    get includeSocialSecurityNo (): ChainablePromiseElement { return $('//*[@id="include-social-container"]/div/div[2]/label') }

    // Social security benefit override — only visible when SS is included
    get socialSecurityOverride (): ChainablePromiseElement { return $('#social-security-override') }

    // ── Marital Status Toggles ───────────────────────────────────────────────
    // div[1] = Single, div[2] = Married
    get singleStatus (): ChainablePromiseElement { return $('//*[@id="marital-status-ul"]/div[1]/label') }
    get marriedStatus (): ChainablePromiseElement { return $('//*[@id="marital-status-ul"]/div[2]/label') }

    // ── Action Elements ──────────────────────────────────────────────────────
    get calculateButton (): ChainablePromiseElement { return $('aria/Calculate') }

    // ── Validation ───────────────────────────────────────────────────────────
    // Alert shown when Calculate is clicked without filling required fields
    get requiredFieldsAlert (): ChainablePromiseElement { return $('#calculator-input-alert-desc') }

    // ── Cookie Consent ───────────────────────────────────────────────────────
    get cookieAcceptButton (): ChainablePromiseElement { return $('#onetrust-accept-btn-handler') }

    // ── Navigation ───────────────────────────────────────────────────────────

    /**
     * Navigates to the retirement calculator and dismisses the cookie popup if present.
     */
    async open () {
        try {
            step('Navigate to Securian Retirement Calculator page')
            await browser.url('https://www.securian.com/insights-tools/retirement-calculator.html')
            await this.acceptCookiesIfPresent()
        } catch (error) {
            throw new Error(`Failed to open Retirement Calculator page: ${(error as Error).message}`)
        }
    }

    // ── Form Actions ─────────────────────────────────────────────────────────

    /** Clicks Calculate and verifies the results section is displayed. */
    async clickCalculateAndVerifyResult () {
        await this.clickElement(this.calculateButton, 'Click Calculate button')
        await RetirementCalculatorResultPage.verifyResultsDisplayed()
    }

    /**
     * Configures the Social Security section in one action.
     * Selects Yes or No on the SS toggle; when include is true and an override
     * amount is provided, also fills the monthly benefit override field.
     * @param options.include  - Whether to include Social Security benefits
     * @param options.override - Optional monthly benefit amount e.g. '1500'
     */
    async configureSocialSecurity (options: { include: boolean, override?: string }) {
        try {
            if (options.include) {
                await this.clickElement(this.includeSocialSecurityYes, 'Select Include Social Security: Yes')
                if (options.override) {
                    step(`Enter Social Security override amount: ${options.override}`)
                    await this.socialSecurityOverride.click()
                    await browser.keys(['Control', 'a'])
                    await browser.keys(options.override.split(''))
                }
            } else {
                await this.clickElement(this.includeSocialSecurityNo, 'Select Include Social Security: No')
            }
        } catch (error) {
            throw new Error(`Failed to configure Social Security: ${(error as Error).message}`)
        }
    }

    /**
     * Selects the marital status on the form.
     * @param status - 'single' or 'married'
     */
    async selectMaritalStatus (status: 'single' | 'married') {
        if (status === 'married') {
            await this.clickElement(this.marriedStatus, 'Select marital status: Married')
        } else {
            await this.clickElement(this.singleStatus, 'Select marital status: Single')
        }
    }

    /**
     * Fills the full calculator form in one call.
     * Currency-masked fields use click + Ctrl+A + keys to trigger the input formatter.
     * Social Security and marital status are configured only when present in the data.
     */
    async fillForm (data: {
        currentAge: string
        retirementAge: string
        currentAnnualIncome: string
        spouseAnnualIncome?: string
        retirementSavingsBalance: string
        savingEachYearForRetirement: string
        rateOfIncreaseInSavings: string
        socialSecurity?: { include: boolean }
        socialSecurityOverride?: string
        maritalStatus?: string
    }) {
        try {
            step('Fill info form fields')
            await this.currentAge.setValue(data.currentAge)
            await this.retirementAge.setValue(data.retirementAge)
            await this.currentAnnualIncome.click()
            await browser.keys(['Control', 'a'])
            await browser.keys(data.currentAnnualIncome.split(''))
            if (data.spouseAnnualIncome) {
                await this.spouseAnnualIncome.click()
                await browser.keys(['Control', 'a'])
                await browser.keys(data.spouseAnnualIncome.split(''))
            }
            await this.currentRetirementSavingsBalance.click()
            await browser.keys(['Control', 'a'])
            await browser.keys(data.retirementSavingsBalance.split(''))
            await this.savingEachYearForRetirement.setValue(data.savingEachYearForRetirement)
            await this.rateOfIncreaseInSavings.setValue(data.rateOfIncreaseInSavings)
            if (data.socialSecurity !== undefined) {
                await this.configureSocialSecurity({
                    include: data.socialSecurity.include,
                    override: data.socialSecurityOverride
                })
            }
            if (data.maritalStatus) {
                await this.selectMaritalStatus(data.maritalStatus as 'single' | 'married')
            }
        } catch (error) {
            throw new Error(`Failed to fill calculator form: ${(error as Error).message}`)
        }
    }

    // ── Assertions ────────────────────────────────────────────────────────────

    /** Toggles Social Security Yes/No and verifies the override field shows then hides. */
    async verifySocialSecurityToggle () {
        await this.configureSocialSecurity({ include: true })
        await this.verifyVisible(this.socialSecurityOverride, 'Verify Social Security override field is visible')
        await this.configureSocialSecurity({ include: false })
        await this.verifyHidden(this.socialSecurityOverride, 'Verify Social Security override field is hidden')
    }

    /** Clicks Calculate and asserts the required-fields validation alert is shown. */
    async clickCalculateAndVerifyAlert () {
        try {
            await this.clickElement(this.calculateButton, 'Click Calculate button')
            step('Verify required fields alert is displayed with correct message')
            await expect(this.requiredFieldsAlert).toBeDisplayed()
            await expect(this.requiredFieldsAlert).toHaveText('Please fill out all required fields')
        } catch (error) {
            throw new Error(`Failed to verify required fields alert: ${(error as Error).message}`)
        }
    }

    // ── Cookie Handling ───────────────────────────────────────────────────────

    /**
     * Accepts the OneTrust cookie consent popup if it appears within 5 seconds.
     * Silently continues if no popup is shown.
     */
    async acceptCookiesIfPresent () {
        try {
            await this.cookieAcceptButton.waitForDisplayed({ timeout: 5000 })
            step('Accept cookies popup')
            await this.cookieAcceptButton.click()
        } catch (error) {
            if (!(error as Error).message.includes('still not displayed')) {
                throw new Error(`Unexpected error while handling cookie popup: ${(error as Error).message}`)
            }
            // Cookie popup did not appear within timeout — proceed without action
        }
    }
}

export default new RetirementCalculatorPage()
