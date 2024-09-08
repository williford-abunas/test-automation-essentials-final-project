import { test, expect } from '@playwright/test'
import { ProductsPage } from './pages/products.page'

test.describe('E commerce web app', () => {
  let productsPage: ProductsPage

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page)
    await productsPage.navigateToShop()
  })

  test('UI - Validate two shirts with size S', async ({ page }) => {
    await test.step('Filter by size S and validate the count', async () => {
      await productsPage.clickFilterBySize('S')
      const itemsList = productsPage.addToCartButtons
      // Wait until the number of visible items is 2
      await expect(itemsList).toHaveCount(2)
      const itemCount = await itemsList.count()
      console.log(`Number of elements in the list: ${itemCount}`)
      // Validate
      expect(itemCount).toBe(2)
    })
  })

  test('API - Validate two shirts with size S', async ({ request }) => {
    // Fetch products from API
    const response = await request.get(
      'https://react-shopping-cart-67954.firebaseio.com/products.json',
      { headers: { Accept: 'application/json' } }
    )
    // Validate the response & parse it
    expect(response.status()).toBe(200)
    const responseBody = (await response.json()) as {
      products: { availableSizes: string[]; title: string }[]
    }
    // Filter product by size S
    const sizeSProducts = responseBody.products.filter((prod) =>
      prod.availableSizes.includes('S')
    )
    // Validate API response count
    expect(sizeSProducts.length).toBe(2)
    console.log(responseBody)
  })
})
