import { Locator, Page } from '@playwright/test'
import * as dotenv from 'dotenv'

dotenv.config()

const baseURL = process.env.BASE_URL
console.log(baseURL)

export class ProductsPage {
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

  // Define selectors ===============================================================
  // private getSizeSelector(size: string): string {
  //   return `.checkmark:has-text("${size}")`
  // }

  // private getProductCountLocator() {
  //   return this.page.locator('text=/\\d+ Product\\(s\\) found/')
  // }

  // private getCartQuantityLocator() {
  //   return this.page.locator('.sc-1h98xa9-3[title="Products in cart quantity"]')
  // }

  // private addToCartBtn = 'role=button[name="Add to cart"]'

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
  // Navigate to products page
  // async navigateToShop() {
  //   await this.page.goto(baseURL)
  // }
  // // Filter by size
  // async selectSize(size: string) {
  //   const selector = this.getSizeSelector(size)
  //   await this.page.click(selector)
  // }
  // // Assert product quantitiy found
  // async assertProductCount(expectedCount: number) {
  //   const locator = this.getProductCountLocator()
  //   await expect(locator).toHaveText(`${expectedCount} Product(s) found`)
  // }
  // // Assert quantity in cart
  // async assertCartQuantity(expectedQuantity: number) {
  //   const locator = this.getCartQuantityLocator()
  //   await expect(locator).toHaveText(`${expectedQuantity}`)
  // }
  // // Adding to cart
  // async addToCart() {
  //   await this.page.click(this.addToCartBtn)
  // }
}
