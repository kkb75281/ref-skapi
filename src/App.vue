<template lang="pug">
div._root(style='min-height: calc(100vh - 1rem - 1px - var(--footer-height, 0));' :style='{"--footer-height": footerHeight+"px"}')
    //- router-view(v-if='route.name === "home" || loaded')
    router-view(v-if='connected')

//- footer#footer.new
    //- img(src="@/assets/img/logo/logo-white.svg" style="height:.88rem;")
    .logo(style="display:flex;align-items:center;gap:0.5rem;")
        img.symbol(src="@/assets/img/logo/symbol-logo.png" style="height:.88rem;margin:0")
        span.faktum.desktop(style="font-size:1rem;") skapi
    router-link(to="/pp.html" target="_blank") Terms of service • Privacy policy
    span.hideOnMobile BROADWAYINC PTE. LTD. Singapore.
    
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { connected } from '@/main';

const router = useRouter();
const route = useRoute();

let footerHeight = ref('0');

onMounted(() => {
    // // this is to make footer stick to bottom
    // // get footer height
    // footerHeight.value = document.getElementById('footer').offsetHeight.toString(); // number
    // console.log('footerHeight', footerHeight.value);
    // // detect window width change
    // window.addEventListener('resize', () => {
    //     window.requestAnimationFrame(() => {
    //         footerHeight.value = document.getElementById('footer').offsetHeight.toString();
    //     });
    // });
})

</script>
<style lang='less'>
footer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    box-shadow: 0px 2px black; // compensate offset calc

    // background-color: #101828;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    height: 2.5rem;
    overflow-y: hidden;

    &.new {
        background-color: rgb(247, 249, 252);
        border: 0;
        // border: 1px solid rgba(0,0,0,0.1);
        // background-color: #fff;
        height: unset;
        box-shadow: unset;
        border-radius: 12px;
        margin: 0.5rem;
        padding: 0.5rem;
    }

    &>* {
        font-size: 0.8rem;
        // color: #fff;
        margin: .5rem 18px;
    }

    img {
        margin-top: .88em;
    }

    .hideOnMobile {
        @media (max-width: 606px) {
            display: none;
        }
    }
}

.review-swiper {
    .swiper {
        padding-bottom: 8rem;
    }

    .swiper-button-prev,
    .swiper-button-next {
        &::after {
            display: none;
        }

        margin-top: unset;
        background-color: transparent;
        background-size: cover;
        width: 72px;
        height: 72px;
        opacity: 1;
    }

    .swiper-button-prev {
        background-image: url('@/assets/img/landingpage/arrow_btn_left.svg');
    }

    .swiper-button-next {
        background-image: url('@/assets/img/landingpage/arrow_btn_right.svg');
    }

    .swiper-pagination {
        width: unset !important;
        bottom: unset !important;
        top: 39.5rem !important;
    }

    .swiper-pagination-bullet {
        background: #3F3F3F;
    }

    .swiper-pagination-bullet-active {
        background: #fff;
    }
}

@media (max-width: 1280px) {
    .review-swiper {

        .swiper-button-prev,
        .swiper-button-next {
            left: 50%;
            bottom: 0 !important;
            top: unset;
            right: unset;
        }

        .swiper-button-prev {
            transform: translate(calc(-50% - 42px), 0);
        }

        .swiper-button-next {
            transform: translate(calc(-50% + 42px), 0);
        }
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
}

@media (max-width: 430px) {
    .review-swiper {

        .swiper-button-prev,
        .swiper-button-next {
            width: 56px;
            height: 56px;
        }

        .swiper-button-prev {
            transform: translate(calc(-50% - 32px), 0);
        }

        .swiper-button-next {
            transform: translate(calc(-50% + 32px), 0);
        }
    }
}
</style>