<template lang="pug">
.content
    template(v-if='selectedRecord.record_id')
        .value-wrap.line
            .row
                .key(style='font-weight:normal;') RECORD ID :
                .value {{ selectedRecord?.record_id }}
                // record_id needed for update
                input(:value='selectedRecord?.record_id' name='config[record_id]' hidden)
            .row
                .key(style='font-weight:normal;') USER ID :
                .value {{ selectedRecord?.user_id }}
            .row
                .key(style='font-weight:normal;') UPDATED :
                .value {{ new Date(selectedRecord?.updated).toLocaleString() }}
            .row 
                .key(style='font-weight:normal;') UPLOADED :
                .value {{ new Date(selectedRecord?.uploaded).toLocaleString() }}
            .row 
                .key(style='font-weight:normal;') IP :
                .value {{ selectedRecord?.ip }}
            .row
                .key(style='font-weight:normal;') REFERENCED :
                .value {{ selectedRecord?.referenced_count }}

    label.row.line
        .key Read Only&nbsp;&nbsp;
        .value
            Checkbox(v-model="selectedRecord.readonly" name='config[readonly]' style='vertical-align:text-top;' :disabled='restrictedAccess')

    .row
        .key Table

    .row
        .key.txt-sm Access Group
        .key(style="width: 8.75rem;")
            select(v-model='accessGroup' :disabled='restrictedAccess' style="width: 100%")
                option(value='public') Public
                option(value='authorized') Authorized
                option(value='private') Private
                
        .value(v-if='accessGroup === "authorized"' style='min-width: 300px;')
            //- input.line(required placeholder="1 ~ 99" :value='accessGroup === "authorized" ? 1 : accessGroup' type='number' name='config[table][access_group]' :disabled='restrictedAccess')
            //- input.line(required placeholder="1 ~ 99" :value='typeof selectedRecord.table.access_group === "number" && selectedRecord.table.access_group !== 99 ? selectedRecord.table.access_group : 1' type='number' name='config[table][access_group]' :disabled='restrictedAccess')
            input.line(required placeholder="1 ~ 99" v-model='authorizedValue' type='number' name='config[table][access_group]' min="1" max="99" :disabled='restrictedAccess')

        template(v-else)
            input.line(hidden v-if='accessGroup === "public"' value='public' name='config[table][access_group]' :disabled='restrictedAccess')
            input.line(hidden v-else-if='accessGroup === "private"' value='private' name='config[table][access_group]' :disabled='restrictedAccess')

    .row.line
        .key.txt-sm Table Name
        .value(style='min-width: 300px;')
            input.line(placeholder="Table.Name" name='config[table][name]' v-model='selectedRecord.table.name' required :disabled='restrictedAccess')
    
    //- .row(:class="{'nonClickable': !tableName}")
    //-     .key Subscription
    //-     .value(style='min-width: 300px;')
    //-         input.line(placeholder="xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" name='table[subscription]')

    //- .row(:class="{disabled : selectedRecord.table.access_group == 'public'}")
        label.key(style='width:unset;color:black;')
            | Subscription&nbsp;&nbsp;
            Checkbox(v-model="selectedRecord_subscription" name='config[table][subscription]' :disabled="selectedRecord.table.access_group == 'public'" style='vertical-align:text-top;')

    .row
        .key Index&nbsp;&nbsp;

    .row
        .key.txt-sm Index Name
        .value(style='min-width: 300px;')
            input.line(name='config[index][name]' v-model='indexName' placeholder='Alphanumeric, periods only.' :disabled='restrictedAccess')

    .row.line(:class="{'nonClickable': !indexName}")
        .key.txt-sm Value
        .value(style="display:flex; flex-wrap:wrap; gap:10px;min-width: 300px;")
            select(v-model='indexValueType' :disabled='restrictedAccess' style="width: 8.75rem;")
                option(value='string' selected) String
                option(value='number') Number
                option(value='boolean') Boolean

            input.line(
                v-if="indexValueType !== 'boolean'"
                    v-model='indexValue'
                    name='config[index][value]'
                    :type='indexValueType' :placeholder='indexValueType === "string" ? "Alphanumeric, space only." : indexValueType === "number" ? "Number value" : "Boolean value"'
                    style="flex-grow:30; width:unset; vertical-align:middle;" :disabled='restrictedAccess')
            
            template(v-else)
                label(style='width:unset;display: flex;align-items: center;')
                    input(type='radio' name='config[index][value]' value='true' :checked='indexValue' style='margin:0;width:unset;' :disabled='restrictedAccess')
                    | &nbsp;True
                label(style='width:unset;display: flex;align-items: center;')
                    input(type='radio' name='config[index][value]' value='false' :checked='indexValue ? null : true' style='margin:0;width:unset;' :disabled='restrictedAccess')
                    | &nbsp;False

    input(:value='service' name='config[service]' hidden)
    input(:value='owner' name='config[owner]' hidden)

    .row.line
        .key 
            span Unique_ID
            Tooltip(tip-background-color="var(--main-color)" text-color="white" tip-max-width="12.875rem")
                template(v-slot:tool)
                    svg.svgIcon
                        use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-help-circle")
                template(v-slot:tip)
                    | If null is given, it will remove the previous unique ID when updating.
        .value
            input.line(v-model="selectedRecord.unique_id" name='config[unique_id]' placeholder="Unique ID to set to the record." :disabled='restrictedAccess')

    .row.line
        .key Tags 
        .value
            input.line(v-model="selectedRecord.tags" name='config[tags]' placeholder="Tag1, Tag2, ... Alphanumeric and space only. Separated with comma." :disabled='restrictedAccess')

    .row.line
        .key Reference
        input.line.value(v-model="selectedRecord.reference" name='config[reference]' placeholder='Record ID to reference' :disabled='restrictedAccess')

    .row.line
        .key(style="margin-bottom: 0.5rem") Data (JSON Object)
        textarea.value(:disabled='restrictedAccess' v-model="selectedRecord_data" @keydown.stop="handleKey" :name='accessGroup !== "private" ? "data" : selectedRecord.user_id === user.user_id ? null : "data"'
            placeholder='{ "key": "value" }' style="flex: auto;")

    .row
        .key(style="margin-bottom: 0.5rem") Files 
        .add(:class="{disabled: restrictedAccess}" @click="addFile")
            svg.svgIcon
                use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-plus")
            span &nbsp;Add File
        .value(style="width:100%; flex: auto;")
            // already uploaded files
            .file(v-if="selectedRecord.bin" v-for="(fileList, key) in selectedRecord.bin")
                template(v-for="(file, index) in fileList")
                    div(style='display: flex;gap:8px;' :class="{disabled: restrictedAccess}")
                        svg.svgIcon.clickable(@click="deleteFile(key, index)")
                            use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-x")

                        div(style='display: flex;flex-wrap: wrap; gap:0.5rem 1rem;')
                            input.line.key(style='width:unset;flex-grow:1;' :value="key" required placeholder="Key name for file" disabled)
                            a.filename(:href='file.url' target="_blank") {{ file.filename }}

            // new files
            .file(v-for="(file, index) in addFileList")
                div(style='display: flex;gap:8px;')
                    svg.svgIcon.clickable(@click="addFileList.splice(index, 1)" style="width: 18px; height: 18px;")
                        use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-x")
                    div(style='display: flex;flex-wrap: wrap; gap:0.5rem 1rem;')
                        input.line.key(style='width:unset;flex-grow:1;' v-model="file.key" required placeholder="Key name for file" :disabled='restrictedAccess')
                        label.filename {{ file.filename || "Choose a file"}}
                            input(@click.stop type="file" :name='file.key' @change="e=>{ file.filename = e.target.files[0].name }" required hidden)

        // files to delete
        template(v-for='furl in deleteFileList')
            input(:value='furl' name='config[remove_bin]' hidden)
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from "vue";
import { user } from "@/code/user";
import { currentService } from "@/views/service/main";

