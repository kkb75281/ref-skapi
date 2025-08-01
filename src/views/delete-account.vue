<template lang="pug">
main#confirmation 
    button.inline.icon-text.dark.btn-prev(type="button" @click="router.push('/account-setting')")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-left")
        span Back

    br

    .inner
        .page-title Delete Account

        br

        .page-desc Once you delete your account you will not be able to recover it.

        .page-desc
            | All your data will be deleted permanently.
            br
            | All your subscription plans will be cancelled.
            br
            | All your services will be removed.
            br
            | All your subdomains will be removed immediately.
            br
            | The remaining subscription cannot be refunded.

        .page-desc Are you sure you want to delete your account?

        Checkbox(v-model="iUnderstand" :disabled="promiseRunning")
            b I agree to delete my account.

        br
        br
        br

        .flex-wrap.end
            button.inline.gray.btn-cancel(type="submit" :disabled="!iUnderstand" :class="{red: iUnderstand}" @click='processDelete' style="width: 148px") 
                template(v-if="promiseRunning")
                    .loader(style="--loader-color:white; --loader-size:12px")
                template(v-else) Delete Account

</template>

<script setup lang="ts">
import { skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';
import { serviceList } from './service-list';
import { ref } from 'vue';

import Checkbox from '@/components/checkbox.vue';

const router = useRouter();
const route = useRoute();
let iUnderstand = ref(false);
let promiseRunning = ref(false);

let processDelete = async () => {
    promiseRunning.value = true;

    try {
        let disables = [];
        let cancelSubs = [];
        for (let k in serviceList) {
            disables.push(serviceList[k].disableService());
            disables.push(serviceList[k].registerSubdomain())
        }
        await Promise.all(disables);

        for (let k in serviceList) {
            cancelSubs.push(serviceList[k].cancelSubscription());
        }
        await Promise.all(cancelSubs);
        await skapi.disableAccount();
        router.push('/bye')
    }
    catch (err: any) {
        promiseRunning.value = false;
        alert(err.message);
    }
}
</script>

<style scoped lang="less">
#confirmation {
    max-width: 1500px;
    margin: 0 auto;
    padding: 60px 40px;

    .inner {
        margin: 0 auto;
        text-align: center;
    }
}

@media (max-width: 800px) {
    #confirmation {
        padding: 60px 20px;
    }

    .btn-prev {
        padding: 0.875rem 0;

        &:hover {
            &::after {
                opacity: 0;
            }
        }
    }
}

@media (max-width: 430px) {
    #confirmation {
        padding: 30px 20px 50px;
    }
}
</style>