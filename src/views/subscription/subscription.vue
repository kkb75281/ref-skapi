<template lang="pug">
main#subscription
    template(v-if="serviceList[serviceId]?.subscriptionFetched")
        .flex-wrap.space-between
            button.inline.icon-text.dark.btn-prev(type="button" @click="router.push('/my-services/' + serviceId + '/dashboard')")
                .icon
                    svg
                        use(xlink:href="/material-icon.svg#icon-arrow-left")
                span Back

            //- button.inline.gray.caution.btn-cancel(v-if="serviceList[serviceId]?.service.plan !== 'Canceled' && serviceList[serviceId]?.service.plan !== 'Trial'" type="button" @click="()=>openCancelplan=true") Cancel Subscription

        br

        .page-title.center Subscription Plans

        br

        .page-desc.center {{ currentService.service.name }} is currently on the {{ currentService.service.plan }} plan.

        .plan-wrap
            //- .plan-item.blue
                svg.mark
                    use(xlink:href="/material-icon.svg#icon-card-mark")
                .top
                    .title Trial
                    .desc 
                        | Best for testing and prototyping.
                        br
                        br
                .middle
                    .price Free
                    router-link(:to="user?.user_id ? '/create' : '/signup'")
                        button(type="button") Get
                .bottom
                    p Core includes:
                    ul
                        li.user 10K User Accounts
                        li.data 8GB Database Storage
                        li.file 100GB File Storage
                        li.mail(style="margin-bottom: 2.5rem;") Automated Emails
                        li.forbiden(style="font-size: .9375rem;") All user data is deleted every 14 days

            .plan-item.green
                svg.mark
                    use(xlink:href="/material-icon.svg#icon-card-mark")
                .top
                    .title Standard
                    .desc Suit best for small businesses, MVP, small projects, etc.
                .middle
                    .price $19
                        span /mon
                    button.block.gray(type="button" :disabled="promiseRunning || availablePlans[0] === false || availablePlans[0] === null" @click="selectedPlan('standard')")
                        template(v-if="changeMode == 'standard' && promiseRunning")
                            .loader(style="--loader-color:white; --loader-size: 12px")
                        template(v-else-if="availablePlans[0]") {{ availablePlans[0] }}
                        template(v-else-if="availablePlans[0] === false") Current
                        template(v-else-if="availablePlans[0] === null") N/A
                        template(v-else) Select
                .bottom
                    p Includes all Trial Plan features, but more functions:
                    ul
                        li.mail 1GB Email Storage
                        li.invitation User invitation System
                        li.global Website Hosting
                        li.global Subdomain Hosting
                        li.mail Sending Bulk Emails

            .plan-item.yellow
                svg.mark
                    use(xlink:href="/material-icon.svg#icon-card-mark")
                .top
                    .title Premium
                    .desc Suit best for huge projects, Saas, social media, AI application, etc.
                .middle
                    .price $89
                        span /mon
                    button.block.gray(type="button" :disabled="promiseRunning || availablePlans[1] === false || availablePlans[1] === null" @click="selectedPlan('premium')")
                        template(v-if="changeMode == 'premium' && promiseRunning")
                            .loader(style="--loader-color:white; --loader-size: 12px")
                        template(v-else-if="availablePlans[1]") {{ availablePlans[1] }}
                        template(v-else-if="availablePlans[1] === false") Current
                        template(v-else-if="availablePlans[1] === null") N/A
                        template(v-else) Select
                .bottom
                    p Includes all Standard Plan features, but more data:
                    ul
                        li.user 100K User Accounts
                        li.data 10GB Database Storage
                        li.file 1TB File Storage
                        li.mail 10GB Email Storage

        br
        br

        .flex-wrap.end
            button.inline.gray.caution.btn-cancel(v-if="serviceList[serviceId]?.service.plan !== 'Canceled' && serviceList[serviceId]?.service.plan !== 'Trial'" type="button" @click="()=>openCancelplan=true") Cancel Subscription

    .center(v-else)
        .loader(style="--loader-color:white; --loader-size:12px")

Modal(:open="subscrOpt" @close="subscrOpt=false" style='max-width: 640px;')
    .modal-title {{subscrOpt}} Plan

    .modal-desc
        | Would you like to {{subscrOpt ? subscrOpt.toLowerCase() : ''}} your service plan to {{ changeMode }}?
        br
        | If the subscription plan is updated before the renewal date,
        br
        | proration of the remaining days will be calculated 
        br
        | and the amount will be adjusted accordingly.

    .modal-btns
        .loader-wrap(v-if='promiseRunning')
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray(@click="subscrOpt = false") Cancel
            button(@click="upgrade") {{subscrOpt}}

