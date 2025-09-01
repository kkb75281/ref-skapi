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
        button.inline.gray(:class="{'nonClickable': loading}" @click="router.push('/my-services')") Go to My Services
        button.inline(:class="{'nonClickable': loading || alreadyRegister}" @click="registerReferMisc") Get Bonus
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { onMounted, ref } from "vue";

const router = useRouter();
const route = useRoute();

let refer = route.params.name;
let alreadyRegister = ref(false);
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

let registerReferMisc = () => {
    if (!checkUser()) {
        return;
    }

    let misc = JSON.parse(user.misc || "{}");

    // misc.refer가 배열이 아니면 배열로 변환
    if (!Array.isArray(misc.refer)) {
        misc.refer = misc.refer ? [misc.refer] : [];
    }

    if (misc.refer.includes(refer)) return;

    loading.value = true;
    misc.refer.push(refer);
    skapi
        .updateProfile({ misc: JSON.stringify(misc) })
        .then(() => {
            loading.value = false;
            alreadyRegister.value = true;
        })
        .catch((err) => {
            loading.value = false;
            alreadyRegister.value = false;
        });
};

onMounted(() => {
    if (!checkUser()) {
        // router.push({ path: "/signup", query: { refer_name: refer } });
        router.push({ path: "/signup", query: { suc_redirect: '/refer/' + refer } });
        return;
    } else {
        // 로그인이 되어 있고
        // refer 가 bonus.useless 에 포함되어 있으면 서비스 리스트로 페이지 이동
        if (bonus.useless.includes(refer)) {
            router.push('/my-services');
            return;
        }
    }

    let misc = JSON.parse(user.misc || "{}");
    let miscRefer = misc.refer || [];

    if (miscRefer.includes(refer)) {
        alreadyRegister.value = true;
    } else {
        alreadyRegister.value = false;
    }
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
