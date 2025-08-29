<template lang="pug">
section.page-header
    .page-title Database
    a.btn-docs(href='https://docs.skapi.com/database/create.html' target="_blank")
        button.inline.icon-text.sm.gray
            img(src="@/assets/img/landingpage/icon_docs.svg" alt="Documentation Icon")
            | Go Docs

hr

section
    .error(v-if='!user?.email_verified')
        svg
            use(xlink:href="@/assets/img/icon/material-icon.svg#icon-warning")
        router-link(to="/account-setting") Please verify your email address to modify settings.
        
    .error(v-else-if='currentService.service.active == 0')
        svg
            use(xlink:href="@/assets/img/icon/material-icon.svg#icon-warning")
        span This service is currently disabled.

    .error(v-else-if='currentService.service.active < 0')
        svg
            use(xlink:href="@/assets/img/icon/material-icon.svg#icon-warning")
        span This service is currently suspended.

section
    .table-menu-wrap
        .table-functions
            button.inline.only-icon.gray(aria-label="Show Columns" @click.stop="(e)=>{showDropDown(e)}")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/icon/material-icon.svg#icon-columns")
                    template(v-slot:tip) Show Columns
                .moreVert(@click.stop style="--moreVert-left:0;display:none;font-weight:normal;")
                    .inner
                        template(v-for="c in columnList")
                            Checkbox(v-model="c.value", style="display: flex;" :disabled="c.value && showTableColumns() === 1") {{ c.name }}
            .search-ing-btn(v-if="(searchValue && !searchModalOpen) || (Object.keys(callParams).length > 0 && !searchModalOpen)")
                span.search-for-value(@click="searchModalOpen = true") 
                    template(v-if="searchValue") {{ searchFor }} / {{ searchValue }} ...
                    template(v-else-if="callParams.unique_id") unique_id / {{ callParams.unique_id }} ...
                    template(v-else-if="Object.keys(callParams).length > 0") query / searching ...
                svg.svgIcon.reset-btn(@click="() => {callParams = {}; resetSearchModal();}")
                    use(xlink:href="@/assets/img/icon/material-icon.svg#icon-x-circle")
                svg.svgIcon
                    use(xlink:href="@/assets/img/icon/material-icon.svg#icon-search")
            button.inline.only-icon.gray.search-btn(v-else aria-label="Search" @click="searchModalOpen = true" :disabled="fetching || !user?.email_verified || currentService.service.active <= 0")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/icon/material-icon.svg#icon-search")
                    template(v-slot:tip) Search
            button.inline.only-icon.gray(aria-label="Refresh" @click="refresh" :disabled="fetching || !user?.email_verified || currentService.service.active <= 0")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/icon/basic-icon.svg#icon-refresh")
                    template(v-slot:tip) Refresh

        .table-actions
            button.inline.only-icon.gray(@click="()=>{ !user.email_verified ? false : selectedRecord = null; showDetail=true; }" :disabled="showDetail || uploading || fetching || !user?.email_verified || currentService.service.active <= 0")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/icon/basic-icon.svg#icon-plus")
                    template(v-slot:tip) Add Record
            button.inline.only-icon.gray(@click="openDeleteRecords=true" :disabled="!Object.keys(checked).length || fetching || !user?.email_verified || currentService.service.active <= 0" )
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="@/assets/img/icon/basic-icon.svg#icon-delete")
                    template(v-slot:tip) Delete Selected

    .table-cont-wrap
        Table(:key="tableKey" :class="{'nonClickable' : !user?.email_verified || currentService.service.active <= 0}" resizable)
            template(v-if="fetching" v-slot:msg)
                .tableMsg.center
                    .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
                .tableMsg.center.empty No Records

            template(v-slot:head)
                tr
                    th.fixed(style='width:60px;')
                        Checkbox(@click.stop :modelValue="listDisplay && listDisplay.length > 0 && Object.keys(checked).length === listDisplay.length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.record_id] = d)); else checked = {}; }" style="display:inline-block")
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
                                            use(xlink:href="@/assets/img/icon/material-icon.svg#icon-key")
                                    span
                                        svg.svgIcon(v-if="rc.table.access_group == 'authorized' || typeof rc.table.access_group === 'number' && rc.table.access_group > 0" style="margin-bottom: 2px")
                                            use(xlink:href="@/assets/img/icon/material-icon.svg#icon-user")
                                    span
                                        svg.svgIcon(v-if="rc.table.access_group == 'public' || rc.table.access_group === 0" style="margin-bottom: 2px")
                                            use(xlink:href="@/assets/img/icon/material-icon.svg#icon-globe")
                                    span(style="margin-left: 8px") {{ rc?.table?.name }}

                                td(v-if="c.key === 'record_id'")
                                    .click.overflow(@click.stop="copy(rc.record_id)") {{ rc.record_id }}

                                td(v-if="c.key === 'unique_id'")
                                    .overflow(:class="{'click' : rc.unique_id}" @click.stop="copy(rc.unique_id)" :style="{'pointer-events': rc.unique_id ? 'auto' : 'none'}") {{ rc.unique_id || '-' }}

                                td(v-if="c.key === 'user_id'") 
                                    .click.overflow(@click.stop="copy(rc.user_id)") {{ rc.user_id }}

                                td(v-if="c.key === 'reference'")
                                    .click.overflow(v-if="rc?.reference" @click.stop="copy(rc?.reference)") {{ rc?.reference }}
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
        button.inline.only-icon.gray(aria-label="Previous" @click="currentPage--;" :disabled="fetching || currentPage <= 1")
            .icon
                svg
                    use(xlink:href="@/assets/img/icon/material-icon.svg#icon-chevron-left")
        button.inline.only-icon.gray(aria-label="Next" @click="currentPage++;" :disabled="fetching || endOfList && currentPage >= maxPage")
            .icon
                svg
                    use(xlink:href="@/assets/img/icon/material-icon.svg#icon-chevron-right")

