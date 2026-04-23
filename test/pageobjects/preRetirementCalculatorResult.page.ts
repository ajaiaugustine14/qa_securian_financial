import Page from './page.js'
import { step } from '../helpers/step.js'

class RetirementCalculatorResultPage extends Page {
    get resultsSection () { return $('//h3[text()="Results"]') }

    async verifyResultsDisplayed () {
        step('Verify Results section is displayed')
        await expect(this.resultsSection).toBeDisplayed()
    }
}

export default new RetirementCalculatorResultPage()
