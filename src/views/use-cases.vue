<template lang="pug">
.use-cases
    section
        .use-cases-content
            .section-title Use Cases
            .section-desc Pre-built modules for database, authentication, chat, and real-time communication. #[span.wordset Explore ready-to-use examples that show how Skapi features work in real applications.]
            .flex-wrap.link-card-wrap
                a.link-card(href="https://github.com/alsdk9879/skapi-auth-html-template" target="_blank")
                    .icon
                        svg
                            use(xlink:href="/material-icon.svg?v=20250829065753667#icon-users")
                    span.title Authentication
                    p.desc A plain HTML starter showcasing Skapi’s authentication system. Includes login, signup, and account management features you can easily integrate.
                            
                a.link-card(href="https://github.com/alsdk9879/skapi-database-html-template" target="_blank")
                    .icon
                        svg
                            use(xlink:href="/material-icon.svg?v=20250829065753667#icon-database")
                    span.title Database
                    p.desc An HTML example for building a simple photo-sharing app with Skapi’s database. Users can log in, upload photos, and fetch content securely.

                a.link-card(href="https://github.com/alsdk9879/skapi-chat-html-template" target="_blank")
                    .icon
                        svg
                            use(xlink:href="/material-icon.svg?v=20250829065753667#icon-chat")
                    span.title Chat
                    p.desc A lightweight chat application template using Skapi’s real-time features. Supports login, message posting, and instant updates between users.
                                
                a.link-card(href="https://github.com/alsdk9879/skapi-webrtc-html-template" target="_blank")
                    .icon
                        svg
                            use(xlink:href="/material-icon.svg?v=20250829065753667#icon-webrtc")
                    span.title WebRTC
                    p.desc A basic video call app built with Skapi’s WebRTC capabilities. Logged-in users can request, accept, and join live video sessions.

    section.dark(style="padding-bottom: 2rem")
        .use-cases-content
            .section-title Starter Templates
            .section-desc Quick start templates for HTML, Vue, Angular, and React projects. #[span.wordset Set up your environment faster and focus on building features right away.]
            .flex-wrap.link-card-wrap
                a.link-card(href="https://github.com/kkb75281/getting-started-template-vanilla-html" target="_blank")
                    .icon
                        img(src="@/assets/img/logo/html.svg")
                    span.title HTML
                    p.desc A clean and minimal starter template using only HTML, CSS, and JavaScript. Great for beginners, quick prototypes, or when you need a lightweight setup without frameworks.

                a.link-card(href="https://github.com/kkb75281/getting-started-template-vue" target="_blank")
                    .icon
                        img(src="@/assets/img/logo/vue.svg")
                    span.title Vue.js
                    p.desc A Vue 3 starter template crafted for rapid and efficient development. Showcases best practices for integrating Skapi into your project.

                a.link-card(href="https://github.com/kkb75281/getting-started-template-angular" target="_blank")
                    .icon
                        img(src="@/assets/img/logo/angular.svg")
                    span.title Angular
                    p.desc A complete Angular starter template with TypeScript support. Showcases best practices for integrating Skapi into your project.

                a.link-card(href="https://github.com/kkb75281/getting-started-template-react" target="_blank")
                    .icon
                        img(src="@/assets/img/logo/react.svg")
                    span.title React
                    p.desc A modern React starter template powered by Vite for blazing-fast builds and hot reload. Showcases best practices for integrating Skapi into your project.
</template>

<script setup>
import Tooltip from "@/components/tooltip.vue";
</script>

<style lang="less" scoped>
.dark {
    background-color: #111112;

    .link-card {
        background-color: #16171a;
    }
}

.use-cases-content {
    max-width: 1500px;
    margin: 0 auto;
    padding: 5rem 1.25rem;
    text-align: center;

    .section-title {
        font-size: 2.7rem;
        margin-bottom: 1.25rem;

        @media (max-width: 430px) {
            font-size: 1.875rem;
            margin-bottom: 1rem;
        }
    }

    .section-desc {
        max-width: 45rem;
        margin: 0 auto;
        line-height: 1.4;
        font-weight: 300;
        font-size: 1.125rem;
        opacity: 0.7;
        margin-bottom: 3rem;

        @media (max-width: 430px) {
            font-size: 0.875rem;
        }
    }

    @media (max-width: 430px) {
        padding: 4rem 1rem;
    }
}

.link-card-wrap {
    flex-wrap: wrap;
    gap: 20px;
}

.link-card {
    position: relative;
    width: 23%;
    min-width: 250px;
    flex-grow: 1;
    background-color: #121214;
    border-radius: 1.0625rem;
    padding: 1.5rem;
    overflow: hidden;
    color: #fff;
    text-align: left;
    transition: all 0.3s ease;
    scale: 0.98;
    display: flex;
    flex-direction: column;

    &:hover {
        text-decoration: none;
        scale: 1;

        .icon {
            opacity: 0.8;
        }
    }

    .icon {
        height: 8rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem 0.5rem 0 0;
        transition: all 0.3s ease;
        opacity: 0.5;
        cursor: default;

        svg {
            width: 32px;
            height: 32px;
        }
    }

    .title {
        display: inline-block;
        margin-top: 1rem;
    }

    .desc {
        margin: 1rem 0 0;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.5);
        flex: 1;
    }
}
</style>
