<template lang="pug">
section.ui-wrap
    .page-header
        .page-title UI guide
        button.inline.sm.gray(@click="router.push('/my-servicess')")
            span Go Service List
    hr
    .page-desc.
        This is a UI guide for Skapi. It shows how the UI components look like and how to use them.
        You can use this as a reference when building your own UI components.
        It is not meant to be used as a design system, but rather as a guide for the UI components.

    h2 Buttons
    p color
    button default
    button.red .red
    button.gray .gray
    button.dark .dark
    br
    br
    p inline/block
    button.inline .inline
    button.block .block
    br
    br
    p variation
    button.gray.caution .gray.caution
    button.gray.selected .gray.selected
    button.dark.selected .dark.selected
    br
    br
    p small size
    button.sm .sm
    button.red.sm .red
    button.gray.sm .gray
    button.dark.sm .dark
    br
    br
    p disabled
    button.disabled .disabled
    button.red.disabled .red.disabled
    button.gray.disabled .gray.disabled
    button.dark.disabled .dark.disabled
    
    br
    br
    br
    hr

    h2 Submit / Cancel
    p Submit is always on the right side:
    div
        button.gray(type="button") Cancel
        | &nbsp;
        button(type="button") Submit
        
    br
    br
    hr

    h2 Input 
    p 
    input.inline(placeholder="input.inline")
    br
    br
    input.block(placeholder="input.block")
    br
    br
    input.inline(placeholder="input.inline(disabled)" disabled)
    br
    br
    input.block(placeholder="input.block(disabled)" disabled)
    br
    br
    br
    hr

    h2 Form

    p Form submit is on the right side:

    form(style='max-width:400px;')
        label
            span.label Input
            input.block(placeholder="Enter something")
        
        label
            span.label Input
            input.block(placeholder="Enter something")

        label
            span.label.required Input
            input.block(placeholder="Enter something")

        br

        div(style='text-align:right')
            button.inline(type="submit") Submit
    
    br

    p Use &lt;a&gt; for additional form option:

    form(style='max-width:400px;')
        label
            span.label Input
            input.block(placeholder="Enter something")
        
        label
            span.label Input
            input.block(placeholder="Enter something")

        br

        div(style='display:flex;justify-content:space-between;align-items:center;')
            span
                | Other&nbsp;
                a(href='/') options
            button.inline(type="submit") Submit

    br
    br
    hr

    h2 Modal
    p default
    .dialog(style='max-width:400px;')
        .modal-title Modal Title
        .modal-desc This is a modal description.
        .modal-btns
            button.inline.gray(type="button") Cancel
            button.inline(type="button") Submit
    p detail (edit/view)
    .dialog.modal-scroll
        .modal-close
            svg.svgIcon
                use(xlink:href="/basic-icon.svg#icon-x")
        form.modal-container
            .modal-header
                .title Modal Title
            .modal-body
                .content
                    label
                        span.label label
                        input.block(placeholder="Enter something")
                    br
                    label
                        span.label label
                        input.block(placeholder="Enter something")
                    br
                    label
                        span.label label
                        input.block(placeholder="Enter something")
            .modal-footer
                button.inline(type="button") SAVE

    br
    br
    br
    br
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import Modal from "@/components/modal.vue";
const router = useRouter();
const route = useRoute();
</script>
<style lang="less" scoped>
.ui-wrap {
    margin: 0 auto;
    padding: 5rem 20px;
    max-width: 1000px;
}

form {
    >label {
        margin-bottom: 16px;
    }
}
</style>