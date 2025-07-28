<template lang="pug">
#verify
    router-link(to="/")
        img(src="@/assets/img/logo/symbol-logo.png" style="width: 40px; margin-bottom: .625rem")

    .page-title Enable Account

    hr

    .page-desc Please check your inbox to enable your account. #[br]The confirmation link has been sent to #[b {{email}}].

    .resend 
        template(v-if="resending")
            .resending Email has been re-sent.
        template(v-else)
            | Haven’t received the email?&nbsp;
            span.click(@click="resend") Re-send
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { skapi } from '@/main';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();

let email = route.params.email;

skapi.recoverAccount('/login').catch(err => {
    window.alert(err.message);
    // redirect user to login page
    router.push('/login');
});

let resending = ref(false);
let resend = () => {
    skapi.recoverAccount('/login').catch(err => window.alert(err.message));
    resending.value = true;
}
</script>

<style scoped lang="less">
#verify {
    max-width: 480px;
    padding: 5rem 20px;
    margin: 0 auto;
}

.resend {
    font-size: 16px;

    .click {
        color: var(--main-color);
        font-weight: 600;
        cursor: pointer;
    }
}
</style>