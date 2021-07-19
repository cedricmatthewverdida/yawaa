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
                <v-list-item>
                <v-list-item-action>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Account</v-list-item-title>
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
                title: 'Account',
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
            title: 'Yawa'
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
                console.log("logged out");
                this.$router.push('/')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>