import Checkbox from "@/components/checkbox.vue";
import Tooltip from "@/components/tooltip.vue";

let service = currentService.id;
let owner = currentService.owner;

let { data } = defineProps({
    data: Object,
});

let def: any = {
    table: {
        name: "",
        access_group: "public",
        subscription: {
            is_subscription_record: false, // When true, record will be uploaded to subscription table.
            exclude_from_feed: false, // When true, record will be excluded from the subscribers feed.
            notify_subscribers: false, // When true, subscribers will receive notification when the record is uploaded.
            feed_referencing_records: false, // When true, records referencing this record will be included to the subscribers feed.
            notify_referencing_records: false, // When true, records referencing this record will be notified to subscribers.
        },
    },
    index: {
        name: "",
        value: "",
    },
    source: {
        referencing_limit: null, // Default: null (Infinite)
        prevent_multiple_referencing: false, // If true, a single user can reference this record only once.
        only_granted_can_reference: false, // When true, only the user who has granted private access to the record can reference this record.
        can_remove_referencing_records: false, // When true, owner of the record can remove any record that are referencing this record. Also when this record is deleted, all the record referencing this record will be deleted.
        referencing_index_restrictions: null as any,
    },
    unique_id: "",
    reference: "",
    tags: [] as string[],
    readonly: false,
    data: null,
    bin: {},
};

