/**
 * Base page object class.
 * Provides shared navigation and reusable interaction/assertion utilities
 * that all page objects inherit, eliminating step+action boilerplate in subclasses.
 */
import { step } from '../helpers/step.js'
import type { ChainablePromiseElement } from 'webdriverio'

export default class Page {
    /**
     * Navigates to the given path relative to the configured baseUrl.
     * @param path - Relative URL path to navigate to
     */
    async open (path: string) {
        await browser.url(path)
    }

    /**
     * Logs a step and clicks the given element.
     * @param element - Element to click
     * @param stepMessage - Step label shown in the HTML report
     */
    protected async clickElement (element: ChainablePromiseElement, stepMessage: string) {
        step(stepMessage)
        try {
            await element.click()
        } catch (error) {
            throw new Error(`Failed to click element — "${stepMessage}": ${(error as Error).message}`)
        }
    }

    /**
     * Logs a step and sets the value of the given input element.
     * Use this for plain text/number inputs. For currency-masked fields use setCurrencyFieldValue() instead.
     * @param element - Input element to set value on
     * @param value - Value to enter
     * @param stepMessage - Step label shown in the HTML report
     */
    protected async setFieldValue (element: ChainablePromiseElement, value: string, stepMessage: string) {
        step(stepMessage)
        try {
            await element.setValue(value)
        } catch (error) {
            throw new Error(`Failed to set value — "${stepMessage}": ${(error as Error).message}`)
        }
    }

    /**
     * Logs a step and enters a value into a currency-masked input.
     * Clicks the field, selects all existing content with Ctrl+A, then types the value
     * character-by-character via browser.keys() to trigger the mask formatter correctly.
     * @param element - Currency-masked input element
     * @param value - Numeric value to enter e.g. '100000'
     * @param stepMessage - Step label shown in the HTML report
     */
    protected async setCurrencyFieldValue (element: ChainablePromiseElement, value: string, stepMessage: string) {
        step(stepMessage)
        try {
            await element.click()
            await browser.keys(['Control', 'a'])
            await browser.keys(value.split(''))
        } catch (error) {
            throw new Error(`Failed to set currency field value — "${stepMessage}": ${(error as Error).message}`)
        }
    }

    /**
     * Logs a step and asserts the element is visible.
     * @param element - Element to assert on
     * @param stepMessage - Step label shown in the HTML report
     */
    protected async verifyVisible (element: ChainablePromiseElement, stepMessage: string) {
        step(stepMessage)
        try {
            await expect(element).toBeDisplayed()
        } catch (error) {
            throw new Error(`Element not visible — "${stepMessage}": ${(error as Error).message}`)
        }
    }

    /**
     * Logs a step and asserts the element is not visible.
     * @param element - Element to assert on
     * @param stepMessage - Step label shown in the HTML report
     */
    protected async verifyHidden (element: ChainablePromiseElement, stepMessage: string) {
        step(stepMessage)
        try {
            await expect(element).not.toBeDisplayed()
        } catch (error) {
            throw new Error(`Element still visible — "${stepMessage}": ${(error as Error).message}`)
        }
    }

    /**
     * Logs a step and waits for the element to disappear from view.
     * Uses reverse waitForDisplayed to handle both CSS-hidden and DOM-removed scenarios.
     * @param element - Element to wait on
     * @param stepMessage - Step label shown in the HTML report
     */
    protected async waitUntilHidden (element: ChainablePromiseElement, stepMessage: string) {
        step(stepMessage)
        try {
            await element.waitForDisplayed({ reverse: true })
        } catch (error) {
            throw new Error(`Element did not disappear — "${stepMessage}": ${(error as Error).message}`)
        }
    }
}
