<template lang="pug">
dialog(ref='dialog' @keydown.esc.prevent="emit('close')")
    slot
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
let props = defineProps({
    open: Boolean
});
const emit = defineEmits(['close']);

let dialog = ref(null);

onMounted(() => {
    if (props.open) {
        dialog.value.showModal();
    }
});

watch(() => props.open, nv => {
    if (nv) {
        dialog.value.showModal();
    }
    else {
        dialog.value.close();
    }
});

</script>

<style lang="less">
dialog {
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    outline: none;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

    background-color: rgba(22, 23, 26, 1);
    color: #fff;
    text-align: center;
    padding: 4rem;

    &::backdrop {
        background-color: rgba(0, 0, 0, 0.7);
    }

    .modal-close {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        width: 2rem;
        height: 2rem;
        background-color: transparent;
        border: none;
        cursor: pointer;
        opacity: 0.8;

        &:hover {
            opacity: 1;
        }
    }

    .modal-title {
        font-size: 1.75rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }

    .modal-desc {
        // max-width: 350px;
        margin: 0 auto;
        font-weight: 400;
        line-height: 1.3;
        color: rgba(102, 102, 102, 1);
        margin-bottom: 2rem;
    }
}
</style>