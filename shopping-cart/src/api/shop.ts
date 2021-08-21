const _products = [
  { 'id': 1, 'title': 'iPad 4 Mini', 'price': 500.01, 'quantity': 2, inventory: 2 },
  { 'id': 2, 'title': 'H&M T-Shirt White', 'price': 10.99, 'quantity': 10, inventory: 2 },
  { 'id': 3, 'title': 'Charli XCX - Sucker CD', 'price': 19.99, 'quantity': 5, inventory: 2 }
]

export default {
  async getProducts () {
    await wait(100)
    return _products
  },

  async buyProducts (products: { id: number; quantity: number; }[]) {
    await wait(100)
    console.log('buyProducts products')
  }
}

function wait (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}