Modal(:open="openCancelplan" @close="openCancelplan=false" style='max-width: 640px;')
    .modal-title Cancel Plan

    .modal-desc
        | Would you like to cancel your service plan?
        br
        | When you cancel your subscription,
        br
        | the service will be available until the end of the current billing period,
        br
        | and the service will be terminated after the end of the period.

    .modal-btns
        .loader-wrap(v-if='promiseRunning')
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray(@click="openCancelplan = false") No, I don't want.
            button.red(@click="cancelSubs") Cancel Plan
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { serviceList } from "@/views/service-list";
import { user, customer } from "@/code/user";
import { skapi } from "@/main";
import { currentService } from '@/views/service/main';
import { planSpec, currentServiceSpec } from "@/views/service/service-spec";

import Modal from "@/components/modal.vue";

const router = useRouter();
const route = useRoute();

let activeTabs = ref({
    standard: 0,
    premium: 0,
});

let serviceId = route.path.split("/")[2];
let subscrOpt = ref(false);
let promiseRunning = ref(false);
let changeMode = "";
let openCancelplan = ref(false);

onMounted(() => {
    console.log(currentServiceSpec.value)
    console.log(availablePlans.value)
    // 구독 변경 페이지로 바로 들어오거나 그 안에서 새로고침할 경우
    if (currentService === null) {
        router.push('/my-services/' + serviceId + '/dashboard');
    }
})

let availablePlans = computed(() => {
    // true = createSubs
    // 1 = upgrade
    // false = current plan
    // null = not avail
    // r = resume

    // 1: 'Trial',
    // 2: 'Standard',
    // 3: 'Premium',
    // 50: 'Unlimited',
    // 51: 'Free Standard'
    if (serviceList[serviceId]?.subscription?.status === "canceled") {
        return ["Subscribe", "Subscribe"];
    } else if (serviceList[serviceId]?.service.plan == "Canceled") {
        return ["Resume", "Resume"];
    }
    if (serviceList[serviceId]?.service.plan == "Trial") {
        return ["Subscribe", "Subscribe"];
    }
    if (serviceList[serviceId]?.service.plan == "Standard") {
        return [activeTabs.value.standard === 0 ? false : "Upgrade", "Upgrade"];
    }
    if (serviceList[serviceId]?.service.plan == "Premium") {
        let notAvail =
            currentServiceSpec.value.service.service.users > Number(planSpec['Premium'].users) ||
            currentServiceSpec.value.storage.database > Number(planSpec['Premium'].storage.database) ||
            currentServiceSpec.value.storage.cloud > Number(planSpec['Premium'].storage.cloud) ||
            currentServiceSpec.value.storage.host > Number(planSpec['Premium'].storage.host) ||
            currentServiceSpec.value.storage.email > Number(planSpec['Premium'].storage.email)

        return [notAvail ? null : "Downgrade", activeTabs.value.premium === 0 ? false : "Upgrade"];
    }

    return [null, null];
});

let selectedPlan = (plan) => {
    if (activeTabs.value[plan] == 1) {
        plan = plan + '-perpetual';
    }

    if (plan === 'standard') {
        subscrOpt.value = availablePlans.value[0];
    } else {
        subscrOpt.value = availablePlans.value[1];
    }

    changeMode = plan;
}

let cancelSubs = async () => {
    promiseRunning.value = true;
    await serviceList[serviceId].cancelSubscription();
    location.href = "/my-services/" + serviceList[serviceId].id + "/dashboard/";
};

let upgrade = () => {
    if (!subscrOpt.value) {
        return;
    }
    if (subscrOpt.value === "Subscribe") {
        return createSubscription(changeMode, serviceList[serviceId]);
    }

    updateSubscription(changeMode);
};

