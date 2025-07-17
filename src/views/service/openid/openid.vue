<template lang="pug">
section
    .flex-wrap.space-between
        .page-title Open ID Loggers
        a(href='https://docs.skapi.com/authentication/openid-login.html' target="_blank")
            button.inline.sm.gray Go Docs

hr

section
    .error(v-if="!user?.email_verified")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
        router-link(to="/account-setting") Please verify your email address to modify settings.

    .error(v-else-if="currentService.service.active == 0")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
        span This service is currently disabled.

    .error(v-else-if="currentService.service.active < 0")
        svg
            use(xlink:href="@/assets/img/material-icon.svg#icon-warning-fill")
        span This service is currently suspended.

section
    .table-menu-wrap
        .table-functions
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
            button.inline.only-icon.gray.sm(@click="getPage(true)" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-refresh")
        .table-actions
            button.inline.only-icon.gray.sm(@click="()=>{ !user.email_verified ? false : selectedLogger = null; showDetail=true; }" :class="{ disabled : showDetail || uploading || fetching || !user?.email_verified || currentService.service.active <= 0}")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-add")
            button.inline.only-icon.gray.sm(@click="openDeleteRecords=true" :class="{ disabled : !Object.keys(checked).length || fetching || !user?.email_verified || currentService.service.active <= 0}" )
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-delete")

    Table(:key="tableKey" :class="{'nonClickable' : fetching || !user?.email_verified || currentService.service.active <= 0}" resizable)
        template(v-if="fetching" v-slot:msg)
            .tableMsg.center
                .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
            .tableMsg.center No Open ID Logger
        template(v-slot:head)
            tr
                th.fixed(style='width:60px;')
                    Checkbox(@click.stop :modelValue="!!Object.keys(checked).length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.id] = d)); else checked = {}; }" style="display:inline-block")
                    .resizer.fixed
                th.overflow(style='width:160px;')
                    | Logger ID
                    .resizer
                th.overflow(style='width:160px;')
                    | Username Key
                    .resizer
                th.overflow(style='width:100px;')
                    | Method
                    .resizer
                th.overflow(style='width:160px;')
                    | Request URL
                    .resizer
        template(v-slot:body)
            template(v-if="fetching || !listDisplay || listDisplay?.length === 0")
                tr(v-for="i in 10")
                    td(:colspan="colspan")
            template(v-else)
                tr.hoverRow(v-for="(rc, i) in listDisplay" @click="showDetail=true; selectedLogger=rc")
                    td
                        Checkbox(@click.stop
                            :modelValue="!!checked?.[rc?.id]"
                            @update:modelValue="(value) => { if (value) checked[rc?.id] = value; else delete checked[rc?.id]; }")
                    td.overflow(v-if="rc.id") {{ rc.id }}
                    td.overflow(v-if="rc.usr") {{ rc.usr }}
                    td.overflow(v-if="rc.mthd") {{ rc.mthd }}
                    td.overflow(v-if="rc.url") {{ rc.url }}

                tr(v-for="i in (10 - listDisplay?.length)")
                    td(:colspan="colspan")

    form.detailRecord(:class="{show: showDetail}" @submit.prevent='upload')
        .header(style='padding-right:10px;')
            svg.svgIcon.black.clickable(@click="showDetail=false; selectedLogger=null;" :class="{nonClickable: fetching}")
                use(xlink:href="@/assets/img/material-icon.svg#icon-arrow-back")
            .name {{ selectedLogger?.id ? selectedLogger.id : 'Register Logger' }}
            template(v-if="uploading")
                .loader(style="--loader-color:blue; --loader-size:12px; margin: 12px;")
            template(v-else)
                button.noLine.iconClick.square(type="submit" style='padding:0 14px') SAVE

        RecDetails(v-if='showDetail' :data='selectedLogger')

br

.tableMenu(v-if="!showDetail" style='display:block;text-align:center;')
    .iconClick.square.arrow(@click="currentPage--;" :class="{'nonClickable': fetching || currentPage === 1 }")
        svg.svgIcon(style="width: 26px; height: 26px")
            use(xlink:href="@/assets/img/material-icon.svg#icon-chevron-left")
        span Previous&nbsp;&nbsp;
    | &nbsp;&nbsp;
    .iconClick.square.arrow(@click="currentPage++;" :class="{'nonClickable': fetching || endOfList && currentPage >= maxPage }")
        span &nbsp;&nbsp;Next
        svg.svgIcon(style="width: 26px; height: 26px")
            use(xlink:href="@/assets/img/material-icon.svg#icon-chevron-right")

// delete records
Modal(:open="openDeleteRecords" @close="openDeleteRecords=false")
    .modal-title Delete Records

    .modal-desc This action will delete {{ Object.keys(checked).length }} open ID logger(s) from the service. #[br] Your users will loose access to the service if they are using this logger. #[br] This action cannot be undone.

    br

    .flex-wrap.space-between(style="display: flex; align-items: center; justify-content: space-between;")
        div(v-if="promiseRunning" style="width:100%; height:44px; text-align:center;")
            .loader(style="--loader-color:blue; --loader-size:12px")

        template(v-else)
            button.inline.gray(type="button" @click="openDeleteRecords=false;") Cancel 
            button.inline.red(type="button" @click="deleteRecords") Delete

</template>
<script setup lang="ts">
import Table from "@/components/table.vue";
import Checkbox from "@/components/checkbox.vue";
import Modal from "@/components/modal.vue";
import Pager from "@/code/pager";
import Guide from "./guide.vue";
import RecDetails from './showDetail.vue'

import type { Ref } from "vue";
import { ref, computed, watch, nextTick, reactive } from "vue";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { devLog } from "@/code/logger"
import { currentService, serviceLoggers } from "@/views/service/main";
import { showDropDown } from "@/assets/js/event.js";

// ui/ux related
let openDeleteRecords = ref(false);
let promiseRunning = ref(false);
let tableKey = ref(0);
let fetching = ref(false);
let maxPage = ref(0);
let currentPage: Ref<number> = ref(1);
let endOfList = ref(false);
let showDetail = ref(false);
let showGuide = ref(false);
let hovering = ref(false);
let colspan = 4;

let columnList = reactive([
    {
        name: "Logger ID",
        key: "logger_id",
        value: true,
    },
    {
        name: "Username Key",
        key: "username_key",
        value: true,
    },
    {
        name: "Method",
        key: "method",
        value: true,
    },
    {
        name: "Request URL",
        key: "url",
        value: true,
    },
]);

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

let pager: Pager = null;
let listDisplay = ref(null);

let setUpNewPageList = async () => {
    endOfList.value = false;
    currentPage.value = 1;
    maxPage.value = 0;

    serviceLoggers[currentService.id] = await Pager.init({
        id: "id",
        resultsPerPage: 10,
        sortBy: "id",
        order: "asc",
    });
}

let getPage = async (refresh?: boolean) => {

    pager = serviceLoggers[currentService.id];
    if (!refresh) {
        if ((maxPage.value >= currentPage.value) || endOfList.value) {
            let disp = pager.getPage(currentPage.value);
            maxPage.value = disp.maxPage;
            listDisplay.value = disp.list;

            while (disp.maxPage > 0 && disp.maxPage < currentPage.value && !disp.list.length) {
                currentPage.value--;
            }

            return;
        }
    }

    fetching.value = true;
    let fetchedData = await currentService.registerOpenIDLogger({ req: 'list' })

    pager.endOfList = fetchedData.endOfList;
    endOfList.value = pager.endOfList;

    // insert data in pager
    if (fetchedData.list.length > 0) {
        await pager.insertItems(fetchedData.list);
    }

    // get page from pager
    let disp = pager.getPage(currentPage.value);
    maxPage.value = disp.maxPage;
    listDisplay.value = disp.list;

    while (disp.maxPage > 0 && disp.maxPage < currentPage.value && !disp.list.length) {
        currentPage.value--;
    }

    fetching.value = false;
};

let init = async () => {
    currentPage.value = 1;

    // setup pagers
    if (serviceLoggers[currentService.id] && Object.keys(serviceLoggers[currentService.id]).length) {
        endOfList.value = serviceLoggers[currentService.id].endOfList;
        getPage();

    } else {
        await setUpNewPageList();
        getPage(true);
    }
};

init();

let selectedLogger = ref(null);
let uploading = ref(false);

let upload = async (e: SubmitEvent) => {
    uploading.value = true;

    let { data } = skapi.util.extractFormData(e, { ignoreEmpty: true });

    let jsonData = data;

    try {
        if (jsonData.data) {
            jsonData.data = JSON.parse(jsonData.data);
            if (!jsonData.data) {
                delete jsonData.data;
            }
        }
        if (jsonData.prms) {
            jsonData.prms = JSON.parse(jsonData.prms);
            if (!jsonData.prms) {
                delete jsonData.prms;
            }
        }
        if (jsonData.hder) {
            jsonData.hder = JSON.parse(jsonData.hder);
            if (!jsonData.hder) {
                delete jsonData.hder;
            }
        }
    } catch (err) {
        alert('Invalid JSON data');
        uploading.value = false;
        return;
    }

    if (!jsonData.cdtn?.key) {
        delete jsonData.cdtn;
    }

    try {
        await currentService.registerOpenIDLogger(jsonData);

        if (pager.list[jsonData.is]) {
            await pager.editItem(jsonData);
        } else {
            await pager.insertItems([jsonData]);
        }

        getPage();

        showDetail.value = false;
    } catch (err: any) {
        alert(err.message);
        throw err;
    } finally {
        uploading.value = false;
    }
};

let deleteRecords = () => {
    promiseRunning.value = true;

    let deleteIds = Object.keys(checked.value)

    let promise = deleteIds.map(id => {
        currentService.registerOpenIDLogger({ req: "delete", id });
    })

    Promise.all(promise)
        .then(async (r) => {
            for (let id of deleteIds) {
                for (let i = 0; i < listDisplay.value.length; i++) {
                    if (listDisplay.value[i].record_id == id) {
                        listDisplay.value.splice(i, 1);
                    }
                }
                await pager.deleteItem(id);
            }

            getPage();

            checked.value = {};
            promiseRunning.value = false;
            openDeleteRecords.value = false;
        });
};

// checks
let checked: any = ref({});

</script>

<style scoped lang="less">
textarea::placeholder {
    opacity: 0.5;
}

.updown {
    background-color: #fff;
    background-color: var(--main-color);
    border-radius: 50%;
    margin-left: 8px;
    cursor: pointer;
    box-shadow: rgba(41, 63, 230, 0.24) 0px 1px 8px;
}

.moreVert {
    .inner {
        padding-top: 0.25rem;

        &>* {
            padding: 0.25rem 0.5rem;
        }

        padding-bottom: 0.25rem;
    }
}

#searchForm {
    // max-width: 700px;
    margin: 0 auto;

    .inner {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
    }

    // .customSelect {
    //     flex-grow: 1;
    // }
    .search {
        position: relative;
        flex-grow: 50;

        .icon {
            &:hover {
                @media (pointer: fine) {
                    color: var(--main-color) !important;
                }
            }

            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            user-select: none;

            &::before {
                display: none;
            }
        }
    }

    .groupWrap {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 6px;
        border-style: hidden;
        cursor: pointer;
        user-select: none;

        .group {
            position: relative;
            height: 44px;
            padding: 10px;
            flex-grow: 1;
            text-align: center;
            background-color: #fff;
            color: rgba(0, 0, 0, 0.4);
            fill: rgba(0, 0, 0, 0.4);

            svg {
                width: 23px;
                height: 23px;
                vertical-align: unset !important;
            }

            &::after {
                position: absolute;
                content: "";
                top: 0;
                left: -1px;
                bottom: 0;
                right: 0;
                border: 1px solid rgba(0, 0, 0, 0.5);
            }

            &:first-child {
                border-radius: 6px 0 0 8px;

                &::after {
                    border-radius: 6px 0 0 8px;
                }
            }

            &:nth-child(2) {
                &::after {
                    border-left: 0;
                }
            }

            &:last-child {
                border-radius: 0 8px 8px 0;

                &::after {
                    border-left: 0;
                    border-radius: 0 8px 8px 0;
                }
            }

            &.active {
                background-color: rgba(41, 63, 230, 0.05);
                color: var(--main-color);
                fill: var(--main-color);

                &::after {
                    border: 1px solid var(--main-color);
                }
            }
        }
    }

    .btn {
        flex-grow: 1;
        width: 140px;
    }

    .advanced {
        font-size: 0.8rem;
        user-select: none;

        .infoBox {
            input {
                outline: 0;
                background-color: rgba(0, 0, 0, 0.05);
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

.recordPart {
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
</style>
