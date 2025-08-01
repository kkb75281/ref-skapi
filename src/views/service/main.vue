<template lang="pug">
#serviceMain.service-page-main(v-if="serviceMainLoaded")
    nav.left 
        SideNav
        .upgrade(v-if="currentService.service.group <= 1")
            .title Hey, {{ user?.name ? user.name : user.email.split('@')[0] }}
            .desc This service is currently in a free version. Upgrade to enjoy more convenient features!
            router-link(:to='`/subscription/${currentService.id}`')
                button.block(type="button") Upgrade

    main.right
        router-view
    
    // upgrade service
    Modal(:open="serviceUpgradeOffer" @close="serviceUpgradeOffer=false")
        .modal-title Upgrade

        .modal-desc You can access more features like sending newsletters, #[br]inviting users and file hosting by upgrading your service. #[br]Would you like you check out our service plans?

        .modal-btns
            button.gray(type="button" @click="serviceUpgradeOffer=false;") No
            button(type="button" @click="router.push(`/subscription/${currentService.id}`)") Upgrade
div(v-else style='width:100%;text-align: center;margin-top: 100px;')
    .loader(style="--loader-color:white; --loader-size:12px")

</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { user } from '@/code/user';
import { serviceList } from "@/views/service-list";
import { currentService, setService, serviceMainLoaded, serviceUpgradeOffer } from "@/views/service/main";

import SideNav from "@/components/sideNav.vue";
import Modal from "@/components/modal.vue";
import MaterialIcon from "@/assets/img/material-icon.svg"

const router = useRouter();
const route = useRoute();

let serviceId = route.path.split("/")[2];
let plan = ref("Trial");

watch(serviceList, nv => {
    if (nv[serviceId] && currentService?.id !== serviceId) {
        try {
            setService(serviceId);
            plan.value = currentService?.plan;
        }
        catch (err) {
            router.push('/my-services');
        }
    } else if (nv[serviceId] && currentService?.id === serviceId && !serviceMainLoaded.value) {
        serviceMainLoaded.value = true;
    }
}, { immediate: true });
</script>

<style lang="less" scoped>
#serviceMain {
    position: relative;
    width: 100%;
    background-color: #16171A;
    color: #F5F5F5;

    .left {
        position: fixed;
        top: 4rem;
        left: 0;
        max-width: 260px;
        width: 100%;
        height: calc(100% - 4rem);
        overflow-y: auto;
        background-color: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .upgrade {
            width: 13.75rem;
            margin: 0 1.25rem 2.5rem;
            padding: 1.875rem 1.25rem;
            background-color: #16171A;
            text-align: center;
            border-radius: .9375rem;

            .title {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                margin-bottom: .5rem;
            }

            .desc {
                font-weight: 300;
                font-size: .875rem;
                line-height: 1.3;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 1.875rem;
            }
        }
    }

    .right {
        // width: 50%;
        flex-grow: 1;
        padding: 40px;
        padding-top: 60px;
        padding-left: 300px;
        max-width: 1600px;
        margin: 0 auto;
    }

    .bottom {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        gap: 20px;
        // padding: 20px 8px 40px;
        padding: 20px 20px 40px;

        .link {
            // width: calc(50% - 10px);
            flex-grow: 1;
            flex-shrink: 0;
            min-width: 320px;
            width: 0; // flex 매직

            a {
                display: block;
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 6px;
                padding: 11px 16px 13px;
                text-decoration: none;
                transition: all 0.25s;

                &:hover {
                    border: 1px solid rgba(41, 63, 230, 0.6);
                }

                &.next {
                    text-align: right;
                }

                .desc {
                    color: rgba(0, 0, 0, 0.4);
                    font-size: 0.8rem;
                }

                .title {
                    color: var(--main-color);
                }
            }
        }
    }
}

@media (max-width: 800px) {
    #serviceMain {
        .left {
            display: none;
        }

        .right {
            padding: 24px;
            padding-top: 60px;
        }
    }
}
</style>
