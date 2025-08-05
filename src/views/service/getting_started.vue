<template lang="pug">
section.page-header
    .page-title Getting Started
    a.btn-docs(href='https://docs.skapi.com/introduction/getting-started.html' target="_blank")
        button.inline.icon-text.sm.gray
            img(src="@/assets/img/landingpage/icon_docs.svg" alt="Documentation Icon")
            | Go Docs

hr

section
    .middle-title Credentials
    .info-value-set
        .info-edit-wrap
            .info
                .title Service ID
                .value(style="max-width: 32rem;") {{ currentService.id }}
            button.only-icon.gray.edit-btn(type="button" @click="")
                .icon
                    svg
                        use(xlink:href="/material-icon.svg#icon-copy")
        .info-edit-wrap
            .info
                .title Service Owner
                .value(style="max-width: 32rem;") {{ currentService.owner }}
            button.only-icon.gray.edit-btn(type="button" @click="")
                .icon
                    svg
                        use(xlink:href="/material-icon.svg#icon-copy")

section
    .middle-title For AI-Driven Development
    p.page-desc Skapi works seamlessly with AI-driven development environments like OpenAI's Codex and Anthropic's Claude. #[br]Simply download the necessary markdown files below to your project folder:

    b Download:&nbsp;&nbsp;&nbsp;&nbsp;
    a.downlink(href="https://docs.skapi.com/skapi.md" download="skapi.md") skapi.md
    span &nbsp;&nbsp;|&nbsp;&nbsp;
    a.downlink(href="https://docs.skapi.com/skapi-types.md" download="skapi-types.md") skapi-types.md
    span &nbsp;&nbsp;|&nbsp;&nbsp;
    a.downlink(href="https://docs.skapi.com/SYSTEM.md" download="SYSTEM.md") SYSTEM.md

    br
    br

    b Important: 
    p.page-desc Rename the `SYSTEM.md` file to an appropriate filename that your coding assistant recognizes. #[br](e.g., `AGENT.md` for OpenAI Codex, `CLAUDE.md` for Anthropic Claude)

section
    .middle-title For HTML Projects
    p.page-desc Add the following code to your HTML website to get started:

    Code
        pre.
            #[span(style="color:#999") &lt;]#[span(style="color:#33adff") script] #[span(style="color:#44E9FF") src]=#[span(style="color:#FFED91") "https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"]#[span(style="color:#999") &gt;&lt;/]#[span(style="color:#33adff") script]#[span(style="color:#999") &gt;]
            #[span(style="color:#999") &lt;]#[span(style="color:#33adff") script]#[span(style="color:#999") &gt;]
                #[span(style="color:#33adff") const] skapi = #[span(style="color:#33adff") new] Skapi(#[span(style="color:#FFED91") "{{ currentService.id }}"], #[span(style="color:#FFED91") "{{ currentService.owner }}"]);
            #[span(style="color:#999") &lt;/]#[span(style="color:#33adff") script]#[span(style="color:#999") &gt;]

section
    .middle-title For SPA Projects
    p.page-desc If you are developing a Single Page Application (SPA), please refer to the following steps:

    p 1. Install the library

    Code
        pre npm install skapi-js

    br

    p 2. Initialize Skapi from your main.js

    Code
        pre.
            #[span(style="color:#999") // main.js]
            #[span(style="color:#44E9FF") import] { Skapi } #[span(style="color:#44E9FF") from] #[span(style="color:#FFED91") "skapi-js"]
            #[span(style="color:#33adff") const] skapi = #[span(style="color:#33adff") new] Skapi(#[span(style="color:#FFED91") "{{ currentService.id }}"], #[span(style="color:#FFED91") "{{ currentService.owner }}"]);
            #[span(style="color:#44E9FF") export] { skapi } #[span(style="color:#999") // Import the instance in your components]

</template>

<script setup>
import Code from '@/components/code.vue';
import { currentService } from '@/views/service/main';
</script>

<style lang="less" scoped>
.middle-title {
    font-size: 26px;
    margin-bottom: 16px;
}

section:not(.page-header) {
    margin-bottom: 3rem;
}

// .downlink {
//     position: relative;
//     margin-right: 1.5rem;

//     &::after {
//         content: '';
//         position: absolute;
//         top: 50%;
//         right: -0.8rem;
//         width: 1px;
//         height: 13px;
//         background-color: #888;
//         transform: translateY(-50%);
//     }

//     &:last-of-type {
//         &::after {
//             display: none;
//         }
//     }
// }</style>