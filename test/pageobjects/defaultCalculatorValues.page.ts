import Page from './page.js'
import { step } from '../helpers/step.js'

class DefaultCalculatorValuesPage extends Page {
    get headerForDefaultCalculatorValues () { return $('//h1[text()="Default calculator values"]') }
    get additionalIncome () { return $('#additional-income') }
    get retirementDuration () { return $('#retirement-duration') }
    get includeInflationYes () { return $('//*[@id="include-inflation-container"]/div/div[1]/label') }
    get expectedInflationRate () { return $('#expected-inflation-rate') }
    get retirementAnnualIncome () { return $('#retirement-annual-income') }
    get preRetirementRoi () { return $('#pre-retirement-roi') }
    get postRetirementRoi () { return $('#post-retirement-roi') }
    get saveChangesButton () { return $('//button[text()="Save changes"]') }

    async selectIncludeInflationYes () {
        step('Select Include Inflation: Yes')
        await this.includeInflationYes.click()
    }

    async setExpectedInflationRate (rate: string) {
        step(`Enter expected inflation rate: ${rate}`)
        await this.expectedInflationRate.setValue(rate)
    }

    async saveChanges () {
        step('Click Save changes button')
        await this.saveChangesButton.click()
    }

    async verifyDefaultsDialogOpen () {
        step('Verify Default calculator values dialog is open')
        await expect(this.headerForDefaultCalculatorValues).toBeDisplayed()
    }

    async verifyDefaultsDialogClosed () {
        step('Verify Default calculator values dialog is closed')
        await this.headerForDefaultCalculatorValues.waitForDisplayed({ reverse: true })
    }

    async adjustDefaults (data: {
        additionalIncome: string
        retirementDuration: string
        retirementAnnualIncome: string
        preRetirementRoi: string
        postRetirementRoi: string
    }) {
        step('Fill default calculator values')
        await this.additionalIncome.click()
        await browser.keys(['Control', 'a'])
        await browser.keys(data.additionalIncome.split(''))
        await this.retirementDuration.setValue(data.retirementDuration)
        await this.retirementAnnualIncome.setValue(data.retirementAnnualIncome)
        await this.preRetirementRoi.setValue(data.preRetirementRoi)
        await this.postRetirementRoi.setValue(data.postRetirementRoi)
    }
}

export default new DefaultCalculatorValuesPage()
