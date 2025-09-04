<template lang="pug">
section.page-header
    .page-title Bulk Email
    a.btn-docs(href='https://docs.skapi.com/email/newsletters.html' target="_blank")
        button.inline.icon-text.sm.gray(style="height: 100%;")
            img(src="@/assets/img/landingpage/icon_docs.svg" alt="Documentation Icon")
            | Go Docs

hr

template(v-if='needsEmailAlias')
    section
        .error(v-if='!user?.email_verified')
            svg
                use(xlink:href="/material-icon.svg?v=20250829065753667#icon-warning")
            router-link(to="/account-setting") Please verify your email address to modify settings.

    section
        p.page-desc(style="text-align: center; margin: 2rem auto").
            You can send bulk emails to your newsletter subscribers.
            #[span.wordset To proceed, please register your email alias address that will be used to send out the emails.]
            #[span.wordset The email alias can only be alphanumeric and hyphen.]

        form#registerForm.flex(@submit.prevent='registerAlias')
            .email-alias
                input.block(v-model='emailAliasVal' pattern='^[a-z\\d](?:[a-z\\d\\-]{0,61}[a-z\\d])?$' :disabled="registerAliasRunning" placeholder="your-email-alias" required)

            button.inline( :disabled='registerAliasRunning')
                template(v-if="registerAliasRunning")
                    .loader(style="--loader-color:white; --loader-size:12px")
                template(v-else)
                    | Register

template(v-else-if='!user?.email_verified || currentService.service.active == 0 || currentService.service.active < 0')
    section.page-desc
        .error(v-if='!user?.email_verified')
            svg
                use(xlink:href="/material-icon.svg?v=20250829065753667#icon-warning")
            router-link(to="/account-setting") Please verify your email address to modify settings.

        .error(v-if='currentService.service.active == 0')
            svg
                use(xlink:href="/material-icon.svg?v=20250829065753667#icon-warning")
            //- span This service is currently disabled.
            router-link(:to="`/my-services/${currentService.id}/dashboard`") This service is currently disabled.

        .error(v-else-if='currentService.service.active < 0')
            svg
                use(xlink:href="/material-icon.svg?v=20250829065753667#icon-warning")
            //- span This service is currently suspended.
            router-link(:to="`/my-services/${currentService.id}/dashboard`") This service is currently suspended.

        p.
            You can send bulk emails to your newsletter subscribers.
            #[span.wordset To proceed, please enable the service or verify your email address.]
            #[br]
            #[span.wordset If you have not verified your email address, please do so first.]

        //- router-link(v-if='currentService.service.active == 0' :to="`/my-services/${currentService.id}/dashboard`") Click here to enable the service.
        //- router-link(v-else-if='!user?.email_verified' to="/account-setting") Click here to verify your email address.

