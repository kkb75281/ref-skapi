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
    // background: rgba(0, 0, 0, 0.7);
    color: #fff;
    text-align: center;
    padding: 3rem;

    .modal-title {
        font-size: 1.75rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }

    .modal-desc {
        max-width: 350px;
        margin: 0 auto;
        font-weight: 400;
        line-height: 1.3;
        color: rgba(102, 102, 102, 1);
        margin-bottom: 2rem;
    }
}
</style>