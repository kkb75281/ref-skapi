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
                .value {{ currentService.id }}
            .actions-wrap
                button.only-icon.gray.edit-btn(type="button" @click="copy(currentService.id)")
                    .icon
                        svg
                            use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-copy")
        .info-edit-wrap
            .info
                .title Service Owner
                .value.owner {{ currentService.owner }}
            .actions-wrap
                button.only-icon.gray.edit-btn(type="button" @click="copy(currentService.owner)")
                    .icon
                        svg
                            use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-copy")

section
    .middle-title For AI-Driven Development
    p.page-desc
        | Skapi works seamlessly with AI-driven development environments such as OpenAI Codex and Anthropic Claude Code.
        br
        | To enable AI-driven development, download the API documentation and default prompts so your AI model understands how to integrate the Skapi API into your project.
        br
        | Download the files below to your project folder:

    .download-file-wrap
        .download-file
            .file-icon
                svg
                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-file-text")
            .file-name skapi.md
            .file-desc Skapi API documentation in Markdown format.
            button.only-icon.gray.file-download(type="button" @click="downloadFile('@/assets/download/skapi.md', 'skapi.md')")
                .icon
                    svg
                        use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-download")

        .download-file
            .file-icon
                svg
                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-file-text")
            .file-name skapi-types.md
            .file-desc Detailed information on all Skapi API data types.
            button.only-icon.gray.file-download(type="button" @click="downloadFile('@/assets/download/skapi-types.md', 'skapi-types.md')")
                .icon
                    svg
                        use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-download")

        .download-file
            .file-icon
                svg
                    use(xlink:href="/material-icon.svg?v=20250829065753667#icon-file-text")
            .file-name SYSTEM.md
            .file-desc The default system prompt for AI coding assistants.
            button.only-icon.gray.file-download(type="button" @click="downloadFile('@/assets/download/SYSTEM.md', 'SYSTEM.md')")
                .icon
                    svg
                        use(xlink:href="/basic-icon.svg?v=20250829065753667#icon-download")

    .important-wrap
        .important-icon
            svg
                use(xlink:href="/material-icon.svg?v=20250829065753667#icon-alert-triangle")
        p.important-text Rename the `SYSTEM.md` file to an appropriate filename that your coding assistant recognizes. (e.g., `AGENT.md` for OpenAI Codex, `CLAUDE.md` for Anthropic Claude)


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
import { copy, downloadFile } from '@/assets/js/common.js'
</script>

<style lang="less" scoped>
.middle-title {
    font-size: 26px;
    margin-bottom: 16px;
}

section:not(.page-header) {
    margin-bottom: 3rem;
}

.download-file-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;
}

.download-file {
    position: relative;
    padding: 1.25rem;
    flex: 1;
    min-width: 300px;
    background-color: #121214;
    border-radius: 13px;

    @media (max-width: 430px) {
        min-width: unset;
        width: 100%;
    }

    .file-icon {
        padding: 8px 0;
        margin-bottom: 0.5rem;

        svg {
            width: 1.75rem;
            height: 1.75rem;
        }
    }

    .file-name {
        font-size: 1.2rem;
    }

    .file-desc {
        width: 100%;
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 5px;
        opacity: 0.7;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    button {
        position: absolute;
        right: 20px;
        top: 20px;
    }
}

.important-wrap {
    display: flex;
    flex-wrap: wrap;
    padding: 1.25rem;
    gap: 1rem;
    border-radius: 13px;
    background-color: rgba(240, 78, 78, 0.15);

    svg {
        width: 1.75rem;
        height: 1.75rem;
        opacity: 0.9;
    }

    p {
        margin: 0;
        opacity: 0.9;
        line-height: 28px;
    }
}
</style>