template(v-else)
    ul.tab-menu
        li.tab-menu-item(v-for="(tab, index) in emailTypeSelect" :key="index" @click="activeTabs = index" :class="{ active: activeTabs === index }") {{ tab }}

    section
        template(v-if='mailType === "Newsletter"')
            p.page-desc.
                Once the users have subscribed #[span.wordset to your newsletter,]
                they will be able to receive your emails sent to the address provided below:
        template(v-else)
            p.page-desc.
                Once the users have subscribed to your service mail,
                they will be able to receive your emails sent to the address provided below:
                User must be logged in to subscribe to Service Mail, and the user must have their email verified.

    section
        .info-value-set
            .info-edit-wrap
                .info
                    .title Email Alias
                    .value {{ currentService.service.email_alias + '@mail.skapi.com' }}
                .actions-wrap
                    button.only-icon.gray.edit-btn(type="button" @click="showSetAliasModal = true; emailAliasVal = currentService.service.email_alias;")
                        .icon
                            svg
                                use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-edit")
            .info-edit-wrap
                .info.email
                    .title Email Address
                    .value {{ newsletterEndpoint || '...' }}
                .actions-wrap
                    button.only-icon.gray.btn-copy(type="button" @click="copy(newsletterEndpoint)")
                        .icon
                            svg
                                use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-copy")
                    a(:href="'mailto:' + newsletterEndpoint" target="_blank")
                        button.only-icon.gray.btn-send(type="button")
                            .icon
                                svg
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-send")

    section.table-area
        .table-menu-wrap
            .table-functions
                button.inline.only-icon.gray(aria-label="Refresh" @click="getPage(true)" :disabled="fetching || !user?.email_verified || currentService.service.active <= 0")
                    Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                        template(v-slot:tool)
                            .icon
                                svg
                                    use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-refresh")
                        template(v-slot:tip) Refresh
            .table-actions
                //- a(:href="'mailto:' + newsletterEndpoint")
                    button.inline.only-icon.gray(:class="{ disabled : fetching || !user?.email_verified || currentService.service.active <= 0}")
                        svg.svgIcon
                            use(xlink:href="/material-icon.svg?v=20250829065753667#icon-send")
                button.inline.only-icon.gray(aria-label="Delete Selected" :disabled="!Object.keys(checked).length || !user?.email_verified || currentService.service.active <= 0")
                    Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                        template(v-slot:tool)
                            .icon
                                svg
                                    use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-delete")
                        template(v-slot:tip) Delete Selected

        .table-cont-wrap
            Table(:class='{disabled: !user?.email_verified || currentService.service.active <= 0}')
                template(v-slot:head)
                    tr(:class="{'nonClickable' : fetching}")
                        th.fixed(style='width:60px;')
                            Checkbox(@click.stop :modelValue="listDisplay && listDisplay.length > 0 && Object.keys(checked).length === listDisplay.length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.url] = d)); else checked = {}; }" style="display:inline-block")
                            .resizer.fixed
                        th(style='width: 250px;')
                            span(@click='toggleSort("subject")')
                                | Subject
                                svg.svgIcon(v-if='searchFor === "subject" && ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-down")
                                svg.svgIcon(v-if='searchFor === "subject" && !ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-up")
                            .resizer
                        th(style='width: 120px;')
                            span(@click='toggleSort("timestamp")')
                                | Sent
                                svg.svgIcon(v-if='searchFor === "timestamp" && ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-down")
                                svg.svgIcon(v-if='searchFor === "timestamp" && !ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-up")
                            .resizer
                        th(style='width: 120px;')
                            span(@click='toggleSort("read")')
                                | Reads
                                svg.svgIcon(v-if='searchFor === "read" && ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-down")
                                svg.svgIcon(v-if='searchFor === "read" && !ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-up")
                            .resizer
                        th(style='width: 120px;')
                            span(@click='toggleSort("complaint")')
                                | Complaint
                                svg.svgIcon(v-if='searchFor === "complaint" && ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-down")
                                svg.svgIcon(v-if='searchFor === "complaint" && !ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-up")
                            .resizer
                        th(style='width: 120px;')
                            span(@click='toggleSort("bounced")')
                                | Bounced
                                svg.svgIcon(v-if='searchFor === "bounced" && ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-down")
                                svg.svgIcon(v-if='searchFor === "bounced" && !ascending')
                                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-arrow-drop-up")
                        th.center(style="width:60px; padding:0")

                template(v-slot:body)
                    template(v-if="fetching")
                        tr.empty-value
                            td#loading(colspan="6").
                                Loading {{mailType}} ... &nbsp;
                                #[.loader(style="--loader-color:white; --loader-size:12px")]
                        tr(v-for="i in 9")
                            td(colspan="6")
                    template(v-else-if="!listDisplay || listDisplay.length === 0")
                        tr.empty-value
                            td(colspan="6") No {{mailType}} Sent
                        tr(v-for="i in 9")
                            td(colspan="6")
                    template(v-else)
                        tr.hoverRow(v-for="ns in listDisplay" @click='openNewsletter(ns.url)')
                            td
                                Checkbox(@click.stop
                                    :modelValue="!!checked?.[ns?.url]"
                                    @update:modelValue="(value) => { if (value) checked[cs?.url] = value; else delete checked[ns?.url]; }"
                                    )
                            td.overflow {{ converter(ns.subject) }}
                            td.overflow {{ dateFormat(ns.timestamp) }}
                            td.overflow {{ ns.read }}
                            td.overflow {{ ns.complaint }}
                            td.overflow {{ ns.bounced }}
                            td.center.buttonWrap(@click.stop)
                                svg.svgIcon.reactiveDanger.clickable.hide(@click.stop="emailToDelete = ns")
                                    use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-delete")

                        tr(v-for="i in (10 - listDisplay.length)")
                            td(colspan="6")

        .table-page-wrap
            button.inline.only-icon.gray(aria-label="Previous" @click="currentPage--;" :disabled="fetching || currentPage <= 1")
                .icon
                    svg
                        use(xlink:href="/material-icon.svg?v=20250829065753667#icon-chevron-left")
            button.inline.only-icon.gray(aria-label="Next" @click="currentPage++;" :disabled="fetching || endOfList && currentPage >= maxPage")
                .icon
                    svg
                        use(xlink:href="/material-icon.svg?v=20250829065753667#icon-chevron-right")

//- modal :: delete email
Modal.modal-deleteEmail(:open="emailToDelete" @close="emailToDelete=false")
    .modal-title Delete Email

    .modal-desc.
        Are you sure you want to delete email:
        #[br]
        "#[b {{ emailToDelete?.subject }}]"?
        #[br]
        This action cannot be undone.

    .modal-btns
        .loader-wrap(v-if="deleteMailLoad")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(@click="emailToDelete = null") Cancel
            button.red.btn-delete(@click="deleteEmail(emailToDelete)") Delete

//- modal :: set email alias
Modal.modal-setAlias(:open="showSetAliasModal" @close="showSetAliasModal=false")
    .modal-close(@click="showSetAliasModal = false; emailAliasVal = '';")
        svg.svgIcon
            use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-x")

    .modal-title Set Email Alias

    .modal-desc You can set automated email templates for your service.#[br]Please register your email alias address that will be used to send out the emails.#[br]The email alias can only be alphanumeric and hyphen.

    form#registerForm(@submit.prevent='registerAlias')
        .email-alias
            input.block(v-model='emailAliasVal' pattern='^[a-z\\d](?:[a-z\\d\\-]{0,61}[a-z\\d])?$' :disabled="registerAliasRunning" placeholder="your-email-alias" required)

        .modal-btns
            .loader-wrap(v-if="registerAliasRunning")
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else)
                button.block(type="submit" :disabled='registerAliasRunning') Register
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import { currentService, serviceBulkMails } from "./main";
import { user } from "@/code/user";
import { skapi } from "@/main";
import { dateFormat } from "@/code/admin";
import { copy } from "@/assets/js/common.js";

import Pager from "@/code/pager";
import Table from "@/components/table.vue";
import Modal from "@/components/modal.vue";
import Checkbox from "@/components/checkbox.vue";
import Tooltip from "@/components/tooltip.vue";

type Newsletter = {
    bounced: number;
    compliant: number;
    read: number;
    message_id: string;
    subject: string;
    timestamp: number;
    url: string;
};

let pager: Pager = null;

let tableKey = ref(0);
let checked: Ref<{ [key: string]: any }> = ref({});
let emailAliasVal = ref("");
let email_is_unverified_or_service_is_disabled = computed(
    () => !user?.email_verified || currentService.service.active <= 0
);

let showSetAliasModal = ref(false);
let registerAliasRunning = ref(false);
function registerAlias() {
    registerAliasRunning.value = true;
    currentService
        .registerSenderEmail({
            email_alias: emailAliasVal.value,
        })
        .catch((err) => {
            window.alert(err.message);
        })
        .finally(() => {
            registerAliasRunning.value = false;
            showSetAliasModal.value = false;
        });
}
let needsEmailAlias = computed(() => {
    return (
        currentService.service.active > 0 && !currentService.service.email_alias
    );
});

// default form input values

let searchFor: Ref<"timestamp" | "read" | "complaint" | "subject"> =
    ref("timestamp");
let group: Ref<0 | 1> = ref(0);
let ascending: Ref<boolean> = ref(false);
let emailToDelete: Ref<Newsletter> = ref(null);

// ui/ux related
let fetching = ref(false);
let maxPage = ref(0);
let currentPage = ref(1);
let endOfList = ref(false);
let mailType = computed(() =>
    group.value === 0 ? "Newsletter" : "Service Mail"
);
let deleteMailLoad = ref(false);
// list renderer
let listDisplay: Ref<Newsletter[]> = ref(null);

// etc
let newsletterEndpoint: Ref<string> = ref("");
currentService.newsletterSender[0].then((r) => (newsletterEndpoint.value = r));

// tabmenu
let activeTabs = ref(0);
let emailTypeSelect = ["Newsletter", "Service Mail"];

watch(activeTabs, (newIndex) => {
    group.value = newIndex as 0 | 1;
});

// call getPage when currentPage changes
watch(currentPage, (n, o) => {
    if (
        n !== o &&
        n > 0 &&
        (n <= maxPage.value || (n > maxPage.value && !endOfList.value))
    ) {
        // if new value is different from old value
        // if new value is within maxPage
        // if new value is greater than maxPage but not end of list

        getPage();
    } else {
        currentPage.value = o; // revert back to old value
    }
});

// initialize the pager when searchFor changes
watch(searchFor, (n) => {
    if (!fetching.value) {
        ascending.value = n === "subject";
        if (endOfList.value) {
            resetIndex();
        } else {
            init();
        }
    }
});

watch(ascending, (n) => {
    if (!fetching.value) {
        if (endOfList.value) {
            resetIndex();
        } else {
            init();
        }
    }
});

watch(group, (n) => {
    newsletterEndpoint.value = "";
    currentService.newsletterSender[n].then(
        (r) => (newsletterEndpoint.value = r)
    );
    init();
});

// computed fetch params
let callParams = computed(() => {
    let defaultValues = {
        timestamp: {
            value: 0,
            condition: ">=",
        },
        read: {
            value: 0,
            condition: ">=",
        },
        complaint: {
            value: 0,
            condition: ">=",
        },
        subject: {
            value: " ",
            condition: ">",
        },
    };
    return {
        params: {
            service: currentService.service.service,
            owner: currentService.service.owner,
            searchFor: searchFor.value,
            value: defaultValues[searchFor.value].value,
            condition: defaultValues[searchFor.value].condition,
            group: group.value,
        },
        options: {
            ascending: ascending.value,
        },
    };
});

let getPage = async (refresh?: boolean) => {
    if (refresh) {
        endOfList.value = false;
    }

    // 서비스 ID가 없으면 객체 초기화
    if (!serviceBulkMails[currentService.id]) {
        serviceBulkMails[currentService.id] = {};
    }

    // group.value 키가 없거나 검색 조건이 있으면 초기화
    if (
        !serviceBulkMails[currentService.id][group.value] ||
        (refresh && searchFor.value)
    ) {
        serviceBulkMails[currentService.id][group.value] = await Pager.init({
            id: "message_id",
            resultsPerPage: 10,
            sortBy: searchFor.value,
            order: ascending.value ? "asc" : "desc",
        });
    }

    pager = serviceBulkMails[currentService.id][group.value];

    // if(!serviceBulkMails[currentService.id] || searchFor.value) {
    //     serviceBulkMails[currentService.id] = await Pager.init({
    //         id: 'message_id',
    //         resultsPerPage: 10,
    //         sortBy: searchFor.value,
    //         order: ascending.value ? 'asc' : 'desc',
    //     });
    // }

    // pager = serviceBulkMails[currentService.id];

    if ((!refresh && maxPage.value >= currentPage.value) || endOfList.value) {
        // if is not refresh and has page data
        listDisplay.value = pager.getPage(currentPage.value)
            .list as Newsletter[];
        return;
    } else if (!endOfList.value || refresh) {
        // if page data needs to be fetched
        fetching.value = true;

        // fetch from server
        let fetchedData = await skapi.getNewsletters(
            callParams.value.params,
            Object.assign({ fetchMore: !refresh }, callParams.value.options)
        );

        // save endOfList status
        endOfList.value = fetchedData.endOfList;

        // insert data in pager
        if (fetchedData.list.length > 0) {
            await pager.insertItems(fetchedData.list);
        }

        // get page from pager
        let disp = pager.getPage(currentPage.value);

        // set maxpage
        maxPage.value = disp.maxPage;

        // render data
        listDisplay.value = disp.list as Newsletter[];
        fetching.value = false;
    }
};

let resetIndex = async () => {
    // reset index is used when index is changed but it's end of list
    currentPage.value = 1;
    await pager.resetIndex({
        sortBy: searchFor.value,
        order: ascending.value ? "asc" : "desc",
    });
    getPage(true);
};

let init = async () => {
    currentPage.value = 1;

    // 서비스 ID가 없을 때 초기화
    if (!serviceBulkMails[currentService.id]) {
        serviceBulkMails[currentService.id] = {};
    }

    // 선택된 그룹 값이 없을 때만 pager로 초기화
    if (!serviceBulkMails[currentService.id][group.value]) {
        serviceBulkMails[currentService.id][group.value] = { ...pager }; // 새로 추가
        getPage(true);
    } else {
        // 기존 값이 있는 경우 가져와서 사용
        pager = serviceBulkMails[currentService.id][group.value];
        endOfList.value = pager.endOfList;

        let disp = pager.getPage(currentPage.value);
        maxPage.value = disp.maxPage;
        listDisplay.value = disp.list;
    }

    // if(serviceBulkMails[currentService.id] && Object.keys(serviceBulkMails[currentService.id]).length) {
    //     pager = serviceBulkMails[currentService.id];
    //     endOfList.value = serviceBulkMails[currentService.id].endOfList;

    //     let disp = pager.getPage(currentPage.value);
    //     maxPage.value = disp.maxPage;
    //     listDisplay.value = disp.list;

    // } else {
    //     serviceBulkMails[currentService.id] = pager;
    //     getPage(true);
    // }

    // setup pagers
    // pager = await Pager.init({
    //     id: 'message_id',
    //     resultsPerPage: 10,
    //     sortBy: searchFor.value,
    //     order: ascending.value ? 'asc' : 'desc',
    // });

    // getPage(true);
};

init();

// ux related functions

let openNewsletter = (url: string) => {
    window.open(url, "_blank");
};

let toggleSort = (search: any) => {
    if (fetching.value) {
        return;
    }

    if (searchFor.value === search) {
        ascending.value = !ascending.value;
    } else {
        searchFor.value = search;
    }
};

let deleteEmail = (ns: Newsletter) => {
    if (!ns) {
        return;
    }

    let params = {
        message_id: ns.message_id,
        group: group.value,
    };

    deleteMailLoad.value = true;
    currentService
        .deleteNewsletter(params)
        .then(async () => {
            emailToDelete.value = null;
            await pager.deleteItem(params.message_id);
            getPage();
        })
        .catch((err) => window.alert(err))
        .finally(() => {
            deleteMailLoad.value = false;
        });
};

let converter = (html: string, parsed: boolean, inv: boolean) => {
    if (!parsed) {
        return html;
    }
    html = html.replaceAll("${code}", "123456");
    html = html.replaceAll("${email}", user.email);
    html = html.replaceAll("${name}", user.name || user.email);
    html = html.replaceAll("${service_name}", service.name);
    html = html.replaceAll(
        "https://link.skapi",
        inv ? "/invitation_confirmed_template" : "/signup_confirmed_template"
    );
    html = html.replaceAll("${password}", "abc123&&");
    return html;
};
</script>

<style lang="less" scoped>
@media (pointer: coarse) {
    .hide {
        display: block !important;
    }
}

.page-desc {
    max-width: 55rem;
    margin: 2rem auto 2.5rem;
    text-align: center;
}

#registerForm {
    &.flex {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        max-width: 620px;
        margin: 0 auto;
    }

    .email-alias {
        position: relative;
        flex-grow: 1;

        &::after {
            content: "@mail.skapi.com";
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            font-size: 0.8rem;
            font-weight: 400;
            pointer-events: none;
            user-select: none;
            z-index: 1;
        }

        input {
            padding-right: 132px;
        }
    }
}

// new style
.email-btn-wrap {
    text-align: center;
    background-color: #222325;
    padding: 1.25rem 2rem;
    border-radius: 2rem;
    max-width: 840px;
    width: 100%;
    margin: 0 auto;

    .inner {
        display: inline-flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background-color: #222325;
        padding: 0.5rem;
        border-radius: 0.6rem;
    }

    .email {
        word-break: break-all;
        line-height: 1.5;
        display: block;
        margin-bottom: 1rem;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        border-radius: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);

        svg {
            // opacity: 0.6;
        }

        &:hover {
            svg {
                opacity: 1;
            }
        }

        &.btn-copy {
            svg {
                width: 20px;
                height: 20px;
            }
        }
    }
}

.tab-menu {
    list-style: none;
    background-color: #121214;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: fit-content;
    padding: 0.75rem 0.875rem;
    margin: 2rem auto;
    border-radius: 2rem;

    .tab-menu-item {
        list-style: none;
        margin: 0;
        background-color: transparent;
        padding: 0.75rem 1.25rem;
        border-radius: 1.5rem;
        font-size: 1rem;
        cursor: pointer;
        user-select: none;

        &:hover,
        &.active {
            background-color: #222325;
        }
    }
}

.info-edit-wrap {
    .email {
        max-width: calc(100% - 120px);
    }

    @media (max-width: 430px) {
        .email {
            max-width: 100%;
        }
    }
}

.table-area {
    margin-top: 3.5rem;
}

.error {
    margin-bottom: 1rem;
    justify-content: center;
    align-items: center;
    font-size: 1.125rem;

    svg {
        width: 1.25rem;
        height: 1.25rem;
        margin-top: 0;
    }
}

@media (max-width: 430px) {
    .tab-menu {
        width: 100%;
        flex-direction: column;
        align-items: center;

        .tab-menu-item {
            width: 100%;
            text-align: center;
        }
    }

    .email-btn-wrap {
        .btn-wrap {
            flex-direction: column;
            gap: 0.5rem;

            button,
            a {
                width: 100%;
                max-width: 100%;
            }
        }
    }
}
</style>
