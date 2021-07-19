<template>
    <div>
        <v-img
        :src="require('@/assets/Arena-fg.png')"
        :lazy-src="require('@/assets/Arena-fg.png')"
    
        >
        <v-container v-if="cart.length != 0">
        <Anounce color="#11131B" :highlight="cart.length" icon="mdi-cart-minus"/>
        <Cart/>
        </v-container>
        <v-container v-else style="margin-top:150px">
            <div class="text-center"
            >
                <h1 class="Design">Cart is Empty</h1>
            </div>
        </v-container>
        </v-img>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Cart from '~/components/usercart.vue'
    import Anounce from '~/components/alert.vue'
    export default {
        middleware: 'loggedin',
        components:{
            Cart,
            Anounce
        },
        computed:{
            ...mapState(['cart'])
        }
    }
</script>

<style lang="scss" scoped>
.Design{
    color: mix(#fff, #11131B, 85%);
	font-size: calc(1em + 10vw) ;  
	font-weight: 900;
	text-shadow: 
		-0.0075em 0.0075em 0 mix(#fff, #11131B, 94%),
		0.005em 0.005em 0 mix(#fff, #11131B, 60%),
		0.01em 0.01em 0 mix(#fff, #11131B, 62%), 
		0.015em 0.015em mix(#fff, #11131B, 64%), 
		0.02em 0.02em 0 mix(#fff, #11131B, 66%), 
		0.025em 0.025em 0 mix(#fff, #11131B, 68%),
		0.03em 0.03em 0 mix(#fff, #11131B, 70%),
		0.035em 0.035em 0 mix(#fff, #11131B, 72%);
}
</style>