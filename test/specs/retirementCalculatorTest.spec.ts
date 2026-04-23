import RetirementCalculatorPage from '../pageobjects/preRetirementCalculatorForm.page.js'
import RetirementCalculatorResultPage from '../pageobjects/preRetirementCalculatorResult.page.js'
import DefaultCalculatorValuesPage from '../pageobjects/defaultCalculatorValues.page.js'
import testData from '../test-data/retirementCalculator.json' with { type: 'json' }

describe('Securian Retirement Calculator', () => {
    beforeEach(async () => {
        await RetirementCalculatorPage.open()
    })

    it('User should not able to calculate without filling all required fields', async () => {
        await RetirementCalculatorPage.clickCalculate()
        await RetirementCalculatorPage.verifyRequiredFieldsAlertDisplayed()
    })

    it('Additional Social Security fields should display/hide based on Social Security benefits toggle', async () => {
        await RetirementCalculatorPage.selectIncludeSocialSecurityYes()
        await RetirementCalculatorPage.verifySocialSecurityOverrideVisible()

        await RetirementCalculatorPage.selectIncludeSocialSecurityNo()
        await RetirementCalculatorPage.verifySocialSecurityOverrideHidden()
    })

    it('User should be able to submit form with all required fields filled in and see results', async () => {
        await RetirementCalculatorPage.fillBasicInfo(testData.requiredFieldsOnly)
        await RetirementCalculatorPage.clickCalculate()
        await RetirementCalculatorResultPage.verifyResultsDisplayed()
    })

    it('User should be able to submit form with all fields filled in', async () => {
        await RetirementCalculatorPage.fillBasicInfo(testData.allFields)
        await RetirementCalculatorPage.selectIncludeSocialSecurityYes()
        await RetirementCalculatorPage.selectMarriedStatus()
        await RetirementCalculatorPage.fillSocialSecurityOverride(testData.allFields.socialSecurityOverride)
        await RetirementCalculatorPage.clickCalculate()
        await RetirementCalculatorResultPage.verifyResultsDisplayed()
    })

    it('Inflation rate field should display/hide based on include inflation toggle in default values', async () => {
        await RetirementCalculatorPage.openAdjustDefaults()
        await DefaultCalculatorValuesPage.verifyDefaultsDialogOpen()

        await DefaultCalculatorValuesPage.selectIncludeInflationYes()
        await DefaultCalculatorValuesPage.verifyInflationRateVisible()

        await DefaultCalculatorValuesPage.selectIncludeInflationNo()
        await DefaultCalculatorValuesPage.verifyInflationRateHidden()

        await DefaultCalculatorValuesPage.saveChanges()
    })

    it('User should be able to update default calculator values', async () => {
        await RetirementCalculatorPage.openAdjustDefaults()
        await DefaultCalculatorValuesPage.verifyDefaultsDialogOpen()
        await DefaultCalculatorValuesPage.adjustDefaults(testData.defaultCalculatorValues)
        await DefaultCalculatorValuesPage.selectIncludeInflationYes()
        await DefaultCalculatorValuesPage.setExpectedInflationRate(testData.defaultCalculatorValues.expectedInflationRate)
        await DefaultCalculatorValuesPage.saveChanges()
        await DefaultCalculatorValuesPage.verifyDefaultsDialogClosed()
    })

    it('User should be able to calculate with adjusted default values and see results', async () => {
        await RetirementCalculatorPage.fillBasicInfo(testData.withAdjustedDefaults.basicInfo)
        await RetirementCalculatorPage.openAdjustDefaults()
        await DefaultCalculatorValuesPage.verifyDefaultsDialogOpen()
        await DefaultCalculatorValuesPage.adjustDefaults(testData.withAdjustedDefaults.defaults)
        await DefaultCalculatorValuesPage.selectIncludeInflationYes()
        await DefaultCalculatorValuesPage.setExpectedInflationRate(testData.withAdjustedDefaults.defaults.expectedInflationRate)
        await DefaultCalculatorValuesPage.saveChanges()
        await DefaultCalculatorValuesPage.verifyDefaultsDialogClosed()
        await RetirementCalculatorPage.clickCalculate()
        await RetirementCalculatorResultPage.verifyResultsDisplayed()
    })
})
