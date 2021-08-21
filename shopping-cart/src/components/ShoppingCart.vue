<template>
  <div class="cart">
    <h2>Your Cart</h2>
    <p v-show="!products.length"><i>Please add some products to cart.</i></p>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.title }} - {{ currency(product.price) }} x {{ product.quantity }}
      </li>
    </ul>
    <p>Total: {{ currency(total) }}</p>
    <p><button :disabled="!products.length" @click="checkout(products)">Checkout</button></p>
    <p v-show="checkoutStatus">Checkout {{ checkoutStatus }}.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { currency } from '@/utils/currency'
import { useStore } from '@/store/index'
import { moduleName, TState as TCartState } from '@/store/modules/cart'

export default defineComponent({
  setup() {
    const store = useStore()
    console.log(store.getters['cart/cartTotalPrice'])
  },
  computed: {
    checkoutStatus() {
      return this.$store.state[moduleName].checkoutStatus
    },
    products() {
      return this.$store.getters['cart/cartProducts']
    },
    total() {
      return this.$store.getters['cart/cartTotalPrice']
    }
  },
  methods: {
    currency,
    checkout (products: TCartState['items']) {
      this.$store.dispatch("cart/checkout", products)
    }
  }
})
</script>