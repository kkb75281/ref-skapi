<template lang="pug">
br
br
br

#refer
    router-link(to="/")
        img(src="@/assets/img/logo/symbol-logo.png" style="width: 40px;")

    .bottomLineTitle Referral Bonus

    template(v-if="!alreadyRegister")
        p You're signing up using {{ route.params.name }}'s referral link. #[br]Once you subscribe to Replit Core, you'll both get an extra 10 of monthly credits!
    template(v-else)
        p You have already registered using a referral link. #[br]You can only register once using a referral link.

    br

    .bottom
        button.noLine(:class="{'nonClickable': loading}" @click="router.push('/my-services')") Go to My Services
        button.final(:class="{'nonClickable': loading || alreadyRegister}" @click="registerReferMisc") Get Bonus
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

    let misc = JSON.parse(user.misc || '{}');

    // misc.refer가 배열이 아니면 배열로 변환
    if (!Array.isArray(misc.refer)) {
        misc.refer = misc.refer ? [misc.refer] : [];
    }

    if (misc.refer.includes(refer)) return;

    loading.value = true;
    misc.refer.push(refer);
    console.log("Updating refer code to", misc.refer);
    skapi.updateProfile({ misc: JSON.stringify(misc) })
        .then(() => {
            console.log("Refer code updated successfully");
            console.log(user);
            loading.value = false;
            alreadyRegister.value = true;
        })
        .catch(err => {
            console.error("Failed to update refer code", err);
            loading.value = false;
            alreadyRegister.value = false;
        });
}

onMounted(() => {
    if (!checkUser()) {
        console.log("User is not logged in");
        router.push({ path: '/login', query: { refer_name: refer } });
        return;
    }

    let misc = JSON.parse(user.misc || '{}');
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
    padding: 0 20px;
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