<template lang="pug">
.content
    span.txt-required * required

    .row
        .key
            span.text.required Logger ID
        .value
            input.line(v-model="selectedRecord.id" name='id' placeholder="Logger ID" required)
    .row
        .key
            span.text.required Username Key
        .value
            input.line(v-model="selectedRecord.usr" name='usr' placeholder="unique_identifiers_key_name" required)
    .row
        .key
            span.text.required Request URL
        .value
            input.line(v-model="selectedRecord.url" type="url", name="url" placeholder="https://example.com/api/token=$TOKEN" required)

    .row.line
        .key Request Method
        .value
            select(v-model='selectedRecord.mthd' name='mthd' style="width: 8.75rem;")
                option(value='GET') GET
                option(value='POST') POST

    .row(style='margin-bottom: 1rem')
        .key Condition

    .row
        .key.txt-sm Profile Attribute Name
        .value(style="display:flex; flex-wrap:wrap; gap:10px;")
            input.line(v-model="cdtn.key" type="text", name="cdtn[key]" placeholder="attribute_name")

    .row(:class="{'nonClickable': !cdtn.key}")
        .key.txt-sm Profile Attribute Value
        .value(style="display:flex; flex-wrap:wrap; gap:10px;")
            input.line(v-model="cdtn.value" type="text", name="cdtn[value]" placeholder="attribute value")

    .row.line(:class="{'nonClickable': !cdtn.key}")
        .key.txt-sm Condition
        .value(style="display:flex; flex-wrap:wrap; gap:10px;")
            select(v-model='cdtn.condition' name='cdtn[condition]')
                option(value='=') =
                option(value='>=') Greater or =
                option(value='>') Greater
                option(value='<=') Less or =
                option(value='<') Less
                option(value="ends_with") ends_with

    .row.line(style='align-items: start; flex-direction: column;')
        .key Header [JSON]
        .value(style="width: 100%;")
            textarea(v-model="selectedRecord_hder" name="hder" @keydown.stop="handleKey" style="width:100%;height:160px;resize: none;tab-size: 2;font-family: monospace;white-space: pre;" placeholder='{ "key": "value" }')

    .row.line(v-if='selectedRecord.mthd === "POST"' style='align-items: start; flex-direction: column;')
        .key Post Body [JSON]
        .value(style="width: 100%;")
            textarea(v-model="selectedRecord_data" name="data" @keydown.stop="handleKey" style="width:100%;height:160px;resize: none;tab-size: 2;font-family: monospace;white-space: pre;"
                placeholder='{ "key": "value" }')

    .row(v-if='selectedRecord.mthd === "GET"' style='align-items: start; flex-direction: column;')
        .key Get Parameter [JSON]
        .value(style="width: 100%;")
            textarea(v-model="selectedRecord_data" name="prms" @keydown.stop="handleKey" style="width:100%;height:160px;resize: none;tab-size: 2;font-family: monospace;white-space: pre;"
                placeholder='{ "key": "value" }')

    input(hidden name="service" :value='service')
    input(hidden name="owner" :value='owner')
    input(hidden name='req' value='create')

</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { user } from "@/code/user";
import { currentService } from "@/views/service/main";

let service = currentService.id;
let owner = currentService.owner;

let { data } = defineProps({
    data: Object,
});

let def: any = {
    id: "",
    usr: "",
    url: "",
    mthd: "GET",
    hder: "",
    prms: "",
    data: "",
    cdtn: {
        key: "",
        value: "",
        condition: "=",
    },
};

let cdtn = ref(def.cdtn);
let selectedRecord_data = ref("");
let selectedRecord_hder = ref("");
let selectedRecord = ref(def);

function load(rec: any) {
    rec = rec || def;
    selectedRecord.value = rec;
    selectedRecord_hder.value = rec.hder
        ? JSON.stringify(rec.hder || null, null, 2)
        : "";

    if (selectedRecord.value.mthd === "GET") {
        selectedRecord_data.value = rec.prms
            ? JSON.stringify(rec.prms, null, 2)
            : "";
    } else {
        selectedRecord_data.value = rec.data
            ? JSON.stringify(rec.data, null, 2)
            : "";
    }

    cdtn.value = rec.cdtn || def.cdtn;

    if (!cdtn.value.condition) {
        cdtn.value.condition = "=";
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
</script>
<style lang="less">
.content {
    .file {
        .removeFile {
            cursor: pointer;
        }

        .filename {
            display: inline-block;
            vertical-align: middle;
            max-width: 100%;
            min-width: 270px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--main-color);

            @media (pointer: fine) {
                &:hover {
                    text-decoration: underline;
                }
            }

            font-weight: 500;
            cursor: pointer;
            margin-bottom: 4px;
        }

        input.line.key {
            margin-bottom: 4px;
        }
    }

    .add {
        width: 100%;
        text-align: center;
        padding: 6px 0;
        color: var(--main-color);
        background-color: #293fe60d;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }
}

// new styles (임시 - 추후 삭제될 수도 있음)
.content {
    .value {
        min-width: fit-content;
        width: fit-content;
        margin: 0;
        flex: 1;

        // background: linear-gradient(
        //     0deg,
        //     rgba(255, 255, 255, 0.05) 0%,
        //     rgba(255, 255, 255, 0.05) 100%
        // ),
        // #16171a;
        //     height: 2.75rem;
        //     display: flex
        //     align-items: center;
        //     padding: 0 1rem;
        //     border-radius: 0.5rem;
    }

    .row {
        margin-bottom: 1.5rem;
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem 1rem;
        flex-wrap: wrap;

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
        width: 170px;
        font-weight: 500;
    }

    .value {
        input {
            width: 100%;
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

    // .key {
    //     width: calc(170px - 2.5rem);
    // }

    // .value {
    //     border-left: 1px solid rgba(255, 255, 255, 0.2);
    //     padding-left: 1rem;
    // }
}

@media (max-width: 430px) {
    .content {
        .row {
            gap: 0.5rem 1.25rem;
        }
    }
}
</style>