let createSubscription = async (ticket_id, service_info, isPerpetual = false) => {
    promiseRunning.value = true;

    if (changeMode.includes('perpetual')) {
        isPerpetual = true;
    }

    let resolvedCustomer = await customer;
    let product = JSON.parse(import.meta.env.VITE_PRODUCT);
    let customer_id = resolvedCustomer.id;
    let currentUrl = window.location;

    let data = {
        client_reference_id: service_info.owner,
        customer: customer_id,
        'customer_update[name]': 'auto',
        'customer_update[address]': 'auto',

        cancel_url: currentUrl.origin + '/my-services',
        "line_items[0][quantity]": 1,
        'line_items[0][price]': product[ticket_id],
        "success_url": currentUrl.origin + '/my-services/' + service_info.id,
        'tax_id_collection[enabled]': true,
    }

    if (isPerpetual) {
        Object.assign(data, {
            'metadata[service]': service_info.id,
            'metadata[owner]': service_info.owner,
            'metadata[price]': product[ticket_id],
            'mode': 'payment',
        })
    } else {
        Object.assign(data, {
            'subscription_data[metadata][service]': service_info.id,
            'subscription_data[metadata][owner]': service_info.owner,
            'mode': 'subscription',
            'subscription_data[description]': 'Subscription plan for service ID: "' + service_info.id + '"',
        })
    }

    let response = await skapi.clientSecretRequest({
        clientSecretName: 'stripe_test',
        url: 'https://api.stripe.com/v1/checkout/sessions',
        method: 'POST',
        headers: {
            Authorization: 'Bearer $CLIENT_SECRET',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data
    });

    if (response.error) {
        promiseRunning.value = false;
        alert(response.error.message);
    } else {
        location.href = response.url;
    }
};

let updateSubscription = async (ticket_id) => {
    await customer;
    let subs_id = serviceList[serviceId].service.subs_id.split("#");
    promiseRunning.value = true;

    if (!serviceList[serviceId].service.subs_id) {
        alert("Service does not have a subscription");
        return;
    }

    if (subs_id.length < 2) {
        alert("Service does not have a subscription");
        return;
    }

    let SUBSCRIPTION_ID = subs_id[0];
    let SUBSCRIPTION_ITEM_ID = subs_id[1];
    let product = JSON.parse(import.meta.env.VITE_PRODUCT);
    let dataObj = {};

    // if (serviceList[serviceId]?.subscription?.cancel_at_period_end) {
    dataObj = {
        "items[0][id]": SUBSCRIPTION_ITEM_ID,
        "items[0][price]": product[ticket_id],
        cancel_at_period_end: false,
    };

    if (!serviceList[serviceId]?.subscription?.canceled_at) {
        dataObj.proration_behavior = 'create_prorations';
    }

    let response = await skapi.clientSecretRequest({
        clientSecretName: "stripe_test",
        url: `https://api.stripe.com/v1/subscriptions/${SUBSCRIPTION_ID}`,
        method: "POST",
        headers: {
            Authorization: "Bearer $CLIENT_SECRET",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: dataObj,
    });

    if (response.error) {
        promiseRunning.value = false;
        alert(response.error.message);
        return;
    }

    location.href = "/my-services/" + serviceList[serviceId].id + "/dashboard/";
};
</script>

<style scoped lang="less">
#subscription {
    max-width: 1500px;
    margin: 0 auto;
    padding: 60px 40px;
}

.center {
    text-align: center;
}

.btn-prev,
.btn-cancel {
    opacity: 0.6;

    &:hover {
        opacity: 1;
    }
}

.plan-wrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;

    .plan-item {
        position: relative;
        max-width: 386px;
        // min-width: 326px;
        flex-basis: 326px;
        height: 660px;
        flex-grow: 1;
        background-color: #16171a;
        border-radius: 1.0625rem;
        padding: 2.5rem 2.125rem 0 2.125rem;
        color: #fff;
        text-align: left;
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
            }

            .desc {
                width: 280px;
                font-size: 1.0625rem;
                font-weight: 300;
                line-height: 1.3;
                margin: 0;
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
                }
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

@media (max-width: 800px) {
    #subscription {
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

    .plan-wrap {
        max-width: 480px;
        margin: 0 auto;

        .plan-item {
            max-width: unset;
            flex-basis: unset;
        }
    }
}

@media (max-width: 430px) {
    #subscription {
        padding: 30px 20px 60px;
    }

    .plan-wrap {
        max-width: unset;
        margin: 0 auto;

        .plan-item {
            width: 100%;
            height: unset;
            padding-bottom: 2.5rem;

            .top {
                .title {
                    font-size: 1.5rem;
                }

                .desc {
                    font-size: 0.9375rem;
                    width: unset;
                }
            }

            .middle {
                padding: 0.625rem 0 0.9375rem;
                margin: 0.625rem 0;

                .price {
                    font-size: 2rem;
                    margin-bottom: 0.9375rem;
                }
            }

            .bottom {
                ul {
                    li {
                        font-size: 0.875rem;
                    }
                }
            }
        }
    }
}
</style>
