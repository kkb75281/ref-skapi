<template lang="pug">
section.page-header
    .page-title File Hosting
    .flex-wrap
        a.btn-docs(href='https://docs.skapi.com/hosting/hosting.html' target="_blank")
            button.inline.icon-text.sm.gray
                img(src="@/assets/img/landingpage/icon_docs.svg" alt="Documentation Icon")
                | Go Docs

hr

section
    .error(v-if='!user?.email_verified')
        svg
            use(xlink:href="/material-icon.svg#icon-warning")
        router-link(to="/account-setting") Please verify your email address to modify settings.
        
    .error(v-else-if='currentService.service.active == 0')
        svg
            use(xlink:href="/material-icon.svg#icon-warning")
        span This service is currently disabled.

    .error(v-else-if='currentService.service.active < 0')
        svg
            use(xlink:href="/material-icon.svg#icon-warning")
        span This service is currently suspended.

template(v-if='!currentService.service.subdomain')
    section(:class="{disabled: email_is_unverified_or_service_is_disabled}")
        p.page-desc.
            File hosting service let you host files and static websites.
            To host your public files, please register a subdomain.
            The subdomain can only be alphanumeric and hyphen, #[span.wordset should be at least 6 characters minimum and max 32 characters.]

        form#registerForm(@submit.prevent='registerSubdomain')
            .email-alias
                input.block(v-model='subdomain' pattern='^[a-z\\d](?:[a-z\\d\\-]{0,61}[a-z\\d])?$' minlength="6" maxlength="32" :disabled="registerSubdomainRunning" placeholder="your-subdomain" required)

            button.inline(type="submit" :disabled='registerSubdomainRunning')
                template(v-if="registerSubdomainRunning")
                    .loader(style="--loader-color:white; --loader-size:12px")
                template(v-else)
                    | Register

