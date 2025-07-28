<template lang="pug">
.account-setting
    section.page-header
        .page-title Account Settings
        router-link(to="/delete-account")
            button.inline.sm.gray.caution Delete Account

    hr

    .card-wrap
        .card
            .flex-wrap.space-between
                div
                    .title Email
                    .data {{ user.email }}
                button.only-icon.gray.edit-btn(type="button" @click="modifyEmail = true")
                    .icon
                        svg
                            use(xlink:href="@/assets/img/material-icon.svg#icon-edit")
        
        .card
            .flex-wrap.space-between
                div
                    .title Password
                    .data *********
                button.only-icon.gray.edit-btn(type="button" @click="router.push('/change-password')")
                    .icon
                        svg
                            use(xlink:href="@/assets/img/material-icon.svg#icon-edit")

        .card
            .flex-wrap.space-between
                div
                    .title Newsletters
                    .data {{ emailSubscribed ? "Subscribed" : "Unsubscribed" }}
                Toggle(
                    style='display:inline-flex;align-items:center;'
                    :disabled="!user.email_verified || subing_email || emailSubscribed === null"
                    :active="emailSubscribed"
                    @click="emailSubscribed = !emailSubscribed"
                )

Modal(:open="modifyEmail" @close="modifyEmail = false")
    .modal-close(@click="modifyEmail = false;")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

    .modal-title Change Email
    .modal-desc.
        Enter your new email address below.
        #[br] A verification email will be sent to the new address.

    form(@submit.prevent="changeEmail")
        input.block(type="email" ref='emailInp' spellcheck="false" :value="inputEmail" :disabled="!user.email_verified || updatingValue" @input="(e) => {e.target.setCustomValidity('');inputEmail = e.target.value;}" placeholder="your@email.com" required)

        .modal-btns
            .loader-wrap(v-if='updatingValue')
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else-if="!user.email_verified")
                button.block.red(v-if="user.email_verified" style="width:100%;" @click="proceedVerification = true;") Verify Email
            template(v-else)
                button.block(type="submit" :class="{disabled: updatingValue || inputEmail === user.email}") Change

Modal(:open="proceedVerification" @close="proceedVerification=false")
    .modal-title Email Verification

    .modal-desc Would you like to verify your email address? #[br] The verification code will be sent to #[b {{ user.email }}]

    .modal-btns
        .loader-wrap(v-if='sendingEmail')
            .loader(style="--loader-color:white; --loader-size:12px;")
        template(v-else)
            button.gray.btn-cancel(@click="proceedVerification = false") Cancel
            button.btn-proceed(@click="sendEmail") Proceed
</template>

<script setup lang="ts">
import { skapi } from "@/main";
import { user, emailSubscribed } from "@/code/user";
import { useRoute, useRouter } from "vue-router";
import { ref, nextTick, watch } from "vue";

import Modal from "@/components/modal.vue";
import Toggle from "@/components/toggle.vue";
import Tooltip from "@/components/tooltip.vue";

const router = useRouter();
const route = useRoute();

let modifyEmail = ref(false);
let updatingValue = ref(false);
let inputEmail = ref(user.email);
let sendingEmail = ref(false);
let emailInp = ref();
let subing_email = ref(false);

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
</script>

<style scoped lang="less">
.account-setting {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 10px 1rem;
    width: 100%;
}

.card-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 1rem 0;

    .card {
        position: relative;
        background-color: #121214;
        padding: 20px;
        border-radius: 13px;
        flex: 1;
        min-width: 300px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        .title {
            // font-size: 20px;
            margin-bottom: 10px;
            opacity: 0.6;
        }

        .data {
            // font-size: 14px;
            font-weight: 300;
            max-width: 12.5rem;

            @media (max-width: 600px) {
                font-size: 12px;
            }
        }

        .date {
            font-size: 14px;
            margin-top: 5px;
            opacity: 0.6;

            @media (max-width: 600px) {
                font-size: 12px;
            }
        }

        // .edit-btn {
        //     position: absolute;
        //     top: 20px;
        //     right: 20px;
        // }

        .bar-wrap {
            margin-top: 10px;
            height: 8px;
            background-color: #2c2c2e;
            border-radius: 4px;
            overflow: hidden;

            .bar {
                height: 100%;
                background-color: var(--main-color);
                transition: width 0.3s ease-in-out;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            span {
                color: white;
                font-size: 12px;
            }
        }
    }
}

// .title {
//     position: relative;
//     font-size: 1.3rem;
//     margin-bottom: 8px;
//     color: #fff;

//     .delete-icon {
//         position: absolute;
//         right: 0;
//         bottom: -1.5rem;

//         svg {
//             width: 24px;
//             height: 24px;
//             cursor: pointer;
//             fill: #ccc;
//         }

//         &:hover {
//             svg {
//                 fill: var(--caution-color);
//             }
//         }
//     }
// }

// .desc {
//     font-size: 0.9rem;
//     color: #fff;
// }

// .bar-wrap {
//     width: 100%;
//     display: flex;
//     align-items: center;
//     background-color: #222326;
//     padding: 4px;
//     border-radius: 8px;
//     gap: 4px;

//     .bar {
//         position: relative;
//         padding: 8px 30px;
//         border-radius: 8px;
//         cursor: pointer;
//         font-size: 0.9rem;
//         user-select: none;

//         &::after {
//             position: absolute;
//             content: '';
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             background-color: rgba(255, 255, 255, 0.05);
//             border-radius: 6px;
//             display: none;
//         }

//         &.active {
//             &::after {
//                 display: block;
//             }
//         }

//         // flex: 1;
//         // padding: 8px;
//         // text-align: center;
//         // font-size: 0.9rem;
//         // font-weight: 500;
//         // color: var(--main-color);
//         // cursor: pointer;

//         // &:hover {
//         //     background-color: rgba(41, 63, 230, 0.1);
//         //     border-radius: 4px;
//         // }
//     }
// }

// .form-wrap {
//     max-width: 530px;
//     margin: 0 auto;
//     padding: 3rem 0;

//     .form-title {
//         margin-bottom: 8px;
//         color: #fff;
//     }

//     input {
//         margin-bottom: 0.5rem;
//     }
// }

// @media (max-width: 600px) {
//     .title {
//         .delete-icon {
//             bottom: unset;
//             top: 50%;
//             transform: translateY(-50%);
//         }
//     }
// }</style>
