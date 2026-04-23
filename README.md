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
| `selectIncludeSocialSecurityYes()` | Selects Yes for social security |
| `selectIncludeSocialSecurityNo()` | Selects No for social security |
| `selectMarriedStatus()` | Selects Married marital status |
| `fillSocialSecurityOverride(amount)` | Enters a custom social security amount |
| `openAdjustDefaults()` | Opens the Adjust default values panel |
| `verifyRequiredFieldsAlertDisplayed()` | Asserts validation alert is shown |
| `verifySocialSecurityOverrideVisible()` | Asserts SS override field is visible |
| `verifySocialSecurityOverrideHidden()` | Asserts SS override field is hidden |

### `defaultCalculatorValues.page.ts`
Handles the Adjust default values panel.

| Method | Description |
|---|---|
| `adjustDefaults(data)` | Fills additional income, duration, ROI fields |
| `selectIncludeInflationYes()` | Selects Yes for inflation |
| `setExpectedInflationRate(rate)` | Enters expected inflation rate |
| `saveChanges()` | Clicks Save changes |
| `verifyDefaultsDialogOpen()` | Asserts panel header is visible |
| `verifyDefaultsDialogClosed()` | Waits for panel to close |

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
| 1 | User should not able to calculate without filling all required fields | Clicks Calculate with empty form and verifies validation alert |
| 2 | Additional Social Security fields should display/hide based on toggle | Toggles SS Yes/No and verifies override field visibility |
| 3 | User should be able to submit form with all required fields filled in | Fills required fields only and verifies results appear |
| 4 | User should be able to submit form with all fields filled in | Fills all fields including spouse income and SS override |
| 5 | User should be able to update default calculator values | Opens defaults panel, updates values, saves and verifies panel closes |

---

## Test Data

All test data is stored in `test/test-data/retirementCalculator.json`.

```json
{
  "requiredFieldsOnly": { ... },   // Used in test 3
  "allFields": { ... },            // Used in test 4
  "defaultCalculatorValues": { ... } // Used in test 5
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