template(v-else)
    section
        .info-value-set
            .info-edit-wrap
                .info
                    .title Storage in-use
                    .value {{ currentService.dirInfo?.size ? getFileSize(currentService.dirInfo?.size || 0) : '...' }}
                .actions-wrap
                    button.only-icon.gray.delete-btn(type="button" @click="removeHosting = true")
                        .icon
                            svg
                                use(xlink:href="/basic-icon.svg#icon-delete")

            .info-edit-wrap
                .info
                    .title URL
                    .value {{ hostUrl}}
                .actions-wrap
                    button.only-icon.gray.edit-btn(type="button" @click="editSubdomain")
                        .icon
                            svg
                                use(xlink:href="/basic-icon.svg#icon-edit")

            .info-edit-wrap
                .info
                    .title 404 Page
                    .value {{ sdInfo?.['404'] || '-' }}
                .actions-wrap
                    button.only-icon.gray.edit-btn(:disabled='email_is_unverified_or_service_is_disabled || isPending' @click="open404FileInp")
                        .icon
                            svg(v-if="sdInfo?.['404']")
                                use(xlink:href="/basic-icon.svg#icon-edit")
                            svg(v-else)
                                use(xlink:href="/material-icon.svg#icon-upload")
                    button.only-icon.gray.edit-btn(v-if='!updatingValue.page404 && sdInfo?.["404"] && sdInfo?.["404"] !== "..."' @click="openRemove404=true")
                        .icon
                            svg
                                use(xlink:href="/basic-icon.svg#icon-delete")

    section
        .table-menu-wrap
            .table-functions
                button.inline.only-icon.gray(aria-label="Refresh CDN" @click="openRefreshCdn=true" :disabled="email_is_unverified_or_service_is_disabled || isPending || fetching")
                    Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                        template(v-slot:tool)
                            .icon
                                svg
                                    use(xlink:href="/basic-icon.svg#icon-refresh")
                        template(v-slot:tip) Refresh CDN
            .table-actions
                button.inline.only-icon.gray(aria-label="Upload Files" @click='uploadFileInp.click()' :disabled="email_is_unverified_or_service_is_disabled || isPending || fetching")
                    input(type="file" hidden multiple @change="e=>uploadFiles(e.target.files, getFileList)" ref="uploadFileInp")
                    Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                        template(v-slot:tool)
                            .icon
                                svg
                                    use(xlink:href="/material-icon.svg#icon-file-plus")
                        template(v-slot:tip) Upload Files
                button.inline.only-icon.gray(aria-label="Upload Folder" @click='uploadFolderInp.click()' :disabled="email_is_unverified_or_service_is_disabled || isPending || fetching")
                    input(type="file" hidden multiple directory webkitdirectory @change="e=>uploadFiles(e.target.files, getFileList)" ref="uploadFolderInp")
                    Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                        template(v-slot:tool)
                            .icon
                                svg
                                    use(xlink:href="/material-icon.svg#icon-folder-plus")
                        template(v-slot:tip) Upload Folder
                button.inline.only-icon.gray(aria-label="Delete Selected" :disabled="email_is_unverified_or_service_is_disabled || isPending || fetching || !Object.keys(checked).length" @click='deleteSelected=true')
                    Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                        template(v-slot:tool)
                            .icon
                                svg
                                    use(xlink:href="/basic-icon.svg#icon-delete")
                        template(v-slot:tip) Delete Selected

        Table(
            @dragover.stop.prevent="e=>{if(isPending) return; e.dataTransfer.dropEffect = 'copy'; dragHere = true;}"
            @dragleave.stop.prevent="dragHere = false;"
            @drop.stop.prevent="e => {dragHere = false; if(!isPending) onDrop(e, getFileList)}"
            :class="{disabled : fetching || isPending || email_is_unverified_or_service_is_disabled, 'dragHere' : dragHere}"
            resizable)
            template(v-if="fetching" v-slot:msg)
                .tableMsg.center
                    .loader(style="--loader-color:white; --loader-size:12px")
                    | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fetching ...
            
            template(v-else-if="!subdomainReady" v-slot:msg)
                .tableMsg.center
                    .loader(style="--loader-color:white; --loader-size:12px")
                    | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subdomain change in process ...
            
            template(v-else-if="!subdomainReady" v-slot:msg)
                .tableMsg.center
                    .loader(style="--loader-color:white; --loader-size:12px")
                    | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subdomain change in process ...

            template(v-else-if="currentService.pending.cdn" v-slot:msg)
                .tableMsg.center
                    .loader(style="--loader-color:white; --loader-size:12px")
                    | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CDN Refresh in process... 

            template(v-else-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
                .tableMsg.center.empty 
                    svg.svgIcon
                        use(xlink:href="/material-icon.svg#icon-upload")
                    | Drag and drop files here
            
            template(v-else-if='uploadProgress.name' v-slot:msg)
                .progress(:style="{ width: uploadProgress.progress + '%', height: '3px', background: 'var(--main-color)', position: 'absolute', top: '58px', left: '0px', zIndex: 1}")
                .tableMsg.left
                    svg.svgIcon.moving(style="margin-right: 13px;")
                        use(xlink:href="/material-icon.svg#icon-upload")
                    | Uploading: /{{ uploadProgress.name }}&nbsp;
                    b ({{ uploadCount[0] }} / {{ uploadCount[1] }})
            
            template(v-slot:head)
                tr
                    th.fixed(style="width:60px;")
                        Checkbox(@click.stop :modelValue="listDisplay && listDisplay.length > 0 && Object.keys(checked).length === listDisplay.length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.name] = d)); else checked = {}; }" :class='{nonClickable: !listDisplay.length}')
                        .resizer.fixed
                    th.left(style='width:320px;')
                        span(@click='toggleSort("name")')
                            | Filename
                            svg.svgIcon(v-if='sortBy === "name" && ascending')
                                use(xlink:href="/material-icon.svg#icon-arrow-drop-down")
                            svg.svgIcon(v-if='sortBy === "name" && !ascending')
                                use(xlink:href="/material-icon.svg#icon-arrow-drop-up")
                        .resizer

                    th(style='width:160px;')
                        span(@click='toggleSort("size")')
                            | Size
                            svg.svgIcon(v-if='sortBy === "size" && ascending')
                                use(xlink:href="/material-icon.svg#icon-arrow-drop-down")
                            svg.svgIcon(v-if='sortBy === "size" && !ascending')
                                use(xlink:href="/material-icon.svg#icon-arrow-drop-up")
                        .resizer
                    th(style='width:220px;')
                        span(@click='toggleSort("upl")')
                            | Uploaded
                            svg.svgIcon(v-if='sortBy === "upl" && ascending')
                                use(xlink:href="/material-icon.svg#icon-arrow-drop-down")
                            svg.svgIcon(v-if='sortBy === "upl" && !ascending')
                                use(xlink:href="/material-icon.svg#icon-arrow-drop-up")

            template(v-slot:body)
                template(v-if="fetching || isPending || !subdomainReady || currentService.pending.cdn || uploadProgress.name || !listDisplay || listDisplay.length === 0")
                    tr.nohover(v-for="i in 10")
                        td(colspan="4")

                //- template(v-else-if='uploadProgress.name')
                    .progress( :style="{ width: uploadProgress.progress + '%', height: '3px', background: 'var(--main-color)', position: 'absolute'}")
                    tr.uploadState(style="position:relative")
                        td
                            svg.svgIcon.moving()
                                use(xlink:href="/material-icon.svg#icon-upload")
                        td.left(colspan="3")
                            | Uploading: /{{ uploadProgress.name }}&nbsp;
                            b ({{ uploadCount[0] }} / {{ uploadCount[1] }})

                template(v-else)
                    tr.nohover(:class='{hoverRow:currentDirectory}' @click='currentDirectory = currentDirectory.split("/").length === 1 ? "" : currentDirectory.split("/").slice(0, -1).join("/")')
                        td
                            svg.svgIcon
                                use(xlink:href="/material-icon.svg#icon-folder-open-fill")

                        td.left(colspan="3")
                            | {{hostUrl}}/{{ currentDirectory ? currentDirectory + '/' : '' }}
                
                    tr.hoverRow(v-for="(ns, i) in listDisplay" @click='()=>{ns.name[0] != "#" ? openFile(ns) : currentDirectory = setNewDir(ns) }')
                        td
                            Checkbox(@click.stop :modelValue="!!checked?.[ns?.name]" @update:modelValue="(value) => { if (value) checked[ns?.name] = value; else delete checked[ns?.name]; }")

                        td.overflow.left(v-if='ns.name[0] == "#"')
                            svg.svgIcon(style='height: 22px; width: 22px; vertical-align: sub;')
                                use(xlink:href="/material-icon.svg#icon-folder-fill")
                            | &nbsp;{{ ns.name.slice(1) }}
                        td.overflow.left(v-else) {{ ns.name }}
                        td.overflow {{ getFileSize(ns.size) }}
                        td.overflow {{ new Date(ns.upl).toLocaleString() }}

                    tr(v-for="i in (10 - listDisplay.length)")
                        td(colspan="4")

    .table-page-wrap
        button.inline.only-icon.gray(aria-label="Previous" @click="currentPage--;" :disabled="fetching || currentPage <= 1")
            .icon
                svg
                    use(xlink:href="/material-icon.svg#icon-chevron-left")
        button.inline.only-icon.gray(aria-label="Next" @click="currentPage++;" :disabled="fetching || endOfList && currentPage >= maxPage")
            .icon
                svg
                    use(xlink:href="/material-icon.svg#icon-chevron-right")

    .dragPopup(:class="{'show' : dragHere}")
        svg.svgIcon(style="width: 64px; height: 64px; fill: white")
            use(xlink:href="/material-icon.svg#icon-upload-cloud")
        p Drop your files to upload

//- modal :: refresh CDN
Modal(:open="openRefreshCdn")
    .modal-title Refresh CDN

    .modal-desc.
        If you have overwritten files, 
        #[br]
        you can refresh the CDN #[span.wordset to apply the changes.]
        #[br]
        While in process you will not be #[span.wordset able to upload or delete files.]
        #[br]
        This process will take a few minutes.

    .modal-btns
        .loader-wrap(v-if='isPending')
                .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(@click="openRefreshCdn = false") Cancel
            button.btn-delete(@click="refreshCdn") Refresh

//- modal :: change subdomain
Modal(:open="modifyMode.subdomain")
    .modal-close(@click="modifyMode.subdomain = false;")
        svg.svgIcon
            use(xlink:href="/basic-icon.svg#icon-x")

    .modal-title Change Subdomain

    .modal-desc
        | Enter a new subdomain for the hosting service.
        br
        | (Minimum 6 characters)

    form(@submit.prevent="changeSubdomain")
        .subdomain
            input.block(ref="focus_subdomain" :disabled="updatingValue.subdomain || null" type="text" pattern='^[a-z\\d](?:[a-z\\d\\-]{0,61}[a-z\\d])?$' minlength="6" maxlength="32" placeholder="your-subdomain" required :value='inputSubdomain' @input="(e) => {e.target.setCustomValidity(''); inputSubdomain = e.target.value;}" style="padding-right: 88px;")

        .modal-btns
            .loader-wrap(v-if='updatingValue.subdomain')
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else)
                button.block(type="submit") Save