// modal :: search
Modal.search-modal(:open="searchModalOpen")
    .modal-close
        button.btn-close(type="button" @click="resetSearchModal")
            svg.svgIcon
                use(xlink:href="@/assets/img/icon/basic-icon.svg#icon-x")
    .top
        #showSearchFor.search-for
            svg.svgIcon
                use(xlink:href="@/assets/img/icon/material-icon.svg#icon-search")
            span {{ searchFor + ' /' }}
        input#searchInput.block(type="text" spellcheck="false" v-model="searchValue" @keydown="handleSearchKeydown" :placeholder="getSearchPlaceholder()")
    
    .bottom
        .tit Search for
        .flex-wrap.center(style="margin-bottom: 1.5rem")
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
                    use(xlink:href="@/assets/img/icon/basic-icon.svg#icon-x")
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
import SearchBox from "./searchbox.vue";
import RecDetails from "./showDetail.vue";
import Tooltip from "@/components/tooltip.vue";

import type { Ref } from "vue";
import { ref, watch, nextTick, onMounted, onUnmounted, reactive } from "vue";
import { skapi } from "@/main";
import { user } from "@/code/user";
import { currentService, serviceRecords } from "@/views/service/main";
import { showDropDown } from "@/assets/js/event.js";
import { copy } from "@/assets/js/common.js";

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
        name: "Unique ID",
        key: "unique_id",
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
let hovering = ref(false);

// search 관련 변수
const searchModalOpen = ref(false);
const searchFor = ref("record_id" || "unique_id" || "query");
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
        alert("Search failed. Please try again.");
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

    // if (toFetch.data?.table?.access_group) {
    //     if (toFetch.data.table.access_group === "private") {
    //         toFetch.data.table.access_group = "private";
    //     } else if (
    //         toFetch.data.table.access_group === "authorized" ||
    //         toFetch.data.table.access_group === 99 ||
    //         toFetch.data.table.access_group === "admin" ||
    //         (typeof toFetch.data.table.access_group === "number" &&
    //             toFetch.data.table.access_group > 0)
    //     ) {
    //         toFetch.data.table.access_group = "authorized";
    //     } else {
    //         toFetch.data.table.access_group = "public";
    //     }
    // }

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
            listDisplay.value = [];
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

    if (configs?.unique_id && configs.unique_id === "null") {
        configs.unique_id = JSON.parse(configs.unique_id);
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

// checks
let checked: any = ref({});

// close record detail modal
const closeModal = () => {
    showDetail.value = false;
    selectedRecord.value = null;
};

// table > show columns
const showTableColumns = () => {
    return columnList.filter((c) => c.value).length;
};
</script>

<style scoped lang="less">
// new style (추후 삭제될 수도 있음)
.search-modal {
    .search-wrap {
        margin-bottom: 0;
    }
}

.error {
    margin-bottom: 1rem;
}

.tableWrap {
    table {
        td {
            .click {
                &:hover {
                    text-decoration: underline;
                    text-decoration-thickness: 1px;
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

@media (max-width: 480px) {
    .table-menu-wrap {
        .search-ing-btn {
            max-width: 12.75rem;
        }
    }
}
</style>
