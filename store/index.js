const Moralis = require("moralis")
import _ from 'lodash';
export const state = () => ({
    user:[],
    mainETH: '0x462644A84F5CFEac3E63DF5E6F43a37adb4098F7',
    userETH: '',
    cart: [
       
    ],
    ETHBalance: 0.049,
    pointbalance: 0
})

export const getters ={

    check_axie_exist_in_cart: (state) => (id) => {
        // return state.cart.length != 0 ? state.cart.find( s => s.id == id) : -1;
        return _.find(state.cart, function(o) { return o.id == id; })
    },
}


export const mutations = {
    addItem(state, params = Object){
        if(state.user.length != 0){
            if(state.cart.length != 0 && params[5] <= state.pointbalance){

                
                var Exist = state.cart.findIndex( s => s.id == params[0])

                if(Exist < 0){
                    state.cart.push({
                        id: params[0],
                        name: params[1],
                        image: params[2],
                        class: params[3],
                        stats:params[4]
                    })

                    state.pointbalance = state.pointbalance - params[5]
                    const currentUser =  Moralis.User.current();
                    currentUser.set("cart",state.cart)
                    currentUser.set("balance",state.pointbalance)
                    currentUser.save()
                }

            }else{
                if(params[5] <= state.pointbalance){
                    
                    state.cart.push({
                        id: params[0],
                        name: params[1],
                        image: params[2],
                        class: params[3],
                        stats:params[4]
                    })

                    state.pointbalance = state.pointbalance - params[5]
                    const currentUser =  Moralis.User.current();
                    currentUser.set("cart",state.cart)
                    currentUser.set("balance",state.pointbalance)
                    currentUser.save()
                    
                }
                
            }
        }
    },

    authorize_loggin(state,user){
        return state.user = user;
    },

    lock_eth(state,userETH){
        return state.userETH = userETH;
    },

    set_ethbalance(state,ETHBalance){
        return state.ETHBalance = ETHBalance;
    },

    set_balance(state,pointbalance){
        return state.pointbalance = pointbalance;
    },

    set_cart(state,cart){
        return state.cart = cart;
    },
}

export const actions = {
    loggedin({commit}){

        const currentUser =  Moralis.User.current();
        if (currentUser) {
           commit('authorize_loggin', currentUser)
           commit('lock_eth', currentUser.attributes.authData.moralisEth.id)
           commit('set_balance', currentUser.attributes.balance)
           let cart = currentUser.attributes.cart == undefined ? [] : currentUser.attributes.cart;
           commit('set_cart', cart)
        }
    },


    nuxtClientInit ({ commit }, { req }) {
        Moralis.initialize("4qbZHWL8fGpAttgD4oOt51ZPmIh4hbRi81oHfnDy","rcgPriOa7YhGvJ5IPtwpOrbLS2h8MH64QU5VIcRD");
        Moralis.serverURL = "https://inutj0ogpf1e.usemoralis.com:2053/server"
        Moralis.Web3.getSigningData = () => 'Welcome to Madafaking Axie Infinity Wadafak!'

        const currentUser =  Moralis.User.current();
        if (currentUser) {
           commit('authorize_loggin', currentUser)
           commit('lock_eth', currentUser.attributes.authData.moralisEth.id)
           commit('set_balance', currentUser.attributes.balance)
           let cart = currentUser.attributes.cart == undefined ? [] : currentUser.attributes.cart;
           commit('set_cart', cart)
        }
        
    }

}