//- modal :: delete selected
Modal.modal-deleteSel(:open="deleteSelected" @close="deleteSelected = false")
    .modal-title Delete Files

    .modal-desc Delete {{ Object.keys(checked).length }} file(s) from your hosting? #[br] This action cannot be undone.

    .modal-btns
        .loader-wrap(v-if="modalPromise")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(@click="deleteSelected = false") Cancel
            button.red.btn-delete(@click="deleteFiles") Delete

//- modal :: remove hosting
Modal.modal-removeHosting(:open="removeHosting" @close="removeHosting=false")
    .modal-title Remove Hosting

    .modal-desc Are you sure you want to remove hosting? #[br] This will remove all the files and release your subdomain address. #[br] This action cannot be undone.

    .modal-btns
        .loader-wrap(v-if="modalPromise")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(@click="removeHosting = false") Cancel
            button.red.btn-delete(@click="remove") Remove

//- modal :: upload 404 page
Modal.modal-upload404(:open="modifyMode.page404" @close="modifyMode.page404 = false; selected404File = null;")
    .modal-close(@click="modifyMode.page404 = false; selected404File = null;")
        svg.svgIcon
            use(xlink:href="/basic-icon.svg#icon-x")

    .modal-title Upload 404 Page

    .modal-desc
        | Upload a custom 404 page for your hosting service.
        br
        | (HTML file only)

    form(@submit.prevent="change404")
        input(ref="focus_404" hidden type="file" name='file' required @change="handle404file" :disabled='updatingValue.page404' accept="text/html")
        input.block(:placeholder="selected404File || 'Click here to select a file'" readonly)
        button.block.gray(type="button" @click='focus_404.click()' style="margin-top: 0.75rem;") Browse File
        .modal-btns
            .loader-wrap(v-if="updatingValue.page404")
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else)
                button.block.btn-save(type="submit" :disabled="!selected404File") Save

