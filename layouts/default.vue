<template>
  <v-app dark style="background-color: #242735;">

    <NavigationBar/>
    <v-main>
        <Nuxt />
    </v-main>



  </v-app>
</template>

<script>
 import Moralis from 'moralis'
import NavigationBar from '~/components/navigation.vue'
import { mapActions,mapState,mapMutations } from 'vuex'
export default {
  components:{
    NavigationBar
  },
  data () {
      return {
        yawa: 0
      }
  },
  computed:{
    ...mapState(
        [
          'user',
          'userETH'
        ]
      )
  },

  methods:{

      ...mapActions(['currentUser']),

      ...mapMutations(['lock_eth','set_ethbalance']),

      async load_eth_balance(){
        if(this.user.length != 0){
          window.web3 = await Moralis.Web3.enable();
          const balances =  await Moralis.Web3.getERC20();
          let currentBalance = web3.utils.fromWei(balances.balance, 'ether')
          this.yawa = currentBalance
        }
      },
  },

  mounted(){
      this.load_eth_balance();
      this.set_ethbalance(this.yawa);
  }
}
</script>

