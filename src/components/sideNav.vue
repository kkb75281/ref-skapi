<template lang="pug">
.sideNav(:class="{'mobile': isMobile}")
    .service-plan-name
        span.plan(:class="currentService.plan.toLowerCase()") {{ currentService.plan }}
        .name {{ currentService.service.name }}
    router-link.router(:to="`/my-services/${currentService.id}`" :class="{'active': route.name == 'service'}" @click="emit('closeMobileMenu');")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-nav-home")
        span.name Getting Started
        
    router-link.router(:to="`/my-services/${currentService.id}/dashboard`" :class="{'active': route.name == 'dashboard'}" @click="emit('closeMobileMenu');")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-nav-setting")
        span.name Service Settings

    router-link.router(:to="`/my-services/${currentService.id}/users`" :class="{'active': route.name == 'users'}" @click="emit('closeMobileMenu');")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-nav-users")
        span.name Users
    
    router-link.router(:to="`/my-services/${currentService.id}/openid`" :class="{'active': route.name == 'openid'}" @click="emit('closeMobileMenu');")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-nav-user-shield")
        span.name OpenID Logger

    router-link.router(:to="`/my-services/${currentService.id}/clientsecret`" :class="{'active': route.name == 'clientsecret'}" @click="emit('closeMobileMenu');")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-nav-lock")
        span.name Client Secret Key

    router-link.router(:to="`/my-services/${currentService.id}/records`" :class="{'active': route.name == 'records'}" @click="emit('closeMobileMenu');")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-nav-database")
        span.name Database

    router-link.router(:to="`/my-services/${currentService.id}/mail`" :class="{'active': route.name == 'mail'}" @click="emit('closeMobileMenu');")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-nav-mail")
        span.name Automated Email

    .advanced-router
        div(v-if='currentService.service.group <= 1' @click='()=>openOffer=true' style='cursor:pointer;')
            .router.disabled(:to="`/my-services/${currentService.id}/newsletter`" :class="{'active': route.name == 'newsletter'}" @click="emit('closeMobileMenu');")
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-nav-bulk-mail")
                span.name Bulk Email

            .router.disabled(:to="`/my-services/${currentService.id}/hosting`" :class="{'active': route.name == 'hosting'}" @click="emit('closeMobileMenu');")
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-nav-hosting")
                span.name File Hosting

        template(v-else)
            router-link.router(:to="`/my-services/${currentService.id}/newsletter`" :class="{'active': route.name == 'newsletter'}" @click="emit('closeMobileMenu');")
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-nav-bulk-mail")
                span.name Bulk Email

            router-link.router(:to="`/my-services/${currentService.id}/hosting`" :class="{'active': route.name == 'hosting'}" @click="emit('closeMobileMenu');")
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-nav-hosting")
                span.name File Hosting
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import { currentService, setService, serviceMainLoaded } from "@/views/service/main";

const router = useRouter();
const route = useRoute();

const emit = defineEmits(['closeMobileMenu']);
const isMobile = ref(false);

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 800;
}

onMounted(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
});
</script>

<style lang="less" scoped>
.sideNav {
    width: 100%;

    &.mobile {
        .advanced-router {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
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
        padding: .75rem 2.25rem;
        text-decoration: none;
        color: #F5F5F5;
        white-space: nowrap;

        &.active {
            background: #0D0D0D;
        }

        &:hover {
            background: #0D0D0D;
        }

        svg {
            width: 18px;
            height: 18px;
            fill: #F5F5F5;
        }

        .name {
            flex-grow: 1;
            font-size: 1rem;
        }
    }

    .advanced-router {
        padding: 24px 0;
        margin-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
}

@media (max-width: 430px) {
    .sideNav {
        .router {
            padding: .75rem 2rem;
        }
    }
}
</style>