//- modal :: remove 404
Modal.modal-remove404(:open="openRemove404" @close="openRemove404=false")
    h4.modal-title Remove 404

    .modal-desc Would you like to remove the 404 page? #[br] This will revert the 404 page to the default one.

    .modal-btns
        .loader-wrap(v-if="modalPromise")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray.btn-cancel(@click="openRemove404 = false") Cancel
            button.red.btn-delete(@click="remove404") Remove
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, nextTick } from "vue";
import { user } from "@/code/user";
import { currentService } from "@/views/service/main";
import { getFileSize } from "@/code/admin";
import {
    serviceFolders,
    uploadFiles,
    onDrop,
    currentDirectory,
    uploadCount,
    uploadProgress,
} from "@/views/service/hosting/file";
import Table from "@/components/table.vue";
import Modal from "@/components/modal.vue";
import Pager from "@/code/pager";
import Tooltip from "@/components/tooltip.vue";
import Checkbox from "@/components/checkbox.vue";

let folders = {}; // cache folders
let domain = import.meta.env.VITE_DOMAIN;

let email_is_unverified_or_service_is_disabled = computed(
    () => !user?.email_verified || currentService.service.active <= 0
);

let isPending = computed(
    () =>
        currentService.pending.subdomain ||
        currentService.pending.cdn ||
        !subdomainReady.value
);
let sdInfo = computed(() => currentService.subdInfo);

// fileinputs
let uploadFileInp = ref(null);
let uploadFolderInp = ref(null);

let dragHere = ref(false);
let registerSubdomainRunning = ref(false);
let modalPromise = ref(false);

let refreshCdn = async () => {
    openRefreshCdn.value = false;
    await currentService.refreshCDN();
    // currentService.refreshCDN({
    //     checkStatus: res => {
    //         cdnPending.value = false;
    //     }
    // });
};

let subdomain = ref(""); // register input value. not the actual subdomain
let registerSubdomain = async () => {
    registerSubdomainRunning.value = true;
    try {
        await currentService.registerSubdomain({
            subdomain: subdomain.value,
            cb: (srvc) => {
                registerSubdomainRunning.value = false;
                // getInfo();
            },
        });
    } catch (err: any) {
        registerSubdomainRunning.value = false;
        alert(err.message);
    }
};

