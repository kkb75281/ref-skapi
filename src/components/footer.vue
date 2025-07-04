<template lang="pug">
footer#footer
    //- template(v-if="route.name === 'home'")
    .top
        .top-inner
            .left(:class="{ 'has-sections': route.name === 'home' }")
                .logo
                    img(src="@/assets/img/logo/logo-white.svg", alt="Skapi Logo")
                ul.sections(v-if="route.name === 'home'")
                    li(@click="scrollSec('section1')") Features
                    li(@click="scrollSec('section2')") Price
                    li(@click="scrollSec('section3')") FAQ
                    li(@click="scrollSec('section4')") Contents
                ul.nav
                    li
                        a(href="https://docs.skapi.com/introduction/getting-started.html" target="_blank") 
                            img(src="@/assets/img/landingpage/icon_docs.svg", alt="GitHub")
                            span Docs
                    li
                        a(href="https://github.com/broadwayinc/skapi-js" target="_blank") 
                            img(src="@/assets/img/landingpage/icon_github.svg", alt="GitHub")
                            span Github
                    li
                        router-link(to="/my-services")
                            img(src="@/assets/img/logo/symbol-logo-white.svg", alt="Skapi Symbol Logo")
                            span My services
            .right
                p support@broadwayinc.com
                a.terms(href="https://www.skapi.com/pp.html" target="_blank") Terms of service / Privacy policy
    .bottom
        .bottom-inner
            span BROADWAYINC PTE. LTD. Singapore.
            .icon-wrap
                a.link(href="http://www.tiktok.com/@skapi_api" target="_blank")
                    img(src="@/assets/img/landingpage/icon_tiktok.svg")
                a.link(href="https://www.instagram.com/skapi_api" target="_blank")
                    img(src="@/assets/img/landingpage/icon_instagram.svg")
                a.link(href="https://www.youtube.com/@skapi_official" target="_blank")
                    img(src="@/assets/img/landingpage/icon_youtube.svg")
                a.link(href="https://x.com/skapi_api" target="_blank")
                    img(src="@/assets/img/landingpage/icon_x.svg")
                a.link(href="https://www.linkedin.com/company/skapi-backend-api/" target="_blank")
                    img(src="@/assets/img/landingpage/icon_linkedin.svg")
                a.link(href="https://www.facebook.com/profile.php?id=61577236221327" target="_blank")
                    img(src="@/assets/img/landingpage/icon_facebook.svg")
    //- template(v-else)
        .footer-wrap
            .left
                .logo
                    img(src="@/assets/img/logo/logo-white.svg", alt="Skapi Logo")
                .company-info
                    a.terms(href="https://www.skapi.com/pp.html" target="_blank") Terms of service / Privacy policy
                    span.address BROADWAYINC PTE. LTD. Singapore.
            .right
                span.email support@broadwayinc.com
                .icon-wrap
                    a.link(href="http://www.tiktok.com/@skapi_api" target="_blank")
                        img(src="@/assets/img/landingpage/icon_tiktok.svg")
                    a.link(href="https://www.instagram.com/skapi_api" target="_blank")
                        img(src="@/assets/img/landingpage/icon_instagram.svg")
                    a.link(href="https://www.youtube.com/@skapi_official" target="_blank")
                        img(src="@/assets/img/landingpage/icon_youtube.svg")
                    a.link(href="https://x.com/skapi_api" target="_blank")
                        img(src="@/assets/img/landingpage/icon_x.svg")
                    a.link(href="https://www.linkedin.com/company/skapi-backend-api/" target="_blank")
                        img(src="@/assets/img/landingpage/icon_linkedin.svg")
                    a.link(href="https://www.facebook.com/profile.php?id=61577236221327" target="_blank")
                        img(src="@/assets/img/landingpage/icon_facebook.svg")
            
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const hoveredMenu = ref("");

const scrollSec = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        const remOffset =
            4 * parseFloat(getComputedStyle(document.documentElement).fontSize);
        const scrollY = section.offsetTop - remOffset;
        window.scrollTo({ top: scrollY, behavior: "smooth" });
    }
};

function setFooterHeight() {
    const footerElement = document.getElementById("footer");

    if (!footerElement) {
        return;
    }

    const height = footerElement.offsetHeight;

    if (height) {
        document.body.style.setProperty("--footer-height", height + "px");
    }
}

const targetClasses = ["link"];

const mousehover = (event) => {
    const hoveredElement = event.target.closest(".link");

    if (hoveredElement) {
        const hoveredClass = targetClasses.find((cls) =>
            hoveredElement.classList.contains(cls)
        );

        const elements = document.querySelectorAll(`.${hoveredClass}`);
        elements.forEach((el) => {
            el.style.opacity = 0.5;
        });
        hoveredElement.style.opacity = 1;
    }
};

const mouseout = (event) => {
    const leftElement = event.target.closest(".link");

    if (leftElement) {
        const leftClass = targetClasses.find((cls) =>
            leftElement.classList.contains(cls)
        );

        const elements = document.querySelectorAll(`.${leftClass}`);
        elements.forEach((el) => {
            el.style.opacity = 1;
        });
    }
};

onMounted(() => {
    setFooterHeight();
    window.addEventListener("resize", setFooterHeight);
    window.addEventListener("mouseover", mousehover);
    window.addEventListener("mouseout", mouseout);
});

