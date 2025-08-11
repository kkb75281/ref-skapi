<template lang="pug">
section.page-header
    .page-title Client Secret Key
    a.btn-docs(href='https://docs.skapi.com/api-bridge/client-secret-request.html' target="_blank")
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

section
    .table-menu-wrap
        .table-functions
            button.inline.only-icon.gray(aria-label="Show Columns" @click.stop="(e)=>{showDropDown(e)}")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="/material-icon.svg#icon-columns")
                    template(v-slot:tip) Show Columns

                .moreVert(@click.stop style="--moreVert-left:0;display:none;font-weight:normal;")
                    .inner
                        template(v-for="c in columnList")
                            Checkbox(v-model="c.value" :disabled="c.value && showTableColumns() === 1") {{ c.name }}
            button.inline.only-icon.gray(aria-label="Refresh" @click="getClientSecret" :disabled="!user?.email_verified || currentService.service.active <= 0")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="left")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="/basic-icon.svg#icon-refresh")
                    template(v-slot:tip) Refresh
        .table-actions
            button.inline.only-icon.gray(aria-label="Add Key" @click="openDetailModal(addClient, -1)" :disabled="!user?.email_verified || currentService.service.active <= 0")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="/basic-icon.svg#icon-plus")
                    template(v-slot:tip) Add Key
            button.inline.only-icon.gray(aria-label="Delete Selected" @click="showDeleteMsg=true" :disabled="!Object.keys(checked).length || !user?.email_verified || currentService.service.active <= 0")
                Tooltip(tip-background-color="rgb(45 46 48)" text-color="white" class="right")
                    template(v-slot:tool)
                        .icon
                            svg
                                use(xlink:href="/basic-icon.svg#icon-delete")
                    template(v-slot:tip) Delete Selected

    Table(:key="tableKey" :class="{disabled : !user?.email_verified || currentService.service.active <= 0}" resizable)
        template(v-if="fetching" v-slot:msg)
            .tableMsg.center
                .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
            .tableMsg.center No Records

        template(v-slot:head)
            tr
                th.fixed(style='width:60px;')
                    Checkbox(@click.stop :modelValue="listDisplay && listDisplay.length > 0 && Object.keys(checked).length === listDisplay.length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.name] = d)); else checked = {}; }" style="display:inline-block")
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
                tr.hoverRow(v-for="(cs, index) in listDisplay" @click="openDetailModal(cs, index)")
                    td
                        Checkbox(@click.stop
                            :modelValue="!!checked?.[cs?.name]"
                            @update:modelValue="(value) => { if (value) checked[cs?.name] = value; else delete checked[cs?.name]; }")

                    template(v-for="c in columnList")
                        template(v-if="c.value")
                            td.overflow(v-if="c.key === 'name'") {{ cs?.name }}
                            td.overflow(v-if="c.key === 'client_secret'") {{ cs.client_secret ? cs.client_secret.slice(0,2) + '*'.repeat(cs.client_secret.length - 2) : '' }}
                            td.overflow(v-if="c.key === 'locked'")
                                svg.svgIcon(v-if="cs?.locked" style="fill: white")
                                    use(xlink:href="/material-icon.svg#icon-check")
                template(v-if="Object.keys(listDisplay || {}).length < 10")
                    tr.nohover(v-for="i in 10 - Object.keys(listDisplay || {}).length")
                        td(:colspan="colspan")

    //- .table-page-wrap
        button.inline.only-icon.gray(aria-label="Previous" @click="currentPage--;" :disabled="fetching || currentPage <= 1")
            .icon
                svg
                    use(xlink:href="/material-icon.svg#icon-chevron-left")
        button.inline.only-icon.gray(aria-label="Next" @click="currentPage++;" :disabled="fetching || endOfList && currentPage >= maxPage")
            .icon
                svg
                    use(xlink:href="/material-icon.svg#icon-chevron-right")

