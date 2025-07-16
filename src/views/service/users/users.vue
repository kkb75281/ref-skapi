<template lang="pug">
section
    .flex-wrap.space-between
        .page-title Users
        .flex-wrap.end
            //- button.inline.only-icon.gray.sm
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-person-add-fill")
            //- button.inline.only-icon.gray.sm
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-mark-email-unread-fill")
            a(href='https://docs.skapi.com/authentication/create-account.html' target="_blank")
                button.inline.sm.gray Go Docs
    
    hr

    br
    br

    .flex-wrap.space-between.table-menu-wrap
        .flex-wrap
            button.inline.only-icon.gray.sm(@click.stop="(e) => { showDropDown(e); }")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-checklist-rtl")
                .moreVert(
                    @click.stop,
                    style="--moreVert-left: 0; display: none; font-weight: normal;"
                    )
                    .inner(style="padding: 0.5rem;")
                        template(v-for="c in columnList")
                            Checkbox(v-model="c.value", style="display: flex; padding: 0.25rem 0;") {{ c.name }}
            button.inline.only-icon.gray.sm(@click="searchModalOpen = true" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                //- span(style="padding-left: 5px; color: #999;") Name / 권규비 ...
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-search")
        .flex-wrap
            button.inline.only-icon.gray.sm(@click="openCreateUser = true" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-person-add-fill")
            button.inline.only-icon.gray.sm
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-mark-email-unread-fill")
            button.inline.only-icon.gray.sm(@click.stop="(e) => { showDropDown(e); }" :class="{disabled: !Object.keys(checked).length || fetching}")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-more-vert")
                .moreVert(@click.stop style="--moreVert-right: 0; display: none; font-weight: normal;")
                    .inner
                        button.inline.icon-text.gray
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-supervisor-account-fill")
                            span Grant Access
                        button.inline.icon-text.gray(:class="{disabled: !Object.keys(checked).length || fetching}")
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-account-circle-fill")
                            span Unblock User
                        button.inline.icon-text.gray(:class="{disabled: !Object.keys(checked).length || fetching}")
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-no-accounts-fill")
                            span Block User
                        button.inline.icon-text.gray(:class="{disabled: !Object.keys(checked).length || fetching}")
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-delete")
                            span Delete User
            //- button.inline.only-icon.gray.sm(:class="{disabled: !Object.keys(checked).length || fetching}")
            //-     svg.svgIcon
            //-         use(xlink:href="@/assets/img/material-icon.svg#icon-supervisor-account-fill")
            //- button.inline.only-icon.gray.sm(:class="{disabled: !Object.keys(checked).length || fetching}")
            //-     svg.svgIcon
            //-         use(xlink:href="@/assets/img/material-icon.svg#icon-account-circle-fill")
            //- button.inline.only-icon.gray.sm(:class="{disabled: !Object.keys(checked).length || fetching}")
            //-     svg.svgIcon
            //-         use(xlink:href="@/assets/img/material-icon.svg#icon-no-accounts-fill")
            //- button.inline.only-icon.gray.sm(:class="{disabled: !Object.keys(checked).length || fetching}")
            //-     svg.svgIcon
            //-         use(xlink:href="@/assets/img/material-icon.svg#icon-delete")
    .userPart
        template(v-if="fetching")
            #loading.
                Loading ... &nbsp;
                #[.loader(style="--loader-color: black; --loader-size: 12px")]

        Table(
            :key="tableKey"
            :class="{ disabled: !user?.email_verified || currentService.service.active <= 0 }"
            resizable
            )
            template(v-slot:head)
                tr
                    th.fixed(style="width: 60px")
                        Checkbox(
                            @click.stop
                            :modelValue="!!Object.keys(checked).length"
                            @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.user_id] = d)); else checked = {}; }"
                            :class="{ nonClickable: !listDisplay || !listDisplay?.length }"
                            style="display: inline-block"
                        )
                        .resizer.fixed

                    template(v-for="c in columnList")
                        th.overflow(v-if="c.value", style="width: 200px")
                            | {{ c.name }}
                            .resizer

            template(v-slot:body)
                template(v-if="fetching")
                    tr(v-for="i in 10")
                        td(:colspan="colspan")
                template(v-else-if="!listDisplay || listDisplay.length === 0")
                    tr
                        td#noUsers(:colspan="colspan") No Users
                    tr(v-for="i in 9")
                        td(:colspan="colspan")
                template(v-else)
                    tr.hoverRow(v-for="(user, index) in listDisplay" @click="showDetail=true; selectedUser=user")
                        td
                            Checkbox(
                            @click.stop
                            :modelValue="!!checked?.[user?.user_id]"
                            @update:modelValue="(value) => { if (value) checked[user?.user_id] = value; else delete checked[user?.user_id]; }"
                            )

                        template(v-for="c in columnList")
                            template(v-if="c.value")
                            // customize the column
                            td.overflow(v-if="c.key === 'timestamp'") {{ new Date(user[c.key]).toLocaleString() }}
                            td.overflow(v-else-if="c.key === 'approved'") {{ user[c.key].split(':')[1].charAt(0).toUpperCase() + user[c.key].split(':')[1].slice(1) }}
                            td.overflow(v-else-if="c.key === 'locale'")
                                img(
                                :src="'https://flagcdn.com/' + user.locale.toLowerCase() + '.svg'",
                                style="width: 16px; object-fit: contain"
                                )
                            td.overflow(v-else-if="c.key === 'access_group'" :style="{color: user[c.key] < 0 ? 'var(--caution-color)' : null }") {{ Math.abs(user[c.key]) }} {{user[c.key] < 0 ? "(Disabled)" : "" }}
                            td.overflow(v-else-if="c.value") {{ user[c.key] || "-" }}

                    tr(v-for="i in 10 - listDisplay.length")
                        td(:colspan="colspan")

        form.detailRecord(:class="{show: showDetail}" @submit.prevent='upload')
            .header(style='padding-right:10px;')
                svg.svgIcon.black.clickable(@click="showDetail=false; selectedUser=null;" :class="{nonClickable: fetching}")
                    use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-back")
                .name {{ selectedUser?.name || selectedUser?.email || selectedUser?.user_id }}
                template(v-if="uploading")
                    .loader(style="--loader-color:blue; --loader-size:12px; margin: 12px;")
                template(v-else)
                    button.noLine.iconClick.square(type="submit" style='padding:0 14px') SAVE

            UserDetails(v-if='showDetail' :data='selectedUser')

