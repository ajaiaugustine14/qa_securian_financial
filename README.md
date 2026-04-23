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
│   │   ├── page.ts                              # Base page class
│   │   ├── preRetirementCalculatorForm.page.ts  # Form fields & actions
│   │   ├── defaultCalculatorValues.page.ts      # Adjust default values panel
│   │   └── preRetirementCalculatorResult.page.ts# Results section
│   ├── specs/
│   │   └── retirementCalculatorTest.spec.ts     # Test cases
│   ├── helpers/
│   │   └── step.ts                              # Step logger for HTML report
│   └── test-data/
│       └── retirementCalculator.json            # Test data
├── reports/                                     # Generated HTML reports
├── wdio.shared.conf.ts                          # Shared WebdriverIO config
├── wdio.local.conf.ts                           # Local Chrome config
└── wdio.sauce.conf.ts                           # Sauce Labs config
```

---

## Page Objects

### `preRetirementCalculatorForm.page.ts`
Handles the main calculator form.

| Method | Description |
|---|---|
| `open()` | Navigates to the calculator page and accepts cookie popup |
| `fillBasicInfo(data)` | Fills all basic info fields (age, income, savings) |
| `clickCalculate()` | Clicks the Calculate button |
| `openAdjustDefaults()` | Opens the Adjust default values panel |
| `selectIncludeSocialSecurityYes()` | Selects Yes for social security |
| `selectIncludeSocialSecurityNo()` | Selects No for social security |
| `selectSingleStatus()` | Selects Single marital status |
| `selectMarriedStatus()` | Selects Married marital status |
| `fillSocialSecurityOverride(amount)` | Enters a custom social security amount |
| `verifyRequiredFieldsAlertDisplayed()` | Asserts validation alert is shown with correct message |
| `verifySocialSecurityOverrideVisible()` | Asserts SS override field is visible |
| `verifySocialSecurityOverrideHidden()` | Asserts SS override field is hidden |
| `verifySpouseIncomeVisible()` | Asserts spouse income field is visible |
| `verifySpouseIncomeHidden()` | Asserts spouse income field is hidden |

### `defaultCalculatorValues.page.ts`
Handles the Adjust default values panel.

| Method | Description |
|---|---|
| `adjustDefaults(data)` | Fills additional income, duration, ROI fields |
| `selectIncludeInflationYes()` | Selects Yes for include inflation toggle |
| `selectIncludeInflationNo()` | Selects No for include inflation toggle |
| `setExpectedInflationRate(rate)` | Enters expected inflation rate |
| `saveChanges()` | Clicks Save changes |
| `verifyDefaultsDialogOpen()` | Asserts defaults panel header is visible |
| `verifyDefaultsDialogClosed()` | Waits for defaults panel to close |
| `verifyInflationRateVisible()` | Asserts expected inflation rate field is visible |
| `verifyInflationRateHidden()` | Asserts expected inflation rate field is hidden |

### `preRetirementCalculatorResult.page.ts`
Handles the results section.

| Method | Description |
|---|---|
| `verifyResultsDisplayed()` | Asserts the Results heading is displayed |

---

## Test Cases

File: `test/specs/retirementCalculatorTest.spec.ts`

| # | Test | Description |
|---|---|---|
| 1 | User should not able to calculate without filling all required fields | Clicks Calculate with empty form and verifies validation alert message |
| 2 | Additional Social Security fields should display/hide based on Social Security benefits toggle | Toggles SS Yes/No and verifies override field visibility |
| 3 | User should be able to submit form with all required fields filled in and see results | Fills required fields only and verifies results section appears |
| 4 | User should be able to submit form with all fields filled in | Fills all fields including spouse income, married status and SS override |
| 5 | Inflation rate field should display/hide based on include inflation toggle in default values | Opens defaults panel, toggles inflation Yes/No and verifies rate field visibility |
| 6 | User should be able to update default calculator values | Opens defaults panel, fills all default values, saves and verifies panel closes |
| 7 | User should be able to calculate with adjusted default values and see results | Full E2E — fills basic info, updates defaults with inflation, calculates and verifies results |

---

## Test Data

All test data is stored in `test/test-data/retirementCalculator.json`.

```json
{
  "requiredFieldsOnly": { ... },       // Used in test 3
  "allFields": { ... },                // Used in test 4
  "defaultCalculatorValues": { ... },  // Used in test 6
  "withAdjustedDefaults": {
    "basicInfo": { ... },              // Used in test 7
    "defaults": { ... }                // Used in test 7
  }
}
```

To change test inputs, update the JSON file — no changes to spec files needed.

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
npx wdio run wdio.local.conf.ts --spec test/specs/retirementCalculatorTest.spec.ts
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
