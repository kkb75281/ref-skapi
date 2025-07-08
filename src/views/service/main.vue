<template lang="pug">
#serviceMain.service-page-main(v-if="serviceMainLoaded")
    nav.left 
        .top
            .service-plan-name
                span.plan(:class="currentService.plan.toLowerCase()") {{ currentService.plan }}
                .name {{ currentService.service.name }}
            router-link.router(:to="`/my-services/${currentService.id}`" :class="{'active': route.name == 'service'}")
                img(src="@/assets/img/servicemain/home.svg" alt="Home Icon")
                span.name Getting Started
                
            router-link.router(:to="`/my-services/${currentService.id}/dashboard`" :class="{'active': route.name == 'dashboard'}")
                img(src="@/assets/img/servicemain/setting.svg" alt="Setting Icon")
                span.name Service Settings

            router-link.router(:to="`/my-services/${currentService.id}/users`" :class="{'active': route.name == 'users'}")
                img(src="@/assets/img/servicemain/users.svg" alt="Users Icon")
                span.name Users
            
            router-link.router(:to="`/my-services/${currentService.id}/openid`" :class="{'active': route.name == 'openid'}")
                img(src="@/assets/img/servicemain/user_shield.svg" alt="OpenID Icon")
                span.name OpenID Logger

            router-link.router(:to="`/my-services/${currentService.id}/clientsecret`" :class="{'active': route.name == 'clientsecret'}")
                img(src="@/assets/img/servicemain/lock.svg" alt="Client Secret Icon")
                span.name Client Secret Key

            router-link.router(:to="`/my-services/${currentService.id}/records`" :class="{'active': route.name == 'records'}")
                img(src="@/assets/img/servicemain/cloud.svg" alt="Database Icon")
                span.name Database

            router-link.router(:to="`/my-services/${currentService.id}/mail`" :class="{'active': route.name == 'mail'}")
                img(src="@/assets/img/servicemain/mail.svg" alt="Automated Email Icon")                      
                span.name Automated Email

            .advanced-router
                div(v-if='currentService.service.group <= 1' @click='()=>openOffer=true')
                    .router.deact(:to="`/my-services/${currentService.id}/newsletter`" :class="{'active': route.name == 'newsletter'}")
                        img(src="@/assets/img/servicemain/mail.svg" alt="Bulk Email Icon")
                        span.name Bulk Email

                    .router.deact(:to="`/my-services/${currentService.id}/hosting`" :class="{'active': route.name == 'hosting'}")
                        img(src="@/assets/img/servicemain/hosting.svg" alt="File Hosting Icon")
                        span.name File Hosting

                template(v-else)
                    router-link.router(:to="`/my-services/${currentService.id}/newsletter`" :class="{'active': route.name == 'newsletter'}")
                        img(src="@/assets/img/servicemain/mail.svg" alt="Bulk Email Icon")
                        span.name Bulk Email

                    router-link.router(:to="`/my-services/${currentService.id}/hosting`" :class="{'active': route.name == 'hosting'}")
                        img(src="@/assets/img/servicemain/hosting.svg" alt="File Hosting Icon")
                        span.name File Hosting
        .upgrade
            .title Hey, {{ user?.name ? user.name : user.email.split('@')[0] }}
            .desc This service is currently in a free version. Upgrade to enjoy more convenient features!
            button Upgrade
    main.right
        router-view
        //- br
        //- br
        //- hr
        //- nav.bottom 
            .link
                router-link.prev(v-if="currentRouter && titleList[index-1]" :to="`/my-services/${currentService.id}/${prevRouter}`")
                    .desc Prev Page
                    .title {{ titleList[index-1] }}
            .link
                router-link.next(v-if="currentRouter !== 'hosting' && titleList[index+1]" :to="`/my-services/${currentService.id}/${nextRouter}`")
                    .desc Next Page
                    .title {{ titleList[index+1] }}

    
    // upgrade service
    Modal(:open="openOffer" @close="openOffer=false")
        h4(style='margin:.5em 0 0;') Upgrade

        hr

        div(style='font-size:.8rem;')
            p.
                You can access more features like sending newsletters,
                #[br]
                inviting users and file hosting by upgrading your service.
                
            p Would you like you check out our service plans?


        br

        div(style="display: flex; align-items: center; justify-content: space-between;")
            button.noLine(type="button" @click="openOffer=false;") No
            router-link(:to='`/subscription/${currentService.id}`')
                button.final(type="button") Yes