// 1
//- Modal(:open="searchModalOpen" style="padding: 2.5rem 2rem;")
    .modal-close(@click="searchModalOpen = false;")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-close")

    .modal-title Search Users

    br

    .flex-wrap(style="gap:10px;")
        select#searchFor(
            v-model="searchFor",
            @change="getPage(true)",
            :disabled="fetching"
        )
            option(v-for="option in searchOptions" :value="option.value") {{ option.option }}
        input.inline(style="width:500px;" type="text")

    br

    .flex-wrap.end(style="gap:10px;")
        button.inline.gray Reset
        button.inline Search

// 2
//- Modal(:open="searchModalOpen" style="max-width: 560px; width: 100%;")
    .modal-prev(v-if="searchModalStep > 1" @click="searchModalStep--")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-back-ios")
    .modal-close(@click="searchModalOpen = false; searchModalStep = 1; searchFor = 'user_id'; searchValue = '';")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-close")

    .modal-title
        template(v-if="searchModalStep === 1") What do you want to search for...
        template(v-else) Search for {{ searchFor }}

    br

    .flex-wrap.center(v-if="searchModalStep === 1" style="max-width: 430px; gap:10px;")
        button.inline.gray(@click="searchFor = 'user_id'; searchModalStep++;") User ID
        button.inline.gray(@click="searchFor = 'email'; searchModalStep++;") Email
        button.inline.gray(@click="searchFor = 'name'; searchModalStep++;") Name
        button.inline.gray(@click="searchFor = 'phone_number'; searchModalStep++;") Phone Number
        button.inline.gray(@click="searchFor = 'address'; searchModalStep++;") Address
        button.inline.gray(@click="searchFor = 'gender'; searchModalStep++;") Gender
        button.inline.gray(@click="searchFor = 'birthdate'; searchModalStep++;") Birthdate
        button.inline.gray(@click="searchFor = 'locale'; searchModalStep++;") Locale
        button.inline.gray(@click="searchFor = 'timestamp'; searchModalStep++;") Date Created

    template(v-if="searchModalStep === 2")
        div(style="max-width: 430px; width: 100%; margin: 0 auto;")
            input.block(type="text" v-model="searchValue" :placeholder="searchFor === 'timestamp' ? 'YYYY-MM-DD ~ YYYY-MM-DD' : 'Search for...'")
        
        br

        .flex-wrap.end(style="gap:10px;")
            button.inline.gray Reset
            button.inline Search

