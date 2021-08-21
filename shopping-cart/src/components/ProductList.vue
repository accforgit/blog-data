<template>
<ul>
  <li v-for="product in products" :key="product.id">
    {{ product.title }} - {{ currency(product.price) }}
    <br>
    <button
      :disabled="!product.inventory"
      @click="addProductToCart(product)">
      Add to cart
    </button>
  </li>
</ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { currency } from '@/utils/currency'
import { moduleName } from '@/store/modules/products';
import { IProductItem } from '@/store/modules/cart';

export default defineComponent({
  name: 'ProductList',
  computed: {
    products() {
      return this.$store.state[moduleName].all
    }
  },
  methods: {
    addProductToCart(products: IProductItem) {
      this.$store.dispatch("cart/addProductToCart", products)
    },
    currency
  },
  created () {
    this.$store.dispatch('products/getAllProducts',  undefined)
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
