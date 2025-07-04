<template lang="pug">
div._root(style='min-height: calc(100vh - 1rem - 1px - var(--footer-height, 0));')
    //- router-view(v-if='route.name === "home" || loaded')
    router-view(v-if='connected')

Footer

//- footer#footer.new
    //- img(src="@/assets/img/logo/logo-white.svg" style="height:.88rem;")
    .logo(style="display:flex;align-items:center;gap:0.5rem;")
        img.symbol(src="@/assets/img/logo/symbol-logo.png" style="height:.88rem;margin:0")
        span.faktum.desktop(style="font-size:1rem;") skapi
    router-link(to="/pp.html" target="_blank") Terms of service • Privacy policy
    span.hideOnMobile BROADWAYINC PTE. LTD. Singapore.
    
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import { connected } from "@/main";

import Footer from "@/components/footer.vue";

const router = useRouter();
const route = useRoute();
</script>
<style lang="less">
._root {
    height: auto;
    min-height: 100%;
}

.review-swiper {
    .swiper {
        padding-bottom: 8rem;
    }

    .swiper-pagination {
        width: unset !important;
        bottom: unset !important;
        top: 39.5rem !important;
    }

    .swiper-pagination-bullet {
        background: #3f3f3f;

        &:hover {
            background: #999;
        }
    }

    .swiper-pagination-bullet-active {
        background: #fff;
    }
}

.plan-swiper {
    .swiper-pagination-bullet {
        width: unset;
        height: unset;
        flex-grow: 1;
        flex-basis: 100px;
        background-color: unset;
        border: 1px solid #000;
        border-radius: 40px;
        padding: 14px 0;
        margin: 0 !important;
        font-size: 20px;
        font-weight: 500;
        opacity: 1;
        color: #000;

        &.on {
            background-color: #000;
            color: #fff;

            &:hover {
                background-color: #000;
            }
        }

        &:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
    }

    .swiper-wrapper {
        flex-wrap: wrap;
        justify-content: center;
        gap: 30px 0;
    }
}

@media (max-width: 800px) {
    .review-swiper {
        .swiper {
            padding-bottom: 6rem;
        }

        .swiper-pagination {
            left: 50% !important;
            top: var(--swiper-pagination-translate-y, 0) !important;
            transform: translateX(-50%) !important;
        }
    }

    .plan-swiper {
        .swiper-wrapper {
            flex-wrap: unset;
            justify-content: unset;
            gap: unset;
        }
    }
}

@media (max-width: 480px) {
    .review-swiper {
        .swiper {
            padding-bottom: 0;
        }
    }

    .plan-swiper {
        .swiper-pagination-bullet {
            font-size: 15px;
            padding: 10px 0;
        }
    }
}
</style>