// 3
Modal.search-modal(:open="searchModalOpen")
    //- form#searchForm(@submit.prevent="getPage(true)")
    form#searchForm(@submit.prevent)
        .top.flex-wrap
            #showSearchFor.search-for
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-search")
                span {{ searchFor + ' /' }}
            .search-input(:class="{'readonly': searchFor === 'timestamp' || searchFor === 'birthdate' || searchFor === 'locale'}")
                template(v-if="searchFor === 'timestamp' || searchFor === 'birthdate'")
                    input#searchInput.block(type="text" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" v-model="searchValue" name="date" readonly)
                    svg.svgIcon
                        use(xlink:href="@/assets/img/material-icon.svg#icon-calendar-today-fill")
                    //- Calendar(
                    //-     v-model="searchValue",
                    //-     :showCalendar="showCalendar",
                    //-     @close="showCalendar = false",
                    //-     alwaysEmit="true"
                    //- )
                template(v-else)
                    input#searchInput.block(type="text" v-model="searchValue" name="search")
        .bottom
            .tit Search for
            .flex-wrap.center(style="margin-bottom: 1.2rem")
                button.inline.gray(v-for="option in searchOptions" :key="option.value" :class="{'selected': searchFor === option.value }" @click="searchFor = option.value;") {{ option.option }}
            .key-desc.flex-wrap.center
                .key
                    span.name esc
                    span.action to close
        Calendar(v-if="searchFor === 'timestamp' || searchFor === 'birthdate'" :showCalendar="true" style="position:relative; width: 100%; margin:0")

Modal(:open="openCreateUser")
    .modal-close(@click="openCreateUser = false;")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-close")

    .modal-title Create User

    br

    form#createForm(@submit.prevent="createUser" style="text-align:left")
        input(hidden, name="service", :value="currentService.id")
        label User's Email
            em(style="color: red; font-size: 0.6rem") * Required
            input#email.block(
                type="email",
                @input="(e) => (createParams.email = e.target.value)",
                @keydown="(e) => moveFocus(e, 'password')",
                :disabled="promiseRunning",
                title="Please enter a valid email address.",
                placeholder="anonymous@anonymous.com",
                required
            )
        
        br

        label Password
            em(style="color: red; font-size: 0.6rem") * Required
            input#password.block(
                @input="(e) => (createParams.password = e.target.value)",
                @keydown="(e) => moveFocus(e, 'name')",
                :disabled="promiseRunning",
                placeholder="User's Password",
                type="Password",
                minlength="6",
                required
            )
        
        br

        label Name
            input#name.block(
                @input="(e) => (createParams.name = e.target.value)",
                @keydown="(e) => moveFocus(e, 'phone')",
                :disabled="promiseRunning",
                placeholder="User's Name"
            )

        br

        label Phone Number
            input#phone.block(
                @input="(e) => (createParams.phone_number = e.target.value)",
                @keydown="(e) => moveFocus(e, 'gender')",
                :disabled="promiseRunning",
                placeholder="User's Phone Number",
                type="text"
            )
        
        br

        .label
            label Gender
                input#gender.block(
                    @input="(e) => (createParams.gender = e.target.value)",
                    @keydown="(e) => moveFocus(e, 'address')",
                    :disabled="promiseRunning",
                    placeholder="User's Gender",
                    type="text"
                )
            Checkbox(v-model="gender_public") public
        
        br

        .label
            label Address
                input#address.block(
                    @input="(e) => (createParams.address = e.target.value)",
                    @keydown="(e) => moveFocus(e, 'birthdate')",
                    :disabled="promiseRunning",
                    placeholder="User's Address",
                    type="text"
                ) 
            Checkbox(v-model="address_public") public

        br

        .label
            label Birthdate
                input#birthdate.block(
                    @input="(e) => (createParams.birthdate = e.target.value)",
                    @keydown="(e) => moveFocus(e, 'picture')",
                    :disabled="promiseRunning",
                    placeholder="User's Birthdate (YYYY-MM-DD)",
                    type="text"
                )
            Checkbox(v-model="birthdate_public") public

        br

        label Picture
            input#picture.block(
                @input="(e) => (createParams.picture = e.target.value)",
                @keydown="(e) => moveFocus(e, 'profile')",
                :disabled="promiseRunning",
                placeholder="URL of the profile picture.",
                type="url"
            )

        br

        label Profile
            input#profile.block(
                @input="(e) => (createParams.profile = e.target.value)",
                @keydown="(e) => moveFocus(e, 'website')",
                :disabled="promiseRunning",
                placeholder="URL of the profile page",
                type="url"
            )

        br

        label Website
            input#website.block(
                @input="(e) => (createParams.website = e.target.value)",
                @keydown="(e) => moveFocus(e, 'nickname')",
                :disabled="promiseRunning",
                placeholder="URL of the website",
                type="url"
            )

        br

        label Nickname
            input#nickname.block(
                @input="(e) => (createParams.nickname = e.target.value)",
                @keydown="(e) => moveFocus(e, 'misc')",
                :disabled="promiseRunning",
                placeholder="Nickname of the user",
                type="text"
            )

        br

        label Misc
            input#misc.block(
                @input="(e) => (createParams.misc = e.target.value)",
                :disabled="promiseRunning",
                placeholder="Additional string value that can be used freely",
                type="text"
            )

        br

        .error(v-if="error")
            svg
                use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
            span {{ error }}

        br

        div(style="display: flex; align-items: center; justify-content: space-between")
            div(v-if="promiseRunning" style="width: 100%; height: 44px; text-align: center")
                .loader(style="--loader-color: white; --loader-size: 12px")
            template(v-else)
                //- button.inline.gray(type="button", @click="closeModal") Cancel
                //- button.inline(type="submit") Create
                button.block(type="submit") Create
