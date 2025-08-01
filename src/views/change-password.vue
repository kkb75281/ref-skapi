<template lang="pug">
#changePassword
    template(v-if="step < 3")
        router-link(to="/")
            img(src="@/assets/img/logo/symbol-logo.png" alt="Skapi Logo" style="width: 40px; margin-bottom: .625rem")

        .page-title Change Password
    template(v-else)
        svg.svgIcon(style="height: 50px; width: 50px; margin-bottom: .625rem")
            use(xlink:href="@/assets/img/material-icon.svg#icon-check-circle" alt="Check Circle Icon")

        .page-title Success

    hr

    template(v-if="step === 1")
        form(@submit.prevent="login")
            .page-desc Please enter your current password.

            input(
                :value="user.email"
                name="email"
                required
                hidden)

            label.passwordInput
                | Current Password
                input.block(
                    :type='showPassword ? "text" : "password"'
                    @input="e=>currPassword = e.target.value"
                    placeholder="Enter your current password"
                    required
                    name="password")
                //- .passwordIcon(@click="showPassword = !showPassword")
                //-     template(v-if="showPassword")
                //-         svg.svgIcon(style="fill: var(--black-6)")
                //-             use(xlink:href="@/assets/img/material-icon.svg#icon-visibility-fill")
                //-     template(v-else)
                //-         svg.svgIcon(style="fill: var(--black-6)")
                //-             use(xlink:href="@/assets/img/material-icon.svg#icon-visibility-off-fill")

            .error(v-if="error")
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-error" alt="Error Icon")
                span {{ error }}

            br

            .bottom
                template(v-if="promiseRunning")
                    .loader(style="--loader-color:white; --loader-size: 12px; margin:0 auto")
                template(v-else)
                    router-link(to='/account-setting') Back
                    button.inline(type="submit") Continue

    template(v-else-if="step === 2")
        form(@submit.prevent="changePassword" action="")
            .page-desc Create a new password.

            label.passwordInput(style="margin-bottom:16px")
                | New password
                input.block(
                    :type='showNewPassword ? "text" : "password"'
                    minlength="6"
                    maxlength='60'
                    @input="e=>newPassword=e.target.value"
                    placeholder="Min 6 characters and max 60 characters"
                    required)
                //- .passwordIcon(@click="showNewPassword = !showNewPassword")
                //-     template(v-if="showNewPassword")
                //-         svg.svgIcon(style="fill: var(--black-6)")
                //-             use(xlink:href="@/assets/img/material-icon.svg#icon-visibility-fill")
                        
                //-     template(v-else)
                //-         svg.svgIcon(style="fill: var(--black-6)")
                //-             use(xlink:href="@/assets/img/material-icon.svg#icon-visibility-off-fill")

            label.passwordInput
                | Confirm new password
                input.block(
                    :type='showConfirmPassword ? "text" : "password"'
                    ref="confirmNewPasswordField"
                    minlength="6"
                    maxlength='60'
                    :value="newPasswordConfirm"
                    @input="e=> { newPasswordConfirm = e.target.value; e.target.setCustomValidity(''); }" 
                    @change="validateNewPassword" 
                    placeholder="Confirm the new password"
                    required)
                //- .passwordIcon(@click="showConfirmPassword = !showConfirmPassword")
                //-     template(v-if="showConfirmPassword")
                //-         svg.svgIcon(style="fill: var(--black-6)")
                //-             use(xlink:href="@/assets/img/material-icon.svg#icon-visibility-fill")
                //-     template(v-else)
                //-         svg.svgIcon(style="fill: var(--black-6)")
                //-             use(xlink:href="@/assets/img/material-icon.svg#icon-visibility-off-fill")

            .error(v-if="error")
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-error" alt="Error Icon")
                span {{ error }}

            br

            .bottom
                template(v-if="promiseRunning")
                    .loader(style="--loader-color:white; --loader-size: 12px; margin:0 auto")
                template(v-else)
                    router-link(to='/account-setting') Back
                    button.inline(type="submit") Submit

    template(v-else-if="step === 3")
        .page-desc Your password has been successfully changed. Please login with the new password.

        br
        br

        div(style="text-align:right")
            button.inline(@click="router.replace('/login')") Login

    br
    br

    .navigator(v-if="step <= 2")
        .ball(v-for="num in 2" :class="{'active': step === num}")
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { skapi } from '@/main';
import { user } from '@/code/user';

const router = useRouter();
const route = useRoute();

let step = ref(1);
let error = ref('');
let promiseRunning = ref(false);

let showPassword = ref(false);
let showNewPassword = ref(false);
let showConfirmPassword = ref(false);
let confirmNewPasswordField = ref(null);

let currPassword = '';
let newPassword = '';
let newPasswordConfirm = '';

let login = async (e: SubmitEvent) => {
    promiseRunning.value = true;
    error.value = '';
    try {
        await skapi.login(e);
        step.value++;
    }
    catch (err: any) {
        error.value = 'Invalid password';
    }
    finally {
        promiseRunning.value = false;
    }
}

let validateNewPassword = () => {
    if (newPasswordConfirm !== newPassword) {
        confirmNewPasswordField.value.setCustomValidity('Password does not match');
        confirmNewPasswordField.value.reportValidity();
    }
}
let changePassword = async () => {
    promiseRunning.value = true;
    error.value = '';
    try {
        await skapi.changePassword({ current_password: currPassword, new_password: newPassword });

        let misc = JSON.parse(user.misc || '{}');

        misc.changePassword = true;

        await skapi.updateProfile({ misc: JSON.stringify(misc) });

        step.value++;
    }
    catch (err: any) {
        error.value = err.message;
    }
    finally {
        promiseRunning.value = false;
    }
}
</script>

<style scoped lang="less">
#changePassword {
    max-width: 480px;
    padding: 5rem 20px;
    margin: 0 auto;
}

// .passwordInput {
//     position: relative;

//     .passwordIcon {
//         position: absolute;
//         right: 15px;
//         bottom: 10px;
//         opacity: 0.5;
//         cursor: pointer;
//     }
// }

.navigator {
    text-align: center;

    .ball {
        display: inline-block;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background-color: #D9D9D9;
        margin-right: 12px;

        &.active {
            background-color: var(--main-color);
        }

        &:last-child {
            margin: 0;
        }
    }
}

form {
    padding: 8px;

    >label {
        margin-bottom: 16px;
    }

    .bottom {
        min-height: 44px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
    }
}
</style>