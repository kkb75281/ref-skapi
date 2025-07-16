<template lang="pug">
dialog(ref='dialog' @keydown.esc.prevent="emit('close')" :class="modalClass")
    slot
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";

// ** 기본 모달 제외 (스크롤 가능한 모달 경우) '.modal-scroll' 클래스명 추가하여 사용 (ex. Modal.modal-scroll)

let props = defineProps({
    open: Boolean,
    variant: {
        type: String,
        default: "default",
    },
});

const emit = defineEmits(["close"]);
const dialog = ref(null);

const modalClass = computed(() => {
    if (props.variant === "modal") {
        return "modal";
    }
    return ""; // 기본 스타일
});

onMounted(() => {
    if (props.open) {
        dialog.value.showModal();
    }
});

watch(
    () => props.open,
    (nv) => {
        if (nv) {
            dialog.value.showModal();
        } else {
            dialog.value.close();
        }
    }
);
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

    .modal-prev,
    .modal-close {
        position: absolute;
        top: 1.5rem;
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

    .modal-prev {
        left: 1.5rem;
    }

    .modal-close {
        right: 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;

        &:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
    }

    .modal-title {
        font-size: 1.75rem;
        font-weight: 500;
        margin: 0 0 1rem;
    }

    .modal-desc {
        // max-width: 350px;
        margin: 0 auto;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.3;
        color: rgba(102, 102, 102, 1);
        margin-bottom: 2rem;
    }
}

// 모달 스타일 추가 (스크롤O) :: s
dialog {
    &::-webkit-scrollbar {
        width: 0.5rem;
        height: 20px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 12px 12px 12px 12px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    label {
        &.flex {
            display: flex;
            flex-direction: column;
        }

        span.label {
            width: fit-content;
        }
    }
}

.modal-scroll {
    background-color: #16171a;
    padding: 0 2rem;
    text-align: left;
    width: calc(100% - 1rem);
    max-height: calc(100% - 1rem);
    max-width: 50rem;

    button {
        padding: 0.875rem 1rem;
        max-width: 6.25rem;
        margin-left: auto;
    }

    .modal-header {
        padding: 1.5rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid rgba(225, 225, 225, 0.1);
    }

    .title {
        font-size: 2rem;
        font-weight: 500;
        line-height: 1.3;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .btn-close {
        background-color: transparent;
        padding: 0.5rem;
        max-width: fit-content;
    }

    .modal-body {
        padding: 2rem 0;
    }

    .content {
        padding: 0;
        font-size: 1rem;
    }

    .modal-footer {
        padding: 2rem 0;
        border-top: 1px solid rgba(225, 225, 225, 0.1);
        text-align: right;
    }

    // 기존 구조에 맞춰서 스타일링
    .modal-title {
        padding: 1.5rem 0;
        border-bottom: 1px solid rgba(225, 225, 225, 0.1);
        margin-bottom: 0;
    }
}

// 모달 스타일 추가 (스크롤O) :: e

.search-modal {
    max-width: 560px;
    width: 100%;
    background-color: unset;
    padding: 0;
    border-radius: 0;

    .top,
    .bottom {
        background-color: rgba(22, 23, 26, 1);
        border-radius: 7px;
        margin-bottom: 1rem;
    }

    .top {
        position: relative;
        padding: 8px;

        .search-for {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;

            svg {
                fill: #666;
                margin: 0 8px;
            }
        }

        .search-input {
            position: relative;
            width: 100%;

            &.readonly {
                cursor: pointer;

                input {
                    cursor: pointer;
                }
            }

            input {
                background: unset;
            }

            svg {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                fill: #666;
                cursor: pointer;
            }
        }
    }

    .bottom {
        padding: 1rem 1rem 1.5rem;

        .tit {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.8rem;
        }

        .key-desc {
            .key {
                font-size: 0.9rem;
                margin-right: 10px;

                .name {
                    padding: 2px 8px;
                    margin-right: 8px;
                    background-color: #1f1f1f;
                    border: 1px solid #222;
                    border-radius: 6px;
                    color: #666;
                }

                .action {
                    color: #555;
                }
            }
        }
    }
}

@media (max-width: 430px) {
    dialog {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
        border-radius: 0;
        padding: 4rem 1.5rem;
    }
}
</style>
