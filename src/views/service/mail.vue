<template lang="pug">
section
    .flex-wrap.space-between
        .page-title Automated Email
        a.btn-docs(href='https://docs.skapi.com/email/email-templates.html' target="_blank")
            button.inline.sm.gray Go Docs
    
hr

section
    .error(v-if='!user?.email_verified')
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
        router-link(to="/account-setting") Please verify your email address to modify settings.

section
    ul.tab-menu
        li.tab-menu-item(v-for="(tab, index) in emailTypeSelect" :key="index" @click="activeTabs = index" :class="{ active: activeTabs === index }") {{ tab }}

    //- TabMenu(v-model="activeTabs" :tabs="['Signup Confirmation', 'Welcome Email', 'Verification Email', 'Invitation Email', 'Newsletter Confirmation']" style="margin-bottom: 1.5rem;")

    .email-btn-wrap(style="text-align: center;")
        .flex-wrap.center(style='display:inline-flex; align-items: center;flex-wrap: nowrap; gap:6px; background-color: #222325; padding: 0.5rem; border-radius: 0.6rem;')
            //- button.inline(@click="init") {{ emailType.split(' ')[0] }} Email Copy
            span(style="word-break: break-all; padding:0 0.5rem 0 1rem") {{ email_templates[group] }}
            button.inline.only-icon.gray.sm(style="padding:8px 10px; border-radius:0.4375rem; background-color: #121214;")
                svg.svgIcon(style="width:20px;")
                    use(xlink:href="@/assets/img/material-icon.svg#icon-file-copy-fill")
            button.inline.only-icon.gray.sm(@click="showPreview = true" style="padding:8px 9px; background-color: #121214;")
                svg.svgIcon(style="width:22px;")
                    use(xlink:href="@/assets/img/material-icon.svg#icon-preview")

