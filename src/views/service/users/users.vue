<template lang="pug">
section.page-header
    .page-title Users
    a.btn-docs(href='https://docs.skapi.com/authentication/create-account.html' target="_blank")
        button.inline.icon-text.sm.gray
            img(src="@/assets/img/landingpage/icon_docs.svg")
            | Go Docs

hr

section
    .error(v-if="!user?.email_verified")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-warning")
        router-link(to="/account-setting") Please verify your email address to modify settings.

    .error(v-else-if="currentService.service.active == 0")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-warning")
        span This service is currently disabled.

    .error(v-else-if="currentService.service.active < 0")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-warning")
        span This service is currently suspended.

section
    .table-menu-wrap
        .table-functions
            button.inline.only-icon.gray(@click.stop="(e) => { showDropDown(e); }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/material-icon.svg#icon-columns")
                    template(v-slot:tip) Show Columns
                .moreVert(
                    @click.stop,
                    style="--moreVert-left: 0; display: none; font-weight: normal;"
                    )
                    .inner
                        template(v-for="c in columnList")
                            Checkbox(v-model="c.value") {{ c.name }}
            .search-ing-btn(v-if="searchValue && !searchModalOpen")
                span.search-for-value(@click="searchModalOpen = true") {{ searchFor }} / {{ searchValue }} ...
                svg.svgIcon.reset-btn(@click="resetSearchModal")
                    use(xlink:href="@/assets/img/material-icon.svg#icon-x-circle")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-search")
            button.inline.only-icon.gray.sm.search-btn(v-else @click="searchModalOpen = true" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/material-icon.svg#icon-search")
                    template(v-slot:tip) Search
            button.inline.only-icon.gray.sm(@click="getPage(true)" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/material-icon.svg#icon-refresh")
                    template(v-slot:tip) Refresh
        .table-actions
            button.inline.only-icon.gray.sm(@click="openCreateUser = true" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/material-icon.svg#icon-plus")
                    template(v-slot:tip) Create User
            button.inline.only-icon.gray.sm(@click="currentService.plan == 'Trial' ? (openUpgrade = true) : (openInviteUser = true)" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0, deact: currentService.plan == 'Trial' }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/material-icon.svg#icon-mail")
                    template(v-slot:tip) Invite User
            button.inline.only-icon.gray.sm(@click.stop="(e) => { showDropDown(e); }" :class="{disabled: !Object.keys(checked).length || fetching}")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/material-icon.svg#icon-more-vertical")
                    template(v-slot:tip) More Actions
                .moreVert(@click.stop style="--moreVert-right: 0; display: none; font-weight: normal;")
                    .inner
                        button.inline.icon-text.gray(@click="openGrantAccess = true" :class="{disabled: !Object.keys(checked).length || fetching}")
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-users")
                            span Grant Access
                        button.inline.icon-text.gray(@click="openUnblockUser=true" :class="{disabled: !Object.keys(checked).length || fetching}")
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-user")
                            span Unblock User
                        button.inline.icon-text.gray(@click="openBlockUser=true" :class="{disabled: !Object.keys(checked).length || fetching}" style="width:100%; justify-content: flex-start;")
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-user-x")
                            span Block User
                        button.inline.icon-text.gray(@click="openDeleteUser=true" :class="{disabled: !Object.keys(checked).length || fetching}" style="width:100%; justify-content: flex-start;")
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-delete")
                            span Delete User

    Table(:key="tableKey" :class="{ disabled: !user?.email_verified || currentService.service.active <= 0 }" resizable)
        template(v-if="fetching" v-slot:msg)
            .tableMsg.center
                .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
            .tableMsg.center.empty No Users

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
            template(v-if="fetching || !listDisplay || listDisplay.length === 0")
                tr.nohover(v-for="i in 10")
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

                tr.nohover(v-for="i in 10 - listDisplay.length")
                    td(:colspan="colspan")

    .table-page-wrap
        button.inline.only-icon.gray(@click="currentPage--;" :class="{ disabled: fetching || currentPage <= 1 }")
            .icon
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-chevron-left")
        button.inline.only-icon.gray(@click="currentPage++;" :class="{ disabled: fetching || endOfList && currentPage >= maxPage }")
            .icon
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-chevron-right")

// 1
//- Modal(:open="searchModalOpen" style="padding: 2.5rem 2rem;")
    .modal-close(@click="searchModalOpen = false;")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

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
            use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-left")
    .modal-close(@click="searchModalOpen = false; searchModalStep = 1; searchFor = 'user_id'; searchValue = '';")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

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
    .modal-close(@click="searchModalOpen = false; searchModalStep = 1; searchFor = 'user_id'; searchValue = '';")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

    .top
        #showSearchFor.search-for
            svg.svgIcon
                use(xlink:href="@/assets/img/material-icon.svg#icon-x-circle")
            span {{ searchFor + ' /' }}
        .search-input(:class="{'readonly': searchFor === 'timestamp' || searchFor === 'birthdate' || searchFor === 'locale'}")
            template(v-if="searchFor === 'timestamp' || searchFor === 'birthdate'")
                input#searchInput.block(type="text" spellcheck="false" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" v-model="searchValue" name="date" readonly)
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-calendar")
            template(v-if="searchFor === 'locale'")
                input#searchInput.block(type="text" spellcheck="false" placeholder="2 digit country code e.g. KR" v-model="searchValue" name="locale" readonly)
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-drop-down") 
            template(v-else-if="searchFor === 'user_id'")
                input#searchInput.block(type="search" spellcheck="false" placeholder="xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" v-model="searchValue" name="user_id" @input="(e) => { e.target.setCustomValidity(''); }" pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")
            template(v-else-if="searchFor === 'email'")
                input#searchInput.block(type="email" spellcheck="false" placeholder="user@email.com" v-model="searchValue" name="email" minlength="5")
            template(v-else-if="searchFor === 'name'")
                input#searchInput.block(type="text" spellcheck="false" placeholder="User's Name" v-model="searchValue" name="name")
            template(v-else-if="searchFor === 'phone_number'")
                input#searchInput.block(type="text" spellcheck="false" placeholder="+821012345678" v-model="searchValue")
            template(v-else-if="searchFor === 'address'")
                input#searchInput.block(type="text" spellcheck="false" placeholder="Seoul, South Korea" v-model="searchValue" name="address")
            template(v-else-if="searchFor === 'gender'")
                input#searchInput.block(type="text" spellcheck="false" placeholder="Gender" v-model="searchValue" name="gender")
    .bottom
        .tit Search for
        .flex-wrap.center(style="margin-bottom: 1.5rem")
            button.inline.gray(v-for="option in searchOptions" :key="option.value" :class="{'selected': searchFor === option.value }" @click="searchFor = option.value;") {{ option.option }}
        .key-desc.flex-wrap.center
            .key
                span.name enter
                span.action search
            .key
                span.name esc
                span.action to close
    Calendar(v-if="searchFor === 'timestamp' || searchFor === 'birthdate'" v-model="searchValue" :showCalendar="true" alwaysEmit="true")
    Locale(v-if="searchFor === 'locale'" v-model="searchValue" :showLocale="true")

// modal :: create user
Modal.modal-scroll.modal-createUser(:open="openCreateUser")
    .modal-close(@click="openCreateUser = false;")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

    .modal-title Create User

    form#createForm.modal-body(@submit.prevent="createUser")
        input(hidden, name="service", :value="currentService.id")

        span.txt-required * required

        label 
            span.label.required Email
            input#email.block(
                type="email",
                @input="(e) => (createParams.email = e.target.value)",
                @keydown="(e) => moveFocus(e, 'password')",
                :disabled="promiseRunning",
                title="Please enter a valid email address.",
                placeholder="User's Email (user@email.com)",
                required
            )
        
        br

        label 
            span.label.required Password
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
                placeholder="User's Phone Number (+821012345678)",
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
                use(xlink:href="@/assets/img/material-icon.svg#icon-warning")
            span {{ error }}

        br

        .modal-footer(style="padding-bottom: 0;")
            template(v-if="promiseRunning")
                .loader(style="--loader-color: white; --loader-size: 12px; margin: 12px;")
            template(v-else)
                button.btn-create(type="submit") Create

// modal :: invite user
Modal.modal-inviteUser(:open="openInviteUser", @close="openInviteUser = false")
    .modal-close(@click="openInviteUser = false")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

    .modal-title Invite User

    .modal-desc
        | Invitation Email includes a temporary password and the acception link. 
        br
        | User must accept the invitation within 7 days.
        br
        | For more information, refer:&nbsp;#[a(href="https://docs.skapi.com/email/email-templates.html", target="_blank", style="white-space: nowrap") E-Mail Templates]

    form#inviteForm(@submit.prevent="inviteUser")
        input(hidden, name="service", :value="currentService.id")

        label.flex
            span.label.required User's Email
            input#inviteUserEmail.big(
            type="email"
            @input="(e) => (inviteParams.email = e.target.value)"
            @keydown="(e) => moveFocus(e, 'inviteUserName')"
            title="Please enter a valid email address."
            placeholder="anonymous@anonymous.com"
            required
            )
        br

        label.flex
            span.label.required Name
            input#inviteUserName.big(
            @input="(e) => (inviteParams.name = e.target.value)"
            @keydown="(e) => moveFocus(e, 'inviteUserURL')"
            placeholder="User's Name"
            required
            )

        br

        label.flex
            span.label Redirect URL
            input#inviteUserURL.big(
                @input="(e) => (redirect = e.target.value)"
                placeholder="URL to redirect when accepted. (optional)"
                type="url"
                )

        br

        .error(v-if="error")
            svg
                use(xlink:href="@/assets/img/material-icon.svg#icon-warning")
            span {{ error }}

        .modal-btns
            .loader-wrap(v-if="promiseRunning")
                .loader(style="--loader-color: white; --loader-size: 12px")
            template(v-else)
                //- button.gray(type="button" @click="closeModal") Cancel
                //- button(type="submit") Invite
                button.block.btn-invite(type="submit") Invite

