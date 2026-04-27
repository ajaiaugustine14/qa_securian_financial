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