</template>
<script setup lang="ts">
import Table from "@/components/table.vue";
import Select from "@/components/select.vue";
import Checkbox from "@/components/checkbox.vue";
import Modal from "@/components/modal.vue";
import Calendar from "@/components/calendar.vue";
import Locale from "@/components/locale.vue";
import Pager from "@/code/pager";

import { nextTick, reactive, ref, computed, watch, type Ref, onMounted, onUnmounted } from "vue";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { showDropDown } from "@/assets/js/event.js";
import { currentService, serviceUsers } from "@/views/service/main";
import { Countries } from "@/code/countries";
import { devLog } from "@/code/logger";
import UserDetails from './showDetail.vue'

onMounted(() => {
    document.addEventListener("keydown", closeSearchModal);
});

onUnmounted(() => {
    document.removeEventListener("keydown", closeSearchModal);
});

let closeSearchModal = (e) => {
    if (e.key === "Escape" && searchModalOpen.value) {
        searchModalOpen.value = false;
        searchModalStep.value = 1;
        searchFor.value = "user_id";
        searchValue.value = "";
    }
}

let pager: Pager = null;
let selectedUser = ref(null);

let searchFor: Ref<
    "timestamp"
    | "user_id"
    | "email"
    | "phone_number"
    | "address"
    | "gender"
    | "name"
    | "locale"
    | "birthdate"
> = ref("user_id");

let searchValue: Ref<string | number> = ref("");

// ui/ux related
let fetching = ref(false);
let maxPage = ref(0);
let currentPage: Ref<number> = ref(1);
let endOfList = ref(false);
let showCalendar = ref(false);
let showLocale = ref(false);
let hovering = ref(false);
let showDetail = ref(false);
let searchModalOpen = ref(false);
let searchModalStep = ref(1);

// document.addEventListener("")

