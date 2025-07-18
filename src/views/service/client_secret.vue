<template lang="pug">
section
    .flex-wrap.space-between
        .page-title Client Secret Key
        .flex-wrap.end
            a(href='https://docs.skapi.com/api-bridge/client-secret-request.html' target="_blank")
                button.inline.sm.gray Go Docs

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
            button.inline.only-icon.gray.sm(@click.stop="(e)=>{showDropDown(e)}")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-checklist-rtl")
                .moreVert(@click.stop style="--moreVert-left:0;display:none;font-weight:normal;")
                    .inner(style="padding: 0.5rem;")
                        Checkbox(v-model="filterOptions.name" style="display:flex;") Name
                        Checkbox(v-model="filterOptions.client_secret" style="display:flex") Client Secret
                        Checkbox(v-model="filterOptions.locked" style="display:flex") Locked
            button.inline.only-icon.gray.sm(@click="getPage(true)" :class="{ disabled: fetching || !user?.email_verified || currentService.service.active <= 0 }")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-refresh")
        .table-actions
            button.inline.only-icon.gray.sm(@click="addKey" :class="{ disabled: !user?.email_verified || currentService.service.active <= 0 }")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-add")
            button.inline.only-icon.gray.sm(@click="deleteClientKey=true" :class="{ disabled : !Object.keys(checked).length || fetching || !user?.email_verified || currentService.service.active <= 0}" )
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-delete")

Table(:class="{'nonClickable' : !user?.email_verified || currentService.service.active <= 0}" resizable)
    template(v-if="!listDisplay || listDisplay?.length === 0" v-slot:msg)
        .tableMsg.center No Records

    template(v-slot:head)
        tr
            th.fixed(style='width:60px;')
                Checkbox(@click.stop :modelValue="!!Object.keys(checked).length" @update:modelValue="(value) => { if (value) listDisplay.forEach((d) => (checked[d.name] = d)); else checked = {}; }" style="display:inline-block")
                .resizer.fixed
            th.overflow(v-if="filterOptions.name" style='width:160px;')
                | Name
                .resizer
            th.overflow(v-if="filterOptions.client_secret" style='width:160px;')
                | Client Secret
                .resizer
            th.overflow(v-if="filterOptions.locked" style='width:160px;')
                | Locked

    template(v-slot:body)
        template(v-if="fetching || !listDisplay || listDisplay?.length === 0")
            tr(v-for="i in 10")
                td(:colspan="colspan")
        template(v-else)
            tr.hoverRow(v-for="(cs, i) in listDisplay" @click="openDetailModal(cs)")
                td
                    Checkbox(@click.stop
                        :modelValue="!!checked?.[cs?.name]"
                        @update:modelValue="(value) => { if (value) checked[cs?.name] = value; else delete checked[cs?.name]; }")

                td.overflow(v-if="filterOptions.name") {{ cs?.name }}
                td.overflow(v-if="filterOptions.client_secret") {{ cs.client_secret ? cs.client_secret.slice(0,2) + '*'.repeat(cs.client_secret.length - 2) : '' }}
                td.overflow(v-if="filterOptions.locked")
                    svg.svgIcon(v-if="cs?.locked" style="fill: white")
                        use(xlink:href="@/assets/img/material-icon.svg#icon-check")