//- modal :: grant access
Modal.modal-grantAccess(:open="openGrantAccess" @close="closeGrantAccess")
    .modal-close(@click="closeGrantAccess")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

    .modal-title Grant Access

    .modal-desc This will grant {{Object.keys(checked).length}} user(s) to a new access group. #[br] Access group can be granted from 1 to 99.

    input.change-access(
        type="number"
        placeholder="1~99"
        min=1
        max=99
        @keyup.stop="(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }"
        style="width: 100%;"
    )

    .modal-btns
        .loader-wrap(v-if="promiseRunning")
            .loader(style="--loader-color: white; --loader-size: 12px")
        template(v-else)
            //- button.gray.btn-cancel(type="button", @click="closeGrantAccess" style="flex: 1;") Cancel
            button.block.btn-grant(type="button", @click="grantAccess" style="flex: 1;") Change Access

// grant access > success
Modal.modal-grantSuccess(:open="successGrantAccess", @close="successGrantAccess = false")
  .modal-title Grant Access

  .modal-desc New access group has been granted to {{Object.keys(checked).length}} user(s).

  .modal-btns
    button.block.btn-cancel(type="button", @click="()=>{checked.value = {};successGrantAccess = false;}") close

//- modal :: unblock user
Modal(:open="openUnblockUser", @close="openUnblockUser = false")
  .modal-title Unblock User

  .modal-desc This action will unblock {{Object.keys(checked).length}} user(s) from your service.  #[br] The user will have access to your service.

  .modal-btns
    .loader-wrap(v-if="promiseRunning")
      .loader(style="--loader-color: white; --loader-size: 12px")
    template(v-else)
      button.gray.btn-cancel(type="button" @click="openUnblockUser = false;") Cancel
      button.btn-unblock(type="button" @click="changeUserApprovalState('unblock')") Unblock

