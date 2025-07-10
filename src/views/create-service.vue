<template lang="pug">
template(v-if="visible")
    .modal-overlay(:class="{ 'first-service': isFirstService }" @click="$emit('close')")
    .modal-content(@click.stop)
        button.btn-close(@click="$emit('close')")
            svg.svgIcon
                use(xlink:href="@/assets/img/material-icon.svg#icon-close")
                
        main#create
            .form(v-if="step === 1")
                h3.title {{ isFirstService ? 'Welcome! Create your first service' : 'Create your service' }}
                span.desc Create your service to get started. <br> You can create and manage multiple projects.
                .input-wrap
                    .infoValue
                        input.big(placeholder="Service name (Max 40 chars)" maxlength="40" required v-model="newServiceName" style="width: 100%;")
                    button.final(type="button" :class="{'disabled': !newServiceName}" @click="step++") Next

            .plan-wrap.card-wrap(v-else-if="step === 2")
                .plan-item.blue(:class="{'selected' : serviceMode == 'trial' && promiseRunning, 'disabled' : serviceMode !== 'trial' && promiseRunning}")
                    svg.mark
                        use(xlink:href="@/assets/img/material-icon.svg#icon-card-mark")
                    .top
                        .title Trial
                        .desc Best for testing and prototypingwwwwwwww
                    .middle
                        .price Free
                        button.final(type="button" :class="{'disabled': promiseRunning}" @click="selectedPlan('trial')") 
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

                .plan-item.green(:class="{'selected' : (serviceMode == 'standard' || serviceMode == 'standard-perpetual') && promiseRunning, 'disabled' : (serviceMode !== 'standard' && serviceMode !== 'standard-perpetual') && promiseRunning}")
                    .card
                        .title Standard 
                        .price
                            template(v-if="activeTabs.standard === 0") 
                                .faktum {{ '$' + planSpec['Standard'].price }}
                                span /mo
                            template(v-else)
                                .faktum {{ '$' + planSpec['Standard (Perpetual License)'].price }}
                                span /only-once
                        .desc 
                            template(v-if="activeTabs.standard === 0") Suits best for hobby use #[span.wordset for small projects #[span.wordset or businesses.]]
                            template(v-else) Get lifetime access to the Standard plan for just $300—upgrade anytime as your needs grow.
                        button.final(type="button" :class="{'disabled': promiseRunning}" @click="selectedPlan('standard')")
                            template(v-if="(serviceMode == 'standard' || serviceMode == 'standard-perpetual') && promiseRunning")
                                .loader(style="--loader-color:white; --loader-size: 12px")
                            template(v-else) Select
                    ul.provides
                        li(v-for="(des) in planSpec['Standard'].description") {{ des }}
                .plan-item.yellow(:class="{'selected' : (serviceMode == 'premium' || serviceMode == 'premium-perpetual') && promiseRunning, 'disabled' : (serviceMode !== 'premium' && serviceMode !== 'premium-perpetual') && promiseRunning}")
                    .card
                        .title Premium 
                        .price
                            template(v-if="activeTabs.premium === 0") 
                                .faktum {{ '$' + planSpec['Premium'].price }}
                                span /mo
                            template(v-else)
                                .faktum {{ '$' + planSpec['Premium (Perpetual License)'].price }}
                                span /only-once
                        .desc Empower your business with formcarry, #[span.wordset for big businesses]
                        button.final(type="button" :class="{'disabled': promiseRunning}" @click="selectedPlan('premium')")
                            template(v-if="(serviceMode == 'premium' || serviceMode == 'premium-perpetual') && promiseRunning")
                                .loader(style="--loader-color:white; --loader-size: 12px")
                            template(v-else) Select
                    ul.provides
                        li(v-for="(des) in planSpec['Premium'].description") {{ des }}
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { serviceIdList, serviceList } from "@/views/service-list";
import { skapi } from "@/main";
import { customer } from "@/code/user";
import { planSpec } from "@/views/service/service-spec";

import Service from "@/code/service";
import TabMenu from "@/components/tab.vue";

const router = useRouter();
const route = useRoute();

defineProps({
    visible: Boolean,
    isFirstService: Boolean,
});

defineEmits(["close"]);

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

input {
    width: unset;
    flex-grow: 1;
}

