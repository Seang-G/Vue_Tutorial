Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      require: true,
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img v-bind:src="image" alt="">
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p>
        <p>Shipping: {{ shipping }}</p>
        <span v-show="onSale">On Sale!</span>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div v-for="(variant, index) in variants" 
            :key="variant.variantId"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor }"
            @mouseover="updateProduct(index)">
          <!-- <p @mouseover="updateProduct(variant.variantImage)">{{ variant.variantColor }}</p> -->
        </div>

        <button v-on:click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }">
            Add to Cart</button>
      </div>

      <product-review @review-submitted="addReview"></product-review>
      
      <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviwes yet.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>
    </div>
  `,
  data(){
    return {
      brand: "Vue Mastery",
      product: "Socks",
      selectedVariant: 0,
      onSale: false,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,

        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 0,
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart(){
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct(index){
      this.selectedVariant = index
    },
    addReview(productReview) {
      this.reviews.push(productReview)
    }
  },
  computed: {
    title() {
      return this.brand + this.name
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "free"
      }
      return 2.99
    }
  }
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    

    </form>
  `,
  data() {
    return {
      name: null,
      rating: null,
      review: null,
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      this.errors = []
      if (this.name && this.review && this.rating){
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        }
        this.$emit("review-submitted", productReview)
        this.name = null
        this.rating = null
        this.review = null
      }
      else {
        if(!this.name) this.errors.push("Name required.")
        if(!this.rating) this.errors.push("Rating required.")
        if(!this.review) this.errors.push("Review required.")
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id){
      this.cart.push(id)
    },
  }
})