//- modal :: block user
Modal(:open="openBlockUser", @close="openBlockUser = false")
  .modal-title Block User

  .modal-desc This action will block {{Object.keys(checked).length}} user(s) from your service. #[br] The user will not be able to access your service anymore.

  .modal-btns
    .loader-wrap(v-if="promiseRunning")
      .loader(style="--loader-color: white; --loader-size: 12px")
    template(v-else)
      button.gray.btn-cancel(type="button" @click="openBlockUser = false;") Cancel
      button.btn-block(type="button", @click="changeUserApprovalState('block')") Block

//- modal :: delete user
Modal(:open="openDeleteUser", @close="openDeleteUser = false")
  .modal-title(style="color: var(--caution-color)") Delete User

  .modal-desc This action will delete {{Object.keys(checked).length}} user(s) from your service. #[br] All the user's data will be deleted. #[br] This action cannot be undone.

  .modal-btns
    .loader-wrap(v-if="promiseRunning")
      .loader(style="--loader-color: white; --loader-size: 12px")
    template(v-else)
      button.gray.btn-cancel(type="button" @click="openDeleteUser = false;") Cancel
      button.red.btn-delete(type="button", @click="deleteUser") Delete

//- modal :: upgrade service
Modal(:open="openUpgrade", @close="openUpgrade = false")
  .modal-title Upgrade

  .modal-desc You can access more features like sending newsletters, #[br] inviting users and file hosting by upgrading your service. #[br]Would you like you check out our service plans?

  .modal-btns
    button.gray.btn-cancel(type="button", @click="openUpgrade = false") No
    router-link(:to="`/subscription/${currentService.id}`" style="display: inline-block; width: 100%")
      button.btn-upgrade(type="button") Yes

