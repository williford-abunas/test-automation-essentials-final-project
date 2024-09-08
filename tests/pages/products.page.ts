import { Locator, Page } from '@playwright/test'
import * as dotenv from 'dotenv'

dotenv.config()

const baseURL = process.env.BASE_URL
console.log(baseURL)

export class ProductsPage {
  // Variable declarations
  readonly page: Page
  readonly addToCartButtons: Locator
  readonly closeCheckoutButton: Locator
  readonly cartQuantity: Locator
  readonly productPriceTexts: Locator
  readonly cartAmount: Locator
  readonly productCountText: Locator
  readonly checkoutButton: Locator
  readonly sizeFilter: (size: string) => Locator
  readonly subtractButton: Locator
  readonly addButton: Locator

  // Constructor to initialize the page object with a Playwright page ===============
  constructor(page: Page) {
    this.page = page
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' })
    this.closeCheckoutButton = page.getByRole('button', { name: 'X' })
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' })
    this.cartQuantity = page.locator(
      '.sc-1h98xa9-3[title="Products in cart quantity"]'
    )
    this.productPriceTexts = page.locator('.sc-11uohgb-4 p')
    this.cartAmount = page.locator('.sc-1h98xa9-9.jzywDV')
    this.productCountText = page.locator('text=/\\d+ Product\\(s\\) found/')
    this.subtractButton = page.getByRole('button', { name: '-', exact: true })
    this.addButton = page.getByRole('button', { name: '+', exact: true })
    this.sizeFilter = (size: string) =>
      page.locator(`.checkmark:has-text(${size})`)
  }

  // Methods ==========================================================================

  async navigateToShop() {
    if (!baseURL) {
      console.log('BASE_URL is not defined.')
      return
    }

    await this.page.goto(baseURL)
  }

  async clickAddToCartButton(index: number) {
    // await this.page.waitForLoadState('domcontentloaded')
    const addToCartButton = this.addToCartButtons.nth(index)
    await addToCartButton.waitFor({ state: 'visible' })
    // Ensure button is enabled, evaluate executes a fn in the browser context to interact w/ DOM
    await this.page.waitForFunction(
      async (btn) =>
        !(await btn.evaluate((el: HTMLElement) => el.hasAttribute('disabled'))),
      addToCartButton
    )
    await addToCartButton.click()
  }

  async clickCheckoutButton() {
    await this.checkoutButton.waitFor({ state: 'visible' })
    await this.checkoutButton.click()
  }

  async clickCloseCheckoutButton() {
    await this.closeCheckoutButton.waitFor({ state: 'visible' })
    await this.closeCheckoutButton.click()
  }

  async getItemsAmount() {
    return await this.addToCartButtons.count()
  }

  async clickFilterBySize(size: string) {
    await this.page.waitForSelector(`text=${size}`, { state: 'visible' })
    await this.sizeFilter(size).click()
  }

  async fetchCartAmount() {
    return await this.cartAmount.textContent()
  }
}
