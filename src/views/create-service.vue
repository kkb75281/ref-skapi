<template lang="pug">
br
br
br

main#create
    router-link(to="/my-services")
        img(src="@/assets/img/logo/logo.png" style="height: 2rem;")

    .bottomLineTitle Create a New Service

    p
        | Choose a plan for your service "
        span(style='font-weight:500') {{newServiceName}}
        | "
    
    section.planWrap(:class="{'disabled' : promiseRunning}")
        .infoBox(:class="{'checked' : serviceMode == 'trial'}" @click="serviceMode='trial'")
            .mode Trial Mode
            .price $0

            hr

            ul
                li 10K User Accounts
                li 4GB Database Storage
                li 50GB File Storage
                li.warning Sending bulk emails not included
                li.warning All user data is deleted every 30 days
        .infoBox(:class="{'checked' : serviceMode == 'standard'}" @click="serviceMode='standard'")
            .mode Standard Mode
            .price $19

            hr

            ul
                li 10K User Accounts
                li User Invitation System
                li Website Hosting
                li 8GB Database Storage
                li 100GB File Storage & Subdomain Hosting
                li Automated Emails & Sending Bulk Emails
                li 1GB Email Storage
        .infoBox(:class="{'checked' : serviceMode == 'premium'}" @click="serviceMode='premium'")
            .mode Premium Mode
            .price $89

            hr

            ul
                li Includes all Standard Plan features
                li 100K User Accounts
                li 100GB Database Storage
                li 1TB File Storage & Subdomain Hosting
                li 10GB Email Storage

    br

    p(style='font-size: 16px;display: flex;justify-content: center;') Selected Plan:&nbsp; #[b(style='color:var(--main-color)') {{serviceMode.charAt(0).toUpperCase() + serviceMode.slice(1)}}]
    .inputWrap(@submit.prevent="createService")
        div(v-if="promiseRunning" style="text-align:center")
            .loader(style="--loader-color:blue; --loader-size: 12px")
        template(v-else)
            button.final(type="submit" @click='createService') Create {{serviceMode.charAt(0).toUpperCase() + serviceMode.slice(1)}}

br
br
br
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { serviceIdList, serviceList } from '@/views/service-list'
import { skapi } from '@/main';
import { customer } from '@/code/user';
import Service from '@/code/service';

const router = useRouter();
const route = useRoute();

let service = {
    active: 1,
    name: 'service name',
    cors: 'service cors',
    timestamp: 1709102706561,
    group: 1,
    service: 'ap226E8TXhYtbcXRgi5D',
    users: 10
}
let promiseRunning = ref(false);
let serviceMode = ref('standard');
let newServiceName = route.params.name as string;

let createSubscription = async (ticket_id, service_info) => {
    let resolvedCustomer = await customer;
    let product = JSON.parse(import.meta.env.VITE_PRODUCT);
    let customer_id = resolvedCustomer.id;
    let currentUrl = window.location;

    let response = await skapi.clientSecretRequest({
        clientSecretName: 'stripe_test',
        url: 'https://api.stripe.com/v1/checkout/sessions',
        method: 'POST',
        headers: {
            Authorization: 'Bearer $CLIENT_SECRET',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            client_reference_id: service_info.owner,
            customer: customer_id,
            'customer_update[name]': 'auto',
            'customer_update[address]': 'auto',
            'subscription_data[metadata][service]': service_info.id,
            'subscription_data[metadata][owner]': service_info.owner,
            'mode': 'subscription',
            'subscription_data[description]': 'Subscription plan for service ID: "' + service_info.id + '"',
            cancel_url: currentUrl.origin + '/my-services',
            "line_items[0][quantity]": 1,
            'line_items[0][price]': product[ticket_id],
            "success_url": currentUrl.origin + '/my-services/' + service_info.id,
            'tax_id_collection[enabled]': true,
        }
    });
    if (response.error) {
        alert(response.error.message);
        return;
    }

    window.location = response.url;
}

let createService = () => {
    promiseRunning.value = true;

    Service.create({ name: newServiceName })
        .then(async (s) => {
            if (serviceMode.value == 'trial') {
                serviceIdList.push(s.id);
                serviceList[s.id] = s;
                location.href = '/my-services/' + s.id;
            } else {
                let service_info = s;
                let ticket_id = serviceMode.value;
                await createSubscription(ticket_id, service_info);
            }
        }).catch(err => {
            promiseRunning.value = false;
            alert(err.message);
        })
}
</script>

<style scoped lang="less">
#create {
    max-width: 1000px;
    padding: 0 8px;
    margin: 0 auto;
}

.inputWrap {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

input {
    width: unset;
    flex-grow: 1;
}

.planWrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;

    .infoBox {
        width: 280px;
        padding: 20px;
        flex-grow: 1;
        user-select: none;
        cursor: pointer;
        box-shadow: 0 0 0 4px rgba(0,0,0,0.1) inset;
        &:hover {
            li {
                &::before {
                    filter: brightness(0) saturate(100%) invert(12%) sepia(84%) saturate(6348%) hue-rotate(240deg) brightness(96%) contrast(87%);
                }
            }
        }

        &.checked {
            background-color: rgba(41, 63, 230, 0.02);
            box-shadow: 0 0 0 4px var(--main-color) inset !important;

            li {
                &::before {
                    filter: brightness(0) saturate(100%) invert(12%) sepia(84%) saturate(6348%) hue-rotate(240deg) brightness(96%) contrast(87%);
                }
            }
        }
    }

    .price {
        position: relative;
        display: inline-block;
        font-size: 1.6rem;
        font-weight: 700;
        padding-top: 1rem;

        &::before {
            position: absolute;
            content: '/mo';
            right: -2rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.7rem;
            font-weight: 500;
            color: var(--black-4);
        }
    }

    ul {
        padding: 0;
        margin: 0;
        list-style: none;
        line-height: 1.4rem;

        li {
            position: relative;
            color: rgba(0, 0, 0, 0.60);
            font-size: 0.8rem;
            font-weight: 400;
            padding-left: 24px;

            &::before {
                position: absolute;
                content: '';
                left: 0;
                top: 0.25rem;
                background: url('@/assets/img/icon/check.svg') no-repeat;
                background-size: cover;
                width: 16px;
                height: 16px;
                opacity: 0.8;
            }

            &.warning {
                &::before {
                    background: url('@/assets/img/icon/warning.svg') no-repeat;
                    background-size: cover;
                    width: 20px;
                    height: 20px;
                    left: -2px;
                }
            }
        }
    }
}

@media (max-width: 480px) {
    button {
        width: 100%;
    }
}
</style>