//- modal :: show user detail
Modal.modal-scroll.modal-detailUser(:open="showDetail" @close="closeModalUser")
    form.modal-container(@submit.prevent='upload')
        .modal-header
            .title {{ selectedUser?.name || selectedUser?.email || selectedUser?.user_id }}
            button.btn-close(type="button" @click="closeModalUser")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-x")
        .modal-body
            UserDetails(v-if='showDetail' :data='selectedUser')
        .modal-footer
            template(v-if="uploading")
                .loader(style="--loader-color:white; --loader-size:12px; margin: 12px;")
            template(v-else)
                button.btn-save(type="submit") SAVE
</template>
<script setup lang="ts">
import Table from "@/components/table.vue";
import Select from "@/components/select.vue";
import Checkbox from "@/components/checkbox.vue";
import Modal from "@/components/modal.vue";
import Calendar from "@/components/calendar.vue";
import Locale from "@/components/locale.vue";
import Pager from "@/code/pager";

import {
    nextTick,
    reactive,
    ref,
    computed,
    watch,
    type Ref,
    onMounted,
    onUnmounted,
} from "vue";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { showDropDown } from "@/assets/js/event.js";
import { currentService, serviceUsers } from "@/views/service/main";
import { Countries } from "@/code/countries";
import { devLog } from "@/code/logger";
import UserDetails from "./showDetail.vue";
import Tooltip from "@/components/tooltip.vue";

onMounted(() => {
    document.addEventListener("keydown", handleSearchModal);
});

onUnmounted(() => {
    document.removeEventListener("keydown", handleSearchModal);
});

function handleSearchModal(e: KeyboardEvent) {
    if (!searchModalOpen.value) return;

    if (e.key === "Escape") {
        resetSearchModal();
    }

    if (e.key === "Enter") {
        e.preventDefault();

        // input 유효성 검사
        const inputEl = document.querySelector(
            "#searchInput"
        ) as HTMLInputElement;
        if (inputEl && !inputEl.checkValidity()) {
            inputEl.reportValidity(); // 브라우저 기본 alert
            return; // 검색 실행하지 않음
        }

        searchModalOpen.value = false;
        getPage(true);
    }
}

function resetSearchModal() {
    searchModalOpen.value = false;
    searchFor.value = "user_id";
    searchValue.value = "";
    currentPage.value = 1;
    getPage(true);
}

let pager: Pager = null;
let selectedUser = ref(null);

let searchFor: Ref<
    | "timestamp"
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

// watch(showDetail, (nv) => {
//     if (nv) {
//         nextTick(() => {
//             let scrollTarget = document.querySelector(".detailRecord .content");
//             let detailRecord = document.querySelector(".detailRecord");
//             let targetTop =
//                 window.scrollY + detailRecord.getBoundingClientRect().top;
//             scrollTarget.scrollTop = 0;
//             window.scrollTo(0, targetTop);
//         });
//     }
// });

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