let columnList = reactive([
    {
        name: "User ID",
        key: "user_id",
        value: true,
    },
    {
        name: "Email",
        key: "email",
        value: true,
    },
    {
        name: "Name",
        key: "name",
        value: true,
    },
    {
        name: "Access Group",
        key: "access_group",
        value: true,
    },
    {
        name: "Approval",
        key: "approved",
        value: true,
    },
    {
        name: "Date Created",
        key: "timestamp",
        value: false,
    },
    {
        name: "Phone Number",
        key: "phone_number",
        value: false,
    },
    {
        name: "Address",
        key: "address",
        value: false,
    },
    {
        name: "Locale",
        key: "locale",
        value: false,
    },
    {
        name: "Gender",
        key: "gender",
        value: false,
    },
    {
        name: "Birth Date",
        key: "birthdate",
        value: false,
    },
    {
        name: "Picture",
        key: "picture",
        value: false,
    },
    {
        name: "Profile",
        key: "profile",
        value: false,
    },
    {
        name: "Website",
        key: "website",
        value: false,
    },
    {
        name: "Nickname",
        key: "nickname",
        value: false,
    },
    {
        name: "Misc",
        key: "misc",
        value: true,
    },
]);

let searchOptions = [
    {
        option: "User ID",
        value: "user_id",
    },
    {
        option: "Email",
        value: "email",
    },
    {
        option: "Name",
        value: "name",
    },
    {
        option: "Phone Number",
        value: "phone_number",
    },
    {
        option: "Address",
        value: "address",
    },
    {
        option: "Gender",
        value: "gender",
    },
    {
        option: "Birth Date",
        value: "birthdate",
    },
    {
        option: "Locale",
        value: "locale",
    },
    {
        option: "Date Created",
        value: "timestamp",
    },
];
let uploading = ref(false);

let upload = async (e: SubmitEvent) => {
    uploading.value = true;

    try {
        let att = await currentService.updateUserAttribute(e);
        console.log(att);

        for (let k in att.attributes) {
            selectedUser.value[k] = att.attributes[k];
        }

        let sel: any = {};
        for (let k in selectedUser.value) {
            sel[k] = selectedUser.value[k];
        }

        await pager.editItem(sel);

        getPage();

        selectedUser.value = null;
        showDetail.value = false;
    } catch (err: any) {
        alert(err.message);
        throw err;
    } finally {
        uploading.value = false;
    }
};

let checked: Ref<{ [key: string]: any }> = ref({});
function checkall() {
    if (Object.keys(checked.value).length) {
        checked.value = {};
    } else {
        listDisplay.value.forEach((user) => {
            checked.value[user.record_id] = user;
        });
    }
}
let colspan = 0;
let tableKey = ref(0);

watch(
    columnList,
    (nv) => {
        colspan = 1;
        nv.forEach((c) => {
            if (c.value) {
                colspan++;
            }
        });

        tableKey.value++;
    },
    { immediate: true }
);

watch(showDetail, (nv) => {
    if (nv) {
        nextTick(() => {
            let scrollTarget = document.querySelector(".detailRecord .content");
            let detailRecord = document.querySelector(".detailRecord");
            let targetTop = window.scrollY + detailRecord.getBoundingClientRect().top;
            scrollTarget.scrollTop = 0;
            window.scrollTo(0, targetTop);
        });
    }
});

// modal related
let promiseRunning = ref(false);
let openInviteUser = ref(false);
let openCreateUser = ref(false);
let openBlockUser = ref(false);
let openUnblockUser = ref(false);
let openDeleteUser = ref(false);
let openUpgrade = ref(false);
let openGrantAccess = ref(false);
let successGrantAccess = ref(false);
let gender_public = ref(false);
let address_public = ref(false);
let birthdate_public = ref(false);
let createParams = {
    email: "",
    name: "",
    password: "",
    phone_number: "",
    gender: "",
    address: "",
    birthdate: "",
    picture: "",
    profile: "",
    website: "",
    nickname: "",
    misc: "",
};
let inviteParams = {
    email: "",
    name: "",
};
let redirect = "";
let error = ref("");

// list renderer
let listDisplay = ref(null);

// call getPage when currentPage changes
watch(currentPage, (n, o) => {
    if (
        n !== o &&
        n > 0 &&
        (n <= maxPage.value || (n > maxPage.value && !endOfList.value))
    ) {
        getPage();
    } else {
        currentPage.value = o;
    }
});

watch(fetching, (n) => {
    if (n && showCalendar.value) {
        showCalendar.value = false;
    }
});

