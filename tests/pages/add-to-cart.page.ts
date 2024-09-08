import { Page, expect } from '@playwright/test'

export class AddToCartPage {
  private page: Page

  // Define selectors ===============================================================
  private closeModalButtonLocator = 'button > span:text("X")'
  private removeButtonLocator = 'button[title="remove product from cart"]'
  private subtractButtonLocator = 'button:has-text("-")'
  private addButtonLocator = 'button:has-text("+")'
  private priceLocator = '.sc-11uohgb-4.bnZqjD > p'
  private cartQuantityLocator = '.sc-1h98xa9-3.VLMSP'

  // Methods ========================================================================
  async clickCloseModal() {
    await this.page.locator(this.closeModalButtonLocator).click()
  }

  async clickRemoveItem() {
    await this.page.locator(this.removeButtonLocator).click()
  }

  async clickAddItem() {
    await this.page.locator(this.addButtonLocator).click()
  }

  async clickSubtractItem() {
    await this.page.locator(this.subtractButtonLocator).click()
  }

  async getCartQuantity() {
    return await this.page.locator(this.cartQuantityLocator).textContent()
  }

  async getTotalPrice() {
    const allPriceTexts = this.page.locator(this.priceLocator).allTextContents()
    if ((await allPriceTexts).length === 1) {
      return Number(await allPriceTexts[0])
    }

    for (const text of await allPriceTexts) {
      let number = Number(text)
      return (number += number)
    }
  }
}
