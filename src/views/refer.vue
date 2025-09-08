<template lang="pug">
#refer
    router-link(to="/")
        img(src="@/assets/img/logo/symbol-logo.png" style="width: 40px;")

    .page-title Referral Bonus

    hr

    template(v-if="!alreadyRegister")
        .page-desc You're signing up using {{ route.params.name }}'s referral link. #[br]Once you subscribe to Replit Core, you'll both get an extra 10 of monthly credits!
    template(v-else)
        .page-desc You have already registered using a referral link. #[br]You can only register once using a referral link.

    br

    .bottom
        .flex-wrap.center(v-if="loading" style="width:100%;")
            .loader(style="--loader-color:white; --loader-size:12px;")
        template(v-else)
            button.inline.gray(:class="{'nonClickable': loading}" @click="router.push('/my-services')") Go to My Services
            button.inline(:class="{'nonClickable': loading || alreadyRegister}" @click="registerReferMisc") Get Bonus

Modal(:open="completeRegister")
    .modal-title Completed!
    .modal-desc Referrals registration has been completed.#[br]Please go to the service page and use the Skapi!
    .modal-btns
        button.block(type="button" @click="router.push({ path: '/my-services' })") Go to My Services
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { onMounted, ref } from "vue";
import Modal from "@/components/modal.vue";

const router = useRouter();
const route = useRoute();

let referParams = route.params.name;
let alreadyRegister = ref(false);
let completeRegister = ref(false);
let loading = ref(false);
let bonus = {
    use: [],
    useless: ["ThanhYDavid"]
}

let checkUser = () => {
    let u = user?.user_id;

    if (u) {
        return true;
    } else {
        return false;
    }
};

let registerReferMisc = async() => {
    if (!checkUser()) {
        return;
    }

    loading.value = true;

    let misc = JSON.parse(user.misc || "{}");

    // misc.refer가 배열이 아니면 배열로 변환
    if (!Array.isArray(misc.refer)) {
        misc.refer = misc.refer ? [misc.refer] : [];
    }

    if (misc.refer.includes(referParams)) {
        loading.value = false;
        completeRegister.value = true;
        return;
    }

    misc.refer.push(referParams);
    skapi
        .updateProfile({ misc: JSON.stringify(misc) })
        .then(() => {
            loading.value = false;
            alreadyRegister.value = true;
            completeRegister.value = true;
            console.log(user);
        })
        .catch((err) => {
            loading.value = false;
            alreadyRegister.value = false;
        });
};

onMounted(async() => {
    if (!checkUser()) {
        // router.push({ path: "/signup", query: { refer_name: refer } });
        // router.push({ path: "/signup", query: { suc_redirect: '/refer/' + refer } });
        router.push({ path: "/signup", query: { refer: referParams } });
        return;
    } else {
        // 유저 misc 에 refer 등록
        await registerReferMisc();
        
        // // refer 가 bonus.useless 에 포함되어 있으면 서비스 리스트로 페이지 이동
        // if (bonus.useless.includes(referParams)) {
        //     // router.push('/my-services');
        //     router.push({ path: "/my-services", query: { refer: referParams } });
        //     return;
        // }
    }

    // let misc = JSON.parse(user.misc || "{}");
    // let miscRefer = misc.refer || [];

    // if (miscRefer.includes(referParams)) {
    //     alreadyRegister.value = true;
    // } else {
    //     alreadyRegister.value = false;
    // }
});
</script>

<style lang="less" scoped>
#refer {
    max-width: 480px;
    padding: 5rem 20px;
    margin: 0 auto;
}

.bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    min-height: 44px;

    .noLine {
        padding: 0;
    }
}
</style>