watch(searchFor, (n, o) => {
    if (n) {
        nextTick(() => {
            let inputElement = document.querySelector("#searchInput");
            let showSearchFor = document.querySelector("#showSearchFor");

            if (!inputElement || !showSearchFor) {
                return;
            }

            let gcr = showSearchFor.getBoundingClientRect().width || 98;

            inputElement.style.paddingLeft = `${gcr + 7}px`;
            inputElement.focus();
        });
    }
    if (n !== o) {
        searchValue.value = "";
    }
}, {
    immediate: true
});

// computed fetch params
let callParams = computed(() => {
    let dates = searchValue.value.split("~").map((d) => d.trim());
    let result = {};

    switch (searchFor.value) {
        case "timestamp":
            let startDate = dates?.[0]
                ? new Date(new Date(dates[0]).setHours(0, 0, 0, 0)).getTime()
                : 0;
            let endDate = dates?.[1]
                ? new Date(new Date(dates[1]).setHours(23, 59, 59, 999)).getTime()
                : "";

            if (startDate && endDate) {
                result = {
                    service: currentService.id,
                    searchFor: searchFor.value,
                    value: startDate,
                    range: endDate,
                };
            } else if (startDate || endDate) {
                result = {
                    service: currentService.id,
                    searchFor: searchFor.value,
                    value: startDate ? startDate : endDate,
                    condition: startDate ? ">=" : "<=",
                };
            } else {
                result = {
                    service: currentService.id,
                    searchFor: searchFor.value,
                    value: new Date().getTime(),
                    condition: "<=",
                };
            }

            break;

        case "user_id":
        case "email":
        case "phone_number":
            result = {
                service: currentService.id,
                searchFor: searchFor.value,
                value: searchValue.value,
                condition: "=",
            };

            break;

        case "birthdate":
            let start = dates?.[0];
            let end = dates?.[1];

            if (start && end) {
                result = {
                    service: currentService.id,
                    searchFor: searchFor.value,
                    value: start,
                    range: end,
                };
            } else if (start || end) {
                result = {
                    service: currentService.id,
                    searchFor: searchFor.value,
                    value: start ? start : end,
                    condition: start ? ">=" : "<=",
                };
            }

            break;

        default:
            result = {
                service: currentService.id,
                searchFor: searchFor.value,
                value: searchValue.value,
                condition: ">=",
            };
    }

    return result;
});

let getPage = async (refresh?: boolean) => {
    // if (!pager) {
    //     return;
    // }

    if (refresh) {
        endOfList.value = false;
        currentPage.value = 1;
    }

    if (!serviceUsers[currentService.id] || searchValue.value) {
        serviceUsers[currentService.id] = await Pager.init({
            id: "user_id",
            resultsPerPage: 10,
            sortBy: !searchValue.value ? "timestamp" : callParams.value.searchFor,
            order: !searchValue.value ? "desc" : "asc",
        });
    }

    pager = serviceUsers[currentService.id];

    if ((!refresh && maxPage.value >= currentPage.value) || endOfList.value) {
        listDisplay.value = pager.getPage(currentPage.value).list;
        return;
    } else if (!endOfList.value || refresh) {
        fetching.value = true;

        if (!searchValue.value) {
            callParams.value.searchFor = "timestamp";
            callParams.value.value = new Date().getTime();
            callParams.value.condition = "<=";
        }

        // devLog({callParams.value})

        let fetchedData = await skapi
            .getUsers(callParams.value, {
                fetchMore: !refresh,
                ascending: !searchValue.value ? false : true,
            })
            .catch((err) => {
                fetching.value = false;
                alert(err);
            });

        // devLog({fetchedData})

        // save endOfList status
        serviceUsers[currentService.id].endOfList = fetchedData.endOfList;
        endOfList.value = serviceUsers[currentService.id].endOfList;

        // insert data in pager
        if (fetchedData.list.length > 0) {
            await pager.insertItems(fetchedData.list);
        }

        // get page from pager
        updateListDisplay();
        fetching.value = false;
    }
};

let init = async () => {
    currentPage.value = 1;

    // setup pagers
    if (
        serviceUsers[currentService.id] &&
        Object.keys(serviceUsers[currentService.id]).length
    ) {
        pager = serviceUsers[currentService.id];
        endOfList.value = serviceUsers[currentService.id].endOfList;

        let disp = pager.getPage(currentPage.value);
        maxPage.value = disp.maxPage;
        listDisplay.value = disp.list;
    } else {
        serviceUsers[currentService.id] = pager;
        getPage(true);
    }
};

