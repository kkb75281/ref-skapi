<template lang="pug">
._toggle(:class="{'active': active, 'nonClickable' : disabled}")
    .toggleBg
        .toggleBtn
</template>
<script setup>
let { active } = defineProps({
    active: Boolean,
    disabled: Boolean,
});
</script>
<style lang="less">
._toggle {
    opacity: 1;
    cursor: pointer;

    &.locked {
        opacity: 0.4;
    }

    &.active {
        .toggleBg {
            background-color: var(--main-color);

            .toggleBtn {
                right: 3px;
                transition: ease-in 0.05s;
            }
        }
    }

    .toggleBg {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 48px;
        height: 24px;
        border-radius: 16px;
        background-color: #2c2d2f;
        transition: ease-in 0.05s;
        padding: 2px;
        box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
        .toggleBtn {
            position: absolute;
            width: 18px;
            height: 18px;
            top: 3px;
            right: 26px;
            border-radius: 50%;
            background-color: white;
            transition: ease-in 0.05s;
            box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
        }
    }
}
</style>
