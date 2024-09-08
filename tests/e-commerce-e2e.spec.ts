import { test, expect } from '@playwright/test'
import { ProductsPage } from './pages/products.page'

test.describe('E commerce web app', () => {
  let productsPage: ProductsPage

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page)
    await productsPage.navigateToShop()
  })
})
