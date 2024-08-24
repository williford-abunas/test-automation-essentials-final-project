import { test, expect, request, APIRequestContext } from '@playwright/test'

test.describe('Api Testing with Playwright', () => {
  let apiContext: APIRequestContext
  let orderId: number
  let token: string

  type Book = {
    id: number
    name: string
    type: string
    available: boolean
  }

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: 'https://simple-books-api.glitch.me',
    })

    const response = await apiContext.post('/api-clients', {
      data: {
        clientName: 'TestClient',
        clientEmail: `testclient${Date.now()}@example.com`,
      },
    })

    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    token = body.accessToken
    expect(token).toBeTruthy()
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  test('Get order details', async () => {
    const response = await apiContext.post('/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        bookId: 1,
        customerName: 'Will Abunas',
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    orderId = body.orderId
    expect(orderId).toBeTruthy()

    const response1 = await apiContext.get(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const body1 = await response1.json()
    expect(body1.id).toEqual(orderId)
    expect(body1.customerName).toEqual('Will Abunas')
  })

  test('delete order', async () => {
    const response = await apiContext.post('/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        bookId: 1,
        customerName: 'Will Abunas',
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    orderId = body.orderId
    expect(orderId).toBeTruthy()

    const response1 = await apiContext.delete(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response1.status()).toBe(204)
  })
})
