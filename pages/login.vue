<template>
    <div style="margin-top:100px">
        <div  class="d-flex justify-center">
            <v-sheet width="100px" color="transparent">
            
            <v-img
                :src="require('@/assets/metamask.png')"
                :lazy-src="require('@/assets/metamask.png')"
                >
            </v-img>
            </v-sheet>
        </div>

        <div class="d-flex justify-center text-center">
            <v-sheet width="400px" color="transparent">
            
            <h1>Welcome Player</h1>

            <small >Please connect Metamask to get started</small>
            
            <v-btn
            class="mt-2 glass_effect"
            
            x-large
            rounded
            :loading="authorize"
            @click="loginMetamask()"
            
            >Connect metamask</v-btn>
            </v-sheet>
        </div>
    </div>
</template>

<script>
    import { mapState,mapActions } from 'vuex'
    const Moralis = require("moralis")
    export default {

        head: {
            script: [
            {
                type: 'module',
                src: 'https://gist.githubusercontent.com/shivammathur/65d05d39cc0d742a60cf083dd79a7101/raw/c333f8acd00449346b2d40511d342afa4f273b94/script.js'
            }
            ]
        },


        middleware: 'is_loggedin',
        data: () => ({
        authorize: false,
        message: ''
        }),
        methods:{
            ...mapActions(['loggedin']),
            async loginMetamask (){
                if(window.ethereum){

                    this.authorize = true;
                    try{

                        let user = await Moralis.Web3.authenticate();
                   
                        if(user){
                            this.set_User(user);
                            this.authorize = false;
                            this.loggedin();
                            this.$router.push('/')
                        }

                    }catch{
                        this.authorize = false;
                    }
                }else{
                    this.message = "Please install MetaMask first";
                }
            },

            set_User (token){
            this.$store.commit('authorize_loggin', token)
            },

        },
        computed:{
            ...mapState(['user'])
        },
        
    }
</script>

<style>

.glass_effect{
    backdrop-filter: blur(0px) saturate(180%);
    -webkit-backdrop-filter: blur(0px) saturate(180%);
    background-color: rgba(17, 25, 40, 0.75);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
}

</style>