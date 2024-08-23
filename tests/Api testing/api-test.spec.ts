import { test, expect, request, APIRequestContext } from '@playwright/test'

test.describe('Api Testing with Playwright', () => {
  let apiContext: APIRequestContext
  let orderId: number
  const token =
    'b81998b8a28636557d6f06db3bd7ebbc2096351ff4dcf85d8158aa2f2d1a15c0'

  type Book = {
    id: number
    name: string
    type: string
    available: boolean
  }

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL: 'https://simple-books-api.glitch.me',
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
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

  test('Get only 2 fiction type books', async () => {
    const response = await apiContext.get('/books', {
      params: {
        type: 'fiction',
        limit: 2,
      },
    })

    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    // Check data is an array
    expect(Array.isArray(data)).toBeTruthy()
    // Check there's only 2 items
    expect(data.length).toBe(2)

    data.forEach((book: Book) => {
      expect(book).toHaveProperty('id')
      expect(book).toHaveProperty('name')
      expect(book).toHaveProperty('type')
      expect(book).toHaveProperty('available')

      // Type checks
      expect(typeof book.id).toBe('number')
      expect(typeof book.name).toBe('string')
      expect(typeof book.type).toBe('string')
      expect(book.type).toBe('fiction') // Ensure the type is "fiction"
      expect(typeof book.available).toBe('boolean')
    })
  })

  test('Submit a new order', async () => {
    const response = await apiContext.post('/orders', {
      data: {
        bookId: 1,
        customerName: 'Will Abunas',
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    orderId = body.orderId
    expect(orderId).toBeTruthy()
  })
})
