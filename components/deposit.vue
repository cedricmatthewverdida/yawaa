<template>
<div class="mt-10">
  <v-form v-model="valid">
    
    <v-container fill-height>
       
       <v-sheet
        width="700"
        color="transparent"
        >
         <h1 class="mb-3">Deposit</h1>
      <v-row
      class="mb-2">
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="address"
            label="From"
            required
            readonly
            prepend-inner-icon="mdi-ethereum"
            rounded
            outlined
            hide-details
            class="glasseffect"
          ></v-text-field>
        </v-col>


        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="network"
            required
            outlined
            prepend-inner-icon="mdi-ethereum"
            readonly
            label="To"
            class="glasseffect"
            rounded
            hide-details
          ></v-text-field>

        </v-col>
      </v-row>


       

        <v-select
          v-model="asset"
          filled
          label="Assets"
          :items="items"
          small-chips
          class="mb-3 glasseffect"
          hide-details
          rounded
        ></v-select>

        <v-text-field
            v-model="amount"
            label="Amount"
            required
            filled
            class="mb-3 glasseffect"
            rounded
            type="number"
            hide
            :rules="balanceRules"
            :readonly="price.length == 0"
            hide-details="auto"
            :hint="price.length == 0 ? `loading` : `Available ETH ` + ETHBalance + ` || You will get ` +  points"
        ></v-text-field>

        <v-btn 
        block
        rounded
        x-large
        color="primary"
        :disabled="!proceed"
        :loading="paymentprocess"
        @click="create_transaction()"
        >
        Next</v-btn>
        </v-sheet>
 
        
        

    </v-container>
  </v-form>


  <v-dialog
      v-model="dialog"
      persistent
      max-width="490"
    >
      <v-card color="#242735" shaped>
        <v-card-title class="text-h5">
          Transaction success
        </v-card-title>
        <v-card-text>
          
          <h3>Transaction Receipt</h3> {{this.receipt.transactionHash}}
          <h3>BlockHash</h3> {{this.receipt.blockHash}}
          <h3>Gas Used</h3> {{this.receipt.gasUsed}}

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>



<script>
  import { mapState,mapMutations } from 'vuex'
  const Moralis = require("moralis")
  export default {
    data: () => ({
      dialog: false,
      asset: '',
      items: [
        'Ethereum',
      ],
      valid: false,
      secretKey: '',
      network: 'Axie NetWork',
      amount: 0,
      price: [{"id":"ETH","currency":"ETH","symbol":"ETH","name":"Ethereum","logo_url":"https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/eth.svg","status":"active","price":"1911.80114081","price_date":"2021-07-19T00:00:00Z","price_timestamp":"2021-07-19T05:53:00Z","circulating_supply":"116751207","market_cap":"223205090731","market_cap_dominance":"0.1566","num_exchanges":"391","num_pairs":"44350","num_pairs_unmapped":"36938","first_candle":"2015-08-07T00:00:00Z","first_trade":"2015-08-07T00:00:00Z","first_order_book":"2018-08-29T00:00:00Z","rank":"2","rank_delta":"0","high":"4164.82895479","high_timestamp":"2021-05-11T00:00:00Z","1d":{"volume":"15073929538.07","price_change":"-68.64152043","price_change_pct":"-0.0347","volume_change":"-2634476944.73","volume_change_pct":"-0.1488","market_cap_change":"-7987922190.74","market_cap_change_pct":"-0.0346"}},{"id":"WETH","currency":"WETH","symbol":"WETH","name":"WETH","logo_url":"https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/WETH.png","status":"active","price":"1908.76622512","price_date":"2021-07-19T00:00:00Z","price_timestamp":"2021-07-19T05:52:00Z","max_supply":"7426818","market_cap_dominance":"0.0000","num_exchanges":"17","num_pairs":"305","num_pairs_unmapped":"1284","first_candle":"2019-06-10T00:00:00Z","first_trade":"2021-01-21T00:00:00Z","first_order_book":"2019-06-10T00:00:00Z","rank":"2364","rank_delta":"-24","high":"4175.89686217","high_timestamp":"2021-05-11T00:00:00Z","1d":{"volume":"1245822.96","price_change":"-68.91377488","price_change_pct":"-0.0348","volume_change":"116302.69","volume_change_pct":"0.1030"}}],
      receipt: { "transactionHash": "0xefd60e11107368244e111a3dd9118d22cfe6cfe7c04585b381155c0785703a0c", "transactionIndex": 0, "blockHash": "0xad3ebb09662b32ae0efc0a36528aba93be05853d86905fbb92109bd539313fcb", "blockNumber": 96, "from": "0x33cfea581a0bb8c45cdd9532d24fd101068f0812", "to": "0x462644a84f5cfeac3e63df5e6f43a37adb4098f7", "gasUsed": 21000, "cumulativeGasUsed": 21000, "contractAddress": null, "logs": [], "status": true, "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" } ,
      paymentprocess:false,
      balanceRules: [
        v => !!v || 'Please enter amount'
      ],
    }),

    computed:{
      ...mapState(['userETH','ETHBalance','mainETH','pointbalance']),
      address : function (){
        return this.truncate_address(this.userETH);
      },
      points : function (){
        let calculate =  (this.amount * this.price[1].price) / this.price[0].price

        let balance = calculate.toString();
        let startDigit = balance.substring(0,8);
        return startDigit
      },


      proceed : function (){
        if(this.asset != '' && this.amount != 0 && this.amount <= this.ETHBalance) {
          return true;
        }
        return false
      }
    },
    methods:{
        ...mapMutations(['set_balance']),
        truncate_address : function (string){
            var startDigit = string.substring(0,7);
            var lastDigit = string.substr(string.length-5);
            return startDigit+"..."+lastDigit
        },
        async currency_price(){
          const send = await this.$axios.get('https://api.nomics.com/v1/currencies/ticker?key=0d187e865fb86612dbe90fa340f4d5c89edc1d74&interval=1d&quote-currency=USD&ids=ETH,WETH');
          const respo = await send.data;
          this.price = respo;
        },
        async create_transaction (){
          try{
              this.paymentprocess = true;
              const web3 = await Moralis.Web3.enable();

              const processed = await web3.eth.sendTransaction({
                  from: this.userETH,
                  to: this.mainETH,
                  value: web3.utils.toWei(this.amount, 'ether')
              }) 
              .on('receipt', function(receipt){
                  console.log(receipt);
              })
              .on('error', console.error);

              if(processed){
                this.receipt = [];
                this.receipt = processed
                const user = await Moralis.User.current();
                const total = this.pointbalance + Number(this.points);
                this.set_balance(total)
                user.set("balance",total)
                user.save()


                this.paymentprocess = false
                this.dialog = true
              }


            }catch(err){
              alert(err.message)
            }
        }
    },
    mounted(){
      // this.currency_price();
    }
  }
</script>

<style scoped>
.widths{
    max-width: 800px;
}
.glasseffect{
    backdrop-filter: blur(17px) saturate(132%);
    -webkit-backdrop-filter: blur(17px) saturate(132%);
    background-color: rgba(40, 43, 57, 0.76);
    border: 1px solid rgba(255, 255, 255, 0.125);

}
</style>