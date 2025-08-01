<template lang="pug">
#bye
    router-link(to="/")
        img(src="@/assets/img/logo/symbol-logo.png" alt="Skapi Logo" style="width: 40px; margin-bottom: .625rem")

    .page-title Deleted Complete

    hr

    .page-desc #[span.wordset Your account and all your subscription plan] #[span.wordset has been disabled.] #[span.wordset All your services will no longer be accessible] #[span.wordset and will be completely removed in 30 days.] #[span.wordset You can re-enable your account within 30 days.]

    div(style="display:block;text-align:center")
        button.block(@click="router.push('/')") Go Skapi
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
</script>

<style scoped lang="less">
#bye {
    max-width: 480px;
    padding: 5rem 20px;
    margin: 0 auto;
}
</style>