import Page from './page.js'
import { step } from '../helpers/step.js'

class RetirementCalculatorPage extends Page {
    // Basic info
    get currentAge () { return $('#current-age') }
    get retirementAge () { return $('#retirement-age') }
    get currentAnnualIncome () { return $('#current-income') }
    get spouseAnnualIncome () { return $('#spouse-income') }
    get currentRetirementSavingsBalance () { return $('#current-total-savings') }
    get savingEachYearForRetirement () { return $('#current-annual-savings') }
    get rateOfIncreaseInSavings () { return $('#savings-increase-rate') }

    // Social security
    get includeSocialSecurityYes () { return $('//*[@id="include-social-container"]/div/div[1]/label') }
    get includeSocialSecurityNo () { return $('//*[@id="include-social-container"]/div/div[2]/label') }
    get singleStatus () { return $('//*[@id="marital-status-ul"]/div[1]/label') }
    get marriedStatus () { return $('//*[@id="marital-status-ul"]/div[2]/label') }
    get socialSecurityOverride () { return $('#social-security-override') }

    // Actions
    get adjustDefaultsButton () { return $('aria/Adjust default values') }
    get calculateButton () { return $('aria/Calculate') }
    get requiredFieldsAlert () { return $('#calculator-input-alert-desc') }

    // Cookie consent
    get cookieAcceptButton () { return $('#onetrust-accept-btn-handler') }

    async open () {
        step('Navigate to Securian Retirement Calculator page')
        await browser.url('https://www.securian.com/insights-tools/retirement-calculator.html')
        await this.acceptCookiesIfPresent()
    }

    async clickCalculate () {
        step('Click Calculate button')
        await this.calculateButton.click()
    }

    async selectIncludeSocialSecurityYes () {
        step('Select Include Social Security: Yes')
        await this.includeSocialSecurityYes.click()
    }

    async selectIncludeSocialSecurityNo () {
        step('Select Include Social Security: No')
        await this.includeSocialSecurityNo.click()
    }

    async selectSingleStatus () {
        step('Select marital status: Single')
        await this.singleStatus.click()
    }

    async selectMarriedStatus () {
        step('Select marital status: Married')
        await this.marriedStatus.click()
    }

    async verifySpouseIncomeVisible () {
        step('Verify spouse annual income field is visible')
        await expect(this.spouseAnnualIncome).toBeDisplayed()
    }

    async verifySpouseIncomeHidden () {
        step('Verify spouse annual income field is hidden')
        await expect(this.spouseAnnualIncome).not.toBeDisplayed()
    }

    async openAdjustDefaults () {
        step('Click Adjust default values button')
        await this.adjustDefaultsButton.click()
    }

    async fillSocialSecurityOverride (amount: string) {
        step(`Enter Social Security override amount: ${amount}`)
        await this.socialSecurityOverride.click()
        await browser.keys(['Control', 'a'])
        await browser.keys(amount.split(''))
    }

    async verifyRequiredFieldsAlertDisplayed () {
        step('Verify required fields alert is displayed with correct message')
        await expect(this.requiredFieldsAlert).toBeDisplayed()
        await expect(this.requiredFieldsAlert).toHaveText('Please fill out all required fields')
    }

    async verifySocialSecurityOverrideVisible () {
        step('Verify Social Security override field is visible')
        await expect(this.socialSecurityOverride).toBeDisplayed()
    }

    async verifySocialSecurityOverrideHidden () {
        step('Verify Social Security override field is hidden')
        await expect(this.socialSecurityOverride).not.toBeDisplayed()
    }

    async acceptCookiesIfPresent () {
        try {
            await this.cookieAcceptButton.waitForDisplayed({ timeout: 5000 })
            step('Accept cookies popup')
            await this.cookieAcceptButton.click()
        } catch {
            // no cookie popup appeared, continue
        }
    }

    async fillBasicInfo (data: {
        currentAge: string
        retirementAge: string
        currentAnnualIncome: string
        spouseAnnualIncome?: string
        retirementSavingsBalance: string
        savingEachYearForRetirement: string
        rateOfIncreaseInSavings: string
    }) {
        step('Fill basic info form fields')
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
    }
}

export default new RetirementCalculatorPage()