onUnmounted(() => {
    window.removeEventListener("resize", setFooterHeight);
    window.addEventListener("mouseover", mousehover);
    window.addEventListener("mouseout", mouseout);
});
</script>
<style lang="less" scoped>
#footer {
    position: relative;
    height: 100%;
    background-color: #000;
    color: #fff;
    z-index: 999;

    .top-inner,
    .bottom-inner {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .top-inner {
        align-items: flex-start;
        gap: 60px;
    }

    .bottom-inner {
        align-items: center;
        gap: 40px;
    }

    .top {
        padding: 40px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .left {
            max-width: 350px;
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            flex-grow: 1;
            align-items: flex-start;
            justify-content: space-between;

            &.has-sections {
                max-width: 528px;
            }

            .logo {
                img {
                    width: 7.5rem;
                }
            }

            ul {
                padding: 0;
                margin: 0;

                li {
                    list-style: none;
                    font-size: 17px;
                    padding: 6px 0;
                    cursor: pointer;

                    &:first-child {
                        padding-top: 0;
                    }

                    &:hover {
                        opacity: 1 !important;
                    }
                }

                &:hover {
                    &::before {
                        content: none;
                    }

                    li {
                        opacity: 0.5;
                    }
                }

                &.nav {
                    li {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        img {
                            width: 20px;
                            height: 20px;
                        }

                        a {
                            color: #fff;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;

                            &:hover {
                                text-decoration: none;
                            }
                        }
                    }
                }
            }
        }

        .right {
            p {
                margin: 0;
                margin-bottom: 12px;
                font-size: 17px;
                font-weight: 300;
                opacity: 0.7;
                text-align: right;

                &.small {
                    font-size: 15px;
                    opacity: 0.5;
                    cursor: pointer;

                    &:hover {
                        opacity: 1;
                    }
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .bottom {
        align-items: center;
        padding: 20px 0;

        span {
            font-size: 13px;
            opacity: 0.5;
        }

        .icon-wrap {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }
    }

    .link {
        padding-right: 1rem;
        display: inline-block;

        &:last-of-type {
            padding-right: 0;
        }

        img {
            display: block;
        }
    }

    .terms {
        display: block;
        font-size: 0.9375rem;
        font-weight: 300;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.5);

        &:hover {
            color: #fff;
            text-decoration: none;
        }
    }

    // !home footer
    .footer-wrap {
        padding: 1.875rem 5rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: 1rem;

        .logo {
            width: 7.5rem;
            height: 2.25rem;
            margin-bottom: 1.25rem;
        }

        .company-info {
            a,
            span {
                display: block;
                font-size: 0.875rem;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.5);
            }

            .terms {
                margin-bottom: 0.375rem;
            }
        }

        .email {
            font-size: 1.125rem;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.5);
            display: block;
            text-align: right;
            margin-bottom: 0.625rem;
        }

        .icon-wrap {
            position: relative;
            right: -7px;
        }
    }
}

@media (max-width: 1560px) {
    #footer {
        .top-inner,
        .bottom-inner {
            margin: 0 80px;
        }
    }
}

@media (max-width: 800px) {
    #footer {
        .top-inner,
        .bottom-inner {
            margin: 0 60px;
        }

        .bottom-inner {
            flex-direction: column-reverse;
            gap: 1.25rem;
        }

        .top {
            .right {
                p {
                    font-size: 15px;
                    margin-bottom: 8px;

                    &.small {
                        font-size: 13px;
                    }
                }
            }
        }

        .footer-wrap {
            padding-left: 2.5rem;
            padding-right: 2.5rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 2rem;

            .logo {
                width: 5.625rem;
                height: 1.6875rem;
            }

            .company-info {
                a,
                span {
                    font-size: 0.75rem;
                }
            }

            .email {
                text-align: left;
                font-size: 0.8125rem;
                margin-bottom: 1rem;
            }

            .icon-wrap {
                left: -7px;
            }
        }
    }
}

@media (max-width: 741px) {
    #footer {
        .top {
            .right {
                p {
                    text-align: left;
                }

                .terms {
                    font-size: 0.75rem;
                }
            }
        }
    }
}

@media (max-width: 500px) {
    #footer {
        .top-inner {
            gap: 30px;
        }

        .top {
            .left {
                max-width: 288px;

                .logo {
                    width: 100%;
                }
            }
        }

        .bottom {
            padding-bottom: 40px;

            .bottom-inner {
                flex-direction: column-reverse;
                gap: 20px;
            }
        }
    }
}

@media (max-width: 430px) {
    #footer {
        .top-inner,
        .bottom-inner {
            margin: 0 40px;
        }

        .bottom-inner {
            gap: 20px;
        }

        .top {
            padding: 30px 0;
            gap: 30px;

            .left {
                gap: 20px;

                .logo {
                    gap: 20px;

                    img {
                        width: 90px;
                    }
                }

                ul {
                    li {
                        padding: 4px 0;
                        font-size: 14px;
                    }
                }
            }

            .right {
                p {
                    font-size: 13px;
                    margin-bottom: 6px;

                    &.small {
                        font-size: 11px;
                    }
                }
            }
        }

        .bottom {
            text-align: center;
        }
    }
}
</style>