// modal :: client secret key detail (edit/add)
Modal.modal-scroll.modal-detailClient(:open="showDetail" @close="closeDetailModal")
    form.modal-container(@submit.prevent='saveKey')
        .modal-header
            h4.title Client Secret Key
            button.btn-close(type="button" @click="closeDetailModal")
                svg.svgIcon
                    use(xlink:href="/basic-icon.svg#icon-x")
        .modal-body
            .content(v-if="showDetail")
                label.row
                    .key Name
                    .value
                        input#keyName.block(type="text" v-model="selectedClient.name" placeholder="myapi" required maxlength="16" @input="e=>e.target.setCustomValidity('')" :disabled='uploading')
                label.row
                    .key Client Secret
                    .value
                        input.block(type="text" v-model="selectedClient.client_secret" placeholder="string1234..." required :disabled='uploading')
                label.row.locked
                    .key Locked &nbsp;
                        Tooltip(tip-background-color="var(--main-color)" text-color="white")
                            template(v-slot:tool)
                                svg.svgIcon
                                    use(xlink:href="/basic-icon.svg#icon-help-circle")
                            template(v-slot:tip)
                                | When LOCKED only signed users can have access to the client secret key.
                    .value
                        Toggle(@click="selectedClient.locked = !selectedClient.locked" :active="selectedClient.locked" :disabled='uploading')
        .modal-footer
            template(v-if="uploading")
                .loader(style="--loader-color:white; --loader-size:12px; margin: 12px;")
            template(v-else)
                button.btn-save(type="submit") SAVE

// modal :: delete client secret key
Modal(:open="showDeleteMsg" @close="showDeleteMsg=false")
    .modal-title Delete Key

    .modal-desc
        | Are you sure you want to delete the selected #[b {{Object.keys(checked).length}} key(s)]?
        br
        | This action cannot be undone.

    .modal-btns
        .loader-wrap(v-if="uploading")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.gray(@click="showDeleteMsg = false;") Cancel
            button.red(@click="deleteKey") Delete

</template>
<script lang="ts" setup>
import Table from "@/components/table.vue";
import Checkbox from "@/components/checkbox.vue";
import Modal from "@/components/modal.vue";
import Tooltip from "@/components/tooltip.vue";
import Toggle from "@/components/toggle.vue";

import { type Ref, ref, nextTick, onMounted, reactive, watch } from "vue";
import { user } from "@/code/user";
import { currentService } from "@/views/service/main";
import { showDropDown } from "@/assets/js/event.js";

