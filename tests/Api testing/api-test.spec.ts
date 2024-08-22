import { test, expect, request, APIRequestContext } from '@playwright/test'

test.describe('Api Testing with Playwright', () => {
  let apiContext: APIRequestContext

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL: 'https://simple-books-api.glitch.me',
      extraHTTPHeaders: {
        Authorization:
          'bf438d7bc080dd5b6a7187430eef29fd8aad09d8b135631d20ae6575c210bd9b',
      },
    })
  })

  test.afterAll(async () => {
    await apiContext.dispose()
  })

  test('GET /books', async () => {
    const response = await apiContext.get('/books')
    expect(response.ok()).toBeTruthy()
    const data = await response.json()

    // Check data is an array
    expect(Array.isArray(data)).toBeTruthy()

    // Check/handle if Array is empty
    if (data.length === 0) {
      console.log('The array is empty')
    } else {
      const firstBook = data[0]

      expect(firstBook).toHaveProperty('id')
      expect(firstBook).toHaveProperty('name')
      expect(firstBook).toHaveProperty('type')
      expect(firstBook).toHaveProperty('available')

      // Type checks
      expect(typeof firstBook.id).toBe('number')
      expect(typeof firstBook.name).toBe('string')
      expect(typeof firstBook.type).toBe('string')
      expect(typeof firstBook.available).toBe('boolean')
    }
  })
})