div(v-else style='text-align: center;margin-top: 100px;')
    .loader(style="--loader-color:blue; --loader-size:12px")


</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { user } from '@/code/user';
import { serviceList } from "@/views/service-list";
import { currentService, setService, serviceMainLoaded } from "@/views/service/main";
import Modal from "@/components/modal.vue";
import MaterialIcon from "@/assets/img/material-icon.svg"

const router = useRouter();
const route = useRoute();

let openOffer = ref(false);

let serviceId = route.path.split("/")[2];
let currentRouter = ref("");
let routerList = [
    "service",
    "dashboard",
    "users",
    "openid",
    "clientsecret",
    "records",
    "mail",
    "newsletter",
    "hosting",
];
let titleList = [
    "Getting Started",
    "Service Settings",
    "Users",
    "OpenID Logger",
    "Client Secret Key",
    "Database",
    "Automated Email",
    "Bulk Email",
    "File Hosting",
];

let index = 0;
let prevRouter = ref("");
let nextRouter = ref("");
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

watch(() => route, nv => {
    currentRouter.value = nv.path.split('/')[3];
    index = routerList.indexOf(currentRouter.value);
    plan.value = currentService?.plan;

    if (plan.value == "Trial") {
        routerList = ["service", "dashboard", "users", "openid", "clientsecret", "records", "mail"];
        titleList = [
            "Getting Started",
            "Dashboard & Settings",
            "Users",
            "OpenID Logger",
            "Client Secret Key",
            "Database",
            "Automated Email"
        ];
    }

    if (index == -1) {
        nextRouter.value = "dashboard";
        titleList[0] = "Dashboard & Settings";
    } else if (index == 1) {
        prevRouter.value = "";
        titleList[0] = "Getting Started";
        nextRouter.value = routerList[index + 1];
    } else {
        prevRouter.value = routerList[index - 1];
        nextRouter.value = routerList[index + 1];
    }
},
    { immediate: true, deep: true }
);
</script>

<style lang="less" scoped>
button {
    display: inline-flex;
    max-width: 240px;
    padding: 0 0.875rem;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 13px;
    background: #0a4df1;
    border: 0;
    color: #fff;
    font-size: .8125rem;
    font-weight: 500;
    line-height: 1.5;
    white-space: nowrap;

    &:hover {
        background-color: #1656f2;
    }
}

#serviceMain {
    position: relative;
    // max-width: 1400px;
    display: flex;
    flex-wrap: nowrap;
    margin: 0 auto;
    gap: 1em;

    .left {
        position: fixed;
        top: 4rem;
        left: 0;
        width: 260px;
        height: calc(100% - 4rem);
        overflow-y: auto;
        background-color: var(--sidebar-bg);
        box-shadow: 1px 0px 0.5px 0px #00000014;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .top {
            width: 100%;
        }

        .service-plan-name {
            padding: 40px 0;
            text-align: center;

            .plan {
                color: #000;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 5px;
                font-weight: 500;

                &.trial {
                    background-color: #3C94FF;
                }

                &.standard {
                    background-color: #77DFA2;
                }

                &.premium {
                    background-color: #F0E577;
                }
            }

            .name {
                font-size: 16px;
                margin-top: 8px;
            }
        }

        .router {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 36px;
            text-decoration: none;
            color: var(--sidebar-color);
            white-space: nowrap;

            &.active {
                background: rgba(var(--sidebar-hover-rgb), 0.05);
            }

            &.deact {
                background-color: transparent !important;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.5) !important;

                img {
                    opacity: 0.5;
                }
            }

            &:hover {
                background: rgba(var(--sidebar-hover-rgb), 0.05);
            }

            img {
                height: 18px;
                width: 18px;
            }

            .name {
                flex-grow: 1;
                font-size: 15px;
            }
        }

        .advanced-router {
            padding: 24px 0;
            margin-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .upgrade {
            margin: 0 20px;
            margin-bottom: 40px;
            padding: 30px 20px;
            background-color: #16171A;
            text-align: center;
            border-radius: 15px;

            .title {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .desc {
                font-weight: 300;
                font-size: 12px;
                line-height: 1.3;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 30px;
            }
        }
    }

    .right {
        width: 50%;
        flex-grow: 1;
        padding: 60px;
        padding-left: 320px;
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

// @media (max-width: 1023px) {
//     .router {
//         .name {
//             display: none;
//         }
//     }
// }

// @media (max-width: 767px) {
//     #serviceMain {
//         #leftNav {
//             display: none;
//         }
//     }
// }</style>
