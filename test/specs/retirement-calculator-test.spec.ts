/**
 * Test suite: Securian Financial Retirement Calculator
 *
 * Covers all acceptance criteria for the retirement calculator form at:
 * https://www.securian.com/insights-tools/retirement-calculator.html
 *
 * Test data is loaded from: test/test-data/retirementCalculator.json
 */
import RetirementCalculatorPage from '../pageobjects/preRetirementCalculatorForm.page.js'
import DefaultCalculatorValuesPage from '../pageobjects/defaultCalculatorValues.page.js'
import testData from '../test-data/retirementCalculator.json' with { type: 'json' }

describe('Securian Retirement Calculator', () => {

    // Navigate to the calculator page before each test
    beforeEach(async () => {
        await RetirementCalculatorPage.open()
    })

    /**
     * TC01 - Required field validation
     * Verifies the calculator shows an alert when Calculate is clicked with no data entered.
     */
    it('User should not able to calculate without filling all required fields', async () => {
        await RetirementCalculatorPage.clickCalculateAndVerifyAlert()
    })

    /**
     * TC02 - Social Security toggle behaviour
     * Verifies the SS override field appears when SS is included and hides when excluded.
     */
    it('Additional Social Security fields should display/hide based on Social Security benefits toggle', async () => {
        await RetirementCalculatorPage.verifySocialSecurityToggle()
    })

    /**
     * TC03 - Calculate with required fields only
     * Verifies that filling only the required fields and clicking Calculate shows results.
     */
    it('User should be able to submit form with all required fields filled in and see results', async () => {
        await RetirementCalculatorPage.fillForm(testData.requiredFieldsOnly)
        await RetirementCalculatorPage.clickCalculateAndVerifyResult()
    })

    /**
     * TC04 - Calculate with all fields including spouse and SS override
     * Verifies the form calculates correctly when married status and SS override are set.
     */
    it('User should be able to submit form with all fields filled in', async () => {
        await RetirementCalculatorPage.fillForm(testData.allFields)
        await RetirementCalculatorPage.clickCalculateAndVerifyResult()
    })

    /**
     * TC05 - Inflation rate toggle behaviour in defaults panel
     * Verifies the inflation rate field shows when inflation is included and hides when excluded.
     */
    it('Inflation rate field should display/hide based on include inflation toggle in default values', async () => {
        await DefaultCalculatorValuesPage.verifyInflationToggle()
    })

    /**
     * TC06 - Update default calculator values
     * Verifies the user can open the defaults panel, fill all values, save and close it.
     */
    it('User should be able to update default calculator values', async () => {
        await DefaultCalculatorValuesPage.open()
        await DefaultCalculatorValuesPage.adjustDefaults(testData.defaultCalculatorValues)
        await DefaultCalculatorValuesPage.clickSaveAndVerifyDefaultValuesSaved()
    })

    /**
     * TC07 - Full end-to-end calculation with adjusted defaults
     * Verifies the calculator returns results when both basic info and adjusted default values are provided.
     */
    it('User should be able to calculate with adjusted default values and see results', async () => {
        await RetirementCalculatorPage.fillForm(testData.withAdjustedDefaults.basicInfo)
        await DefaultCalculatorValuesPage.open()
        await DefaultCalculatorValuesPage.adjustDefaults(testData.withAdjustedDefaults.defaults)
        await DefaultCalculatorValuesPage.clickSaveAndVerifyDefaultValuesSaved()
        await RetirementCalculatorPage.clickCalculateAndVerifyResult()
    })

    /**
     * TC08 - Calculate with missing required field (current age)
     * Verifies that leaving out a required field (current age) and clicking Calculate shows the validation alert.
     */
    it('User should not able to calculate without entering current age value', async () => {
        await RetirementCalculatorPage.fillForm(testData.requiredFieldsWithoutAge)
        await RetirementCalculatorPage.clickCalculateAndVerifyAlert()
    })

    /**
     * TC09 - Calculate with missing required field (retirement age)
     * Verifies that omitting retirement age triggers the required-fields validation alert.
     */
    it('User should not be able to calculate without entering retirement age value', async () => {
        await RetirementCalculatorPage.fillForm(testData.requiredFieldsWithoutRetirementAge)
        await RetirementCalculatorPage.clickCalculateAndVerifyAlert()
    })

    /**
     * TC10 - Calculate with missing required field (current annual income)
     * Verifies that omitting annual income triggers the required-fields validation alert.
     */
    it('User should not be able to calculate without entering current annual income', async () => {
        await RetirementCalculatorPage.fillForm(testData.requiredFieldsWithoutIncome)
        await RetirementCalculatorPage.clickCalculateAndVerifyAlert()
    })

    /**
     * TC11 - Calculate with missing required field (retirement savings balance)
     * Verifies that omitting the savings balance triggers the required-fields validation alert.
     */
    it('User should not be able to calculate without entering retirement savings balance', async () => {
        await RetirementCalculatorPage.fillForm(testData.requiredFieldsWithoutSavingsBalance)
        await RetirementCalculatorPage.clickCalculateAndVerifyAlert()
    })

    /**
     * TC12 - Retirement age less than current age (invalid business rule)
     * Verifies the calculator does not produce results when retirement age is set
     * lower than the current age.
     */
    it('User should not be able to calculate when retirement age is less than current age', async () => {
        await RetirementCalculatorPage.fillForm(testData.retirementAgeLessThanCurrentAge)
        await RetirementCalculatorPage.clickCalculateAndVerifyAlert()
    })

    /**
     * TC13 - Retirement age equal to current age (boundary case)
     * Verifies the calculator does not produce results when retirement age equals
     * current age (zero years to retirement).
     */
    it('User should not be able to calculate when retirement age equals current age', async () => {
        await RetirementCalculatorPage.fillForm(testData.retirementAgeEqualToCurrentAge)
        await RetirementCalculatorPage.clickCalculateAndVerifyAlert()
    })
})