let accessGroup = ref("public");
let authorizedValue = ref(1);
let indexName = ref("");
let indexValueType = ref("string");

let selectedRecord_data = ref("");
let indexValue: Ref<any> = ref("");
let restrictedAccess = ref(false);

// file
let deleteFileList = ref([]);
let addFileList = ref([]);

let selectedRecord = ref(def);

function load(rec: any) {
    rec = rec || def;
    // selectedRecord.value = rec;
    selectedRecord.value = JSON.parse(JSON.stringify(rec));

    deleteFileList.value = [];
    addFileList.value = [];

    // accessGroup.value =
    //     typeof rec.table.access_group === "number" && rec.table.access_group > 0
    //         ? "authorized"
    //         : rec.table.access_group;

    if (typeof rec.table.access_group === "number") {
        accessGroup.value = "authorized";
        authorizedValue.value = rec.table.access_group;
    } else if (rec.table.access_group === "admin") {
        // admin은 99로 처리
        accessGroup.value = "authorized";
        authorizedValue.value = 99;
    } else if (rec.table.access_group === "private") {
        accessGroup.value = "private";
        authorizedValue.value = 1;
    } else {
        accessGroup.value = rec.table.access_group || "public";
        authorizedValue.value = 1;
    }

    indexName.value = rec?.index?.name || "";
    indexValue.value = rec.index?.value || "";

    if (
        rec?.user_id &&
        rec.table.access_group === "private" &&
        rec.user_id !== user?.user_id
    ) {
        restrictedAccess.value = true;
    } else {
        restrictedAccess.value = false;
    }

    if (indexValue.value !== false || indexValue.value !== 0) {
        indexValue.value = indexValue.value || "";
    }

    indexValueType.value = typeof indexValue.value;
    selectedRecord_data.value = JSON.stringify(rec.data || null, null, 2);
    if (Array.isArray(selectedRecord?.value?.tags)) {
        selectedRecord.value.tags = selectedRecord.value.tags.join(", ");
    }
}

watch(
    () => data,
    (newVal) => {
        load(newVal);
    },
    { immediate: true }
);