template(v-if='!needsEmailAlias')
    //- section.infoBox(style='margin-top: 3rem;')
        .titleHead
            h5(style='white-space: nowrap;') {{emailType}}
            div(style='display: flex;align-items: center;font-size: 0.8rem;')
                span Preview&nbsp;&nbsp;
                Toggle(:active='parseOpt' @click="parseOpt=!parseOpt")

        hr

        .state
            .smallTitle Sender :
            .smallValue.ellipsis {{ currentService.service?.email_alias || currentService.service?.service }}@mail.skapi.com
        .state
            .smallTitle Subject :
            .smallValue.ellipsis {{ converter(subjects[group], parseOpt) }}

        .email(style='pointer-events: none;')
            div(v-if='htmls[group] === null') ...
            iframe(v-else :srcdoc='currentTemp' style='width: 100%; height: 300px; border: none;')

    //- br

    section
        .table-menu-wrap
            .table-functions
                //- button.inline.only-icon.gray.sm(@click.stop="(e)=>{showDropDown(e)}")
                    svg.svgIcon
                        use(xlink:href="@/assets/img/material-icon.svg#icon-checklist-rtl")
                button.inline.only-icon.gray.sm(@click="getPage(true)" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                    svg.svgIcon
                        use(xlink:href="@/assets/img/material-icon.svg#icon-refresh")
            .table-actions
                a(:href="'mailto:' + mailEndpoint")
                    button.inline.only-icon.gray.sm(:class="{ disabled : fetching || !user?.email_verified || currentService.service.active <= 0}")
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-send")
                button.inline.only-icon.gray.sm(:class="{ disabled : !Object.keys(checked).length || !user?.email_verified || currentService.service.active <= 0}" )
                    svg.svgIcon
                        use(xlink:href="@/assets/img/material-icon.svg#icon-delete")

        Table(:key="tableKey" :class='{disabled: !user?.email_verified || currentService.service.active <= 0}')
            template(v-if="fetching" v-slot:msg)
                .tableMsg.center
                    .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
                .tableMsg.center No {{emailType}} Template

            template(v-slot:head)
                tr(:class="{'nonClickable' : fetching}")
                    th.fixed(style='width:60px;')
                        Checkbox(@click.stop :modelValue="!!Object.keys(checked).length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.url] = d)); else checked = {}; }" style="display:inline-block")
                        .resizer.fixed
                    th(style="width:66px; padding:0;text-align:center;")
                        span In-Use
                        .resizer
                    th(style="width:400px;")
                        span(@click='toggleSort("subject")')
                            | Subject
                            svg.svgIcon(v-if='searchFor === "subject" && ascending')
                                use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-drop-down")
                            svg.svgIcon(v-if='searchFor === "subject" && !ascending')
                                use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-drop-up")
                        .resizer
                    th(style="width:160px;")
                        span(@click='toggleSort("timestamp")')
                            | Date
                            svg.svgIcon(v-if='searchFor === "timestamp" && ascending')
                                use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-drop-down")
                            svg.svgIcon(v-if='searchFor === "timestamp" && !ascending')
                                use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-drop-up")
                        .resizer
                    th(style="width:66px; padding:0")

            template(v-slot:body)
                template(v-if="fetching || !listDisplay || listDisplay.length === 0")
                    tr.nohover(v-for="i in 10")
                        td(colspan="4")
                template(v-else)
                    tr.hoverRow(v-for="ns in listDisplay" @click='openNewsletter(ns.url)')
                        td
                            Checkbox(@click.stop
                                :modelValue="!!checked?.[ns?.url]"
                                @update:modelValue="(value) => { if (value) checked[cs?.url] = value; else delete checked[ns?.url]; }"
                                )
                        td.overflow
                            template(v-if='currentService.service?.["template_" + group]?.url === ns.url')
                                svg.svgIcon
                                    use(xlink:href="@/assets/img/material-icon.svg#icon-verified-fill")
                            template(v-else)
                                svg.svgIcon.reactive.clickable.hide(@click.stop="emailToUse = ns")
                                    use(xlink:href="@/assets/img/material-icon.svg#icon-verified")
                        td.overflow {{ converter(ns.subject) }}
                        td.overflow {{ dateFormat(ns.timestamp) }}
                        td.center.buttonWrap(@click.stop)
                            svg.svgIcon.reactiveDanger.clickable.hide(@click.stop="emailToDelete = ns")
                                use(xlink:href="@/assets/img/material-icon.svg#icon-delete-fill")
                    tr.nohover(v-for="i in (10 - listDisplay.length)")
                        td(colspan="4")

        .table-page-wrap
            button.inline.only-icon.gray.sm(@click="currentPage--;" :class="{ disabled: fetching || currentPage <= 1 }")
                svg.svgIcon(style="rotate: 180deg;")
                    use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-forward-ios")
            button.inline.only-icon.gray.sm(@click="currentPage++;" :class="{ disabled: fetching || endOfList && currentPage >= maxPage }")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-forward-ios")

Modal.modal-scroll(:open="showPreview")
    .modal-container
        .modal-header
            h4.title Current Template
            button.btn-close(type="button" @click="showPreview = false")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-close")
        .modal-body
            div(v-if='htmls[group] === null')
                .loader(style="--loader-color:white; --loader-size:12px")
            .content(v-else)
                .row
                    .key Sender
                    .value {{ currentService.service?.email_alias || currentService.service?.service }}@mail.skapi.com
                .row
                    .key Subject
                    .value {{ converter(subjects[group], parseOpt) }}
                .row
                    iframe(:srcdoc='currentTemp' style='width: 100%; height: 300px; border: none; background-color: #fff; border-radius: 1rem; padding: 1rem;')

Modal(:open="!!emailToDelete" @close="emailToDelete=false")
    h4(style='margin:.5em 0 0;') Delete Email

    hr

    div(style='font-size:.8rem;')
        p.
            Are you sure you want to delete email template:
            #[br]
            "#[b {{ emailToDelete?.subject }}]"?
            #[br]
            #[br]
            This action cannot be undone.

    br

    div(style='justify-content:space-between;display:flex;align-items:center;min-height:44px;')
        div(v-if="deleteMailLoad" style="width:100%; text-align:center")
            .loader(style="--loader-color:blue; --loader-size:12px")
        template(v-else)
            button.noLine.warning(@click="emailToDelete = null") Cancel
            button.final.warning(@click="deleteEmail(emailToDelete)") Delete

//- modal :: delete email
Modal.modal-deleteEmail(:open="!!emailToDelete" @close="emailToDelete=false")
    h4.modal-title Delete Email

    hr

    div.modal-desc
        p.
            Are you sure you want to delete email template:
            #[br]
            "#[b {{ emailToDelete?.subject }}]"?
            #[br]
            #[br]
            This action cannot be undone.

    br

    div(style='justify-content:space-between;display:flex;align-items:center;min-height:44px;')
        div(v-if="deleteMailLoad" style="width:100%; text-align:center")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(@click="emailToDelete = null") Cancel
            button.red.btn-delete(@click="deleteEmail(emailToDelete)") Delete

//- modal :: set email template
Modal.modal-setTemplate(:open="!!emailToUse" @close="emailToUse=false")
    h4.modal-title Set Template

    hr

    div.modal-desc
        p.
            By clicking confirm, you are setting the email template:
            #[br]
            "#[b {{ emailToUse?.subject }}]"
            #[br]
            as the {{ emailType }} template.

    br

    div(style='justify-content:space-between;display:flex;align-items:center;min-height:44px;')
        div(v-if="useMailLoad" style="width:100%; text-align:center")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(@click="emailToUse = null") Cancel
            button.btn-confirm(@click="useEmail(emailToUse)") Confirm
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import { currentService, serviceAutoMails } from "./main";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { dateFormat } from "@/code/admin";
import { devLog } from "@/code/logger";
import Code from "@/components/code.vue";
import Table from "@/components/table.vue";
import Modal from "@/components/modal.vue";
import Pager from "@/code/pager";
import Select from "@/components/select.vue";
import Toggle from "@/components/toggle.vue";
import TabMenu from "@/components/tab.vue";
import Checkbox from "@/components/checkbox.vue";

type Newsletter = {
    bounced: number;
    compliant: number;
    read: number;
    message_id: string;
    subject: string;
    timestamp: number;
    url: string;
};

let showPreview = ref(false);
let tableKey = ref(0);
let checked: Ref<{ [key: string]: any }> = ref({});
let emailAliasVal = ref("");
let email_is_unverified_or_service_is_disabled = computed(
    () => !user?.email_verified || currentService.service.active <= 0
);
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
        });
}
let needsEmailAlias = computed(() => {
    return (
        currentService.service.active > 0 && !currentService.service.email_alias
    );
});

