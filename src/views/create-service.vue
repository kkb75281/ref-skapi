<template lang="pug">
template(v-if="visible")
    .modal-overlay(:class="{ 'first-service': isFirstService }" @click="handleClose")
        .modal-wrap
            .modal-content(@click.stop)                    
                #create
                    .btn-prev(v-if="step > 1")
                        svg.svgIcon(@click="step--")
                            use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-left" alt="Arrow Left Icon")
                    .btn-close(@click="handleClose" :style="isFirstService ? {display: 'none'} : {}")
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-x" alt="Close Icon")

                    .form(v-if="step === 1")
                        h3.title
                            template(v-if="isFirstService")
                                | Welcome!
                                br
                                | Create your first service
                            template(v-else)
                                | Create your service
                        span.desc
                            template(v-if="isFirstService")
                                | Create your first service to get started.
                                br
                                | You can create and manage multiple projects.
                            template(v-else)
                                | Create a service to get started.
                                br
                                | You can create and manage multiple projects.
                        input.block(placeholder="Service name (Max 40 chars)" maxlength="40" required v-model="newServiceName" style="margin-bottom: 0.75rem;")
                        button.block.icon-text(type="button" :disabled="!newServiceName" :style="!newServiceName ? { backgroundColor: 'rgba(34, 35, 37, 1)' } : {}" @click="step++")
                            svg
                                use(xlink:href="@/assets/img/material-icon.svg#icon-plus" alt="Plus Icon") 
                            span Create

                    .step-plan(v-else-if="step === 2")
                        h3.title(style="margin: 4.5rem 0 2rem;") Choose a plan
                        .plan-wrap
                            .plan-item.blue(:class="{'selected' : serviceMode == 'trial' && promiseRunning, 'disabled' : serviceMode !== 'trial' && promiseRunning}")
                                svg.mark
                                    use(xlink:href="@/assets/img/material-icon.svg#icon-card-mark" alt="Card Mark Icon")
                                .top
                                    .title Trial
                                    .desc Best for testing and prototyping.
                                    //- .option 
                                        TabMenu(v-model="activeTabs.trial" :tabs="['basic']")
                                .middle
                                    .price Free
                                        //- .num {{ '$' + planSpec['Trial'].price }}
                                        //- span /mo
                                    button.block(type="button" :disabled="promiseRunning" @click="selectedPlan('trial')") 
                                        template(v-if="serviceMode == 'trial' && promiseRunning")
                                            .loader(style="--loader-color:white; --loader-size: 12px")
                                        template(v-else) Select
                                .bottom
                                    p Core includes:
                                    ul
                                        li.user 10K User Accounts
                                        li.data 8GB Database Storage
                                        li.file 100GB File Storage
                                        li.mail(style="margin-bottom: 2.5rem;") Automated Emails
                                        li.forbiden(style="font-size: .9375rem;") All user data is deleted every 14 days
                                    //- ul.provides
                                        li(v-for="(des) in planSpec['Trial'].description") {{ des }}
                                        li.warning(v-for="(des) in planSpec['Trial'].description_warning") {{ des }}

                            .plan-item.green(:class="{'selected' : (serviceMode == 'standard' || serviceMode == 'standard-perpetual') && promiseRunning, 'disabled' : (serviceMode !== 'standard' && serviceMode !== 'standard-perpetual') && promiseRunning}")
                                svg.mark
                                    use(xlink:href="@/assets/img/material-icon.svg#icon-card-mark" alt="Card Mark Icon")
                                .top
                                    .title Standard
                                    .desc Suit best for small businesses, MVP, small projects, etc.
                                    //- .option 
                                        TabMenu(v-model="activeTabs.standard" :tabs="['basic', 'perpetual']")
                                .middle
                                    .price
                                        template(v-if="activeTabs.standard === 0") 
                                            .num {{ '$' + planSpec['Standard'].price }}
                                            span /mon
                                        template(v-else)
                                            .num {{ '$' + planSpec['Standard (Perpetual License)'].price }}
                                            span /only-once
                                    button.block(type="button" :disabled="promiseRunning" @click="selectedPlan('standard')")
                                        template(v-if="(serviceMode == 'standard' || serviceMode == 'standard-perpetual') && promiseRunning")
                                            .loader(style="--loader-color:white; --loader-size: 12px")
                                        template(v-else) Select
                                .bottom
                                    p Includes all Trial Plan features, but more functions:
                                    ul
                                        li.mail 1GB Email Storage
                                        li.invitation User invitation System
                                        li.global Website Hosting
                                        li.global Subdomain Hosting
                                        li.mail Sending Bulk Emails
                                    //- .desc 
                                        template(v-if="activeTabs.standard === 0") Suits best for hobby use #[span.wordset for small projects #[span.wordset or businesses.]]
                                        template(v-else) Get lifetime access to the Standard plan for just $300—upgrade anytime as your needs grow.
                                    //- ul.provides
                                        li(v-for="(des) in planSpec['Standard'].description") {{ des }}
                            .plan-item.yellow(:class="{'selected' : (serviceMode == 'premium' || serviceMode == 'premium-perpetual') && promiseRunning, 'disabled' : (serviceMode !== 'premium' && serviceMode !== 'premium-perpetual') && promiseRunning}")
                                svg.mark
                                    use(xlink:href="@/assets/img/material-icon.svg#icon-card-mark" alt="Card Mark Icon")
                                .top
                                    .title Premium 
                                    .desc Suit best for huge projects, Saas, social media, AI application, etc.
                                    //- .option 
                                        TabMenu(v-model="activeTabs.premium" :tabs="['basic', 'perpetual']")
                                .middle
                                    .price
                                        template(v-if="activeTabs.premium === 0") 
                                            .num {{ '$' + planSpec['Premium'].price }}
                                            span /mon
                                        template(v-else)
                                            .num {{ '$' + planSpec['Premium (Perpetual License)'].price }}
                                            span /only-once
                                    //- .desc Empower your business with formcarry, #[span.wordset for big businesses]
                                    button.block(type="button" :disabled="promiseRunning" @click="selectedPlan('premium')")
                                        template(v-if="(serviceMode == 'premium' || serviceMode == 'premium-perpetual') && promiseRunning")
                                            .loader(style="--loader-color:white; --loader-size: 12px")
                                        template(v-else) Select
                                //- ul.provides
                                    li(v-for="(des) in planSpec['Premium'].description") {{ des }}
                                .bottom
                                    p Includes all Standard Plan features, but more data:
                                    ul
                                        li.user 100K User Accounts
                                        li.data 10GB Database Storage
                                        li.file 1TB File Storage
                                        li.mail 10GB Email Storage

            //- button.btn-close.inline(v-if="step === 2" type="button" @click="handleClose") Close
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import {
    serviceIdList,
    serviceList,
    fetchingServiceList,
} from "@/views/service-list";
import { skapi } from "@/main";
import { customer } from "@/code/user";
import { planSpec } from "@/views/service/service-spec";

