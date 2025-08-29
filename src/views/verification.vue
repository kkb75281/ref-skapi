<template lang="pug">
#verify
    template(v-if="step == 1")
        router-link(to="/")
            img(src="@/assets/img/logo/symbol-logo.png" alt="Skapi Logo" style="width: 40px; margin-bottom: .625rem")

        .page-title Email Verification

    template(v-else)
        svg.svgIcon(style="height: 50px; width: 50px; margin-bottom: .625rem")
            use(xlink:href="/material-icon.svg?v=20250829065753667#icon-check-circle")
        .page-title Success

    hr

    template(v-if="step === 1")
        form(@submit="verifyEmail")
            .page-desc Verification code has been sent to #[b {{skapi.user.email}}]. #[br]Please check your email and enter the code.

            label
                | Code
                input.block(
                type="text"
                @input="(e) => { error = ''; }"
                name='code'
                placeholder="6 digits code"
                required)

            .resend 
                template(v-if="resending")
                    .resending Email has been re-sent.
                template(v-else)
                    | Haven’t received the email?&nbsp;
                    a.clickable(@click="resend") Re-send

            br

            .error(v-if="error") 
                svg
                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-error")
                span {{ error }}

            br

            .bottom
                div(v-if="promiseRunning" style="width:100%; text-align:center")
                    .loader(style="--loader-color:white; --loader-size:12px")
                template(v-else)
                    router-link(to='/account-setting') Back
                    button.inline(type="submit") Submit

    template(v-else-if="step === 2")
        .page-desc #[b {{ skapi.user.email }}] has been successfully verified. #[br]You can now proceed to your account settings.

        br
        br

        div(style="text-align:right")
            button.inline(@click="router.push('/account-setting')") Confirm
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { skapi } from '@/main';

const router = useRouter();

let step = ref(1);
let error = ref('');
let resending = ref(false);
let promiseRunning = ref(false);
let resend = async () => {
    resending.value = true;
    skapi.verifyEmail();

    setTimeout(() => {
        resending.value = false;
    }, 30000);
}
let verifyEmail = e => {
    promiseRunning.value = true;
    skapi.verifyEmail(e).then(() => step.value++).catch(err => error = err.message).finally(() => promiseRunning.value = false);
}
</script>

<style scoped lang="less">
#verify {
    max-width: 480px;
    padding: 5rem 20px;
    margin: 0 auto;
}

.navigator {
    text-align: center;

    .ball {
        display: inline-block;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background-color: #D9D9D9;
        margin-right: 12px;

        &.active {
            background-color: var(--main-color);
        }

        &:last-child {
            margin: 0;
        }
    }
}

form {
    padding: 8px;

    >label {
        margin-bottom: 16px;
    }

    .resend {
        font-size: 16px;

        // .click {
        //     color: var(--main-color);
        //     font-weight: 600;
        //     cursor: pointer;
        // }
    }

    .bottom {
        min-height: 44px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
    }
}
</style>