init();

let moveFocus = (e: any, next: string) => {
    if (e.key == "Enter") {
        e.preventDefault();

        if (e.target.id == "email" || e.target.id == "inviteUserEmail") {
            if (!e.target.value) {
                alert("email is required");
                return false;
            } else {
                let email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
                if (!email_regex.test(e.target.value)) {
                    alert("Please enter it in e-mail format");
                    return false;
                }
            }
        } else if (e.target.id == "password") {
            if (!e.target.value) {
                alert("password is required");
                return false;
            } else {
                if (e.target.value.length < 6 || e.target.value.length > 60) {
                    alert("Min 6 characters and Max 60 characters");
                    return false;
                }
            }
        } else if (e.target.id == "inviteUserName") {
            if (!e.target.value) {
                alert("name is required");
                return false;
            }
        }

        let scrollTarget = e.target.parentElement.parentElement.parentElement;

        if (
            scrollTarget.getBoundingClientRect().height < scrollTarget.scrollHeight
        ) {
            scrollTarget.scrollTop += 70;
        }

        document.getElementById(next).focus();
    }
};

let createUser = () => {
    promiseRunning.value = true;
    error.value = "";

    if (gender_public.value || address_public.value || birthdate_public.value) {
        Object.assign(
            createParams,
            {
                gender_public: gender_public.value,
                address_public: address_public.value,
                birthdate_public: birthdate_public.value,
            }
        );
    }

    currentService
        .createAccount(createParams, {
            // email_subscription: redirect || false,
        })
        .then(async (res) => {
            res.email = res.email_admin;
            await pager.insertItems([res]);

            let disp = pager.getPage(currentPage.value);
            maxPage.value = disp.maxPage;
            listDisplay.value = disp.list;

            document.getElementById("createForm").reset();
            for (let i in createParams) {
                createParams[i] = "";
            }
            redirect = "";
            gender_public.value = false;
            address_public.value = false;
            birthdate_public.value = false;
            openCreateUser.value = false;
            promiseRunning.value = false;
            getPage();
        })
        .catch((err) => {
            promiseRunning.value = false;
            // error.value = err.message;
            alert(err.message);
        });
};

let inviteUser = () => {
    promiseRunning.value = true;
    error.value = "";

    let options = {};
    if (redirect) {
        options.confirmation_url = redirect;
    }

    currentService
        .inviteUser(inviteParams, options)
        .then((res) => {
            promiseRunning.value = false;
            openInviteUser.value = false;

            let successMessage = `Invitation E-Mail has been sent to: "${inviteParams.email}". Invited users will be listed once they accept their invitation.`;
            alert(successMessage);

            document.getElementById("inviteForm").reset();
            for (let i in inviteParams) {
                inviteParams[i] = "";
            }
            redirect = "";
        })
        .catch((err) => {
            promiseRunning.value = false;
            // error.value = err.message;
            alert(err.message);
        });
};

let changeUserApprovalState = async (state: string) => {
    promiseRunning.value = true;

    let user_ids = Object.keys(checked.value);

    let promise = user_ids.map(user_id => {
        let selectedUser = pager.list[user_id];
        let original_approved_info = selectedUser.approved.split(":");
        let original_approver = original_approved_info[0];
        let original_approved_status = original_approved_info[1];

        if (state == "block") {
            if (original_approved_status == "suspended") {
                // This user is already blocked.
                return;
            }

            return currentService.blockAccount(user_id).then(() => {
                selectedUser.approved = `${original_approver}:suspended:` + new Date().getTime();
                return pager.editItem(selectedUser);
            })
        }

        else if (state == "unblock") {
            if (original_approved_status != "suspended") {
                // This user is not blocked.
                return;
            }

            return currentService.unblockAccount(user_id).then(() => {
                selectedUser.approved = `${original_approver}:approved:` + new Date().getTime();
                return pager.editItem(selectedUser);
            })
        }
    });

    await Promise.all(promise).then(() => {
        checked.value = {};
        updateListDisplay();
        promiseRunning.value = false;
        openBlockUser.value = false;
        openUnblockUser.value = false;
    }).catch((e) => {
        promiseRunning.value = false;
        alert(e.message);
    });
};