import Service from "@/code/service";
import TabMenu from "@/components/tab.vue";

const router = useRouter();
const route = useRoute();

const props = defineProps({
    visible: Boolean,
    // isFirstService: Boolean,
});

// 첫 번째 서비스인지 계산
const isFirstService = computed(() => {
    // 로딩 중이면 false 반환 (로딩 완료 후 판단)
    if (fetchingServiceList.value) {
        return false;
    }
    // 서비스가 없으면 첫 번째 서비스
    return serviceIdList.length === 0;
});

const emit = defineEmits(["close"]);

let service = {
    active: 1,
    name: "service name",
    cors: "service cors",
    timestamp: 1709102706561,
    group: 1,
    service: "ap226E8TXhYtbcXRgi5D",
    users: 10,
};
let promiseRunning = ref(false);
let serviceMode = ref("standard");
let newServiceName = ref("");
let activeTabs = ref({
    trial: 0,
    standard: 0,
    premium: 0,
});
let step = ref(1);

let createSubscription = async (
    ticket_id,
    service_info,
    isPerpetual = false
) => {
    if (serviceMode.value.includes("perpetual")) {
        isPerpetual = true;
    }

    let resolvedCustomer = await customer;
    let product = JSON.parse(import.meta.env.VITE_PRODUCT);
    let customer_id = resolvedCustomer.id;
    let currentUrl = window.location;

    let data = {
        client_reference_id: service_info.owner,
        customer: customer_id,
        "customer_update[name]": "auto",
        "customer_update[address]": "auto",

        cancel_url: currentUrl.origin + "/my-services",
        "line_items[0][quantity]": 1,
        "line_items[0][price]": product[ticket_id],
        success_url: currentUrl.origin + "/my-services/" + service_info.id,
        "tax_id_collection[enabled]": true,
    };

    if (isPerpetual) {
        Object.assign(data, {
            "metadata[service]": service_info.id,
            "metadata[owner]": service_info.owner,
            "metadata[price]": product[ticket_id],
            mode: "payment",
        });
    } else {
        Object.assign(data, {
            "subscription_data[metadata][service]": service_info.id,
            "subscription_data[metadata][owner]": service_info.owner,
            mode: "subscription",
            "subscription_data[description]":
                'Subscription plan for service ID: "' + service_info.id + '"',
        });
    }

    let response = await skapi.clientSecretRequest({
        clientSecretName: "stripe_test",
        url: "https://api.stripe.com/v1/checkout/sessions",
        method: "POST",
        headers: {
            Authorization: "Bearer $CLIENT_SECRET",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data,
    });

    if (response.error) {
        alert(response.error.message);
        return;
    }

    window.location = response.url;
};

let createService = () => {
    promiseRunning.value = true;

    Service.create({ name: newServiceName.value })
        .then(async (s) => {
            if (serviceMode.value == "trial") {
                serviceIdList.push(s.id);
                serviceList[s.id] = s;
                location.href = "/my-services/" + s.id;
            } else {
                let service_info = s;
                let ticket_id = serviceMode.value;
                await createSubscription(ticket_id, service_info);
            }
        })
        .catch((err) => {
            promiseRunning.value = false;
            alert(err.message);
        });
};

let selectedPlan = (plan: string) => {
    if (plan !== "trial") {
        if (activeTabs.value[plan] == 1) {
            plan = plan + "-perpetual";
        }
    }

    serviceMode.value = plan;
    createService();
};

// 모달 상태 초기화 함수
const resetModalState = () => {
    promiseRunning.value = false;
    serviceMode.value = "standard";
    newServiceName.value = "";
    activeTabs.value = {
        trial: 0,
        standard: 0,
        premium: 0,
    };
    step.value = 1;
};

// body 스크롤 제어 함수들
const disableBodyScroll = () => {
    document.body.style.overflow = "hidden";
};

const enableBodyScroll = () => {
    document.body.style.overflow = "";
};

const handleKey = (e: KeyboardEvent) => {
    if (!props.visible) return;

    if (e.key === "Enter" && step.value === 1 && newServiceName.value) {
        e.preventDefault();
        step.value++;
    }
};

onMounted(() => {
    document.addEventListener("keydown", handleKey);
});

onUnmounted(() => {
    document.removeEventListener("keydown", handleKey);
});

// 모달이 열리고 닫힐 때 상태 관리
watch(
    () => props.visible,
    (newVisible) => {
        if (newVisible) {
            // 모달이 열릴 때
            resetModalState(); // 상태 초기화
            disableBodyScroll(); // body 스크롤 비활성화
        } else {
            // 모달이 닫힐 때
            enableBodyScroll(); // body 스크롤 활성화
        }
    }
);

// close 이벤트 핸들러
const handleClose = () => {
    resetModalState(); // 모달 상태 초기화
    enableBodyScroll(); // 모달 닫을 때 스크롤 복원
    emit("close");
};


function resetSearchModal() {
    throw new Error("Function not implemented.");
}
</script>

<style scoped lang="less">
.smallTitle {
    font-size: 0.8rem;
    color: #333;
    margin-bottom: 0.5rem;
}

.step-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;

    // max-width: 80rem;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    box-shadow: rgba(66, 62, 121, 0.25) 0px 0px 90px -14px;
    // margin: 0 var(--nav-top);
    border-color: #f7f9fc;

    a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #000;

        img {
            height: 30px;
        }
    }

    .route {
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
}