let activeTabs = ref(0);
let emailType = ref("Signup Confirmation");
let emailTypeSelect = [
    "Signup Confirmation",
    "Welcome Email",
    "Verification Email",
    "Invitation Email",
    "Newsletter Confirmation",
];

watch(activeTabs, (n) => {
    emailType.value = emailTypeSelect[n];
    console.log(emailType.value);
});

///////////////////////////////////////////////////////////////////////////////// template history[start]
let pager: Pager = null;

// default form input values

let searchFor: Ref<"timestamp" | "subject"> = ref("timestamp");
let ascending: Ref<boolean> = ref(false);
let emailToDelete: Ref<Newsletter> = ref(null);

// ui/ux related
let fetching = ref(false);
let maxPage = ref(0);
let currentPage = ref(1);
let endOfList = ref(false);
let deleteMailLoad = ref(false);

// list renderer
let listDisplay: Ref<Newsletter[]> = ref(null);

// etc

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
        let prev = ascending.value;
        if (n === "subject") {
            ascending.value = true;
        }
        if (prev !== ascending.value) {
            if (endOfList.value) {
                resetIndex();
            } else {
                init();
            }
        }
    }
});

watch(ascending, () => {
    if (!fetching.value) {
        if (endOfList.value) {
            resetIndex();
        } else {
            init();
        }
    }
});

watch(emailType, () => {
    if (!fetching.value) {
        init();
    }
});

let mailEndpoint = ref("");

let group: ComputedRef<
    | "confirmation"
    | "welcome"
    | "verification"
    | "invitation"
    | "newsletter_subscription"
> = computed(() => {
    let grp:
        | "confirmation"
        | "welcome"
        | "verification"
        | "invitation"
        | "newsletter_subscription" = "confirmation";
    switch (emailType.value) {
        case "Signup Confirmation":
            grp = "confirmation";
            break;

        case "Welcome Email":
            grp = "welcome";
            break;
        case "Verification Email":
            grp = "verification";
            break;
        case "Invitation Email":
            grp = "invitation";
            break;
        case "Newsletter Confirmation":
            grp = "newsletter_subscription";
            break;
    }

    mailEndpoint.value = (
        currentService.service.email_triggers.template_setters as any
    )[grp];
    return grp;
});

watch(group, (n) => {
    getHtml(n);
});