//- form.table-form(@submit.prevent :class='{disabled: !user?.email_verified || currentService.service.active <= 0}')
    .table-tootlip
        Tooltip(tip-background-color="var(--main-color)" text-color="white")
            template(v-slot:tip)
                | When LOCKED only signed users can have access to the client secret key.
    Table
        template(v-slot:head)
            tr
                th.center.fixed(style="width:48px")
                    //- .material-symbols-outlined.notranslate lock
                    //- svg.svgIcon(style="fill: black;")
                        use(xlink:href="@/assets/img/material-icon.svg#icon-lock")
                    .resizer
                th(style="width:200px")
                    | Name
                    .resizer
                th(style="width:400px")
                    | $CLIENT_SECRET
                    .resizer
                th.center(style="width:66px")
                    .resizer

        template(v-slot:body)
            tr(v-if="!client_key.length") 
                td(colspan=4 style="padding-left:20px") No Client Secret Key
            tr(v-for="(key, index) in client_key")
                template(v-if="editMode && key.edit || addMode && key.edit")
                    td.center 
                        //- Checkbox(v-model="key.secure" :disabled='updating')
                        svg.svgIcon.black(@click="key.secure = !key.secure" :class="{ 'reactive' : !updating }" :style="{ opacity : updating ? 0.3 : 1, pointerEvents : updating ? 'none' : 'default' }" style="cursor:pointer")
                            template(v-if="key.secure")
                                use(xlink:href="@/assets/img/material-icon.svg#icon-lock-fill")
                            template(v-else)
                                use(xlink:href="@/assets/img/material-icon.svg#icon-lock-open")
                    td  
                        input#keyName.line(type="text" v-model="key.name" placeholder="myapi" required maxlength="16" @input="e=>e.target.setCustomValidity('')" :disabled='updating')
                    td
                        input.line(type="text" v-model="key.key" placeholder="string1234..." required :disabled='updating')
                    td.center.buttonWrap
                        div(v-if="updating" style="width:100%; text-align:center")
                            .loader(style="--loader-color:blue; --loader-size:12px")
                        template(v-else)
                            //- label.material-symbols-outlined.notranslate.clickable.save(@click="saveKey(key)" style="color:var(--main-color)") done
                            label
                            svg.svgIcon.clickable.save(style="fill: var(--main-color);" @click="saveKey(key)")
                                use(xlink:href="@/assets/img/material-icon.svg#icon-check")
                                input(type="submit" hidden)
                            //- .material-symbols-outlined.notranslate.clickable.cancel(@click="cancelKey(key, index)") close
                            svg.svgIcon.clickable.cancel(style="fill: black;" @click="cancelKey(key, index)")
                                use(xlink:href="@/assets/img/material-icon.svg#icon-close")
                template(v-else)
                    td.center 
                        //- .material-symbols-outlined.notranslate.bold(v-if="key.secure") check
                        svg.svgIcon(v-if="key.secure" style="fill: black")
                            use(xlink:href="@/assets/img/material-icon.svg#icon-check")
                    td.overflow {{ key.name }}
                    td.overflow {{ key.key ? key.key.slice(0,2) + '*'.repeat(key.key.length - 2) : '' }}
                    td.center.buttonWrap
                        template(v-if="!editMode && !addMode")
                            //- .material-symbols-outlined.notranslate.fill.clickable.icon.hide(@click="editKey(key)") edit
                            svg.svgIcon.reactive.clickable.hide(@click="editKey(key)")
                                use(xlink:href="@/assets/img/material-icon.svg#icon-edit-fill")
                            //- .material-symbols-outlined.notranslate.fill.clickable.icon.hide(@click="deleteClientKey = key.name;deleteIndex = index;") delete
                            svg.svgIcon.reactive.clickable.hide(@click="deleteClientKey = !!key.name;deleteIndex = index;")
                                use(xlink:href="@/assets/img/material-icon.svg#icon-delete-fill")

// modal :: client secret key detail
Modal.modal-scroll.modal-detailClient(:open="showDetail" @close="closeDetailModal")
    form.modal-container(@submit.prevent='saveKey')
        .modal-header
            h4.title Client Secret Key
            button.btn-close(type="button" @click="closeDetailModal")
                svg.svgIcon
                    use(xlink:href="@/assets/img/material-icon.svg#icon-close")
        .modal-body
            .content(v-if="showDetail")
                label.row
                    .key Name
                    .value
                        input#keyName.block(type="text" v-model="selectedClient.name" placeholder="myapi" required maxlength="16" @input="e=>e.target.setCustomValidity('')" :disabled='updating')
                label.row
                    .key Client Secret
                    .value
                        input.block(type="text" v-model="selectedClient.client_secret" placeholder="string1234..." required :disabled='updating')
                label.row
                    .key Locked &nbsp;
                        Tooltip(tip-background-color="var(--main-color)" text-color="white")
                            template(v-slot:tip)
                                | When LOCKED only signed users can have access to the client secret key.
                    .value
                        Checkbox(v-model="selectedClient.locked" :disabled='updating' style="font-weight:unset;")
        .modal-footer
            template(v-if="updating")
                .loader(style="--loader-color:blue; --loader-size:12px; margin: 12px;")
            template(v-else)
                button.btn-save(type="submit") SAVE