.plan-wrap {
    display: flex;
    justify-content: center;
    align-items: start;
    gap: 1.5rem;
    padding: 0 5.25rem 5.25rem;

    .option {
        position: relative;
        height: 2rem;
        margin-bottom: 1rem;

        .tab-menu {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-55%, -50%);
            scale: 0.9;
            margin: 0;
        }
    }

    .plan-item {
        position: relative;
        background-color: #16171a;
        border-radius: 1.0625rem;
        padding: 2.5rem 2.125rem;
        color: #fff;
        text-align: left;
        max-width: 24.125rem;
        min-height: 41.75rem;
        flex: 1;
        border: 1px solid rgba(255, 255, 255, 0.1);

        .mark {
            position: absolute;
            top: 0;
            right: 0;
            width: 83px;
            height: 83px;
        }

        .top {
            .title {
                margin-bottom: 10px;
                font-size: 1.75rem;
                font-weight: 500;
                text-align: left;
            }

            .desc {
                font-size: 1rem;
                font-weight: 300;
                line-height: 1.3;
                margin: 0;
                color: rgba(255, 255, 255, 0.7);
                min-height: 3.9375rem;
            }
        }

        .middle {
            padding: 1.875rem 0;
            margin: 1.875rem 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);

            .price {
                font-size: 2.5rem;
                font-weight: 500;
                margin-bottom: 1.875rem;
                display: flex;
                align-items: baseline;
                min-height: 3.25rem;

                span {
                    font-size: 16px;
                    font-weight: 400;
                    margin-left: 7px;
                    opacity: 0.7;
                    color: rgba(255, 255, 255, 0.7);
                }
            }

            button {
                width: 100%;
                max-width: 100%;
                background-color: #242529;
            }
        }

        .bottom {
            font-size: 1rem;

            p {
                margin: 0;
            }

            ul {
                margin: 0;
                padding: 0;
                margin-top: 1rem;

                li {
                    position: relative;
                    list-style: none;
                    margin-left: 1.4rem;
                    margin-bottom: 8px;

                    &::before {
                        position: absolute;
                        content: "";
                        left: -1.6rem;
                        top: 1px;
                        background-size: cover;
                        width: 18px;
                        height: 18px;
                        opacity: 0.8;
                    }

                    &.user {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_user.svg") no-repeat;
                        }
                    }

                    &.data {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_data.svg") no-repeat;
                        }
                    }

                    &.file {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_file.svg") no-repeat;
                        }
                    }

                    &.mail {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_mail.svg") no-repeat;
                        }
                    }

                    &.forbiden {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_forbiden.svg") no-repeat;
                        }
                    }

                    &.invitation {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_invitation.svg") no-repeat;
                        }
                    }

                    &.global {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_global.svg") no-repeat;
                        }
                    }
                }
            }
        }

        &.blue {
            .mark {
                fill: #0a4df1;
            }

            .top {
                .title {
                    color: #306cff;
                }
            }

            .middle {
                button {
                    &:hover {
                        background-color: #0a4df1;
                    }
                }
            }
        }

        &.green {
            .mark {
                fill: #52dfa2;
            }

            .top {
                .title {
                    color: #52dfc7;
                }
            }

            .middle {
                button {
                    &:hover {
                        background-color: #3ad08f;
                    }
                }
            }
        }

        &.yellow {
            .mark {
                fill: #fff06c;
            }

            .top {
                .title {
                    color: #fff06c;
                }
            }

            .middle {
                button {
                    &:hover {
                        background-color: #e8ba3c;
                    }
                }
            }
        }
    }
}

