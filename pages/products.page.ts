import { Page, expect } from '@playwright/test'

export class ProductsPage {
  private page: Page

  // Define selectors ===============================================================
  private getSizeSelector(size: string): string {
    return `.checkmark:has-text("${size}")`
  }

  private getProductCountLocator() {
    return this.page.locator('text=/\\d+ Product\\(s\\) found/')
  }

  private getCartQuantityLocator() {
    return this.page.locator('.sc-1h98xa9-3[title="Products in cart quantity"]')
  }

  private addToCartBtn = 'role=button[name="Add to cart"]'

  // Constructor to initialize the page object with a Playwright page ===============
  constructor(page: Page) {
    this.page = page
  }

  // Methods ==========================================================================
  // Navigate to products page
  async navigate() {
    await this.page.goto('https://react-shopping-cart-67954.firebaseapp.com/')
  }
  // Filter by size
  async selectSize(size: string) {
    const selector = this.getSizeSelector(size)
    await this.page.click(selector)
  }
  // Assert product quantitiy found
  async assertProductCount(expectedCount: number) {
    const locator = this.getProductCountLocator()
    await expect(locator).toHaveText(`${expectedCount} Product(s) found`)
  }
  // Assert quantity in cart
  async assertCartQuantity(expectedQuantity: number) {
    const locator = this.getCartQuantityLocator()
    await expect(locator).toHaveText(`${expectedQuantity}`)
  }
  // Adding to cart
  async addToCart() {
    await this.page.click(this.addToCartBtn)
  }
}