// modal :: delete client secret key
Modal(:open="deleteClientKey" @close="deleteClientKey=false")
    .modal-title Delete Client Secret

    .modal-desc
        | Are you sure you want to delete #[b "{{deleteClientKey}}"]?
        br
        | This action cannot be undone.

    .flex-wrap.space-between
        .flex-wrap.center(v-if="deleteKeyLoad")
            .loader(style="--loader-color:white; --loader-size:12px")
        template(v-else)
            button.inline.gray(@click="deleteClientKey = false") Cancel
            button.inline.red(@click="delCliKey") Delete

</template>
<script lang="ts" setup>
import Table from '@/components/table.vue';
import Code from '@/components/code.vue';
import Checkbox from '@/components/checkbox.vue';
import Modal from '@/components/modal.vue';
import Tooltip from '@/components/tooltip.vue';

import { type Ref, ref, nextTick } from 'vue';
import { user } from '@/code/user';
import { currentService } from '@/views/service/main';
import { showDropDown } from "@/assets/js/event.js";

// table columns
let filterOptions = ref({
    name: true,
    client_secret: true,
    locked: true,
});

let selectedClient = ref(null);
let backupClient = ref(null);
let showDetail = ref(false);
let uploading = ref(false);

let fetching = ref(false);
let updating = ref(false);
let showDes = ref(false);
let addMode = ref(false);
let editMode = ref(false);
let deleteKeyLoad = ref(false);
let deleteClientKey = ref(false);
let hovering = ref(false);
let deleteIndex = '';
let listDisplay: Ref<{ [key: string]: any } | null> = ref(null);
let client_key = ref([
    // {
    //     edit: false,
    //     secure: true,
    //     name: 'test1',
    //     key: 'dssdlfkjsdakdsjfaiw'
    // },
]);

if (currentService.service.client_secret) {
    listDisplay.value = {};

    for (let key in currentService.service.client_secret) {
        // client_key.value.push({
        //     edit: false,
        //     secure: (currentService.service?.auth_client_secret || []).indexOf(key) !== -1,
        //     name: key,
        //     key: currentService.service.client_secret[key]
        // });

        listDisplay.value[key] = {
            name: key,
            client_secret: currentService.service.client_secret[key],
            locked: (currentService.service?.auth_client_secret || []).indexOf(key) !== -1
        };
    }
}

let openDetailModal = (cs) => {
    console.log('openDetailModal', cs);
    backupClient.value = JSON.stringify(cs);
    selectedClient.value = cs;
    showDetail.value = true;
};

let closeDetailModal = () => {
    if (backupClient.value !== JSON.stringify(selectedClient.value)) {
        if (confirm('You have unsaved changes. Do you want to discard them?')) {
            showDetail.value = false;
            selectedClient.value = null;
        }
    } else {
        showDetail.value = false;
        selectedClient.value = null;
    }
};

let checked: Ref<{ [key: string]: any }> = ref({});
function checkall() {
    if (Object.keys(checked.value).length) {
        checked.value = {};
    } else {
        listDisplay.value.forEach((client) => {
            checked.value[client.name] = client;
        });
    }
}

let delCliKey = async () => {
    deleteKeyLoad.value = true;

    client_key.value.splice(deleteIndex, 1);

    let authKeys = [];
    let secKeys = {};
    for (let i = 0; i < client_key.value.length; i++) {
        let ck = client_key.value[i];

        if (secKeys[ck.name] && secKeys[ck.name] !== ck.key) {
            continue;
        }

        if (ck.secure && authKeys.indexOf(ck.name) === -1) {
            authKeys.push(ck.name);
        }

        Object.assign(secKeys, {
            [ck.name]: ck.key
        });
    }

    await currentService.setServiceOption({
        client_secret: secKeys,
        auth_client_secret: authKeys,
    }).catch(err => {
        window.alert(err.message || err);
    });

    deleteClientKey.value = false;
    deleteKeyLoad.value = false;
}