let updateListDisplay = () => {
    let disp = pager.getPage(currentPage.value);
    maxPage.value = disp.maxPage;
    listDisplay.value = disp.list;
    while (
        disp.maxPage > 0 &&
        disp.maxPage < currentPage.value &&
        !disp.list.length
    ) {
        currentPage.value--;
    }
}

let deleteUser = () => {
    promiseRunning.value = true;

    let userToDel = Object.keys(checked.value);
    let promises: Array<Promise<any>> = [];
    userToDel.forEach((u) => {
        console.log({ u })
        promises.push(currentService.deleteAccount(u).then(async () => {
            await pager.deleteItem(u);
        }));
    });

    Promise.all(promises).then(() => {
        checked.value = {};
        updateListDisplay();
        promiseRunning.value = false;
        openDeleteUser.value = false;
    }).catch((e) => {
        promiseRunning.value = false;
        alert(e.message);
    });

};

let closeModal = () => {
    if (openInviteUser.value) {
        document.getElementById("inviteForm").reset();
        openInviteUser.value = false;
    } else if (openCreateUser.value) {
        document.getElementById("createForm").reset();
        for (let i in createParams) {
            createParams[i] = "";
        }
        gender_public.value = false;
        address_public.value = false;
        birthdate_public.value = false;
        openCreateUser.value = false;
    }
};

let grantAccess = async () => {
    promiseRunning.value = true;

    let inputAccess: HTMLInputElement = document.querySelector(".change-access");
    let resultAccess = Number(inputAccess.value);

    if (resultAccess < 1 || resultAccess > 99) {
        promiseRunning.value = false;
        inputAccess.value = "";
        alert("Access group should be between 1 and 99");
        return;
    }

    let user_ids = Object.keys(checked.value);
    let promises: Array<Promise<any>> = [];

    user_ids.forEach((u) => {
        promises.push(
            currentService.grantAccess({ user_id: u, access_group: resultAccess }).then(() => {
                pager.list[u].access_group = resultAccess;
                pager.editItem(pager.list[u]);
            })
        );
    });

    await Promise.all(promises).then(() => {
        inputAccess.value = "";
        updateListDisplay();
        openGrantAccess.value = false;
        successGrantAccess.value = true;
    }).catch((e) => {
        alert(e.message);
    }).finally(() => {
        promiseRunning.value = false;
    });
};

let closeGrantAccess = () => {
    let inputAccess: HTMLInputElement = document.querySelector(".change-access");

    openGrantAccess.value = false;

    if (inputAccess) {
        inputAccess.value = "";
    }
};
</script>
<style scoped lang="less">
body {
    font-family: "Twemoji Country Flags", "Radio Canada", sans-serif;
}

#calendar,
#localeSelector {
    position: absolute;
    right: 0;
    top: 100%;
    max-width: 100%;
    margin-top: 8px;
    z-index: 1;
}

#createForm {
    .label {
        position: relative;

        ._checkbox {
            position: absolute;
            top: 0;
            right: 0;
        }
    }
}

.tableMenu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // flex-direction: row-reverse;

    &>* {
        margin: 8px 0;
    }
}

.userPart {
    position: relative;
    overflow: hidden;
}

#loading {
    position: absolute;
    top: 60px;
    left: 20px;
    height: 60px;
    z-index: 2;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    font-size: 0.8rem;
}

.optionCol {
    &>*:not(:last-child) {
        margin-right: 8px;
    }
}

.iconClick.arrow {
    padding: 0;
    font-size: 0.8rem;
}

.iconClick.deact {
    color: rgba(0, 0, 0, 0.5);

    &::before {
        box-shadow: unset !important;
    }

    svg {
        fill: rgba(0, 0, 0, 0.5);
    }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}

tbody {
    td {
        .click {
            position: relative;
            color: var(--main-color);
            font-weight: 500;

            &::after {
                position: absolute;
                content: "copied!";
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                border-radius: 4px;
                text-align: center;
                background-color: var(--main-color);
                color: #fff;
                display: none;
            }

            &:hover {
                text-decoration: underline;
                cursor: pointer;
            }

            &.clicked {
                &::after {
                    display: block;
                }
            }
        }
    }
}
</style>