<template lang="pug">
section
    .flex-wrap.space-between
        .page-title Automated Email
        a.btn-docs(href='https://docs.skapi.com/email/email-templates.html' target="_blank")
            button.inline.sm.gray Go Docs
    
hr

template(v-if='needsEmailAlias')
    section
        .error(v-if='!user?.email_verified')
            svg
                use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
            router-link(to="/account-setting") Please verify your email address to modify settings.

    section
        p.desc(style="color: #888888; margin-bottom: 30px;").
            You can set automated email templates for your service.
            #[br]
            To proceed, please register your email alias address that will be used to send out the emails.
            #[br]
            The email alias can only be #[span.wordset alphanumeric and hyphen.]

        form#registerForm(@submit.prevent='registerAlias')
            .email-alias
                input.block(v-model='emailAliasVal' pattern='^[a-z\\d](?:[a-z\\d\\-]{0,61}[a-z\\d])?$' :disabled="registerAliasRunning" placeholder="your-email-alias" required)

            button.inline(:disabled='registerAliasRunning' :class='{disabled: registerAliasRunning}')
                template(v-if="registerAliasRunning")
                    .loader(style="--loader-color:white; --loader-size:12px; margin: 12px")
                template(v-else)
                    | Register
template(v-else)
    section
        .error(v-if='!user?.email_verified')
            svg
                use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
            router-link(to="/account-setting") Please verify your email address to modify settings.
            
        .error(v-else-if='currentService.service.active == 0')
            svg
                use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
            span This service is currently disabled.

        .error(v-else-if='currentService.service.active < 0')
            svg
                use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
            span This service is currently suspended.

    section
        span.txt-required * required

        ul.tab-menu
            li.tab-menu-item(v-for="(tab, index) in emailTypeSelect" :key="index" @click="activeTabs = index" :class="{ active: activeTabs === index }") {{ tab }}

        .desc-wrap
            template(v-if='emailType === "Signup Confirmation"')
                p.
                    Signup confirmation email is sent #[span.wordset when the signup requires email verification]
                    #[br]
                    or when the user tries to recover #[span.wordset their disabled account.]
                    #[br]
                    The email contains a link to activate the account.

            template(v-if='emailType === "Welcome Email"')
                p.
                    Welcome Email is sent when the user successfully logs #[span.wordset in after the signup confirmation.]
                    #[span.wordset If the signup did not require any signup confirmation, #[span.wordset Welcome Email will not be sent]]

            template(v-if='emailType === "Verification Email"')
                p.
                    Verification Email is sent when the user requests to verify their email address or tries to reset their #[span.wordset forgotten password.]

            template(v-if='emailType === "Invitation Email"')
                p.
                    Invitation Email is sent when the user is invited to join the service.
                    #[span.wordset You can invite new users] to your service from the #[router-link(to='users') Users] page.
                    #[span.wordset User can login] with provided email and password after they accept the invitation by clicking on the link provided in the email.

            template(v-if='emailType === "Newsletter Confirmation"')
                p.
                    Newsletter Confirmation is sent when the user subscribes to your public newsletter.


        .placeholder-wrap
            svg.svgIcon
                use(xlink:href="@/assets/img/material-icon.svg#icon-info")
            span.label placeholders: 
            span.placeholder.required(v-for="(placeholder, i) in emailPlaceholders[group].required" :key="'req-' + i")
                | {{ placeholder }}
            span.placeholder.optional(v-for="(placeholder, i) in emailPlaceholders[group].optional" :key="'opt-' + i")
                | {{ placeholder }}


        .email-btn-wrap
            .email {{ email_templates[group] }}

            .flex-wrap.center
                button.inline.icon-text.gray.sm.btn-copy(@click="copy(email_templates[group])")
                    svg.svgIcon
                        use(xlink:href="@/assets/img/material-icon.svg#icon-file-copy-fill")
                    span Copy
                button.inline.icon-text.gray.sm.btn-preview(@click="showPreview = true; previewModal.current = true; previewModal.subject = null; beforeTemp = null;")
                    svg.svgIcon
                        use(xlink:href="@/assets/img/material-icon.svg#icon-preview")
                    span Preview
                a(:href="'mailto:' + mailEndpoint")
                    button.inline.icon-text.gray.sm.btn-send
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-send")
                        span Send

        br

    section
        .table-menu-wrap
            .table-functions
                button.inline.only-icon.gray(@click="getPage(true)" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                    svg.svgIcon
                        use(xlink:href="@/assets/img/material-icon.svg#icon-refresh")
            .table-actions
                button.inline.only-icon.gray(@click="emailToDelete = true" :class="{ disabled : !Object.keys(checked).length || !user?.email_verified || currentService.service.active <= 0}" )
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
                        Checkbox(@click.stop :modelValue="!!Object.keys(checked).length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.message_id] = d)); else checked = {}; }" style="display:inline-block")
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

            template(v-slot:body)
                template(v-if="fetching || !listDisplay || listDisplay.length === 0")
                    tr.nohover(v-for="i in 10")
                        td(colspan="4")
                template(v-else)
                    tr.hoverRow(v-for="ns in listDisplay" @click='openMailPreview(ns, currentService.service?.["template_" + group]?.url === ns.url)')
                        td
                            Checkbox(@click.stop
                                :modelValue="!!checked?.[ns?.message_id]"
                                @update:modelValue="(value) => { if (value) checked[ns?.message_id] = value; else delete checked[ns?.message_id]; }"
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
                    tr.nohover(v-for="i in (10 - listDisplay.length)")
                        td(colspan="4")

        .table-page-wrap
            button.inline.only-icon.gray(@click="currentPage--;" :class="{ disabled: fetching || currentPage <= 1 }")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-keyboard-arrow-left")
            button.inline.only-icon.gray(@click="currentPage++;" :class="{ disabled: fetching || endOfList && currentPage >= maxPage }")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-keyboard-arrow-right")

//- modal :: preview mail template
Modal.modal-scroll.modal-previewMail(:open="showPreview" @close="closePreview")
    .modal-container
        .modal-header
            h4.title {{ previewModal.current ? "Current" : "Before" }} Template
            button.btn-close(type="button" @click="closePreview")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-close")
        .modal-body
            div(v-if='htmls[group] === null')
                .loader(style="--loader-color:white; --loader-size:12px")
            .content(v-else)
                .row(v-if="previewModal.current")
                    .key Preview
                    .value
                        Toggle(:active='parseOpt' @click="parseOpt=!parseOpt")
                .row
                    .key Sender
                    .value {{ currentService.service?.email_alias || currentService.service?.service }}@mail.skapi.com
                .row
                    .key Subject
                    template(v-if="previewModal.current")
                        .value {{ converter(subjects[group], parseOpt) }}
                    template(v-else)
                        .value {{ previewModal.subject }}
                .row
                    iframe(:srcdoc='previewModal.current ? currentTemp : beforeTemp' style='width: 100%; height: 300px; border: none; background-color: #fff; border-radius: 1rem; padding: 1rem;')

//- modal :: delete email
Modal.modal-deleteEmail(:open="emailToDelete" @close="emailToDelete=false")
    .modal-title Delete Email

    .modal-desc Are you sure you want to delete the selected #[b {{Object.keys(checked).length}} email template(s)]? #[br] This action cannot be undone.

    .modal-btns
        .loader-wrap(v-if="deleteMailLoad")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(@click="emailToDelete = false") Cancel
            button.red.btn-delete(@click="deleteEmail") Delete

//- modal :: set email template
Modal.modal-setTemplate(:open="!!emailToUse" @close="emailToUse=false")
    .modal-title Set Template

    .modal-desc By clicking confirm, you are setting the email template: #[br] "#[b {{ emailToUse?.subject }}]" #[br] as the {{ emailType }} template.

    .modal-btns
        .loader-wrap(v-if="useMailLoad")
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
let beforeTemp = ref(null);
let previewModal: Ref<{
    current: boolean;
    subject: string | null;
}> = ref({
    current: false,
    subject: null,
})
let tableKey = ref(0);
let checked: Ref<{ [key: string]: any }> = ref({});
const emailPlaceholders: Record<string, { required: string[]; optional: string[] }> = {
    confirmation: {
        required: ["https://link.skapi"],
        optional: ["${email}", "${name}", "${service_name}"]
    },
    welcome: {
        required: [],
        optional: ["${email}", "${name}", "${service_name}"]
    },
    verification: {
        required: ["${code}"],
        optional: ["${email}", "${name}", "${service_name}"]
    },
    invitation: {
        required: ["https://link.skapi", "${email}", "${password}"],
        optional: ["${name}", "${service_name}"]
    },
    newsletter_subscription: {
        required: ["https://link.skapi"],
        optional: ["${name}", "${service_name}"]
    }
};

let emailAliasVal = ref("");
let email_is_unverified_or_service_is_disabled = computed(
    () => !user?.email_verified || currentService.service.active <= 0
);

function copy(text: string) {
    let doc = document.createElement('textarea');
    doc.textContent = text;
    document.body.append(doc);
    doc.select();
    document.execCommand('copy');
    doc.remove();

    let copyMsg = document.getElementById('copy-msg');
    copyMsg.textContent = 'The email copied!';
    copyMsg.classList.add('show');

    setTimeout(() => {
        copyMsg.classList.remove('show');
    }, 2000);
}

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
let emailToDelete: Ref<boolean> = ref(false);

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

            console.log("getPage", res);

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

        console.log(listDisplay.value);
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

let openMailPreview = async (mail: Newsletter, isCurrent: boolean) => {
    if (!mail.url) return;

    if (isCurrent) {
        previewModal.value.current = true;
        previewModal.value.subject = null;
        beforeTemp.value = null;
        showPreview.value = true;
        return;
    }

    previewModal.value.current = false;
    previewModal.value.subject = mail.subject;

    try {
        const res = await fetch(mail.url);
        const html = await res.text();

        beforeTemp.value = html;
        showPreview.value = true;
    } catch (err) {
        window.alert('미리보기 HTML을 불러오지 못했습니다.');
        beforeTemp.value = null;
        showPreview.value = false;
    }
};

let closePreview = () => {
    showPreview.value = false;
    beforeTemp.value = null;
    previewModal.value.current = false;
    previewModal.value.subject = null;
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

let deleteEmail = async () => {
    const ids = Object.keys(checked.value);

    if (!ids.length) {
        return;
    }

    deleteMailLoad.value = true;

    try {
        // 삭제 요청을 모두 Promise 배열로 만듭니다.
        await Promise.all(ids.map(async (message_id) => {
            const params = {
                message_id,
                group: group.value,
            };
            await currentService.deleteTemplate(params);

            // 현재 사용 중인 템플릿이면 삭제
            const templateKey = "template_" + group.value;
            if ((currentService.service as any)?.[templateKey]?.url === checked.value[message_id]?.url) {
                delete (currentService.service as any)[templateKey];
            }

            await pager.deleteItem(message_id);
        }));

        emailToDelete.value = false;
        checked.value = {};
        getHtml(group.value);
        getPage(true);
    } catch (err) {
        window.alert(err.message || err);
    } finally {
        deleteMailLoad.value = false;
    }
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
section {
    position: relative;
}

.txt-required {
    // position: absolute;
    // top: -1rem;
    // right: 14px;
    margin-right: 14px;
}

#registerForm {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    max-width: 620px;

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

    button {
        width: 92px;
    }

    @media (max-width: 540px) {
        button {
            width: 100%;
            max-width: 100%;
        }
    }
}

.desc-wrap {
    max-width: 600px;
    margin: 2rem auto;
    text-align: center;
    color: #999;
}

.email-btn-wrap {
    text-align: center;
    background-color: #222325;
    padding: 1rem 2rem;
    border-radius: 2rem;
    max-width: 840px;
    width: 100%;
    margin: 0 auto;

    .email {
        word-break: break-all;
        line-height: 1.5;
        margin-bottom: 1rem;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        border-radius: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 465px) {
        padding: 1rem;

        a {
            width: 100%;
        }

        button {
            width: 100%;
            max-width: 100%;
        }
    }
}

.placeholder-wrap {
    font-size: 1rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #888888;

    svg {
        width: 18px;
        height: 18px;
        fill: #888888;
    }

    .label {
        margin-left: 0.25rem;
        margin-right: 0.5rem;
    }

    .placeholder {
        position: relative;
        margin-right: 1rem;
        font-size: 0.875rem;

        &.required {
            font-weight: 500;
            margin-right: 1.4rem;

            &::after {
                content: "*";
                color: yellow;
                position: absolute;
                right: -8px;
                top: 0;
            }
        }

        &.optional {
            color: #888888;
        }
    }
}

.modal-previewMail {
    .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 1rem;

        .key {
            font-weight: 500;
            width: 170px;
        }

        .value {
            min-width: 270px;
            margin: 6px 0 6px;
        }
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
        &>span {
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

    &>* {
        margin-bottom: 8px;
    }
}

@media (pointer: coarse) {
    .hide {
        display: block !important;
    }
}

.tab-menu {
    // margin-bottom: 1.5rem;
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
    margin: 2rem auto 0;
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