// edit/change
let openRefreshCdn = ref(false);
let modifyMode = reactive({
    subdomain: false,
    page404: false,
});
let updatingValue = reactive({
    subdomain: false,
    page404: false,
});
let focus_subdomain = ref();

let inputSubdomain = "";
let editSubdomain = () => {
    inputSubdomain = hostUrl.value.split(".").slice(0, -2).join(".");
    modifyMode.subdomain = true;
    nextTick(() => {
        focus_subdomain.value.focus();
    });
};

// modal
let focus_404 = ref();
let selected404File = ref(null);
let open404FileInp = async () => {
    modifyMode.page404 = true;
    await nextTick();
    focus_404.value.click();
};

let handle404file = (e: any) => {
    let file = e.target?.files?.[0];
    let fileName = file.name;

    if (!file) {
        selected404File.value = null;
        return;
    }

    selected404File.value = fileName;
};

let progress404 = ref(0);
let change404 = async (e: any) => {
    const file = e.target?.elements?.file?.files?.[0];
    if (!file) {
        return;
    }

    updatingValue.page404 = true;

    try {
        let up = await currentService.uploadHostFiles(e, {
            progress: (p) => {
                progress404.value = Math.floor(p.progress);
            },
        });

        // get current 13 digit timestamp
        let pager = folders["!"].pager;

        await pager.editItem({
            name: up.completed[0].name,
            size: up.completed[0].size,
            upl: Date.now(),
        });

        getFileList();

        await currentService.set404({
            path: up.completed[0].name,
        });

        currentService.subdInfo["404"] = up.completed[0].name;

        modifyMode.page404 = false;
        updatingValue.page404 = false;
        progress404.value = 0;
        selected404File.value = null;
    } catch (err: any) {
        updatingValue.page404 = false;
        alert(err.message);
    }
};

let openRemove404 = ref(false);
let remove404 = async () => {
    modalPromise.value = true;

    try {
        const current404File = currentService.subdInfo["404"];

        await currentService.set404({
            path: null,
        });

        delete currentService.subdInfo["404"];

        // 테이블에서도 해당 파일 제거
        if (current404File && folders["!"]) {
            const pager = folders["!"].pager;
            if (pager.list?.[current404File]) {
                await pager.deleteItem(current404File);
                // 현재 페이지가 루트 디렉토리일 때만 리스트 업데이트
                if (!currentDirectory.value) {
                    getFileList();
                }
            }
        }

        openRemove404.value = false;
        selected404File.value = null;
    } catch (err: any) {
        alert(err.message);
    } finally {
        modalPromise.value = false;
    }
};

let removeHosting = ref(false);
let remove = () => {
    modalPromise.value = true;
    currentService
        .registerSubdomain()
        .then(() => {
            removeHosting.value = false;
            modalPromise.value = false;
        })
        .catch((err) => {
            modalPromise.value = false;
            alert(err.message);
        });
};

let changeSubdomain = async () => {
    if (currentService.service.subdomain === inputSubdomain) {
        modifyMode.subdomain = false;
        return;
    }

    if (
        inputSubdomain.charAt(0) == "-" &&
        inputSubdomain.charAt(inputSubdomain.length - 1) == "-"
    ) {
        alert("Subdomains cannot start or end with a hyphen.");
        return;
    }

    if (/--/.test(inputSubdomain)) {
        alert("Hyphens cannot be used consecutively.");
        return;
    }

    updatingValue.subdomain = true;

    try {
        await currentService.registerSubdomain({
            subdomain: inputSubdomain,
        });
    } catch (err: any) {
        alert(err?.message || err.toString());
        throw err;
    } finally {
        modifyMode.subdomain = false;
        updatingValue.subdomain = false;
    }
};

let retriveCachedFolders = () => {
    let sd = currentService.service.subdomain;
    if (!sd) {
        return "";
    }

    let subd = "";
    if ((sd && sd[0] === "*") || sd[0] === "+") {
        subd = sd.slice(1) + "." + domain;
    } else {
        subd = sd + "." + domain;
    }

    if (serviceFolders?.[sd] && Object.keys(serviceFolders[sd]).length) {
        folders = serviceFolders[sd];
    } else {
        serviceFolders[sd] = folders;
    }

    return subd;
};

let hostUrl = computed(retriveCachedFolders);

retriveCachedFolders();

let listDisplay = ref([]);
let sortBy = ref("name");
let ascending = ref(true);
let currentPage = ref(1);
let endOfList: any = reactive({});
let maxPage = ref(0);
let fetching = ref(true); // init value should be true