// table
let listDisplay = ref(null);
let checked: Ref<{ [key: string]: any }> = ref({});
let fetching = ref(false);
let maxPage = ref(0);
let currentPage = ref(1);
let endOfList = ref(false);
let tableKey = ref(0);
let colspan = 0;
let columnList = reactive([
    {
        name: "Name",
        key: "name",
        value: true,
    },
    {
        name: "Client Secret",
        key: "client_secret",
        value: true,
    },
    {
        name: "Locked",
        key: "locked",
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

// modal
let showDetail = ref(false);
let showDeleteMsg = ref(false);
let uploading = ref(false);
let selectedClientIndex: null | number = null; // -1이면 새로 추가, 0 이상이면 수정
let selectedClient = ref(null);
let addClient = ref({
    name: "",
    client_secret: "",
    locked: false,
});

function checkall() {
    if (Object.keys(checked.value).length) {
        checked.value = {};
    } else {
        listDisplay.value.forEach((client) => {
            checked.value[client.name] = client;
        });
    }
}

onMounted(() => {
    // Initialize the listDisplay with existing client secrets
    getClientSecret();
});

function getClientSecret(): void {
    fetching.value = true;
    listDisplay.value = null;
    checked.value = {};

    setTimeout(() => {
        if (!currentService.service.client_secret) {
            listDisplay.value = [];
            fetching.value = false;
        } else {
            listDisplay.value = [];
            Object.entries(currentService.service.client_secret).forEach(
                ([key, value], i) => {
                    listDisplay.value[i] = {
                        name: key,
                        client_secret: value,
                        locked:
                            (currentService.service?.auth_client_secret || []).indexOf(
                                key
                            ) !== -1,
                    };
                }
            );
        }

        fetching.value = false;
    }, 300);

}

let openDetailModal = (cs: object, i: number) => {
    selectedClientIndex = i;
    selectedClient.value = JSON.parse(JSON.stringify(cs));
    showDetail.value = true;
};

let closeDetailModal = () => {
    selectedClientIndex = null;
    selectedClient.value = null;
    addClient.value = {
        name: "",
        client_secret: "",
        locked: false,
    };
    showDetail.value = false;
};

let deleteKey = async () => {
    if (!Object.keys(checked.value).length) {
        return;
    }

    let authKeys = [];
    let secKeys = {};

    let deleteKeys = Object.keys(checked.value);

    for (const [i, ck] of Object.entries(listDisplay.value)) {
        if (deleteKeys.indexOf(ck.name) !== -1) {
            continue;
        }

        if (ck.locked && authKeys.indexOf(ck.name) === -1) {
            authKeys.push(ck.name);
        }

        Object.assign(secKeys, {
            [ck.name]: ck.client_secret,
        });
    }

    uploading.value = true;

    await currentService
        .setServiceOption({
            client_secret: secKeys,
            auth_client_secret: authKeys,
        })
        .then(() => {
            showDeleteMsg.value = false;
            checked.value = {};
            nextTick(() => {
                listDisplay.value = Object.values(listDisplay.value).filter(
                    (ck) => !deleteKeys.includes(ck.name)
                );
            });
        })
        .catch((err) => {
            window.alert(err.message || err);
        })
        .finally(() => {
            uploading.value = false;
        });
};

let saveKey = async () => {
    let authKeys = [];
    let secKeys = {};

    // Validate selectedClient
    if (
        !selectedClient.value ||
        !selectedClient.value.name ||
        !selectedClient.value.client_secret
    ) {
        let el = document.getElementById("keyName");
        el.focus();
        el.setCustomValidity("Please fill in all required fields.");
        el.reportValidity();
        return;
    }

    // Check for duplicate names
    if (
        listDisplay.value.length &&
        listDisplay.value[selectedClientIndex]?.name !==
        selectedClient.value.name
    ) {
        for (let i = 0; i < listDisplay.value.length; i++) {
            let ck = listDisplay.value[i];
            if (
                ck.name === selectedClient.value.name &&
                i !== selectedClientIndex
            ) {
                let el = document.getElementById("keyName");
                el.focus();
                el.setCustomValidity("The name is already in use.");
                el.reportValidity();
                return;
            }
        }
    }

    // Update the selected client
    if (selectedClientIndex === -1) {
        // 새 클라이언트 키 추가: 마지막 인덱스에 추가
        let lastIndex = 0;

        if (listDisplay.value && listDisplay.value.length) {
            lastIndex = Object.keys(listDisplay.value).length;
        }

        listDisplay.value[lastIndex] = {
            name: selectedClient.value.name,
            client_secret: selectedClient.value.client_secret,
            locked: selectedClient.value.locked,
        };
    } else {
        // 기존 클라이언트 키 수정
        listDisplay.value[selectedClientIndex] = {
            name: selectedClient.value.name,
            client_secret: selectedClient.value.client_secret,
            locked: selectedClient.value.locked,
        };
    }

    // Prepare the keys for update
    for (const [i, ck] of Object.entries(listDisplay.value)) {
        if (ck.locked) {
            authKeys.push(ck.name);
        }
        Object.assign(secKeys, {
            [ck.name]: ck.client_secret,
        });
    }

    uploading.value = true;

    await currentService
        .setServiceOption({
            client_secret: secKeys,
            auth_client_secret: authKeys,
        })
        .then(() => {
            closeDetailModal();
        })
        .catch((err) => {
            window.alert(err.message || err);
        })
        .finally(() => {
            uploading.value = false;
        });
};

// table > show columns
const showTableColumns = () => {
    return columnList.filter((c) => c.value).length;
};
</script>
<style scoped lang="less">
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

        ._tooltip {
            ::v-deep(.tip) {
                max-width: 10rem;
            }
        }
    }
}

.modal-scroll {
    .key {
        .svgIcon {
            width: 1.125rem;
            height: 1.125rem;
        }
    }
}

.error {
    margin-bottom: 1rem;
}

@media (max-width: 430px) {
    .modal-detailClient {
        .row {
            flex-direction: column;
            align-items: flex-start;

            .key {
                width: 100%;
            }

            &.locked {
                flex-direction: row;

                .key {
                    width: 6.25rem;
                }
            }

            .value {
                width: 100%;
            }
        }

        &:hover {
            border-radius: 50%;
            background-color: #293FE61A;
        }
    }
}
</style>
