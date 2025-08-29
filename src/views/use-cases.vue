<template lang="pug">
.use-cases
    section
        .use-cases-content
            .section-title Use Cases
            .section-desc Pre-built modules for database, authentication, chat, and real-time communication. #[span.wordset Explore ready-to-use examples that show how Skapi features work in real applications.]
            .flex-wrap.link-card-wrap
                a.link-card(href="https://github.com/broadwayinc/skapi-database-html-template" target="_blank")
                    .icon
                        svg
                            use(xlink:href="/material-icon.svg#icon-users")
                    .title Auth
                    .desc A plain HTML starter showcasing Skapi’s authentication system. Includes login, signup, and account management features you can easily integrate.
                a.link-card(href="https://github.com/broadwayinc/skapi-auth-html-template" target="_blank")
                    .icon
                        svg
                            use(xlink:href="/material-icon.svg#icon-database")
                    .title Database
                    .desc An HTML example for building a simple photo-sharing app with Skapi’s database. Users can log in, upload photos, and fetch content securely.
                a.link-card(href="https://github.com/broadwayinc/skapi-chat-html-template" target="_blank")
                    .icon
                        svg
                            use(xlink:href="/material-icon.svg#icon-chat")
                    .title Chat
                    .desc A lightweight chat application template using Skapi’s real-time features. Supports login, message posting, and instant updates between users.
                a.link-card(href="https://github.com/broadwayinc/skapi-webrtc-html-template" target="_blank")
                    .icon
                        svg
                            use(xlink:href="/material-icon.svg#icon-webrtc")
                    .title WebRTC
                    .desc A basic video call app built with Skapi’s WebRTC capabilities. Logged-in users can request, accept, and join live video sessions.

    section.dark(style="padding-bottom: 2rem")
        .use-cases-content
            .section-title Starter Templates
            .section-desc Quick start templates for HTML, Vue, Angular, and React projects. #[span.wordset Set up your environment faster and focus on building features right away.]
            .flex-wrap.link-card-wrap
                a.link-card(href="https://github.com/kkb75281/getting-started-template-vanilla-html" target="_blank") 
                    .icon
                        img(src="@/assets/img/logo/html.svg")
                    .title html
                    .desc A clean and minimal starter template using only HTML, CSS, and JavaScript. Great for beginners, quick prototypes, or when you need a lightweight setup without frameworks.
                a.link-card(href="https://github.com/kkb75281/getting-started-template-vue" target="_blank") 
                    .icon
                        img(src="@/assets/img/logo/vue.svg")
                    .title vue
                    .desc A Vue 3 starter template designed for fast and efficient development. Ideal for learning Vue’s component-based structure or bootstrapping small to mid-sized apps.
                a.link-card(href="https://github.com/kkb75281/getting-started-template-angular" target="_blank") 
                    .icon
                        img(src="@/assets/img/logo/angular.svg")
                    .title angular
                    .desc A complete Angular CLI setup with best practices in place. Perfect for building scalable, enterprise-level web applications with TypeScript support.
                a.link-card(href="https://github.com/kkb75281/getting-started-template-react" target="_blank") 
                    .icon
                        img(src="@/assets/img/logo/react.svg")
                    .title react
                    .desc A modern React starter powered by Vite for blazing-fast builds and hot reload. Great for quickly creating single-page applications and experimenting with React hooks and components.

</template>

<script setup>
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
    padding: 5rem 20px;
    text-align: center;

    .section-title {
        font-size: 2.7rem;
        margin-bottom: 20px;
    }

    .section-desc {
        max-width: 45rem;
        margin: 0 auto;
        line-height: 1.4;
        font-weight: 300;
        font-size: 1.125rem;
        opacity: 0.7;
        margin-bottom: 3rem;
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
    padding: 0 1.5rem;
    overflow: hidden;
    color: #fff;
    text-align: left;
    transition: all 0.3s ease;
    scale: 0.98;

    &:hover {
        text-decoration: none;
        scale: 1;

        .icon {
            opacity: 0.7;
        }
    }

    .icon {
        height: 100px;
        // background-color: #282a31;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem 0.5rem 0 0;
        padding: 5rem 0.5rem;
        transition: all 0.3s ease;
        opacity: 0.5;

        svg {
            width: 32px;
            height: 32px;
        }
    }

    .title {
        // padding: 5rem 0 0.7rem 1.5rem;
        // background-color: #1e1e20;
        position: absolute;
        left: 1.5rem;
        top: 8rem;
    }

    .desc {
        padding: 0.7rem 0 1.5rem;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.5);
    }

    .img {
        max-width: 100%;
        height: 200px;
        border-radius: 0.5rem;
        overflow: hidden;

        img {
            max-width: 100%;
            object-fit: cover;
        }
    }
}
</style>