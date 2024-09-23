import { test, expect } from '@playwright/test'
import { ProductsPage } from '../pages/products.page.ts'

test.describe('E commerce web app', () => {
  let productsPage: ProductsPage

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page)
    await productsPage.navigateToShop()
    console.log('Logged in as ' + process.env.USERNAME)
  })

  test('UI - Validate two shirts with size S', async ({ page }) => {
    await test.step('Given I filter the products by size "S"', async () => {
      await productsPage.clickFilterBySize('S')
    })

    await test.step('Then I verify that the correct number of products is displayed', async () => {
      const itemsList = productsPage.addToCartButtons
      await expect(itemsList).toHaveCount(2)
      const itemCount = await itemsList.count()
      console.log(`Number of elements in the list: ${itemCount}`)
      expect(itemCount).toBe(2)
    })
  })

  test('API - Validate two shirts with size S', async ({ request }) => {
    await test.step('When I fetch the products from the API', async () => {
      const response = await request.get(
        'https://react-shopping-cart-67954.firebaseio.com/products.json',
        { headers: { Accept: 'application/json' } }
      )

      expect(response.status()).toBe(200)
    })

    await test.step('Then I parse the response and filter by size "S"', async () => {
      const response = await request.get(
        'https://react-shopping-cart-67954.firebaseio.com/products.json',
        { headers: { Accept: 'application/json' } }
      )
      const responseBody = (await response.json()) as {
        products: { availableSizes: string[]; title: string }[]
      }

      const sizeSProducts = responseBody.products.filter((prod) =>
        prod.availableSizes.includes('S')
      )

      expect(sizeSProducts.length).toBe(2)
    })
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
    await test.step('Given I add 5 items to the cart', async () => {
      await productsPage.addMultipleItemsToCart(5)
      const cartAmount = await productsPage.fetchCartQuantity()
      expect(cartAmount).toBe('5')
    })

    await test.step('When I open the cart I can remove the same number of product', async () => {
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

    await test.step('The checkout dialog should display correct subtotal', async () => {
      await productsPage.openCart()
      const totalPrice = await productsPage.getTotalPrice()
      console.log(`Expected Total Price: ${totalPrice}`)

      let dialogTriggered = false
      page.on('dialog', async (dialog) => {
        dialogTriggered = true
        console.log(`Dialog message: ${dialog.message()}`)
        expect(dialog.message()).toBe(`Checkout - Subtotal: $ ${totalPrice}`)
        await dialog.accept()
      })

      await productsPage.clickCheckoutButton()

      expect(dialogTriggered).toBe(true)
    })
  })

  test('Adding any amount of any product (>=10) and verify in the cart', async ({
    page,
  }) => {
    const itemsCount = 10
    let randomCount = Math.floor(Math.random() * itemsCount)
    while (randomCount === 0) {
      randomCount = Math.floor(Math.random() * itemsCount)
    }

    console.log(`random amount: ${randomCount}`)
    await test.step('I can add any number of any product', async () => {
      await productsPage.addRandomProducts(randomCount, itemsCount)
    })
    await test.step('I can verify the correct quantity in the cart', async () => {
      const cartQuantity = await productsPage.fetchCartQuantity()
      expect(cartQuantity).toBe(`${randomCount}`)
    })
  })
})
