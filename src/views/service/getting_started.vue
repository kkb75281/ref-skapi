<template lang="pug">
section
    .page-title Getting Started

    hr

    p Service Name: {{ currentService.service.name }}
    p.desc Add the following code to your HTML website to get started:

    Code(style="margin: 36px 0 60px 0")
        pre.
            #[span(style="color:#999") &lt;]#[span(style="color:#33adff") script] #[span(style="color:#44E9FF") src]=#[span(style="color:#FFED91") "https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"]#[span(style="color:#999") &gt;&lt;/]#[span(style="color:#33adff") script]#[span(style="color:#999") &gt;]
            #[span(style="color:#999") &lt;]#[span(style="color:#33adff") script]#[span(style="color:#999") &gt;]
                #[span(style="color:#33adff") const] skapi = #[span(style="color:#33adff") new] Skapi(#[span(style="color:#FFED91") "{{ currentService.id }}"], #[span(style="color:#FFED91") "{{ currentService.owner }}"]);
            #[span(style="color:#999") &lt;/]#[span(style="color:#33adff") script]#[span(style="color:#999") &gt;]

    .middle-title For SPA Projects
    p.desc If you are developing a Single Page Application (SPA), please refer to the following steps:
    p(style='margin-bottom: 0') 1. Install the library

    Code(style="margin: 20px 0 40px")
        pre npm install skapi-js


    p(style='margin-bottom: 0') 2. Initialize Skapi from your main.js

    Code(style="margin: 20px 0 40px")
        pre.
            #[span(style="color:#999") // main.js]
            #[span(style="color:#44E9FF") import] { Skapi } #[span(style="color:#44E9FF") from] #[span(style="color:#FFED91") "skapi-js"]
            #[span(style="color:#33adff") const] skapi = #[span(style="color:#33adff") new] Skapi(#[span(style="color:#FFED91") "{{ currentService.id }}"], #[span(style="color:#FFED91") "{{ currentService.owner }}"]);
            #[span(style="color:#44E9FF") export] { skapi } #[span(style="color:#999") // Import the instance in your components]


    p For more details, please refer to the #[a(href="https://docs.skapi.com/introduction/getting-started.html" target="_blank") Documentation]

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

hr {
    background: rgba(255, 255, 255, 0.1);
}

p {
    margin: 0;
    margin-bottom: 11px;
}

.desc {
    color: #888888;
    margin-bottom: 30px;
}
</style>