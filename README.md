# QA Automation - Securian Financial Retirement Calculator

**Author:** ajaiaugustine14 | ajaiaugustine94@gmail.com

End-to-end test suite for the [Securian Financial Retirement Calculator](https://www.securian.com/insights-tools/retirement-calculator.html) built with WebdriverIO, Jasmine, and TypeScript.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [WebdriverIO v9](https://webdriver.io/) | Browser automation framework |
| [Jasmine](https://jasmine.github.io/) | Test framework |
| TypeScript | Language |
| Chrome | Browser |
| wdio-html-nice-reporter | HTML test report generation |

---

## Project Structure

```
qa_securian_financial/
├── test/
│   ├── pageobjects/
│   │   ├── base.page.ts                             # Base page class (shared utilities)
│   │   ├── preRetirementCalculatorForm.page.ts      # Form fields & actions
│   │   ├── defaultCalculatorValues.page.ts          # Adjust default values panel
│   │   └── preRetirementCalculatorResult.page.ts    # Results section
│   ├── specs/
│   │   └── retirement-calculator-test.spec.ts       # Test cases (TC01–TC13)
│   ├── helpers/
│   │   └── step.ts                                  # Step logger for HTML report
│   └── test-data/
│       └── retirement-calculator.json               # Test data
├── reports/                                         # Generated HTML reports
├── wdio.shared.conf.ts                              # Shared WebdriverIO config
├── wdio.local.conf.ts                               # Local Chrome config
└── wdio.sauce.conf.ts                               # Sauce Labs config
```

---

## Page Objects

### `base.page.ts`
Shared base class inherited by all page objects. Provides common interaction and assertion utilities.

| Method | Description |
|---|---|
| `open(path)` | Navigates to the given path relative to baseUrl |
| `clickElement(element, stepMessage)` | Logs a step and clicks the element |
| `setFieldValue(element, value, stepMessage)` | Logs a step and sets a value on a plain text/number input via `setValue()` |
| `setCurrencyFieldValue(element, value, stepMessage)` | Logs a step and enters a value into a currency-masked input using click + Ctrl+A + `browser.keys()` to trigger the mask formatter |
| `verifyVisible(element, stepMessage)` | Asserts the element is displayed |
| `verifyHidden(element, stepMessage)` | Asserts the element is not displayed |
| `waitUntilHidden(element, stepMessage)` | Waits for the element to disappear |

### `preRetirementCalculatorForm.page.ts`
Handles the main calculator form — inputs, toggles, validation, and cookie consent.

| Method | Description |
|---|---|
| `open()` | Navigates to the calculator page and accepts cookie popup if present |
| `fillForm(data)` | Fills all visible form fields from a data object |
| `configureSocialSecurity(options)` | Selects SS Yes/No toggle; optionally fills the override amount |
| `selectMaritalStatus(status)` | Selects `'single'` or `'married'` |
| `clickCalculateAndVerifyResult()` | Clicks Calculate and asserts the Results section appears |
| `clickCalculateAndVerifyAlert()` | Clicks Calculate and asserts the required-fields validation alert |
| `verifySocialSecurityToggle()` | Toggles SS Yes then No and verifies override field shows then hides |
| `acceptCookiesIfPresent()` | Dismisses the OneTrust cookie popup if it appears |

### `defaultCalculatorValues.page.ts`
Handles the Adjust Default Calculator Values panel.

| Method | Description |
|---|---|
| `open()` | Clicks "Adjust default values" and verifies the panel header is visible |
| `adjustDefaults(data)` | Fills all default value fields; configures inflation inline when rate is provided |
| `configureInflation(options)` | Selects Include Inflation Yes/No; optionally fills the inflation rate |
| `saveChanges()` | Clicks "Save changes" and waits for the panel to close |
| `clickSaveAndVerifyDefaultValuesSaved()` | Saves and verifies the Calculate button is enabled |
| `verifyInflationToggle()` | Opens panel, toggles inflation Yes/No and verifies rate field shows then hides |

### `preRetirementCalculatorResult.page.ts`
Handles the results section displayed after a successful calculation.

| Method | Description |
|---|---|
| `verifyResultsDisplayed()` | Asserts the Results heading is visible on the page |

---

## Test Cases

File: `test/specs/retirement-calculator-test.spec.ts`

### Positive Scenarios

| TC | Test | Description |
|---|---|---|
| TC01 | User should not able to calculate without filling all required fields | Clicks Calculate on an empty form and verifies the required-fields validation alert |
| TC02 | Additional Social Security fields should display/hide based on Social Security benefits toggle | Toggles SS Yes/No and verifies the override field shows then hides |
| TC03 | User should be able to submit form with all required fields filled in and see results | Fills only required fields and verifies the Results section appears |
| TC04 | User should be able to submit form with all fields filled in | Fills all fields including spouse income, married status, and SS override; verifies results |
| TC05 | Inflation rate field should display/hide based on include inflation toggle in default values | Opens defaults panel, toggles inflation Yes/No, and verifies the rate field shows then hides |
| TC06 | User should be able to update default calculator values | Opens defaults panel, fills all default values, saves, and verifies the panel closes |
| TC07 | User should be able to calculate with adjusted default values and see results | Full E2E — fills basic info, updates defaults with inflation rate, calculates, and verifies results |

### Negative Scenarios

| TC | Test | Description |
|---|---|---|
| TC08 | User should not able to calculate without entering current age value | Omits current age and verifies the required-fields validation alert |
| TC09 | User should not be able to calculate without entering retirement age value | Omits retirement age and verifies the required-fields validation alert |
| TC10 | User should not be able to calculate without entering current annual income | Omits annual income and verifies the required-fields validation alert |
| TC11 | User should not be able to calculate without entering retirement savings balance | Omits savings balance and verifies the required-fields validation alert |
| TC12 | User should not be able to calculate when retirement age is less than current age | Sets retirement age below current age (invalid business rule) and verifies the validation alert |
| TC13 | User should not be able to calculate when retirement age equals current age | Sets retirement age equal to current age (zero years to retirement) and verifies the validation alert |

---

## Test Data

All test data is stored in `test/test-data/retirement-calculator.json`.

```json
{
  "requiredFieldsOnly": { ... },                  // TC03 — required fields only
  "allFields": { ... },                           // TC04 — all fields including SS override & married status
  "defaultCalculatorValues": { ... },             // TC06 — default panel values
  "withAdjustedDefaults": {
    "basicInfo": { ... },                         // TC07 — main form data
    "defaults": { ... }                           // TC07 — default panel data
  },
  "requiredFieldsWithoutAge": { ... },            // TC08 — current age left blank
  "requiredFieldsWithoutRetirementAge": { ... },  // TC09 — retirement age left blank
  "requiredFieldsWithoutIncome": { ... },         // TC10 — annual income left blank
  "requiredFieldsWithoutSavingsBalance": { ... }, // TC11 — savings balance left blank
  "retirementAgeLessThanCurrentAge": { ... },     // TC12 — retirement age < current age
  "retirementAgeEqualToCurrentAge": { ... }       // TC13 — retirement age = current age
}
```

To change test inputs, update the JSON file — no changes to spec files are needed.

---

## Setup

```bash
npm install
```

---

## Running Tests

Run all tests:
```bash
npm run test:local
```

Run only the retirement calculator spec:
```bash
npx wdio run wdio.local.conf.ts --spec test/specs/retirement-calculator-test.spec.ts
```

---

## HTML Report

The HTML report is automatically generated after each run and opens in the browser.

- Report location: `reports/report.html`
- The `reports/` folder is cleaned before each run so only the latest results are shown
- Each test displays step-by-step logs captured from page object methods

---

## Configuration

Key settings in `wdio.shared.conf.ts`:

| Setting | Value |
|---|---|
| `baseUrl` | `https://www.securian.com/insights-tools/retirement-calculator.html` |
| `framework` | `jasmine` |
| `logLevel` | `trace` |
| `waitforTimeout` | `10000ms` |
| `defaultTimeoutInterval` | `60000ms` |
