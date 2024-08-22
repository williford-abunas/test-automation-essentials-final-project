import { test, expect, request, APIRequestContext } from '@playwright/test'

test.describe('Api Testing with Playwright', () => {
  let apiContext: APIRequestContext

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL: 'https://simple-books-api.glitch.me/books',
      extraHTTPHeaders: {
        Authorization:
          'bf438d7bc080dd5b6a7187430eef29fd8aad09d8b135631d20ae6575c210bd9b',
      },
    })
  })

  test.afterAll(async () => {
    await apiContext.dispose()
  })
})
