<template lang="pug">
main#confirmation 
    button.inline.icon-text.dark.btn-prev(type="button" @click="router.push('/my-services/' + serviceId + '/dashboard')")
        svg
            use(xlink:href="/material-icon.svg#icon-arrow-left")
        span Back

    br

    .inner
        .page-title Delete Service

        br

        .page-desc Once you delete your service you will not be able to recover it.

        .page-desc
            | Your website will be disconnected from the service.
            br
            | All your service users and data will be deleted permanently.
            br
            | All your hosted files will be deleted immediately.
            br
            | You will lose your subdomain registration.
            br
            | The remaining subscription cannot be refunded.

        .page-desc Are you sure you want to delete your service "#[b {{currentService.service.name}}]"?

        Checkbox(v-model="iUnderstand" :disabled="promiseRunning")
            b I agree to delete my service "{{currentService.service.name}}".

        br
        br
        br
        
        .flex-wrap.end
            button.inline.gray.btn-cancel(type="submit" :disabled="!iUnderstand" :class="{red: iUnderstand}" @click='deleteService()') Delete Service

        //- .bottom
            div(v-if="promiseRunning" style="width:100%; text-align:center")
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else)
                button.noLine.warning(type="button" @click="router.push('/my-services/' + serviceId + '/dashboard')") Cancel
                | &nbsp;&nbsp;
                button.final.warning(type="submit" :class="{disabled: !iUnderstand}" @click='deleteService()') Delete

</template>

<script setup lang="ts">
import { currentService } from "@/views/service/main";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import Checkbox from "@/components/checkbox.vue";

const router = useRouter();
const route = useRoute();
let iUnderstand = ref(false);
let promiseRunning = ref(false);
let serviceId = route.params.id as string;

let deleteService = async () => {
    promiseRunning.value = true;
    try {
        await currentService.deleteSubscription();
        await currentService.deleteService();
        let url = window.location.origin + "/my-services";
        window.location = url;
    } catch (err) {
        promiseRunning.value = false;
        alert(err.message);
        return;
    }
};
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

ul {
    li {
        list-style: none;
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
        padding: 30px 20px 60px;
    }
}
</style>