// checks
let checked: any = ref({});
// let checkedall = ref(false);
// let checkall = () => {
//     for (let i in listDisplay.value) {
//         checked.value[listDisplay.value[i].name] = checkedall.value;
//     }
// }
// let noSelection = computed(() => {
//     for (let i in checked.value) {
//         if (checked.value[i]) {
//             return false;
//         }
//     }
//     return true;
// });

let deleteSelected = ref(false);

let deleteFiles = async () => {
    modalPromise.value = true;
    let toDel = [];
    for (let i in checked.value) {
        if (checked.value[i]) {
            toDel.push(
                (() => {
                    for (let v of listDisplay.value) {
                        if (v.name === i) {
                            return v;
                        }
                    }
                })()
            );
        }
    }

    try {
        let currDir = currentDirectory.value || "!";
        let pager = folders[currDir].pager;

        // 404 파일이 삭제 대상에 포함되어 있는지 확인
        const current404File = currentService.subdInfo?.["404"];
        const is404FileDeleted = toDel.some(
            (file) => file.name === current404File
        );

        await currentService.deleteHostFiles({
            paths: toDel.map(
                (v) =>
                    v.path +
                    "/" +
                    (() => {
                        let n = v.name;
                        if (n[0] == "#") {
                            return n.slice(1) + "/";
                        }
                        return n;
                    })()
            ),
        });

        for (let v of toDel) {
            await pager.deleteItem(v.name);
        }

        // 404 파일이 삭제되었다면 404 설정도 해제
        if (is404FileDeleted && current404File) {
            await currentService.set404({
                path: null,
            });
            delete currentService.subdInfo["404"];
        }

        getFileList().then(() => {
            // when empty, go back a page
            if (!listDisplay.value.length && currentPage.value > 1) {
                currentPage.value--;
            }
        });

        deleteSelected.value = false;
        checked.value = {};
        // checkedall.value = false;
    } catch (err: any) {
        alert(err.message);
    } finally {
        modalPromise.value = false;
    }
};

// let numberOfSelected = computed(() => {
//     let n = 0;
//     for (let i in checked.value) {
//         if (checked.value[i]) {
//             n++;
//         }
//     }
//     return n;
// });

let subdomainReady = computed(() => {
    let sd = currentService.service.subdomain;
    if (!sd) {
        return "no-subdomain";
    }
    return (
        (currentService.subdInfo.stat &&
            currentService.subdInfo.stat === "active") ||
        currentService.subdInfo.stat === "tracked"
    );
});

if (currentService.dirInfo.path) {
    fetching.value = false;
}

watch(
    () => currentService.dirInfo.path,
    (n, o) => {
        if (n) {
            getFileList("conditional").then(() => {
                fetching.value = false;
            });
        }
    },
    {
        immediate: true,
    }
);

watch(
    subdomainReady,
    (n, o) => {
        if (n) {
            if (n !== "no-subdomain") {
                // currentDirectory.value = "";
                fetching.value = true;
                currentService.getDirInfo();
            }
        }
    },
    {
        immediate: true,
    }
);

let setNewDir = (ns: any) => {
    let path = ns.path;
    path = path.split("/");
    if (path.length > 1) {
        return path.slice(1).join("/") + "/" + ns.name.slice(1);
    }

    return ns.name.slice(1);
};

watch(currentDirectory, (n) => {
    getFileList();
});