.card-wrap {
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    // flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    // text-align: center;

    .card {
        flex-grow: 1;
        width: 48%;
        min-width: 250px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        padding: 1rem;
        transition: all 0.3s;
        cursor: pointer;
        background-color: #fff;

        &:hover {
            // border-color: var(--main-color);
            box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.05);
        }

        a {
            display: flex;
            align-items: center;
            gap: 1rem;
            text-decoration: none;
            color: #333;
        }

        .icon {
            width: 3rem;
            height: 3rem;
        }

        .content {
            text-align: left;

            p {
                margin: 0;

                &.small {
                    font-size: 0.8rem;
                    color: rgba(0, 0, 0, 0.5);
                }
            }
        }
    }
}

.plan-wrap {
    align-items: start;

    .plan {
        width: 31%;
        min-width: 250px;
        flex-grow: 1;
        transition: all 0.3s;
        scale: 1;

        &.selected {
            scale: 1.05;

            .card {
                box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.05);
            }
        }

        &.disabled {
            opacity: 0.5;
            pointer-events: none;
            cursor: default;
        }

        &:hover {
            scale: 1.05;
        }
    }

    .card {
        width: 100%;
        cursor: default;
    }

    .title {
        font-size: 1rem;
        margin-bottom: 1rem;
        text-align: left;
    }

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

    .price {
        // display: flex;
        // align-items: baseline;
        // justify-content: center;
        // margin-bottom: 1rem;

        .faktum {
            font-size: 2.4rem;
            margin-right: 0.5rem;
        }
    }

    .desc {
        margin: 0;
        line-height: 1.4;
        font-size: 0.8rem;
        margin-bottom: 1rem;
    }

    button {
        width: 100% !important;
    }
}

// plan-wrap new style
.plan-wrap {
    .plan-item {
        position: relative;
        flex-grow: 1;
        background-color: #16171a;
        border-radius: 1.0625rem;
        padding: 2.5rem 2.125rem;
        color: #fff;
        text-align: left;

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
            }

            .desc {
                width: 280px;
                font-size: 1.0625rem;
                font-weight: 300;
                line-height: 1.3;
                margin: 0;
                color: rgba(255, 255, 255, 0.7);
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
                            background: url("@/assets/img/landingpage/icon_user.svg")
                                no-repeat;
                        }
                    }

                    &.data {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_data.svg")
                                no-repeat;
                        }
                    }

                    &.file {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_file.svg")
                                no-repeat;
                        }
                    }

                    &.mail {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_mail.svg")
                                no-repeat;
                        }
                    }

                    &.forbiden {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_forbiden.svg")
                                no-repeat;
                        }
                    }

                    &.invitation {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_invitation.svg")
                                no-repeat;
                        }
                    }

                    &.global {
                        &::before {
                            background: url("@/assets/img/landingpage/icon_global.svg")
                                no-repeat;
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
        background: url("@/assets/img/myservice/bg_gradation.png") no-repeat
            center center;
        background-size: cover;
        top: 4rem;
    }
}

.modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 62.5rem;
    width: fit-content;
    max-height: 90vh;
    overflow-y: auto;
    background: #16171a;
    border-radius: 12px;
    padding: 5rem 5.25rem 6.25rem;
    z-index: 999999;

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

.btn-close {
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 1.5rem;
    right: 2.5rem;

    .svgIcon {
        fill: #fff;
    }
}

.form {
    max-width: 22rem;
    min-width: 22rem;

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

.input-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    input {
        border-radius: 0.5rem;
        border: 1px solid rgba(0, 0, 0, 0.5);
        background: linear-gradient(
                0deg,
                rgba(255, 255, 255, 0.05) 0%,
                rgba(255, 255, 255, 0.05) 100%
            ),
            #16171a;
        outline: none;
        color: #fff;
        padding: 0.625rem 1rem;

        &:focus,
        &:hover,
        &:active {
            border-color: rgba(10, 77, 241, 0.8);
            outline: none !important;
        }

        &::placeholder {
            font-size: 0.875rem;
            font-weight: 400;
            color: #999;
        }
    }
}

.provides {
    color: #666666;
}
// 모달 스타일 추가 :: e

@media (max-width: 992px) {
    .card-wrap {
        flex-direction: column;
        align-items: center;
    }

    .modal-content {
        padding: 3rem 2rem 2rem;
    }

    .btn-close {
        top: 1rem;
        right: 1.875rem;
    }
}

@media (max-width: 576px) {
    .step-wrap {
        .list {
            display: none;
        }
    }

    .plan-wrap {
        padding-top: 20px;

        .plan {
            &:hover,
            &.selected {
                scale: 1;
            }

            &.disabled {
                scale: 0.95;
            }
        }
    }
}

@media (max-width: 430px) {
    .modal-content {
        width: calc(100% - 1rem);
    }

    .form {
        max-width: 100%;
        min-width: 100%;
    }
}
</style>
