<template lang="pug">
.account-setting
    .title Account Settings
        .delete-icon(@click="router.push('/delete-account')")
            svg
                use(xlink:href="@/assets/img/material-icon.svg#icon-delete")
    .desc Edit your account details down below.

    br

    .bar-wrap
        .bar(:class="{active: activeBar === 'email'}" @click="activeBar = 'email'") Email
        .bar(:class="{active: activeBar === 'password'}" @click="activeBar = 'password'") Password
        .bar(:class="{active: activeBar === 'newsletters'}" @click="activeBar = 'newsletters'") Newsletters

    .form-wrap
        template(v-if="activeBar === 'email'")
            .form-title Email
            form(@submit.prevent="changeEmail" style='margin-bottom:12px;')
                input.block(type="email" ref='emailInp' spellcheck="false" :value="inputEmail" :disabled="updatingValue || !user.email_verified" @input="(e) => {e.target.setCustomValidity('');inputEmail = e.target.value;}" placeholder="your@email.com" required)
                button.block(style="width:100%; margin-bottom:0.5rem" :class="{disabled: updatingValue || inputEmail === user.email}")
                    template(v-if="updatingValue")
                        .loader(style="--loader-color:#fff; --loader-size:12px")
                    template(v-else) Change Email
                button.block.warning(v-if="!user.email_verified" style="width:100%;" @click="proceedVerification = true;") Verify Email
        template(v-else-if="activeBar === 'password'")
            .form-title Password
            form(@submit.prevent="changePassword" style='margin-bottom:12px;')
                input.block.disabled(type="password" ref='passwordInp' value="********")
                button.block(style="width:100%" @click="router.push('/change-password')") Change Password
        template(v-else-if="activeBar === 'newsletters'")
            button.block(:class="{unFinished: emailSubscribed, final: subing_email || !emailSubscribed, disabled: !user.email_verified || subing_email || emailSubscribed === null}" @click="emailSubscribed = !emailSubscribed" style="width:100%; margin-bottom:0.5rem")
                template(v-if="subing_email")
                    .loader(style="--loader-color:#fff; --loader-size:12px")
                template(v-else)
                    template(v-if="emailSubscribed") Unsubscribe from newsletters
                    template(v-else) Subscribe to newsletters

Modal(:open="proceedVerification" @close="proceedVerification=false")
    .modal-title Email Verification

    .modal-desc Would you like to verify your email address? #[br] The verification code will be sent to #[b {{ user.email }}]

    br
    div(style='justify-content:space-between;display:flex;align-items:center;')
        template(v-if='sendingEmail')
            .loader(style="--loader-color:white; --loader-size:12px; margin:0 auto")
        template(v-else)
            button.inline.gray(@click="proceedVerification = false") Cancel
            button.inline(@click="sendEmail") Proceed

</template>

<script setup lang="ts">
import { skapi } from "@/main";
import { user, emailSubscribed } from "@/code/user";
import router from "@/router";
import { computed, ref, nextTick, watch, onMounted } from "vue";
import Modal from "@/components/modal.vue";
import Checkbox from "@/components/checkbox.vue";

let activeBar = ref("email");
let modifyMode = ref(false);
let updatingValue = ref(false);
let inputEmail = ref(user.email);
let sendingEmail = ref(false);
let emailInp = ref();
let subing_email = ref(false);
let editEmail = () => {
    inputEmail.value = user.email;
    modifyMode.value = true;
    nextTick(() => {
        emailInp.value.focus();
    });
};
let sendEmail = async () => {
    sendingEmail.value = true;
    try {
        await skapi.verifyEmail();
        router.push("/verification");
    } catch (err) {
        window.alert(err.message);
    } finally {
        proceedVerification.value = false;
    }
};
let changeEmail = async () => {
    updatingValue.value = true;
    try {
        await skapi.updateProfile({
            email: inputEmail.value,
        });
        updatingValue.value = false;
        modifyMode.value = false;
    } catch (err) {
        updatingValue.value = false;
        nextTick(() => {
            emailInp.value.focus();
            emailInp.value.setCustomValidity(err.message);
            emailInp.value.reportValidity();
        });
    }
};

let proceedVerification = ref(false);

watch(emailSubscribed, async (n, o) => {
    if (o === null) return;

    subing_email.value = true;
    if (n) {
        await skapi.subscribeNewsletter({
            group: "authorized",
        });
    } else {
        await skapi.unsubscribeNewsletter({
            group: "authorized",
        });
    }
    subing_email.value = false;
});
watch(activeBar, (n, o) => {
    if (n && n !== o) {
        if (inputEmail.value !== user.email) {
            inputEmail.value = user.email;
        }
    }
});
</script>

<style scoped lang="less">
.account-setting {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 10px;
    padding-top: 3rem;
    width: 100%;
}

.title {
    position: relative;
    font-size: 1.3rem;
    margin-bottom: 8px;
    color: #fff;

    .delete-icon {
        position: absolute;
        right: 0;
        bottom: -1.5rem;

        svg {
            width: 24px;
            height: 24px;
            cursor: pointer;
            fill: #ccc;
        }

        &:hover {
            svg {
                fill: var(--caution-color);
            }
        }
    }
}

.desc {
    font-size: 0.9rem;
    color: #fff;
}

.bar-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #222326;
    padding: 4px;
    border-radius: 8px;
    gap: 4px;

    .bar {
        position: relative;
        padding: 8px 30px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        user-select: none;

        &::after {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            display: none;
        }

        &.active {
            &::after {
                display: block;
            }
        }

        // flex: 1;
        // padding: 8px;
        // text-align: center;
        // font-size: 0.9rem;
        // font-weight: 500;
        // color: var(--main-color);
        // cursor: pointer;

        // &:hover {
        //     background-color: rgba(41, 63, 230, 0.1);
        //     border-radius: 4px;
        // }
    }
}

.form-wrap {
    max-width: 530px;
    margin: 0 auto;
    padding: 3rem 0;

    .form-title {
        margin-bottom: 8px;
        color: #fff;
    }

    input {
        margin-bottom: 0.5rem;
    }
}

@media (max-width: 600px) {
    .title {
        .delete-icon {
            bottom: unset;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}

// .infoBox {
//     max-width: 600px;
//     margin: 0 auto;

//     .svgIcon {
//         height: 28px;
//         width: 28px;
//     }

//     svg:hover {
//         border-radius: 50%;
//         background-color: rgba(41, 63, 230, 0.1);
//     }
// }</style>
