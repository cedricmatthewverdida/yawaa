<template>
    <div>

        

    <v-navigation-drawer
        v-if="user.length != 0"
        v-model="drawer"
        clipped
        color="#232634"
        app
    >

        <v-container>
            <v-card color="#232634" >
                <v-card-title class="justify-center">Account</v-card-title>
                <v-card-subtitle class="caption">{{user.id}}</v-card-subtitle>
                <v-card-text>
                    <div class="px-2">
                        <v-icon small>mdi-ethereum</v-icon>
                         <small v-if="ETHBalance != undefined">{{ETHBalance}}</small>
                         <v-progress-circular
                            v-if="ETHBalance == undefined"
                            indeterminate
                            :size="15"
                            color="primary"
                        ></v-progress-circular>
                    </div>
                    <div class="px-2">
                        <v-icon small>mdi-wallet-outline</v-icon>
                         <small>{{userETH | truncate_address}}</small>
                    </div>

                    <div class="px-2">
                         <span class="caption">Axie Points</span>: 
                         <small class="overline">{{pointbalance | truncate_balance}}</small>
                    </div>

                </v-card-text>
            </v-card>
        </v-container>


        <v-container>
            <v-list rounded>
                <v-list-item @click="logout_metamask()">
                <v-list-item-action>
                    <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.2757 6H27.7303C28.9282 6 29.8993 6.97112 29.8993 8.16906V25.1413C29.8993 25.958 29.5312 26.7312 28.8972 27.246L21.0285 33.636C20.431 34.1213 19.575 34.1213 18.9775 33.636L11.1088 27.246C10.4748 26.7312 10.1067 25.958 10.1067 25.1413V8.16906C10.1067 6.97112 11.0778 6 12.2757 6Z" fill="#1273EA"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M25.0189 9.25359C25.9174 9.25359 26.6457 9.98193 26.6457 10.8804V16.1277L26.6452 16.1706C26.6227 17.2407 25.7595 18.1041 24.6895 18.1269L24.646 18.1274L24.6889 18.1279C25.759 18.1504 26.6224 19.0136 26.6452 20.0837L26.6457 20.1271V23.4095C26.6457 23.8765 26.445 24.3209 26.0948 24.6297L22.0083 28.2327L22.0083 20.8791C22.0083 19.9806 21.28 19.2523 20.3815 19.2523H17.9976L17.9975 28.2327L13.9112 24.6297C13.5609 24.3209 13.3602 23.8765 13.3602 23.4095V10.8804C13.3602 9.98193 14.0886 9.25359 14.987 9.25359H25.0189ZM22.0083 11.5033H17.9976V16.5026H20.3815C21.28 16.5026 22.0083 15.7743 22.0083 14.8758V11.5033Z" fill="white"></path></svg>
                    
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Ronnin Wallet</v-list-item-title>
                </v-list-item-content>
                </v-list-item>

                <v-list-item @click="logout_metamask()">
                <v-list-item-action>
                    <v-icon>mdi-logout</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-container>
    </v-navigation-drawer>

    <v-app-bar
        clipped-left
        fixed
        app
        flat
        color="#11131B"
        >

        
         <v-img 
            max-height="32"
            max-width="66"
            class="mr-5"
            :src="require('@/assets/logo.png')"
            >
        </v-img>

        <v-toolbar-title class="overline" v-text="title" />

        <v-spacer></v-spacer>

        <v-app-bar-nav-icon v-if="user.length != 0" @click.stop="drawer = !drawer" />
        

        <template v-slot:extension class="d-flex justify-center">
            
            <v-tabs  align-with-title v-model="activeTab">
                <v-tab v-for="tab in routes" :key="tab.id" :to="tab.link">
                     <v-icon small class="mr-1">{{tab.icon}}</v-icon>
                    {{ tab.title }}
                </v-tab>

                <v-tabs-items v-model="activeTab" @change="updateRouter($event)">
                    <v-tab-item v-for="tab in routes" :key="tab.id" :to="tab.link">
                        <router-view />          
                    </v-tab-item>
                </v-tabs-items>
            </v-tabs>
            
        </template>
        

    </v-app-bar>

   
    </div>
</template>

<script>
    import { mapState,mapMutations } from 'vuex'
    import Moralis from 'moralis'
    export default {
        
        computed:{
            ...mapState(['user','pointbalance','ETHBalance','userETH'])
        },

        data () {
            return {
            balance: undefined,
            activeTab: '',
            routes: [
            {
                id: 1,
                title: 'Market',
                icon: 'mdi-storefront-outline',
                link: '/'
            },
            {
                id: 2,
                title: 'Bridge',
                icon: 'mdi-ethereum',
                link: '/bridge/deposit'
            },
            {
                id: 3,
                title: 'Cart',
                icon: 'mdi-cart-minus',
                link: '/cart'
            }
            
            ],
            drawer:true,
            items: [
                {
                icon: 'mdi-account',
                title: 'Ronin Address',
                to: '/account'
                },
                {
                icon: 'mdi-logout',
                title: 'Logout',
                to: '/logout'
                }
            ],
            miniVariant: true,
            right: false,
            rightDrawer: false,
            title: 'Axie Overload'
            }
        },
        filters:{
            truncate_address : function (string){
                var startDigit = string.substring(0,7);
                var lastDigit = string.substr(string.length-5);
                return startDigit+"..."+lastDigit
            },
            truncate_balance : function (string){
                let balance = string.toString();
                var startDigit = balance.substring(0,8);
                return startDigit
            }
        },
        methods: {
            updateRouter(val){
                this.$router.push(val)
            },

            ...mapMutations(['authorize_loggin']),
            async logout_metamask() {
                await Moralis.User.logOut();
                this.authorize_loggin([]);
                this.$router.push('/')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>