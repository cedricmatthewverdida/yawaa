<template>
    <div>
        HAHAHAHAHAHA
    </div>
</template>

<script>
    const Moralis = require("moralis")
    import { mapState } from 'vuex'
    export default {
        computed:{
            ...mapState(['pointbalance'])
        },
        mounted(){
            const currentUser =  Moralis.User.current();
            let addFunds = this.pointbalance + 1;
            currentUser.set("balance",addFunds)
            currentUser.save()
        }
    }
</script>

<style lang="scss" scoped>

</style>