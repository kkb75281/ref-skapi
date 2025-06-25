<template lang="pug">
NavBar
main#main
    router-view
</template>

<script setup>
import NavBar from '@/components/navBar.vue';
</script>

<style lang="less">
#main {
    padding-top: 4rem; // height of the navbar
}
</style>