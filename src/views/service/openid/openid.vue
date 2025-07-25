<template lang="pug">
section.page-header
    .page-title Open ID Loggers
    a.btn-docs(href='https://docs.skapi.com/api-bridge/client-secret-request.html' target="_blank")
        button.inline.icon-text.sm.gray
            img(src="@/assets/img/landingpage/icon_docs.svg")
            | Go Docs

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
            button.inline.only-icon.gray(@click.stop="(e) => { showDropDown(e); }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-checklist-rtl")
                    template(v-slot:tip) Show Columns
                .moreVert(
                    @click.stop,
                    style="--moreVert-left: 0; display: none; font-weight: normal;"
                    )
                    .inner
                        template(v-for="c in columnList")
                            Checkbox(v-model="c.value") {{ c.name }}
            button.inline.only-icon.gray(@click="getPage(true)" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-refresh")
                    template(v-slot:tip) Refresh
        .table-actions
            button.inline.only-icon.gray(@click="()=>{ !user.email_verified ? false : selectedLogger = null; showDetail=true; }" :class="{ disabled : showDetail || uploading || fetching || !user?.email_verified || currentService.service.active <= 0}")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-add")
                    template(v-slot:tip) Add Logger
            button.inline.only-icon.gray(@click="openDeleteRecords=true" :class="{ disabled : !Object.keys(checked).length || fetching || !user?.email_verified || currentService.service.active <= 0}" )
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-delete")
                    template(v-slot:tip) Delete Selected

    Table(:key="tableKey" :class="{'nonClickable' : fetching || !user?.email_verified || currentService.service.active <= 0}" resizable)
        template(v-if="fetching" v-slot:msg)
            .tableMsg.center
                .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
            .tableMsg.center.empty No Open ID Logger
        template(v-slot:head)
            tr
                th.fixed(style='width:60px;')
                    Checkbox(@click.stop :modelValue="!!Object.keys(checked).length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.id] = d)); else checked = {}; }" style="display:inline-block")
                    .resizer.fixed
                template(v-for="c in columnList")
                    th.overflow(v-if="c.value", style="width: 200px")
                        | {{ c.name }}
                        .resizer
                //- th.overflow(style='width:160px;')
                //-     | Logger ID
                //-     .resizer
                //- th.overflow(style='width:160px;')
                //-     | Username Key
                //-     .resizer
                //- th.overflow(style='width:100px;')
                //-     | Method
                //-     .resizer
                //- th.overflow(style='width:160px;')
                //-     | Request URL
                //-     .resizer
        template(v-slot:body)
            template(v-if="fetching || !listDisplay || listDisplay?.length === 0")
                tr.nohover(v-for="i in 10")
                    td(:colspan="colspan")
            template(v-else)
                tr.hoverRow(v-for="(rc, i) in listDisplay" @click="showDetail=true; selectedLogger=rc")
                    td
                        Checkbox(@click.stop
                            :modelValue="!!checked?.[rc?.id]"
                            @update:modelValue="(value) => { if (value) checked[rc?.id] = value; else delete checked[rc?.id]; }")
                    template(v-for="c in columnList")
                        template(v-if="c.value")
                            td.overflow(v-if="c.key === 'logger_id'") {{ rc.id }}
                            td.overflow(v-if="c.key === 'username_key'") {{ rc.usr }}
                            td.overflow(v-if="c.key === 'method'") {{ rc.mthd }}
                            td.overflow(v-if="c.key === 'url'") {{ rc.url }}

                tr.nohover(v-for="i in (10 - listDisplay?.length)")
                    td(:colspan="colspan")

    .table-page-wrap
        button.inline.only-icon.gray(@click="currentPage--;" :class="{ disabled: fetching || currentPage <= 1 }")
            svg.svgIcon
                use(xlink:href="@/assets/img/material-icon.svg#icon-keyboard-arrow-left")
        button.inline.only-icon.gray(@click="currentPage++;" :class="{ disabled: fetching || endOfList && currentPage >= maxPage }")
            svg.svgIcon
                use(xlink:href="@/assets/img/material-icon.svg#icon-keyboard-arrow-right")

//- modal :: delete records
Modal(:open="openDeleteRecords" @close="openDeleteRecords=false")
    .modal-title Delete Records

    .modal-desc This action will delete {{ Object.keys(checked).length }} open ID logger(s) from the service. #[br] Your users will loose access to the service if they are using this logger. #[br] This action cannot be undone.

    .modal-btns
        .loader-wrap(v-if="promiseRunning")
            .loader(style="--loader-color:white; --loader-size:12px")

        template(v-else)
            button.gray(type="button" @click="openDeleteRecords=false;") Cancel 
            button.red(type="button" @click="deleteRecords") Delete

//- modal :: logger
Modal.modal-scroll.modal-logger(:open="showDetail" @close="showDetail=false; selectedLogger=null;")
    form.modal-container(@submit.prevent='upload')
        .modal-header
            h4.title {{ selectedLogger?.id ? selectedLogger.id : 'Register Logger' }}
            button.btn-close(type="button" @click="showDetail=false; selectedLogger=null;")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-close")
        .modal-body
            RecDetails(v-if='showDetail' :data='selectedLogger')
        .modal-footer
            template(v-if="uploading")
                .loader(style="--loader-color:white; --loader-size:12px; margin: 12px;")
            template(v-else)
                button.btn-save(type="submit") SAVE

</template>
<script setup lang="ts">
import Table from "@/components/table.vue";
import Checkbox from "@/components/checkbox.vue";
import Modal from "@/components/modal.vue";
import Pager from "@/code/pager";
import Guide from "./guide.vue";
import RecDetails from "./showDetail.vue";
import Tooltip from "@/components/tooltip.vue";

import type { Ref } from "vue";
import { ref, computed, watch, nextTick, reactive } from "vue";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { devLog } from "@/code/logger";
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
let colspan = 0;

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
};

let getPage = async (refresh?: boolean) => {
    pager = serviceLoggers[currentService.id];
    if (!refresh) {
        if (maxPage.value >= currentPage.value || endOfList.value) {
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

            return;
        }
    }

    fetching.value = true;
    let fetchedData = await currentService.registerOpenIDLogger({
        req: "list",
    });

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

    while (
        disp.maxPage > 0 &&
        disp.maxPage < currentPage.value &&
        !disp.list.length
    ) {
        currentPage.value--;
    }

    fetching.value = false;
};

let init = async () => {
    currentPage.value = 1;

    // setup pagers
    if (
        serviceLoggers[currentService.id] &&
        Object.keys(serviceLoggers[currentService.id]).length
    ) {
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
        alert("Invalid JSON data");
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

    let deleteIds = Object.keys(checked.value);

    let promise = deleteIds.map((id) => {
        currentService.registerOpenIDLogger({ req: "delete", id });
    });

    Promise.all(promise).then(async (r) => {
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
