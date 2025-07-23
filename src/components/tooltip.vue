<template lang="pug">
._tooltip(:class="classNames" @mouseenter="handleMouseEnter" ref="host")
    .tool
        .tool-icon
            slot(name="tool")
        .tip(:style="{ '--tip-background-color': props.tipBackgroundColor, '--text-color': props.textColor}" ref="tipContainer" :class="class")
            slot(name="tip")
        .tip-arrow(:class="classNames" :style="{ '--tip-background-color': props.tipBackgroundColor }")
</template>

<script setup>
import { ref, nextTick } from "vue";

const props = defineProps({
    tipBackgroundColor: {
        type: String,
        default: "transparent",
    },
    textColor: {
        type: String,
        default: "#000",
    },
    class: {
        type: String,
        default: "",
    },
});

const host = ref(null);
const tipContainer = ref(null);
const classNames = ref("");
const tipBackgroundColor = ref("transparent");

const handleMouseEnter = (e) => {
    const tipEl = tipContainer.value;
    const toolEl = host.value;

    if (!tipEl || !toolEl) return;

    const toolRect = toolEl.getBoundingClientRect();
    const tipHeight = tipEl.offsetHeight;

    const safeMargin = 8; // 위에 최소로 확보하고 싶은 여백

    // 상단 공간 부족하면 아래로 표시
    const shouldFlip = toolRect.top < tipHeight + safeMargin;

    classNames.value = "";
    classNames.value += shouldFlip ? "bottom" : "top";

    // 왼쪽/오른쪽 판단은 유지
    const x = window.innerWidth / 2;
    const isLeft = e.clientX > x;
    classNames.value += isLeft ? " left" : " right";

    nextTick(() => {
        const tipElement = tipContainer.value?.querySelector('[slot="tip"]');
        if (tipElement) {
            const bgColor = window
                .getComputedStyle(tipElement)
                .getPropertyValue("background-color");
            tipBackgroundColor.value = bgColor || "transparent";
        }
    });
};
</script>

<style lang="less" scoped>
._tooltip {
    display: block;
    position: relative !important;
    z-index: 1;

    &.bottom {
        .tip {
            top: calc(100% + 8px);
            bottom: unset;
        }
    }
    &.left {
        .tip {
            left: unset;
            right: 0;
        }
    }
    &:hover {
        .tip {
            display: block;
        }
        .tip-arrow {
            display: block;
        }
    }

    > .tool {
        text-align: inherit;
    }

    .tool-icon {
        display: inline-block;
        cursor: pointer;

        svg {
            height: 20px;
            width: 20px;
            fill: #aaa !important;
        }
    }

    .tip {
        width: max-content;
        display: none;
        position: absolute;
        box-sizing: border-box;
        bottom: calc(100% + 8px);
        top: unset;
        left: 0;
        right: unset;
        z-index: 999;
        white-space: pre-wrap;
        text-align: left;

        background-color: var(--tip-background-color); // 배경색 적용
        color: var(--text-color); // 텍스트 색상 적용
        padding: 8px;
        font-size: 0.8rem;
        border-radius: 0.375rem;
    }

    .tip-arrow {
        display: none;
        position: absolute;
        width: 0;
        height: 0;
        left: 50%;
        transform: translateX(-50%);

        &.top {
            top: unset;
            bottom: calc(100% + 4px);
            border: 4px solid transparent;
            border-bottom-width: 0;
            border-top-width: 4px;
            border-top-color: var(--tip-background-color);
        }
        &.bottom {
            z-index: 1;
            top: calc(100% + 4px);
            bottom: unset;
            border: 4px solid transparent;
            border-top-width: 0;
            border-bottom-width: 4px;
            border-bottom-color: var(--tip-background-color);
        }
    }
}

.table-menu-wrap {
    ._tooltip {
        .tip {
            bottom: calc(100% + 18px);

            &.left {
                left: -10px;
            }

            &.right {
                left: initial;
                right: -10px;
            }
        }

        .tip-arrow {
            &.top {
                bottom: calc(100% + 14px);
            }
        }
    }
}
</style>
