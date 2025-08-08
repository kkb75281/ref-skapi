<template lang="pug">
#success
    router-link(to="/")
        img(src="@/assets/img/logo/symbol-logo.png" alt="Skapi Logo" style="width: 40px; margin-bottom: .625rem")

    .page-title Thanks for joining!

    hr

    .page-desc Your email has been confirmed. #[br]You can now login to Skapi.

    br

    div(style="display:block;text-align:center")
        button.block(@click="router.push({path: '/login', query: {suc_redirect: routeQuery} })") Login
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

let how = route.path.split("/")[2];
let routeQuery = route.query?.suc_redirect;

console.log(how)
</script>

<style scoped lang="less">
#success {
    max-width: 480px;
    padding: 5rem 20px;
    margin: 0 auto;
}

@media (max-width: 480px) {
    button {
        width: 100%;
    }
}
</style>