watch(
    searchFor,
    (n, o) => {
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
    },
    {
        immediate: true,
    }
);

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
                ? new Date(
                    new Date(dates[1]).setHours(23, 59, 59, 999)
                ).getTime()
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

    if (!serviceUsers[currentService.id] || searchValue.value || refresh) {
        serviceUsers[currentService.id] = await Pager.init({
            id: "user_id",
            resultsPerPage: 10,
            sortBy: !searchValue.value
                ? "timestamp"
                : callParams.value.searchFor,
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

        // devLog({ callParams: callParams.value });

        let fetchedData = await skapi
            .getUsers(callParams.value, {
                fetchMore: !refresh,
                ascending: !searchValue.value ? false : true,
            })
            .catch((err) => {
                fetching.value = false;
                alert(err);
            });

        // devLog({ fetchedData })

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
                let email_regex =
                    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
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
            scrollTarget.getBoundingClientRect().height <
            scrollTarget.scrollHeight
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
        Object.assign(createParams, {
            gender_public: gender_public.value,
            address_public: address_public.value,
            birthdate_public: birthdate_public.value,
        });
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

    let promise = user_ids.map((user_id) => {
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
                selectedUser.approved =
                    `${original_approver}:suspended:` + new Date().getTime();
                return pager.editItem(selectedUser);
            });
        } else if (state == "unblock") {
            if (original_approved_status != "suspended") {
                // This user is not blocked.
                return;
            }

            return currentService.unblockAccount(user_id).then(() => {
                selectedUser.approved =
                    `${original_approver}:approved:` + new Date().getTime();
                return pager.editItem(selectedUser);
            });
        }
    });

    await Promise.all(promise)
        .then(() => {
            checked.value = {};
            updateListDisplay();
            promiseRunning.value = false;
            openBlockUser.value = false;
            openUnblockUser.value = false;
        })
        .catch((e) => {
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
};

let deleteUser = () => {
    promiseRunning.value = true;

    let userToDel = Object.keys(checked.value);
    let promises: Array<Promise<any>> = [];
    userToDel.forEach((u) => {
        console.log({ u });
        promises.push(
            currentService.deleteAccount(u).then(async () => {
                await pager.deleteItem(u);
            })
        );
    });

    Promise.all(promises)
        .then(() => {
            checked.value = {};
            updateListDisplay();
            promiseRunning.value = false;
            openDeleteUser.value = false;
        })
        .catch((e) => {
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

    let inputAccess: HTMLInputElement =
        document.querySelector(".change-access");
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
            currentService
                .grantAccess({ user_id: u, access_group: resultAccess })
                .then(() => {
                    pager.list[u].access_group = resultAccess;
                    pager.editItem(pager.list[u]);
                })
        );
    });

    await Promise.all(promises)
        .then(() => {
            inputAccess.value = "";
            updateListDisplay();
            openGrantAccess.value = false;
            successGrantAccess.value = true;
        })
        .catch((e) => {
            alert(e.message);
        })
        .finally(() => {
            promiseRunning.value = false;
        });
};

let closeGrantAccess = () => {
    let inputAccess: HTMLInputElement =
        document.querySelector(".change-access");

    openGrantAccess.value = false;

    if (inputAccess) {
        inputAccess.value = "";
    }
};

const closeModalUser = () => {
    showDetail.value = false;
    selectedUser.value = null;
};
</script>
<style scoped lang="less">
body {
    font-family: "Twemoji Country Flags", "Radio Canada", sans-serif;
}

.label {
    position: relative;
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
            height: 1.875rem;
            line-height: 1.875rem;

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

@media (max-width: 768px) {
    .modal-close {
        z-index: 9999;
        position: relative;
        left: initial;
        bottom: initial;
        top: 0;
        right: 0;
        margin-bottom: 0.5rem;
        margin-left: auto;

        .btn-close {
            padding: 0;
            background: transparent;
            height: 100%;
            min-height: 100%;
        }
    }
}
</style>
