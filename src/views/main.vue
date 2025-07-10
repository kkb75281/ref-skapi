<template lang="pug">
NavBar
main#main
    router-view
</template>

<script setup>
import NavBar from "@/components/navBar.vue";
</script>

<style lang="less">
#main {
    padding-top: 4rem; // height of the navbar
    display: flex;
    flex: 1;

    >div {

        &:first-of-type {
            width: 100%;
        }
    }

}
</style>