async function getFileList(refresh: string | boolean = false) {
    if (!refresh && fetching.value) return;

    let resultsPerPage = 10;
    fetching.value = true;

    let currDir = currentDirectory.value || "!";
    let hasPage = folders?.[currDir]?.pager;

    let pager = null;

    if (hasPage) {
        pager = folders[currDir].pager;
        maxPage.value = Math.ceil(pager.map.length / pager.resultsPerPage);
    }

    if (!hasPage || (refresh && refresh !== "conditional")) {
        folders[currDir] = {
            pager: await Pager.init({
                id: "name",
                sortBy: sortBy.value,
                order: ascending.value ? "asc" : "desc",
                resultsPerPage,
            }),
        };
        maxPage.value = 0;
        currentPage.value = 1;
        endOfList[currDir] = false;
    }

    pager = folders[currDir].pager;

    if (refresh && refresh !== "conditional") {
        checked.value = {};
    }

    if (
        (refresh && refresh !== "conditional") ||
        (!endOfList[currDir] && currentPage.value > maxPage.value)
    ) {
        try {
            let l = await currentService.listHostDirectory(
                { dir: currentDirectory.value },
                !(refresh || maxPage.value == 0)
            );
            if (l.list.length > 0) {
                await pager.insertItems(l.list);
                let fl = pager.getPage(currentPage.value);
                listDisplay.value = fl.list;
                maxPage.value = fl.maxPage;
                endOfList[currDir] = l.endOfList;
            } else {
                listDisplay.value = [];
                endOfList[currDir] = true;
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            fetching.value = false;
        }
    } else if (
        endOfList[currDir] ||
        (maxPage.value && currentPage.value <= maxPage.value)
    ) {
        let fl = pager.getPage(currentPage.value);
        listDisplay.value = fl.list;
        maxPage.value = fl.maxPage;
        fetching.value = false;
    }

    // let chk: any = {};
    // for (let lk in listDisplay.value) {
    //     chk[listDisplay.value[lk].name] = false;
    // }

    // checked.value = chk;
}

function openFile(ns: any) {
    let path = ns.path;
    let url;
    if (path.split("/").length > 1) {
        url = `https://${hostUrl.value}/${path.split("/").slice(1).join("/")}/${
            ns.name
        }`;
    } else {
        url = `https://${hostUrl.value}/${ns.name}`;
    }

    window.open(url, "_blank");
}

let resetIndex = async () => {
    let currDir = currentDirectory.value || "!";
    await folders[currDir].pager.resetIndex({
        sortBy: sortBy.value,
        order: ascending.value ? "asc" : "desc",
    });
    if (currentPage.value !== 1) {
        currentPage.value = 1;
    } else {
        getFileList();
    }
};

let toggleSort = (search: any) => {
    if (fetching.value || !listDisplay.value.length) {
        // if no list or fetching no nothing
        return;
    }

    if (sortBy.value === search) {
        ascending.value = !ascending.value;
    } else {
        sortBy.value = search;
    }
};

// call getPage when currentPage changes
watch(currentPage, (n, o) => {
    if (
        n !== o &&
        n > 0 &&
        (n <= maxPage.value ||
            (n > maxPage.value && !endOfList[currentDirectory.value || "!"]))
    ) {
        // if new value is different from old value
        // if new value is within maxPage
        // if new value is greater than maxPage but not end of list

        getFileList();
    } else {
        currentPage.value = o; // revert back to old value
    }
});

// initialize the pager when searchFor changes
watch(sortBy, (n) => {
    if (!fetching.value) {
        let currDir = currentDirectory.value || "!";
        if (endOfList[currDir]) {
            resetIndex();
        } else {
            getFileList(true);
        }
    }
});

watch(ascending, () => {
    if (!fetching.value) {
        let currDir = currentDirectory.value || "!";
        if (endOfList[currDir]) {
            resetIndex();
        } else {
            getFileList(true);
        }
    }
});
</script>

<style lang="less" scoped>
.page-desc {
    max-width: 620px;
    margin: 2rem auto;
    text-align: center;
}

#registerForm {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    max-width: 620px;
    margin: 0 auto;

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

.dragPopup {
    position: fixed;
    left: 50%;
    bottom: 20px;
    max-width: 300px;
    width: 100%;
    padding: 10px 20px;
    margin: 8px;
    border-radius: 6px;
    transform: translate(-50%, 300px);
    transition: all 0.15s;
    background-color: var(--main-color);
    color: #fff;
    user-select: none;
    pointer-events: none;

    &.show {
        transform: translate(-50%, 0);
    }
}

.moving {
    color: var(--main-color);
    font-size: 24px;
    animation: motion 0.3s linear 1s infinite alternate;
}

.error {
    margin-bottom: 1rem;
}

@keyframes motion {
    0% {
        margin-top: -10px;
    }

    100% {
        margin-top: 0px;
    }
}

@media (pointer: coarse) {
    .hide {
        display: block !important;
    }
}

.subdomain {
    position: relative;

    &::after {
        content: ".skapi.com";
        position: absolute;
        top: 1px;
        right: 1.25rem;
        line-height: 2.75rem;
        color: #999;
        font-size: 0.875rem;
        font-weight: 400;
        pointer-events: none;
        user-select: none;
        z-index: 1;
    }
}
</style>
