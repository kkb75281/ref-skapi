<template lang="pug">
#localeSelector(:class="{'show' : props.showLocale}" @click.stop)
    .wrap
        .country(v-for="(c, key) in Countries" @click="handleCountryClick(key)" :class="{'selected' : selectedFlag == key}") 
            //- span.flag(v-html="showFlagImg(c.flag_unicode)")
            //- span.flag {{ c.flag }}
            img.flag(:src="'https://flagcdn.com/' + c.code.toLowerCase() + '.svg'" style="width:16px; object-fit:contain")
            .name {{ key }} - {{ c.name }}
</template>
<script setup>
import { Countries } from "@/code/countries";
import { ref, onBeforeUnmount, onMounted } from "vue";

let emit = defineEmits(["close", "update:modelValue"]);
let props = defineProps(["showLocale", "modelValue"]);
let selectedFlag = ref("");

onMounted(() => {
    document.addEventListener("mouseup", closeLocale);
});
onBeforeUnmount(() => {
    document.removeEventListener("mouseup", closeLocale);
});

let showFlagImg = (code) => {
    let codePoints = code.split(" ");
    let htmlEntities = codePoints.map(
        (code) => code.replace("U+", "&#x") + ";"
    );

    return htmlEntities.join("");
};

let handleCountryClick = (key) => {
    selectedFlag.value = key;
    emit("update:modelValue", key);
    emit("close");
};

let closeLocale = (e) => {
    let localeSelector = document.querySelector("#localeSelector");

    if (!localeSelector.contains(e.target)) {
        emit("close");
    }
};
</script>
<style lang="less" scoped>
#localeSelector {
    // width: 340px;
    width: 100%;
    height: 276px;
    overflow: hidden;
    border-radius: 6px;
    // border: 1px solid rgba(0, 0, 0, 0.15);
    // background: #FAFAFA;
    background: #16171a;
    box-shadow: 8px 12px 36px 0px rgba(0, 0, 0, 0.1);
    display: none;

    &.show {
        display: block;
    }

    .wrap {
        height: 100%;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 0.25rem;
            height: 0.25rem;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.5);
            border-radius: 12px 12px 12px 12px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }
    }

    .country {
        display: flex;
        gap: 16px;
        margin: 5px;
        // padding: 6px 10px;
        padding: 14px 16px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;

        &.selected {
            // background-color: rgba(41, 63, 230, 0.05);
            background-color: rgba(255, 255, 255, 0.05);
            // border: 1px solid var(--main-color);
            box-shadow: 0 0 0 1px var(--main-color) inset;
        }

        &:hover {
            // background-color: rgba(41, 63, 230, 0.05);
            background-color: rgba(255, 255, 255, 0.05);
        }

        .name {
            flex: 0.95;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
}
</style>
