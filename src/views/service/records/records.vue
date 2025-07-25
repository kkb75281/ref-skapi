<template lang="pug">
section.page-header
    .page-title Database
    a.btn-docs(href='https://docs.skapi.com/api-bridge/client-secret-request.html' target="_blank")
        button.inline.icon-text.sm.gray
            img(src="@/assets/img/landingpage/icon_docs.svg")
            | Go Docs

hr

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
    .table-menu-wrap
        .table-functions
            button.inline.only-icon.gray(@click.stop="(e)=>{showDropDown(e)}")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-checklist-rtl")
                    template(v-slot:tip) Show Columns
                .moreVert(@click.stop style="--moreVert-left:0;display:none;font-weight:normal;")
                    .inner
                        template(v-for="c in columnList")
                            Checkbox(v-model="c.value", style="display: flex;") {{ c.name }}
            .search-ing-btn(v-if="searchValue && searchValue.length > 0 && searchFor !== 'query'")
                span.search-for-value(@click="searchModalOpen = true") {{ searchFor }} / {{ searchValue }} ...
                svg.svgIcon.reset-btn(@click="() => { callParams = {}; resetSearchModal(); }")
                    use(xlink:href="@/assets/img/material-icon.svg#icon-cancel-fill")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-search")
            button.inline.only-icon.gray.search-btn(v-else @click="searchModalOpen = true" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-search")
                    template(v-slot:tip) Search
            button.inline.only-icon.gray(@click="refresh" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-refresh")
                    template(v-slot:tip) Refresh

        .table-actions
            button.inline.only-icon.gray(@click="()=>{ !user.email_verified ? false : selectedRecord = null; showDetail=true; }" :class="{ disabled : showDetail || uploading || fetching || !user?.email_verified || currentService.service.active <= 0}")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-add")
                    template(v-slot:tip) Add Record
            button.inline.only-icon.gray(@click="openDeleteRecords=true" :class="{ disabled : !Object.keys(checked).length || fetching || !user?.email_verified || currentService.service.active <= 0}" )
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-delete")
                    template(v-slot:tip) Delete Selected

    Table(:key="tableKey" :class="{'nonClickable' : !user?.email_verified || currentService.service.active <= 0}" resizable)
        template(v-if="fetching" v-slot:msg)
            .tableMsg.center
                .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
            .tableMsg.center.empty No Records

        template(v-slot:head)
            tr
                th.fixed(style='width:60px;')
                    Checkbox(@click.stop :modelValue="!!Object.keys(checked).length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.record_id] = d)); else checked = {}; }" style="display:inline-block")
                    .resizer.fixed
                template(v-for="c in columnList")
                    th.overflow(v-if="c.value", style="width: 200px")
                        | {{ c.name }}
                        .resizer

        template(v-slot:body)
            template(v-if="fetching || !listDisplay || listDisplay?.length === 0")
                tr.nohover(v-for="i in 10")
                    td(:colspan="colspan")
            template(v-else)
                tr.hoverRow(v-for="(rc, i) in listDisplay" @click="showDetail=true; selectedRecord=rc")
                    td
                        Checkbox(@click.stop
                            :modelValue="!!checked?.[rc?.record_id]"
                            @update:modelValue="(value) => { if (value) checked[rc?.record_id] = value; else delete checked[rc?.record_id]; }")

                    template(v-for="c in columnList")
                        template(v-if="c.value")
                            td.overflow.left(v-if="c.key === 'table'") 
                                span
                                    svg.svgIcon(v-if="rc.table.access_group == 'private' || rc.table.access_group == 99 || rc.table.access_group === 'admin'" style="margin-bottom: 2px")
                                        use(xlink:href="@/assets/img/material-icon.svg#icon-vpn-key-fill")
                                span
                                    svg.svgIcon(v-if="rc.table.access_group == 'authorized' || typeof rc.table.access_group === 'number' && rc.table.access_group > 0" style="margin-bottom: 2px")
                                        use(xlink:href="@/assets/img/material-icon.svg#icon-person-fill")
                                span
                                    svg.svgIcon(v-if="rc.table.access_group == 'public' || rc.table.access_group === 0" style="margin-bottom: 2px")
                                        use(xlink:href="@/assets/img/material-icon.svg#icon-language")
                                span(style="margin-left: 8px") {{ rc?.table?.name }}

                            td(v-if="c.key === 'record_id'")
                                .click.overflow(@click.stop="copyID") {{ rc.record_id }}

                            td(v-if="c.key === 'user_id'") 
                                .click.overflow(@click.stop="copyID") {{ rc.user_id }}

                            td(v-if="c.key === 'reference'")
                                .click.overflow(v-if="rc?.reference" @click.stop="copyID") {{ rc?.reference }}
                                template(v-else) -
                            td.overflow(v-if="c.key === 'index'") 
                                template(v-if="rc?.index") 
                                    span(v-if="typeof(rc?.index?.value) == 'string'") {{ rc?.index?.name }} / "{{ rc?.index?.value }}"
                                    span(v-else) {{ rc?.index?.name }} / {{ rc?.index?.value }}
                                template(v-else) -
                            td.overflow(v-if="c.key === 'tag'") 
                                template(v-if="rc?.tags" v-for="(tag, index) in rc.tags")
                                    span(v-if="rc.tags.length-1 == index") {{ tag }}
                                    span(v-else) {{ tag }}
                                template(v-else) -

                            td.overflow(v-if="c.key === 'files'") {{ countMyFiles(rc) }}
                            td.overflow(v-if="c.key === 'data'") {{ rc.data }}
                            td.overflow(v-if="c.key === 'updated'") {{ new Date(rc.updated).toLocaleString() }}
                            td.overflow(v-if="c.key === 'referenced'") {{ rc.referenced_count }}
                            td.overflow(v-if="c.key === 'ip'") {{ rc.ip }}
                tr.nohover(v-for="i in (10 - listDisplay?.length)")
                    td(:colspan="colspan")

    .table-page-wrap
        button.inline.only-icon.gray(@click="currentPage--;" :class="{ disabled: fetching || currentPage <= 1 }")
            svg.svgIcon
                use(xlink:href="@/assets/img/material-icon.svg#icon-keyboard-arrow-left")
        button.inline.only-icon.gray(@click="currentPage++;" :class="{ disabled: fetching || endOfList && currentPage >= maxPage }")
            svg.svgIcon
                use(xlink:href="@/assets/img/material-icon.svg#icon-keyboard-arrow-right")

// modal :: search
Modal.search-modal(:open="searchModalOpen")
    .top
        #showSearchFor.search-for
            svg.svgIcon
                use(xlink:href="@/assets/img/material-icon.svg#icon-search")
            span {{ searchFor + ' /' }}
        input#searchInput.block(type="text" v-model="searchValue" @keydown="handleSearchKeydown" :placeholder="getSearchPlaceholder()")
    
    .bottom
        .tit Search for
        .flex-wrap.center(style="margin-bottom: 2rem")
            button.inline.gray(v-for="option in searchOptions" :key="option.value" :class="{'selected': searchFor === option.value }" @click="searchFor = option.value;") {{ option.option }}
        .key-desc.flex-wrap.center
            .key(v-if="searchFor !== 'query'")
                span.name enter
                span.action search
            .key
                span.name esc
                span.action to close

    // query 선택시
    .bottom.search-wrap.sel-query(v-if="searchFor === 'query'")
        SearchBox(
            :callSearch="handleSearchBoxSubmit"
            :isInModal="true"
            style="margin: 0;"
        )

// modal :: record detail
Modal.modal-scroll.modal-detailRecord(:open="showDetail" @close="closeModal")
    form.modal-container(@submit.prevent='upload')
        .modal-header
            h4.title {{ selectedRecord?.record_id ? selectedRecord?.record_id : 'Create Record' }}
            button.btn-close(type="button" @click="closeModal")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-close")
        .modal-body
            RecDetails(v-if='showDetail' :data='selectedRecord')
        .modal-footer
            template(v-if="uploading")
                .loader(style="--loader-color:white; --loader-size:12px; margin: 12px;")
            template(v-else)
                button.btn-save(type="submit") SAVE


// modal :: delete records
Modal.modal-deleteRecord(:open="openDeleteRecords" @close="openDeleteRecords=false")
    .modal-title(style='color: var(--caution-color)') Delete Records

    .modal-desc You sure want to delete {{ Object.values(checked).filter(value => value === true).length > 1 ? Object.values(checked).filter(value => value === true).length + ' records' : 'the record'}}? #[br] This action cannot be undone.

    .modal-btns
        .loader-wrap(v-if="promiseRunning")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(type="button" @click="openDeleteRecords=false;") Cancel 
            button.red.btn-delete(type="button" @click="deleteRecords") Delete
</template>
<script setup lang="ts">
import Table from "@/components/table.vue";
import Checkbox from "@/components/checkbox.vue";
import Modal from "@/components/modal.vue";
import Pager from "@/code/pager";
import Guide from "./guide.vue";
import SearchBox from "./searchbox.vue";
import RecDetails from "./showDetail.vue";

import type { Ref } from "vue";
import {
    ref,
    computed,
    watch,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
} from "vue";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { devLog } from "@/code/logger";
import { currentService, serviceRecords } from "@/views/service/main";
import { showDropDown } from "@/assets/js/event.js";
import Tooltip from "@/components/tooltip.vue";

// table columns
let tableKey = ref(0);
let colspan = 0;
let columnList = reactive([
    {
        name: "Table",
        key: "table",
        value: true,
    },
    {
        name: "User ID",
        key: "user_id",
        value: false,
    },
    {
        name: "Reference",
        key: "reference",
        value: true,
    },
    {
        name: "Index",
        key: "index",
        value: false,
    },
    {
        name: "Tag",
        key: "tag",
        value: false,
    },
    {
        name: "Record ID",
        key: "record_id",
        value: true,
    },
    {
        name: "Updated",
        key: "updated",
        value: true,
    },
    {
        name: "IP",
        key: "ip",
        value: false,
    },
    {
        name: "Files",
        key: "files",
        value: true,
    },
    {
        name: "Referenced",
        key: "referenced",
        value: true,
    },
    {
        name: "Data",
        key: "data",
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

// ui/ux related
let openDeleteRecords = ref(false);
let promiseRunning = ref(false);
let fetching = ref(false);
let maxPage = ref(0);
let currentPage: Ref<number> = ref(1);
let endOfList = ref(false);
let showDetail = ref(false);
let showGuide = ref(false);
let hovering = ref(false);

// search 관련 변수
const searchModalOpen = ref(false);
const searchFor = ref("record_id");
const searchValue = ref("");
const searchOptions = [
    {
        option: "Record ID",
        value: "record_id",
    },
    {
        option: "Unique ID",
        value: "unique_id",
    },
    {
        option: "Query",
        value: "query",
    },
];

// 검색 placeholder 함수
const getSearchPlaceholder = () => {
    switch (searchFor.value) {
        case "record_id":
            return "Enter record ID...";
        case "unique_id":
            return "Enter unique ID...";
        case "query":
            return "Use advanced search form below...";
        default:
            return "Search...";
    }
};

// 키보드 이벤트
const handleSearchKeydown = (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
    } else if (e.key === "Escape") {
        callParams = {};
        resetSearchModal();
    }
};

// SearchBox에서 submit 이벤트 받음
const handleSearchBoxSubmit = async (formElement) => {
    try {
        await callSearch(formElement);
        resetSearchModal();
    } catch (error) {
        console.error("Search error:", error);
    }
};

// 검색 실행
const performSearch = async () => {
    // Query 검색은 SearchBox 컴포넌트에서 처리
    if (searchFor.value === "query") {
        return;
    }

    try {
        if (searchFor.value === "record_id") {
            callParams = {
                record_id: searchValue.value.trim(),
            };
        } else if (searchFor.value === "unique_id") {
            callParams = {
                unique_id: searchValue.value.trim(),
            };
        }

        await setUpNewPageList();
        searchModalOpen.value = false;
        searchFor.value = "record_id";
        currentPage.value = 1;
        getPage(true);
    } catch (error) {
        console.error("Search error:", error);
        alert("Search failed. Please try again.");
    }
};

// searchFor 변경 시 input 스타일 조정
watch(
    searchFor,
    (n, o) => {
        if (n) {
            nextTick(() => {
                const inputElement = document.querySelector("#searchInput");
                const showSearchFor = document.querySelector("#showSearchFor");

                if (!inputElement || !showSearchFor) {
                    return;
                }

                const gcr = showSearchFor.getBoundingClientRect().width || 114;
                inputElement.style.paddingLeft = `${gcr + 8}px`;

                if (n !== "query") {
                    inputElement.focus();
                    inputElement.style.pointerEvents = "auto";
                } else {
                    inputElement.style.pointerEvents = "none";
                }
            });
        }

        if (n !== o) {
            searchValue.value = "";
        }
    },
    { immediate: true }
);

onMounted(() => {
    document.addEventListener("keydown", handleSearchModal);
});

onUnmounted(() => {
    document.removeEventListener("keydown", handleSearchModal);
});

const handleSearchModal = (e: KeyboardEvent) => {
    if (!searchModalOpen.value) return;

    if (e.key === "Escape") {
        callParams = {};
        resetSearchModal();
    }

    if (e.key === "Enter") {
        e.preventDefault();
        performSearch();

        // Query 검색이 아닌 경우에만 간단 검색 실행 (Query 검색 경우 SearchBox 내부에서 처리)
        if (searchFor.value !== "query") {
            performSearch();
        }
    }
};

// 검색 초기화
const resetSearchModal = () => {
    searchModalOpen.value = false;
    searchFor.value = "record_id";
    currentPage.value = 1;
    searchValue.value = "";
    getPage(true);
};

// 새로고침
const refresh = () => {
    if (fetching.value) return;
    fetching.value = true;
    callParams = {};

    // reset pager
    serviceRecords[currentService.id] = null;
    endOfList.value = false;
    currentPage.value = 1;
    maxPage.value = 0;

    // reinitialize
    setUpNewPageList().then(() => {
        getPage(true);
        fetching.value = false;
    });
};

let countMyFiles = (rc: any) => {
    let count = 0;
    if (!rc.bin) return 0;
    for (let k in rc.bin) {
        count += rc.bin[k].length;
    }

    return count;
};

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

let pager: Pager = null;
let listDisplay = ref(null);

let callParams: any = {};

let callSearch = async (e: HTMLFormElement) => {
    let toFetch: {
        data: {
            record_id: string;
            unique_id: string;
            table: {
                name?: string;
                access_group?: string | number;
                subscription?: string;
            };
            index: {
                name?: any;
                value?: any;
                condition?: any;
                range?: any;
            };
            reference?: string;
            tags?: string;
        };
        files: {
            file: File;
            name: string;
        }[];
    } = skapi.util.extractFormData(e, { ignoreEmpty: true });

    if (!toFetch.data?.index?.name) {
        delete toFetch.data.index;
    }

    if (!toFetch.data?.table?.name) {
        if (toFetch.data?.record_id || toFetch.data?.unique_id) {
            callParams = {
                record_id: toFetch?.data?.record_id || undefined,
                unique_id: toFetch?.data?.unique_id || undefined,
            };
        } else {
            callParams = {};
        }
    } else {
        callParams = toFetch.data;
    }
    await setUpNewPageList();
    getPage(true);
};

let setUpNewPageList = async () => {
    endOfList.value = false;
    currentPage.value = 1;
    maxPage.value = 0;

    serviceRecords[currentService.id] = await Pager.init({
        id: "record_id",
        resultsPerPage: 10,
        sortBy: callParams?.index?.name || "record_id",
        order:
            callParams?.index?.name &&
            (callParams?.index?.condition || "").includes("<")
                ? "desc"
                : callParams?.table?.name
                ? "asc"
                : "desc",
    });
};

let getPage = async (refresh?: boolean) => {
    console.log("== getPage실행 ==");
    pager = serviceRecords[currentService.id];
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

    let fetchedData = await skapi
        .getRecords(Object.assign({ service: currentService.id }, callParams), {
            fetchMore: !refresh,
        })
        .catch((err) => {
            alert(err);
            fetching.value = false;
            throw err;
        });

    fetchedData.list.forEach((r) => {
        if (r.bin) {
            // remove getFile function from bin data. Pager cannot handle functions.
            for (let k in r.bin) {
                r.bin[k] = r.bin[k].map((f) => {
                    delete f.getFile;
                    return f;
                });
            }
        }
    });

    // save endOfList status as a Pager property
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
        serviceRecords[currentService.id] &&
        Object.keys(serviceRecords[currentService.id]).length
    ) {
        endOfList.value = serviceRecords[currentService.id].endOfList;
        getPage();
    } else {
        await setUpNewPageList();
        getPage(true);
    }
};

init();

let selectedRecord = ref(null);
let uploading = ref(false);

let upload = async (e: SubmitEvent) => {
    uploading.value = true;

    let { data, files } = skapi.util.extractFormData(e, { nullIfEmpty: true });

    let jsonData = data.data || null;

    try {
        if (jsonData) jsonData = JSON.parse(data.data);
    } catch (err) {
        alert("Invalid JSON data");
        uploading.value = false;
        return;
    }

    let configs = data.config;

    if (!configs.index?.name) {
        delete configs.index;
    }

    try {
        let r = await skapi.postRecord(jsonData, configs, files);

        if (r.bin) {
            // remove getFile function from bin data. Pager cannot handle functions.
            for (let k in r.bin) {
                r.bin[k] = r.bin[k].map((f) => {
                    delete f.getFile;
                    return f;
                });
            }
        }

        if (configs.record_id) {
            await pager.editItem(r);
        } else {
            await pager.insertItems([r]);
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

    skapi
        .deleteRecords({ service: currentService.id, record_id: deleteIds })
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

let copyID = (e) => {
    let target = e.currentTarget;
    let copy = target.textContent;
    let doc = document.createElement("textarea");

    doc.textContent = target.textContent;
    document.body.append(doc);
    doc.select();
    document.execCommand("copy");
    doc.remove();

    target.classList.add("clicked");

    setTimeout(() => {
        target.classList.remove("clicked");
    }, 1000);
};

// checks
let checked: any = ref({});

// close record detail modal
const closeModal = () => {
    showDetail.value = false;
    selectedRecord.value = null;
};
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

    & > * {
        margin-bottom: 8px;
    }
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

// new style (추후 삭제될 수도 있음)
label._checkbox svg {
    margin-right: 0;
}

.content {
    .value {
        margin: 0;
    }

    .add {
        background: #0a4df1;
        color: #fff;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.125rem;
        padding: 0.5rem;
        margin-bottom: 0.5rem;

        svg {
            width: 1.125rem;
            height: 1.125rem;
        }
    }
}

.iconClick {
    font-size: 1rem;
    font-weight: 500;
    color: #fff;

    &.square {
        padding: 0.375rem 0.625rem;
    }

    .svgIcon {
        width: 1.125rem;
        height: 1.125rem;
        fill: #fff;
    }
}

.search-modal {
    .bottom {
        margin-bottom: 0;
    }
}
</style>