// textarea tab key
let handleKey = (e: any) => {
    let start = e.target.selectionStart;
    let end = e.target.selectionEnd;
    let beforeCursor = e.target.value.slice(0, start);
    let afterCursor = e.target.value.slice(start);

    if (e.key == "Tab") {
        e.preventDefault();

        e.target.value =
            e.target.value.substring(0, start) +
            "\t" +
            e.target.value.substring(end);
        e.target.setSelectionRange(start + 1, start + 1);
    } else if (e.key == "Enter") {
        e.preventDefault();

        let indentMatch = beforeCursor.match(/(\n|\s)*$/);
        let startCount = indentMatch.input.split("{").length - 1;
        let endCount = indentMatch.input.split("}").length - 1;

        let currentLineStart = beforeCursor.lastIndexOf("\n") + 1;
        let currentIndentation = beforeCursor
            .slice(currentLineStart)
            .match(/^\s*/)[0];
        let newIndentation = currentIndentation + "\t";
        let newCursorPosition = beforeCursor.length + newIndentation.length + 1;

        if (
            (beforeCursor.endsWith("{") && afterCursor.startsWith("}")) ||
            (beforeCursor.endsWith("[") && afterCursor.startsWith("]"))
        ) {
            e.target.value =
                beforeCursor +
                "\n" +
                newIndentation +
                "\n" +
                currentIndentation +
                afterCursor;
            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
        } else {
            if (startCount > endCount) {
                e.target.value =
                    beforeCursor +
                    "\n" +
                    currentIndentation +
                    currentIndentation +
                    afterCursor;
                e.target.setSelectionRange(
                    beforeCursor.length + newIndentation.length,
                    beforeCursor.length + newIndentation.length
                );
            }
        }
    } else if (e.key == "{" && e.shiftKey) {
        e.target.value = beforeCursor + "}" + afterCursor;
        e.target.setSelectionRange(start, start);
    } else if (e.key == "[") {
        e.target.value = beforeCursor + "]" + afterCursor;
        e.target.setSelectionRange(start, start);
    }
};

let addFile = () => {
    addFileList.value.push({ key: "", filename: "" });
    nextTick(() => {
        let scrollTarget = document.querySelector(".detailRecord .content");
        let scrollTargets = document.querySelector(".detail-record .content");

        if (!scrollTarget || !scrollTargets) return;
        scrollTarget.scrollTop = scrollTarget.scrollHeight;
        scrollTargets.scrollTop = scrollTargets.scrollHeight;
    });
};

let deleteFile = (key: string, index: number) => {
    deleteFileList.value.push(
        selectedRecord.value.bin[key].splice(index, 1)[0].url.split("?")[0]
    );
};
</script>
<style lang="less">
.content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    font-size: 0.8rem;

    .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 0;
        margin-bottom: 1.5rem;
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
        gap: 10px;
        font-weight: 500;
        width: 170px;

        ._tooltip {
            svg {
                width: 18px;
                height: 18px;
            }
        }
    }

    .value {
        min-width: fit-content;
        width: fit-content;
        margin: 0;
        flex: 1;

        input {
            width: 100%;
        }
    }

    .file {
        div {
            align-items: center;
            margin-bottom: 0.5rem;
        }

        &:last-of-type {
            div {
                margin-bottom: 0;
            }
        }

        svg {
            flex: none;
            position: relative;
            top: 0.25rem;
        }

        .removeFile {
            cursor: pointer;
        }

        .filename {
            width: fit-content;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            vertical-align: middle;
            max-width: 100%;
            min-width: fit-content;
            overflow: hidden;
            white-space: initial;
            text-overflow: ellipsis;
            color: #fff;
            margin-bottom: 0;

            @media (pointer: fine) {
                &:hover {
                    text-decoration: none;
                }
            }

            font-weight: 500;
            cursor: pointer;
        }
    }

    .add {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0.5rem;
        background: #0a4df1;
        color: #fff;
        margin-bottom: 0.5rem;
        gap: 0.125rem;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;

        svg {
            width: 1.125rem;
            height: 1.125rem;
        }
    }

    textarea {
        background: linear-gradient(0deg,
                rgba(255, 255, 255, 0.05) 0%,
                rgba(255, 255, 255, 0.05) 100%),
            #16171a;
        border: none;
        color: #fff;
        line-height: 1.4;
        padding: 1rem 1.25rem;
        width: 100% !important;
        height: 160px;
        resize: none;
        tab-size: 2;
        font-family: monospace;
        white-space: pre;
        border-radius: 0.5rem;
        outline: none;

        &:focus-visible {
            border: 1px solid #0a4df1;
        }
    }
}

.value-wrap {
    background-color: rgba(225, 225, 225, 0.05);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;

    .row {
        &:last-child {
            margin-bottom: 0;
        }
    }

    &.line {
        margin-bottom: 4rem;
        position: relative;

        &::after {
            content: "";
            display: block;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            width: 100%;
            position: absolute;
            bottom: -2rem;
            left: 0;
        }
    }
}

@media (max-width: 430px) {
    .content {
        .row {
            gap: 0.5rem 1.25rem;
        }
    }
}
</style>
