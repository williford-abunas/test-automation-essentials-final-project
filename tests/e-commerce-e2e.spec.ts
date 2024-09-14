import { test, expect } from '@playwright/test'
import { ProductsPage } from './pages/products.page.ts'

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

  test('Adding 5 items to the cart, validate count and total price', async ({
    page,
  }) => {
    await test.step('Given I add multiple items to the cart', async () => {
      await productsPage.addMultipleItemsToCart(5)
    })

    await test.step('I can verify the total count reflects this.', async () => {
      const cartQuantity = await productsPage.fetchCartQuantity()
      expect(cartQuantity).toBe('5')
    })

    await test.step('I can verify total amount is correct', async () => {
      await productsPage.openCart()
      const itemPricesSum = await productsPage.addItemPrices()
      console.log(`Sum of item prices: ${itemPricesSum}`)
      const totalPrice = await productsPage.getTotalPrice()
      console.log(`Total price displayed: ${totalPrice}`)

      expect(itemPricesSum).toBe(totalPrice)
    })
  })

  test('Successfully remove a product from the cart', async ({ page }) => {
    await test.step('Add 5 items to the cart and verify', async () => {
      await productsPage.addMultipleItemsToCart(5)
      const cartAmount = await productsPage.fetchCartQuantity()
      expect(cartAmount).toBe('5')
    })

    await test.step('Remove product and verify', async () => {
      await productsPage.openCart()
      await productsPage.removeMultipleItems(5)
      const cartAmount = await productsPage.fetchCartQuantity()
      expect(cartAmount).toBe('0')
    })
  })

  test('Verify the checkout process works corrrectly', async ({ page }) => {
    await test.step('Given the customer added 2 items to the cart', async () => {
      await productsPage.addMultipleItemsToCart(2)
    })

    await test.step('Checkout dialog should display correct subtotal', async () => {
      // Make sure cart is open
      await productsPage.openCart()
      const totalPrice = await productsPage.getTotalPrice()
      console.log(`Expected Total Price: ${totalPrice}`)

      // Register the dialog listener before clicking the checkout button
      let dialogTriggered = false
      page.on('dialog', async (dialog) => {
        dialogTriggered = true
        console.log(`Dialog message: ${dialog.message()}`)
        expect(dialog.message()).toBe(`Checkout - Subtotal: $ ${totalPrice}`)
        await dialog.accept()
      })

      // Click the checkout button and trigger the dialog
      await productsPage.clickCheckoutButton()

      // Verify if the dialog was triggered
      expect(dialogTriggered).toBe(true)
    })
  })

  // Adding random amount of randomly selected product - EXTRA CHALLENGE!
  test('Add any amount of any product and verify in the cart', async ({
    page,
  }) => {
    const itemsCount = await productsPage.getItemsAmount()
    let randomCount = Math.floor(Math.random() * itemsCount)
    while (randomCount === 0) {
      randomCount = Math.floor(Math.random() * itemsCount)
    }

    console.log(`random amount: ${randomCount}`)
    await test.step('I can add any amount of any product', async () => {
      await productsPage.addRandomProducts(randomCount, itemsCount)
    })
    await test.step('I can verify the correct quantity in the cart', async () => {
      const cartQuantity = await productsPage.fetchCartQuantity()
      expect(cartQuantity).toBe(`${randomCount}`)
    })
  })
})
