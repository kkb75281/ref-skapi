<template lang="pug">
br
br
br

#serviceMain(v-if="currentService")
    nav.left 
        router-link.router(:to="`/my-services`")
            span.material-symbols-outlined.nohover.back arrow_back_ios
            span.name My services
        br
        br
        br
        router-link.router(:to="`/my-services/${currentService.service}`" :class="{'active': route.name == 'service'}")
            span.material-symbols-outlined.icon.fill.nohover home
            span.name Dashboard
        router-link.router(:to="`/my-services/${currentService.service}/users`" :class="{'active': route.name == 'users'}")
            span.material-symbols-outlined.icon.fill.nohover supervisor_account
            span.name Users
        router-link.router(:to="`/my-services/${currentService.service}/records`" :class="{'active': route.name == 'records'}")
            span.material-symbols-outlined.icon.fill.nohover database
            span.name Database
        router-link.router(:to="`/my-services/${currentService.service}/mail`" :class="{'active': route.name == 'mail'}")
            span.material-symbols-outlined.icon.fill.nohover email
            span.name Mail
        router-link.router(:to="`/my-services/${currentService.service}/hosting`" :class="{'active': route.name == 'hosting'}")
            span.material-symbols-outlined.icon.fill.nohover language
            span.name Hosting
    main.right 
        router-view
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { currentService } from '@/data.js';
import { watch } from 'vue';
import { loginState } from '@/code/user';

const router = useRouter();
const route = useRoute();

watch(loginState, nv=>{
    if(!nv) {
        router.push('/login');
    }
}, {immediate: true});

let getCurrentService = () => {
    currentService.value = {};
    currentService.value.service = route.path.split('/')[2];
}

if(currentService.value !== route.path.split('/')[2] || currentService.value == null) {
    getCurrentService();
}
</script>

<style lang="less" scoped>
#serviceMain {
    position: relative;
    max-width: 100%;
    display: flex;
    flex-wrap: nowrap;

    .left {
        padding-left: 20px;
    }
    .right {
        width: 50%;
        flex-grow: 1;
        padding: 0 20px;

        > div {
            max-width: 1200px;
            margin: 0 auto;
        }
    }
}
.router {
    display: block;
    padding: 12px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--main-color);
    white-space: nowrap;

    &.active {
        background: #293FE60D;
        box-shadow: 0px -1px 1px 0px rgba(0, 0, 0, 0.15) inset;

        .name {
            font-weight: 700;
        }
    }
    span {
        vertical-align: middle;
    }
    .back {
        font-size: 1rem;
        margin-left: 9px;
    }
    .icon {
        font-size: 1.5rem;
    }
    .name {
        font-size: 1rem;
        font-weight: 500;
        margin-left: 13px;
        padding-right: 60px;
    }
}

@media (max-width:1023px) {
    .router {
        .name {
            display: none;
        }
    }
}

@media (max-width:767px) {
    #serviceMain {
        .left {
            display: none;
        }
    }
}
</style>