// computed fetch params
let callParams = computed(() => {
    let defaultValues = {
        timestamp: {
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

        currentService.getEmailTemplate(group.value).then((res) => {
            if (!res) return;

            (currentService.service as any)["template_" + group.value].url =
                res.url;
            (currentService.service as any)["template_" + group.value].subject =
                res.subject;
            getHtml(group.value);
        });
    }

    // 서비스 ID가 없으면 객체 초기화
    if (!serviceAutoMails[currentService.id]) {
        serviceAutoMails[currentService.id] = {};
    }

    // group.value 키가 없거나 검색 조건이 있으면 초기화
    if (
        !serviceAutoMails[currentService.id][group.value] ||
        (refresh && searchFor.value)
    ) {
        serviceAutoMails[currentService.id][group.value] = await Pager.init({
            id: "message_id",
            resultsPerPage: 10,
            sortBy: searchFor.value,
            order: ascending.value ? "asc" : "desc",
        });
    }

    pager = serviceAutoMails[currentService.id][group.value];

    if ((!refresh && maxPage.value >= currentPage.value) || endOfList.value) {
        // if is not refresh and has page data
        listDisplay.value = pager.getPage(currentPage.value)
            .list as Newsletter[];
        return;
    } else if (!endOfList.value || refresh) {
        // if page data needs to be fetched
        fetching.value = true;

        // fetch from server
        let fetchedData = await currentService.getMailTemplates(
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
    currentPage.value = 1;
    await pager.resetIndex({
        sortBy: searchFor.value,
        order: ascending.value ? "asc" : "desc",
    });

    getPage(true);
};

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
        .deleteTemplate(params)
        .then(async () => {
            emailToDelete.value = null;

            if (
                (currentService.service as any)?.["template_" + group]?.url ===
                ns.url
            ) {
                delete (currentService.service as any)?.["template_" + group];
            }

            await pager.deleteItem(params.message_id);
            getHtml(group.value);
            getPage();
        })
        // .catch((err) => window.alert(err))
        .finally(() => {
            deleteMailLoad.value = false;
        });
};

let useMailLoad = ref(false);
let emailToUse = ref(null);

let useEmail = (ns: Newsletter) => {
    if (!ns) {
        return;
    }

    let params = {
        message_id: ns.message_id,
        group: group.value,
    };

    useMailLoad.value = true;
    currentService
        .setTemplate(params)
        .then(async () => {
            if (!(currentService.service as any)["template_" + group.value])
                (currentService.service as any)["template_" + group.value] =
                    reactive({
                        url: ns.url,
                        subject: ns.subject,
                    });
            else {
                (currentService.service as any)["template_" + group.value].url =
                    ns.url;
                (currentService.service as any)[
                    "template_" + group.value
                ].subject = ns.subject;
            }

            getHtml(group.value);

            emailToUse.value = null;
        })
        .catch((err) => window.alert(err))
        .finally(() => {
            useMailLoad.value = false;
        });
};
///////////////////////////////////////////////////////////////////////////////// template history[end]

let service = currentService.service;
let email_templates = currentService.service.email_triggers.template_setters;
// devLog(currentService.service)
let parseOpt: any = ref(true);

let currentTemp = computed(() => {
    return converter(htmls[group.value], parseOpt.value, true);
});

let converter = (html: string, parsed: boolean, inv: boolean) => {
    // if (!parsed) {
    //     html = html.replaceAll('style="font-weight: bold"', 'style="font-weight: bold; pointer-events: none;"');
    //     return html;
    // }
    if (!parsed) {
        return html;
    }
    html = html.replaceAll("${code}", "123456");
    html = html.replaceAll("${email}", user.email);
    html = html.replaceAll("${name}", user.name || user.email);
    html = html.replaceAll("${service_name}", service.name);
    html = html.replaceAll("${password}", "abc123&&");
    html = html.replaceAll("https://link.skapi", "https://path.to/link");
    return html;
};

let subjects = computed(() => {
    let s = currentService.service;
    return {
        confirmation:
            s?.template_confirmation?.subject ||
            "[${service_name}] Signup Confirmation",
        welcome:
            s?.template_welcome?.subject ||
            "Thank you for joining ${service_name}",
        verification:
            s?.template_verification?.subject ||
            "[${service_name}] Verification code",
        invitation:
            s?.template_invitation?.subject || "[${service_name}] Invitation",
        newsletter_subscription:
            s?.template_newsletter_subscription?.subject ||
            "[${service_name}] Thank you for subscribing to our newsletter.",
    };
});

let htmls: { [key: string]: string } = reactive({
    confirmation: null,
    welcome: null,
    verification: null,
    invitation: null,
    newsletter_subscription: null,
});

let getHtml = async (key: string) => {
    if (!key) {
        return;
    }

    let defaults: { [key: string]: string } = {
        welcome: `
<pre style="line-height: 1.4;">
<span style="font-weight: bold">Hello \${name}</span>
Thank you for joining \${service_name}
Your login email is: <span style="font-weight: bold">\${email}</span></pre>`,
        verification:
            '<pre style="line-height: 1.4;">Your verification code is <span style="font-weight: bold">${code}</span></pre>',
        confirmation: `<pre style="line-height: 1.4;">
Please activate your account by clicking this <a href="\https://link.skapi" style="font-weight: bold">LINK</a>
Your activation link is valid for 7 days.
</pre>`,
        invitation: `
<pre style="line-height: 1.4;">
Hello \${name}
You are invited to \${service_name}
You can accept the invitation by clicking on this <a href="\https://link.skapi" style="font-weight: bold">LINK</a>

Your login e-mail is: <b>\${email}</b>
Your account password is: <b>\${password}</b>

Your activation link is valid for 7 days.
</pre>`,
        newsletter_subscription: `<pre style="line-height: 1.4;">
Thank you for subscribing to \${service_name} newsletter. 
Please confirm your subscription by clicking this <a href="\https://link.skapi" style="font-weight: bold">LINK</a>
</pre>`,
    };

    let url = (service as any)?.["template_" + group.value]?.url;
    if (!url) {
        htmls[key] = defaults[key];
        return;
    }

    let res = await fetch(url);
    let html = await res.text();
    htmls[key] = html;
};

let init = async () => {
    currentPage.value = 1;

    // 서비스 ID가 없을 때 초기화
    if (!serviceAutoMails[currentService.id]) {
        serviceAutoMails[currentService.id] = {};
    }

    // 선택된 그룹 값이 없을 때만 pager로 초기화
    if (!serviceAutoMails[currentService.id][group.value]) {
        serviceAutoMails[currentService.id][group.value] = { ...pager }; // 새로 추가
        getPage(true);
    } else {
        // 기존 값이 있는 경우 가져와서 사용
        pager = serviceAutoMails[currentService.id][group.value];
        endOfList.value = pager.endOfList;

        let disp = pager.getPage(currentPage.value);
        maxPage.value = disp.maxPage;
        listDisplay.value = disp.list;
    }

    getHtml(group.value);
};

init();
</script>

<style lang="less" scoped>
.email-btn-wrap {
    button {
        svg {
            opacity: 0.6;
        }

        &:hover {
            &::after {
                display: none;
            }

            svg {
                opacity: 1;
            }
        }
    }
}

.modal-scroll {
    .content {
        flex-grow: 1;
        overflow-y: auto;
        font-size: 0.8rem;

        .value {
            min-width: fit-content;
            width: fit-content;
            margin: 0;
            flex: 1;
        }

        .row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 1.5rem;
            margin-top: 0;
            gap: 0.5rem;

            &:last-of-type {
                margin-bottom: 0;
            }

            &.line {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 2rem;
                margin-bottom: 2rem;
            }
        }

        .key {
            display: flex;
            align-items: center;
            font-weight: 500;
            width: 170px;
        }
    }
}

.email {
    overflow-x: auto;
    display: flex;
    justify-content: center;
    background-color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    margin-top: 1.5rem;

    & > div {
        width: 100%;
    }
}

.plch {
    font-weight: normal;
}

ul {
    margin-top: 0.5rem;
}

li {
    margin-bottom: 8px;
    font-size: 0.8rem;
}

// table style below
thead {
    th {
        & > span {
            @media (pointer: fine) {
                // only for mouse pointer devices
                &:hover {
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
    }
}

.tableMenu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    & > * {
        margin-bottom: 8px;
    }
}

@media (pointer: coarse) {
    .hide {
        display: block !important;
    }
}

form.register {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-end;

    .emailAlias {
        display: inline-block;
        position: relative;
        height: 44px;

        &::after {
            content: "@mail.skapi.com";
            position: absolute;
            right: 20px;
            line-height: 44px;
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

        flex-grow: 1;
    }

    svg:hover {
        border-radius: 50%;
        background-color: rgba(41, 63, 230, 0.1);
    }

    button {
        flex-shrink: 0;
    }
}

// new style
.infoBox {
    .state {
        margin-bottom: 1rem;
    }

    .smallTitle {
        font-weight: 500;
    }
}

.tab-menu {
    margin-bottom: 1.5rem;
}

._codeWrap {
    margin-top: 0;
    margin-bottom: 1.5rem;

    .code {
        pre {
            padding-bottom: 4.2rem !important;
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
    padding: 0.625rem;
    margin: 2rem auto 1.5rem;
    border-radius: 2rem;

    .tab-menu-item {
        list-style: none;
        margin: 0;
        background-color: transparent;
        padding: 0.75rem 1rem;
        border-radius: 1.5rem;
        font-size: 1rem;
        cursor: pointer;

        &:hover,
        &.active {
            background-color: #222325;
        }
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
}
</style>