let edit_key_origin = {};

let addKey = () => {
    client_key.value.unshift({ edit: true, secure: false, name: '', key: '' });
    addMode.value = true;
    nextTick(() => {
        document.getElementById('keyName').focus();
    })
}

let editKey = (key) => {
    key.edit = true;
    editMode.value = true;
    edit_key_origin.name = key.name;
    edit_key_origin.key = key.key;
}

let cancelKey = (key, index) => {
    if (addMode.value) {
        client_key.value.splice(index, 1);
        addMode.value = false;
    } else {
        if (edit_key_origin.name !== key.name || edit_key_origin.key !== key.key) {
            key.name = edit_key_origin.name;
            key.key = edit_key_origin.key;
        }

        key.edit = false;
        editMode.value = false;
    }
}

let saveKey = async () => {
    let authKeys = [];
    let secKeys = {};

    // Validate selectedClient
    if (!selectedClient.value.name || !selectedClient.value.client_secret) {
        let el = document.getElementById('keyName');
        el.focus();
        el.setCustomValidity('Please fill in the name and client secret.');
        el.reportValidity();
        return;
    }

    // Check for duplicate names
    if (listDisplay.value[selectedClient.value.name] && listDisplay.value[selectedClient.value.name] !== selectedClient.value.client_secret) {
        let el = document.getElementById('keyName');
        el.focus();
        el.setCustomValidity('The name is already in use.');
        el.reportValidity();
        return;
    }

    // for (let i=0; i<listDisplay.value.length; i++) {
    //     let ck = listDisplay.value[i];

    //     if (ck.locked && authKeys.indexOf(ck.name) === -1) {
    //         authKeys.push(ck.name);
    //     }

    //     Object.assign(secKeys, {
    //         [ck.name]: ck.client_secret
    //     });
    // }

    // for (let i = 0; i < client_key.value.length; i++) {
    //     let ck = client_key.value[i];

    //     if (secKeys[ck.name] && secKeys[ck.name] !== ck.key) {
    //         let el = document.getElementById('keyName');
    //         el.focus();
    //         el.setCustomValidity('The name is already in use.');
    //         el.reportValidity();
    //         return;
    //     }

    //     if (ck.secure && authKeys.indexOf(ck.name) === -1) {
    //         authKeys.push(ck.name);
    //     }

    //     Object.assign(secKeys, {
    //         [ck.name]: ck.key
    //     });
    // }

    // // loading...
    // updating.value = true;
    // await currentService.setServiceOption({
    //     client_secret: secKeys,
    //     auth_client_secret: authKeys,
    // }).catch(err => {
    //     window.alert(err.message || err);
    // });

    // // loading end
    // updating.value = false;

    // if (addMode.value) {
    //     key.edit = false;
    //     addMode.value = false;
    // } else {
    //     key.edit = false;
    //     editMode.value = false;
    // }
}
</script>
<style scoped lang="less">
.content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
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

.table-form {
    position: relative;

    .table-tootlip {
        position: absolute;
        left: 18px;
        top: 17px;
        z-index: 999;
    }
}

.updown {
    background-color: #fff;
    background-color: var(--main-color);
    border-radius: 50%;
    margin-left: 8px;
    cursor: pointer;
    box-shadow: rgba(41, 63, 230, 0.24) 0px 1px 8px;
}

input {
    width: 100%;
}

table {
    form {
        display: block;
    }

    tr {
        &:hover {
            .hide {
                display: block;
            }
        }

        .hide {
            display: none;
        }
    }

    td,
    th {
        padding: 0 4px 0 10px;
    }
}

.buttonWrap {
    display: flex;
    height: 60px;
    align-items: center;
    gap: 8px;
    padding: 0;
}

.save,
.cancel {
    position: relative;
    font-size: 1.3rem;
    font-weight: 500;
    cursor: pointer;

    &::after {
        position: absolute;
        content: '';
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        padding: 4px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background-color: #293FE61A;
        display: none;
    }

    &:hover::after {
        display: block;
    }

    &:hover {
        border-radius: 50%;
        background-color: #293FE61A;
    }
}

@media (pointer: coarse) {
    .hide {
        display: block !important;
    }
}
</style>