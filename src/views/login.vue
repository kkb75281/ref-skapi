<template lang="pug">
#login
    router-link(to="/")
        img(src="@/assets/img/logo/symbol-logo.png" alt="Skapi Logo" style="width: 40px; margin-bottom: .625rem")

    .page-title Login

    hr

    form(@submit.prevent="login")
        label
            | Email
            input.block(type="email" @input="e=> { form.email = e.target.value; error='';}" :disabled="promiseRunning" placeholder="your@email.com" required)

        label.passwordInput
            | Password
            input.block(:type='showPassword ? "text" : "password"'
            @input="(e)=>{form.password = e.target.value; error='';}" 
            :disabled="promiseRunning"
            name="password" placeholder="Enter password" required)
            //- .passwordIcon(@click.stop="showPassword = !showPassword")
            //-     template(v-if="showPassword")
            //-         svg.svgIcon(style="fill: var(--black-6)")
            //-             use(xlink:href="/material-icon.svg#icon-visibility-fill")
            //-     template(v-else)
            //-         svg.svgIcon(style="fill: var(--black-6)")
            //-             use(xlink:href="/material-icon.svg#icon-visibility-off-fill")

        .actions
            Checkbox(style='font-weight:unset;' @change="(e)=>{setLocalStorage(e)}" :disabled='promiseRunning' v-model='remVal') Remember Me
            RouterLink(to="/forgot" :class='{disabled: promiseRunning}') Forgot Password?

        br

        .error(v-if="error")
            svg
                use(xlink:href="/material-icon.svg#icon-error")
            div(v-if="enableAccount")
                | {{ error }}
                br
                br
            span(v-else) {{ error }}

        .error(v-if="enableAccount" style="align-items: center;")
            router-link(:to='"/enable-account/" + form.email') [Click Here]
            span &nbsp;to enable your account.

        br

        .bottom
            div(v-if="promiseRunning" style="width:100%; text-align:center")
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else)
                button.inline.btn-login Login
                .signup
                    span.text No account?
                    router-link.btn-signup(to="/signup") Sign up
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { onMounted, ref } from "vue";
import Checkbox from "@/components/checkbox.vue";

const router = useRouter();
const route = useRoute();

skapi.logout().then(() => {
    for (let k in user) {
        delete user[k];
    }
});
let showPassword = ref(false);
let remVal = ref(false); // dom 업데이트시 checkbox value 유지하기 위함
let promiseRunning = ref(false);
let error = ref(null);
let form = {
    email: "",
    password: "",
};
let enableAccount = ref(false);

onMounted(() => {
    if (window.localStorage.getItem("remember") === "true") {
        remVal.value = true;
    } else {
        remVal.value = false;
    }
});
let setLocalStorage = (e) => {
    localStorage.setItem("remember", e.target.checked ? "true" : "false");
};

let login = (e) => {
    promiseRunning.value = true;

    let params = {
        email: form.email,
        password: form.password,
    };

    skapi
        .login(params)
        .then((u) => {
            for (let k in u) {
                user[k] = u[k];
            }
            // if (route.query?.suc_redirect) {
            //     // router.push(route.query?.suc_redirect);
            //     router.push({ path: "/my-services", query: { redirect: route.query?.suc_redirect } });
            // } else {
            //     router.push("/my-services");
            // }
            router.push("/my-services");
        })
        .catch((err) => {
            for (let k in user) {
                delete user[k];
            }
            if (err.code === "SIGNUP_CONFIRMATION_NEEDED") {
                router.push({
                    path: "/confirmation",
                    query: { email: form.email },
                });
            } else if (err.code === "USER_IS_DISABLED") {
                error.value = "This account is disabled.";
                enableAccount.value = true;
            } else if (err.code === "INCORRECT_USERNAME_OR_PASSWORD") {
                error.value = "Incorrect email or password.";
            } else if (err.code === "NOT_EXISTS") {
                error.value = "Incorrect email or password.";
            } else {
                error.value = err.message;
            }
        })
        .finally(() => {
            promiseRunning.value = false;
        });
};
</script>

<style scoped lang="less">
#login {
    max-width: 480px;
    padding: 5rem 20px;
    margin: 0 auto;
    width: 100%;
}

form {
    padding: 8px;

    >label {
        margin-bottom: 16px;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
    }

    .bottom {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse;
        min-height: 44px;

        .signup {
            font-size: 16px;
            margin: 16px 0;
        }
    }
}

.btn-signup {
    display: inline-block;
    margin-left: 0.5rem;
}

.btn-login {
    padding: 0.875rem 1.5rem;
}

@media (max-width: 480px) {
    form {
        padding-bottom: 1rem;

        .bottom {
            display: block;
            text-align: center;

            button {
                width: 100%;
                max-width: 100%;
            }

            .forgot {
                display: block;
                margin-bottom: 8px;
            }
        }
    }
}
</style>
