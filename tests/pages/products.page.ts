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
  readonly productPriceText: Locator
  readonly cartButton: Locator
  readonly productCountText: Locator
  readonly checkoutButton: Locator
  readonly sizeFilter: (size: string) => Locator
  readonly subtractButton: Locator
  readonly addButton: Locator
  readonly removeButton: Locator
  readonly totalPriceText: Locator
  readonly quantityElement: Locator

  // Constructor to initialize the page object with a Playwright page ===============
  constructor(page: Page) {
    this.page = page
    this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' })
    this.closeCheckoutButton = page.getByRole('button', { name: 'X' })
    this.checkoutButton = page.locator('button:has-text("Checkout")')
    this.cartQuantity = page.locator('.sc-1h98xa9-3')
    this.productPriceText = page.locator('.sc-11uohgb-4 p')
    this.productCountText = page.locator('text=/\\d+ Product\\(s\\) found/')
    this.subtractButton = page.getByRole('button', { name: '-', exact: true })
    this.addButton = page.getByRole('button', { name: '+', exact: true })
    this.sizeFilter = (size: string) =>
      page.getByText(`${size}`, { exact: true })
    this.removeButton = page.locator('button[title="remove product from cart"]')
    this.cartButton = page.locator(
      'button:has(div[title="Products in cart quantity"])'
    )
    this.totalPriceText = page.locator('p.sc-1h98xa9-9.jzywDV')
    this.quantityElement = page.locator('p.sc-11uohgb-3.gKtloF')
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
    const addToCartButton = this.addToCartButtons.nth(index)
    await addToCartButton.waitFor({ state: 'visible' })
    await addToCartButton.click()
  }

  async clickCloseCheckoutButton() {
    await this.closeCheckoutButton.waitFor({ state: 'visible' })
    await this.closeCheckoutButton.click()
  }

  async clickCheckoutButton() {
    await this.checkoutButton.waitFor({ state: 'visible' })
    await this.checkoutButton.click()
  }

  async clickFilterBySize(size: string) {
    await this.page.waitForSelector(`text=${size}`, { state: 'visible' })
    await this.sizeFilter(size).click()
  }

  async fetchCartQuantity() {
    return await this.cartQuantity.textContent()
  }

  async getItemsAmount() {
    return await this.addToCartButtons.count()
  }

  async addMultipleItemsToCart(count: number) {
    await this.page.waitForLoadState('domcontentloaded')

    const itemsCount = await this.getItemsAmount()
    console.log(`Total items available: ${itemsCount}`)

    for (let i = 0; i < Math.min(count, itemsCount); i++) {
      console.log(`Adding item ${i + 1} to the cart`)
      await this.clickAddToCartButton(i)
      await this.clickCloseCheckoutButton()
    }
  }

  async openCart() {
    await this.cartButton.click()
  }

  async removeMultipleItems(count: number) {
    let itemsCount = await this.removeButton.count() // Count the total number of remove buttons

    // Loop over the items and remove them one by one
    for (let i = 0; i < Math.min(count, itemsCount); i++) {
      console.log(`Removing item ${i + 1} from the cart`)

      // Wait for the remove button to be visible and clickable
      const currentRemoveButton = this.removeButton.nth(0) // Always target the first button since the DOM is dynamic

      await currentRemoveButton.waitFor({ state: 'visible' }) // Ensure the button is visible
      await currentRemoveButton.click() // Click the button to remove the item
    }
  }

  async addItemPrices() {
    const allPriceTexts = await this.productPriceText.allTextContents()
    console.log(allPriceTexts)

    // Use reduce to sum the prices
    const total = allPriceTexts.reduce((acc, price) => {
      const numericPrice = this.convertPriceStringToNumber(price)

      // Add to the accumulator
      return acc + numericPrice
    }, 0)

    return total
  }

  async getTotalPrice() {
    const totalPrice = await this.totalPriceText.textContent()
    return this.convertPriceStringToNumber(totalPrice)
  }

  // Helper to convert price string to number
  convertPriceStringToNumber(priceText: string | null): number {
    if (!priceText) {
      return 0
    }
    // Remove dollar sign, trim spaces, then convert to number
    return parseFloat(priceText.replace('$', '').trim())
  }

  async addRandomProducts(randomNum: number, itemsCount: number) {
    await this.page.waitForLoadState('domcontentloaded')

    for (let i = 0; i < randomNum; i++) {
      const randomProductIndex = Math.floor(Math.random() * itemsCount)
      console.log(`random index: ${randomProductIndex}`)
      await this.clickAddToCartButton(randomProductIndex)
      await this.clickCloseCheckoutButton()
    }
  }
}