.provides {
    li {
        position: relative;
        list-style: none;
        text-align: left;
        margin-bottom: 0.5rem;
        font-size: 0.8rem;

        &::before {
            position: absolute;
            content: "";
            left: -1.3rem;
            top: 0.1rem;
            background: url("@/assets/img/icon/check.svg") no-repeat;
            background-size: cover;
            width: 16px;
            height: 16px;
            opacity: 0.8;
        }
    }
}

// 모달 스타일 추가 :: s
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999999;

    &.first-service {
        background: url("@/assets/img/myservice/bg_gradation.svg") no-repeat center center;
        background-size: cover;
        top: 4rem;
    }
}

.modal-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999999;
}

.modal-content {
    width: calc(100% - 1rem);
    max-width: 75rem;
    max-height: calc(100% - 1rem);
    overflow-y: auto;
    z-index: 999999;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .title {
        font-size: 1.875rem;
        font-weight: 500;
        color: #fff;
        margin-bottom: 0.625rem;
        margin-top: 0;
        text-align: center;
    }

    .desc {
        font-size: 0.9375rem;
        font-weight: 400;
        color: #666666;
        line-height: 1.2;
        margin-bottom: 3.125rem;
        display: block;
    }
}

#create {
    background: #16171a;
    position: relative;
    max-height: calc(100% - 4rem);
    overflow-y: auto;
    border-radius: 0.75rem;

    &::-webkit-scrollbar {
        width: 0.25rem;
        height: 0.25rem;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 12px 12px 12px 12px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }
}

.form {
    padding: 5rem 5.25rem 6.25rem;

    button {
        border-radius: 0.5rem;
        background-color: #0a4df1;

        &:hover {
            background-color: #1656f2;
        }

        &.disabled {
            opacity: 1;
            background-color: #222325;
        }
    }
}

.btn-close,
.btn-prev {
    position: absolute;
    cursor: pointer;

    .svgIcon {
        width: 1.75rem;
        height: 1.75rem;
        fill: #fff;
    }
}

.btn-close {
    top: 1.5rem;
    right: 1.5rem;
}

.btn-prev {
    top: 1.75rem;
    left: 1.8rem;

    .svgIcon {
        width: 1.5rem;
        height: 1.5rem;
    }
}

.provides {
    color: #666666;
}

// 모달 스타일 추가 :: e

@media (max-width: 992px) {
    .plan-wrap {
        flex-direction: column;
        align-items: center;
        padding: 0 4rem 4rem;

        .plan-item {
            width: 20.375rem;
        }
    }
}

@media (max-width: 576px) {
    .step-wrap {
        .list {
            display: none;
        }
    }

    .plan-wrap {
        padding: 0 2rem 2rem;
    }
}

@media (max-width: 430px) {
    .modal-content {
        width: calc(100% - 1rem);
    }

    .form {
        max-width: 100%;
        min-width: 100%;
        padding: 5rem 2rem 4.25rem;
    }

    .plan-wrap {
        .plan-item {
            width: 100%;
        }
    }
}
</style>
