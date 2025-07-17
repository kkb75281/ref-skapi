<template lang="pug">
.landing-page-root
	.bg-blue.hero-bg
		section.hero
			.title #[span.linear-gradient Zero-Setup] #[span.wordset Backend API]
			.desc Skapi is a serverless backend platform that gives frontend developers,no-coders, and product teams everything they need: auth, database,file storage, and real-time APIs.  Launch your app in minutes.
			template(v-if="user?.user_id")
				button(type="button" data-aos="fade-up" data-aos-duration="500" @click="$router.push('/my-services')") Go to My Services
			router-link(v-else to="/signup")
				button(type="button" data-aos="fade-up" data-aos-duration="500") Get Started

		section.video
			.wrap
				.inner
					//- img(src="@/assets/img/landingpage/bg_hero.png", alt="Skapi Video")
					video.video-skapi(src="@/assets/img/landingpage/video_skapi.mp4", autoplay muted loop playsinline)
						source(src="@/assets/img/landingpage/video_skapi.mp4", type="video/mp4")
						p Your browser does not support the video tag.

		section.why
			.title(data-aos="fade-up") Why Skapi?
			.reason-wrap(data-aos="fade-up" data-aos-delay="300")
				.reason-item
					.image
						img(src="@/assets/img/landingpage/icon_reason1.svg", alt="Why Skapi Icon1")
					.reason
						.title Affordable Backend API
						.desc Most APIs cost $140+/month plus dev time. Skapi starts at just $19 — no servers, no backend hires, no bugs. Just copy code and go.

				.reason-item
					.image
						img(src="@/assets/img/landingpage/icon_reason2.svg", alt="Why Skapi Icon2")
					.reason
						.title Built-In Backend Security
						.desc Secure APIs, access, indexing, and data storage by default. Set permissions from the frontend. Skapi handles the rest.
				
				.reason-item
					.image
						img(src="@/assets/img/landingpage/icon_reason3.svg", alt="Why Skapi Icon3")
					.reason
						.title No servers. No stress.
						.desc No more server config, maintenance, and email hacks. Skapi gives you everything out of the box — so you can launch faster and sleep better.
	.bg-dark
		section.review
			.title(data-aos="fade-up" data-aos-delay="300") Real Reviews
			.review-swiper(data-aos="fade-up" data-aos-delay="500")
				swiper(
					:slidesPerView="1"
					:spaceBetween="30"
					:loop="true"
					:pagination="{ clickable: true }"
					:navigation="{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }"
                    :autoplay="{ delay: 3000, disableOnInteraction: false }"
					:modules="[Pagination, Navigation, Autoplay]"
					@swiper="onSwiperReady"
				)
					swiper-slide.review-item
						.reviewer
							img#reviewerImg(src="@/assets/img/landingpage/reviewer1.svg" alt="Reviewer 1")
							.profile
								.name Mohammad Nadim
								.position Full Stack Developer
						.content
							.summary
								p Skapi is perfect for students, professionals, and local businesses seeking a secure and efficient solution.
								img(src="@/assets/img/landingpage/stars.svg" alt="Stars")
							.entire As a student, I struggled with sending data to databases using Apache servers because plugin installation caused frequent OS errors. Skapi solves this by letting you import APIs and send data directly, with no extra plugins needed. It saves time, avoids errors, and requires no backend coding.
					
					swiper-slide.review-item
						.reviewer
							img(src="@/assets/img/landingpage/reviewer2.svg" alt="Reviewer 2")
							.profile
								.name Aae Kim
								.position Junior Frontend Developer
						.content
							.summary
								p Thanks to Skapi, I can build full applications using only frontend code.
								img(src="@/assets/img/landingpage/stars.svg", alt="Stars")
							.entire When I was a junior frontend developer the biggest challenge I faced was not being able to build a complete service on my own, mostly because a backend is essential, and I had no experience. When I discovered Skapi, everything changed. I was able to handle data fetching and all server-side functionality with just a few simple lines of code. Skapi feels like a better alternative to Firebase or Supabase. It’s easy and doesn’t waste days just trying to sync backend logic and data communication.

					swiper-slide.review-item
						.reviewer
							img(src="@/assets/img/landingpage/reviewer3.svg", alt="Reviewer 3")
							.profile
								.name Hee Jong Lee
								.position Full Stack Developer
						.content
							.summary
								p Someone completely new to web development could use Skapi without any prior database knowledge. It requires zero setup.
								img(src="@/assets/img/landingpage/stars.svg", alt="Stars")
							.entire I work on core systems and web development at an insurance company. One of the challenges I often face is setting up new environments or getting started with unfamiliar frameworks. Skapi reduces the time I spend installing packages and configuring environments. For database operations, it’s incredibly convenient. You can just start using the database right away, no setup required.
				.swiper-button-prev
					img(src="@/assets/img/landingpage/arrow_left.svg", alt="Arrow Left")
				.swiper-button-next
					img(src="@/assets/img/landingpage/arrow_right.svg", alt="Arrow Right")
	.bg-blue
		section#section1.feature
			.title(data-aos="fade-up" data-aos-delay="300") Features
			.desc(data-aos="fade-up" data-aos-delay="300") All You Need for Modern Web Apps. #[br]Discover 6 Unique Advantages Only Skapi Delivers.
			.feature-wrap(data-aos="fade-up" data-aos-delay="500")
				.feature-item
					.img
						img(src="@/assets/img/landingpage/feature1.svg", alt="Feature Icon1")
					.title Works with#[br]Any Frontend
					.content Skapi is compatible with Vue.js, React, Angular, and more, providing pre-built templates for various frameworks. It also works seamlessly with plain HTML without requiring any dependencies.

				.feature-item
					.img
						img(src="@/assets/img/landingpage/feature2.svg", alt="Feature Icon2")
					.title API Docs for#[br]Faster Dev Flow
					.content Well-written API documentation that your favorite language models can train on, enabling full support from your AI coding assistant like ChatGPT, GitHub Copilot, and more.

				.feature-item
					.img
						img(src="@/assets/img/landingpage/feature3.svg", alt="Feature Icon3")
					.title Built-in#[br]Email System
					.content Need to send marketing emails or automate service notifications? Skapi includes a fully integrated email system — no third-party providers required. Everything you need to manage app emails is built right in.

				.feature-item
					.img
						img(src="@/assets/img/landingpage/feature4.svg", alt="Feature Icon4")
					.title Instant#[br]File Hosting
					.content Skapi lets you host files or deploy static websites instantly on your own subdomain. Everything’s pre-configured and delivered fast worldwide via a built-in global CDN.

				.feature-item
					.img
						img(src="@/assets/img/landingpage/feature5.svg", alt="Feature Icon5")
					.title Scalable#[br]Database 
					.content Skapi delivers a scalable, flexible, auto-indexed database powered by DynamoDB — with built-in security by design for modern web applications.

				.feature-item
					.img
						img(src="@/assets/img/landingpage/feature6.svg", alt="Feature Icon6")
					.title Solid#[br]Security
					.content Skapi uses JWT-based authentication, pre-configured to securely handle user data, file access, and third-party API connections via Skapi’s API Bridge. No complex setup — just secure, reliable access out of the box.
	.bg-colorful
		section#section2.plan
			.title.black(data-aos="fade-up" data-aos-delay="300") Pricing Plans
			.desc.black(data-aos="fade-up" data-aos-delay="300") Start for free, no credit card required.#[br]Test features, connect your frontend, #[span.wordset and launch your project.]#[br]Decide later if you want to upgrade.
			.plan-swiper(data-aos="fade-up" data-aos-delay="500")
				.plan-swiper-pagination
				swiper(
					:spaceBetween="30"
					:slideActiveClass="'on'"
					:pagination="{ el: '.plan-swiper-pagination', clickable: true, bulletActiveClass: 'on', renderBullet: makeBullet }"
					:breakpoints="{ 0: { slidesPerView: 1, enabled: true, loop: true }, 801: { slidesPerView: 3, enabled: false, loop: false } }"
					:modules="[Pagination]"
				)
					swiper-slide.plan-item.blue
						svg.mark
							use(xlink:href="@/assets/img/material-icon.svg#icon-card-mark")
						.top
							.title Trial
							.desc Best for testing and prototyping.
						.middle
							.price Free
							router-link(:to="user?.user_id ? '/create' : '/signup'")
								button(type="button") Get
						.bottom
							p Core includes:
							ul
								li.user 10K User Accounts
								li.data 8GB Database Storage
								li.file 100GB File Storage
								li.mail(style="margin-bottom: 2.5rem;") Automated Emails
								li.forbiden(style="font-size: .9375rem;") All user data is deleted every 14 days

					swiper-slide.plan-item.green
						svg.mark
							use(xlink:href="@/assets/img/material-icon.svg#icon-card-mark")
						.top
							.title Standard
							.desc Suit best for small businesses, MVP, small projects, etc.
						.middle
							.price $19
								span /mon
							router-link(:to="user?.user_id ? '/create' : { path: '/signup', query: { suc_redirect: '/create' } }")
								button(type="button") Get
						.bottom
							p Includes all Trial Plan features, but more functions:
							ul
								li.mail 1GB Email Storage
								li.invitation User invitation System
								li.global Website Hosting
								li.global Subdomain Hosting
								li.mail Sending Bulk Emails

					swiper-slide.plan-item.yellow
						svg.mark
							use(xlink:href="@/assets/img/material-icon.svg#icon-card-mark")
						.top
							.title Premium
							.desc Suit best for huge projects, Saas, social media, AI application, etc.
						.middle
							.price $89
								span /mon
							router-link(:to="user?.user_id ? '/create' : { path: '/signup', query: { suc_redirect: '/create' } }")
								button(type="button") Get
						.bottom
							p Includes all Standard Plan features, but more data:
							ul
								li.user 100K User Accounts
								li.data 10GB Database Storage
								li.file 1TB File Storage
								li.mail 10GB Email Storage

	.bg-dark
		section#section3.faq
			.title(data-aos="fade-up" data-aos-delay="300") FAQ
			ul.faq-list(data-aos="fade-up" data-aos-delay="500")
				li.faq-item
					.item-title(:class="{ open: openStates[0]}" @click="faqToggle(0)") How does Skapi make your app more secure?
					.item-cont(v-show="openStates[0]")
						p.text Skapi is built on a security-first data model where protection isn’t just enforced by infrastructure — it’s embedded directly into the data itself.
						p.text Instead of relying on backend engineers to manually configure access rules (and account for edge cases — a common source of vulnerabilities), Skapi lets data owners define exactly how data is shared, accessed, and indexed — directly from the frontend.
						p.text This eliminates the risk of backend misconfigurations and ensures that security policies stay attached to the data itself, wherever it goes.
						br
						p.text By shifting control to the data layer, Skapi delivers a system that is:
						ul
							li More secure by design
							li Easier to manage
							li Free from backend guesswork and silent errors
						br
						p.text It’s not just user-friendly — it’s trust built into the foundation.
				li.faq-item
					.item-title(:class="{ open: openStates[1]}" @click="faqToggle(1)") How does Skapi work without a server?
					.item-cont(v-show="openStates[1]")
						p.text In traditional web apps, a server sits between the frontend and backend — handling requests, managing databases, storing files, and more. But this setup often brings downsides: performance bottlenecks, downtime risks, and constant maintenance.
						p.text At Skapi, we took a different approach.We’ve built the entire platform on serverless infrastructure, so your frontend connects directly and securely to backend resources — no servers to deploy, manage, or scale.
						br
						p.text The result?
						ul
							li Faster performance
							li Lower costs
							li Simpler development
				li.faq-item
					.item-title(:class="{ open: openStates[2]}" @click="faqToggle(2)") Do I need to know how to code?
					.item-cont(v-show="openStates[2]")
						p.text Not at all. With Skapi, there’s no server to set up, no backend code to write, and no complex configuration required. Just drop it into your frontend, and you’re ready to build.
						p.text Skapi is also designed for AI-assisted and no-code development. Since everything runs securely from the frontend, you can even let your AI agent build a full-stack app — without exposing backend infrastructure.
						p.text It’s the simplest and safest way to bring automation and AI into modern web development.
				li.faq-item
					.item-title(:class="{ open: openStates[3]}" @click="faqToggle(3)") How does Skapi keep the price so low?
					.item-cont(v-show="openStates[3]")
						p.text Traditional backends get expensive fast. A basic cloud server alone can cost over $100/month — and that’s before you add a basic SQL or NoSQL database which starts at another $50/month. Add file storage, CDN, email systems, and more — and the costs quickly multiply.
						br
						p.text Skapi avoids all of that. Our fully serverless architecture means no idle servers, no maintenance, and no wasted resources. You only pay for what you use — and still get everything you need:
						br
						ul
							li Database
							li File Storage
							li Global CDN
							li Built-in Email System
						br
						p.text With Skapi, you can run a complete web service at a fraction of the cost — often saving 90% or more compared to traditional stacks.

				li.faq-item
					.item-title(:class="{ open: openStates[4]}" @click="faqToggle(4)") What happens if I cancel my subscription?
					.item-cont(v-show="openStates[4]")
						p.text If you cancel your subscription, you’ll still have full access to your service until the end of your billing period.
						p.text After that, the service will stop responding to requests.
						p.text Your data will be retained for 30 days after your subscription ends.
						p.text  If you don’t reactivate within that window, all data will be permanently deleted.

	.bg-blue
		section#section4.contents
			.title(data-aos="fade-up" data-aos-delay="300") Contents
			.tab-cont-wrap
				TabMenu(v-model="activeTabs.contents" :tabs="['Articles', 'Videos']" data-aos="fade-up" data-aos-delay="500")
				.tab-cont(data-aos="fade-up" data-aos-delay="700")
					template(v-if="activeTabs.contents === 0")
						.tab-item(v-for="article in articles" :key="article.id")
							.title {{ article.title }}
							.desc {{ article.description }}
							a.btn-read-more(:href="article.url" target="_blank") Read more

					template(v-else-if="activeTabs.contents === 1")
						.tab-item.videos(v-for="video in videos" :key="video.id")
							.videos-wrap
								iframe(
									:src="`https://www.youtube.com/embed/${video.id}`"
									:title="video.title"
									allow="encrypted-media"
									allowfullscreen
									frameborder="0"
								)
							.title {{ video.title }}

	.bg-dark
		section.banner
			.banner-inner
				.title.black(data-aos="fade-up" data-aos-delay="700") Start Building Today!
				.desc.black(data-aos="fade-up" data-aos-delay="700") Serverless Backend for Modern Web Apps. #[span.wordset Auth, database, file storage — all from the frontend.]
				template(v-if="user?.user_id")
					button(type="button" data-aos="fade-up" data-aos-delay="1000" @click="$router.push('/my-services')") Go to My Services
				router-link(v-else to="/signup")
					button(type="button" data-aos="fade-up" data-aos-delay="1000") Get Started
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted, onBeforeUnmount } from "vue";
import { npmVersion } from "@/main.ts";
import { user } from "@/code/user";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css"; // import Swiper styles
import "swiper/css/pagination";
import "swiper/css/navigation";
import TabMenu from "@/components/tab.vue";

const activeTabs = ref({
    contents: 0,
});
const articles = ref([]);
const videos = ref([]);

function setSwiperImageWidth() {
    let swiperImage = document.getElementById("reviewerImg");
    let swiperImageWidth = swiperImage.getBoundingClientRect().height + 10;

    document.body.style.setProperty(
        "--swiper-pagination-translate-y",
        `${swiperImageWidth}px`
    );
}

function onSwiperReady(swiper) {
    console.log("Swiper is ready!");
    setTimeout(() => {
        setSwiperImageWidth();
    }, 100); // 약간의 딜레이로 DOM이 완전히 렌더링되도록 함
}

// 각 FAQ 항목 toggle (하나 열리면 다른 항목은 닫힘)
const openStates = ref([false, false]);
function faqToggle(index) {
    if (openStates.value[index]) {
        openStates.value[index] = false; // 이미 열려있으면 닫음
        return;
    }

    // 다른 항목은 닫음
    for (let i = 0; i < openStates.value.length; i++) {
        openStates.value[i] = false;
    }

    openStates.value[index] = true; // 선택한 항목만 열림
}

function makeBullet(index, className) {
    let menu = ["Trial", "Standard", "Premium"];
    return `<span class="${className}">${menu[index]}</span>`;
}

function handleScroll() {
    const video = document.querySelector(".video .wrap");
    if (!video) return;

    const maxScroll = 300; // 효과 구간
    const scrollTop = Math.min(window.scrollY, maxScroll);

    const progress = scrollTop / maxScroll; // 0 ~ 1 사이 진행도
    const rotate = 15 - 15 * progress; // 15deg → 0deg로 변화 (뒤로 → 정면)

    video.style.transform = `perspective(1000px) rotateX(${rotate}deg)`;
}

onMounted(async () => {
    window.addEventListener("resize", setSwiperImageWidth);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const heroArea = document.querySelector(".hero");
    if (heroArea) {
        requestAnimationFrame(() => {
            heroArea.classList.add("active");
        });
    }

    // contents > articles (Dev.to api 호출)
    try {
        const response = await fetch(
            "https://dev.to/api/articles?username=skapi_api&per_page=3"
        );
        if (!response.ok) throw new Error("Fetch failed");
        articles.value = await response.json();
    } catch (err) {
        console.error(err);
    }

    // contents > videos (youtube api 호출)
    // skapi's youtube channelId : UC0e4MITESMr3OaUiyWHpdYA
    // mina's googleConsole api_key : AIzaSyC6PGYZWVYqPO7ItsTVBarYW_htT1kaXW0
    const API_KEY = "AIzaSyC6PGYZWVYqPO7ItsTVBarYW_htT1kaXW0";
    const CHANNEL_ID = "UC0e4MITESMr3OaUiyWHpdYA";

    try {
        // 최신 영상 검색
        const searchRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=10&type=video`
        );
        const searchData = await searchRes.json();
        const videoIds = searchData.items
            .map((item) => item.id.videoId)
            .join(",");

        // 영상 상세 조회 (duration 얻기)
        const videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,contentDetails`
        );
        const videosData = await videosRes.json();

        // shorts 제외 (60초 이하 제외) 후 3개만 선택
        const filtered = videosData.items
            .filter((item) => {
                const duration = item.contentDetails.duration;
                // ISO 8601 duration에서 PT60S 이하인지 파싱
                const match = duration.match(/PT((\d+)M)?(\d+)S/);
                let totalSeconds = 0;
                if (match) {
                    const minutes = match[2] ? parseInt(match[2], 10) : 0;
                    const seconds = match[3] ? parseInt(match[3], 10) : 0;
                    totalSeconds = minutes * 60 + seconds;
                }
                return totalSeconds > 60; // shorts는 60초 이하이므로 초과만 포함
            })
            .slice(0, 3)
            .map((item) => ({
                id: item.id,
                title: item.snippet.title,
                description: item.snippet.description,
            }));

        videos.value = filtered;
    } catch (error) {
        console.error("영상 정보를 가져오는 중 오류:", error);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("resize", setSwiperImageWidth);

    const heroArea = document.querySelector(".hero");
    if (heroArea) {
        heroArea.classList.remove("active");
    }
});
</script>

<style lang="less" scoped>
section {
    margin: 0 2.5rem;
    color: #fff;
    text-align: center;

    .title {
        font-size: 3rem;
        margin-bottom: 20px;

        &.black {
            font-weight: 500;
            color: #000;
        }
    }

    .desc {
        font-weight: 300;
        font-size: 1.25rem;
        opacity: 0.7;

        &.black {
            font-weight: 400;
            color: #000;
        }
    }
}

.bg-blue {
    background-color: #16171a;
}

.bg-dark-blue {
    background-color: #121214;
}

.bg-dark {
    background-color: #111112;
}

.bg-colorful {
    background: url("@/assets/img/landingpage/bg_price.png") lightgray 50% /
        cover no-repeat;
}

.hero-bg {
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 56.25rem;
        background-color: #121214;
    }
}

.hero {
    position: relative;
    padding-top: 8.125rem;
    padding-bottom: 4.25rem;
    z-index: 1;
    opacity: 0;
    transition: opacity 1s ease, transform 1s ease;

    &.active {
        opacity: 1;
    }

    .title {
        font-size: 4rem;
        font-weight: 500;
        margin-bottom: 1.25rem;
    }

    .desc {
        max-width: 43.75rem;
        margin: 0 auto;
        line-height: 1.5;
        margin-bottom: 1.875rem;
    }

    .linear-gradient {
        background-image: linear-gradient(
            92.16deg,
            #0156ff 3.64%,
            #079af2 37.09%,
            #49c48d 61.65%,
            #e0fa1c 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }
}

.video {
    position: relative;
    margin: 0;
    padding: 0 2.5rem;
    z-index: 1;
    overflow: hidden;
    height: auto;

    .wrap {
        max-width: 1200px;
        margin: 0 auto;
        border-radius: 0.625rem;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        max-height: 46.875rem;

        perspective: 1000px;
        transform-style: preserve-3d;
        transform: perspective(1000px) rotateX(15deg);
        transition: transform 0.1s linear;
        will-change: transform;

        .inner {
            width: 100%;
            height: 100%;
            background-color: #1c1c1c;
            object-fit: cover;

            img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .video-skapi {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
}

.why {
    padding-top: 6.25rem;
    padding-bottom: 6.25rem;

    .title {
        margin-bottom: 3.75rem;
    }

    .reason-wrap {
        display: flex;
        align-items: center;
        max-width: 1440px;
        margin: 0 auto;
        gap: 1.875rem;

        .reason-item {
            flex-grow: 1;

            .title {
                font-size: 1.75rem;
                font-weight: 400;
                line-height: 1.2;
                margin-bottom: 0.875rem;
            }

            .desc {
                font-size: 1.125rem;
                line-height: 1.5;
            }
        }
    }
}

.review {
    padding: 3.75rem 0 5rem 0;

    .title {
        margin-bottom: 5rem;
    }

    .review-swiper {
        position: relative;
        max-width: 1450px;
        margin: 0 auto;
        padding: 0 8vw;

        .swiper-button-prev,
        .swiper-button-next {
            position: absolute;
            top: 50%;
            transform: translateY(-130%);

            &::after {
                display: none;
            }

            margin-top: unset;
            background-color: transparent;
            background-size: cover;
            width: 72px;
            height: 72px;
            background-color: #191a1f;
            border-radius: 50%;
            opacity: 1;
            user-select: none;

            &:hover {
                background-color: #25252a;
            }
        }

        .swiper-button-prev {
            left: 0;
        }

        .swiper-button-next {
            right: 0;
        }
    }

    .review-item {
        display: flex;
        gap: 60px;
        align-items: stretch;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;

        .reviewer {
            position: relative;
            flex: 1 0 25%;
            height: 620px;
            border-radius: 0.8125rem;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 100%;
                height: 100%;
                min-width: 250px;
                min-height: 400px;
                object-fit: cover;
                display: block;
            }

            .profile {
                position: absolute;
                bottom: 2.25rem;
                left: 2.25rem;
                font-size: 1.25rem;
                line-height: 1.5;
                text-align: left;

                .name {
                    font-weight: 500;
                }

                .position {
                    font-weight: 300;
                    opacity: 0.7;
                }
            }
        }

        .content {
            flex: 1 0 30%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: left;

            .summary {
                p {
                    margin: 0;
                    font-size: 2.125rem;
                    line-height: 1.3;
                    margin-bottom: 1.25rem;
                }
            }

            .entire {
                font-size: 1.25rem;
                font-weight: 300;
                line-height: 1.5;
                opacity: 0.7;
            }
        }
    }
}

.feature {
    padding: 5rem 0;

    .desc {
        line-height: 1.4;
        margin-bottom: 5rem;
    }

    .feature-wrap {
        max-width: 1580px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 2.5rem;

        .feature-item {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 50px;
            gap: 50px;
            text-align: left;
            background: #121214;
            border-radius: 17px;
            box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);

            .feature-item {
                position: relative;
                display: flex;
                flex-direction: column;
                padding: 50px;
                gap: 50px;
                text-align: left;
                background: #121214;
                border-radius: 17px;
                box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);

                &:nth-child(3),
                &:nth-child(4) {
                    .img {
                        right: 0px;
                    }
                }
            }

            &:nth-child(5) {
                .img {
                    right: 20px;
                }
            }

            &:nth-child(6) {
                .img {
                    right: -10px;
                }
            }

            .img {
                position: absolute;
                top: 30px;
                right: 30px;
            }

            .title {
                position: relative;
                margin: 0;
                font-size: 2rem;
                line-height: 1.2;
                z-index: 1;
                // height: 4.875rem;
            }

            .content {
                opacity: 0.7;
                font-size: 1.0625rem;
                line-height: 1.3;
            }
        }
    }
}

.plan {
    padding: 5rem 0 6.25rem 0;

    .desc {
        margin-bottom: 1.875rem;
    }

    .plan-swiper {
        max-width: 1500px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.25rem;

        .plan-swiper-pagination {
            max-width: 420px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.875rem;
            gap: 10px;
            display: none;
        }

        .plan-item {
            position: relative;
            max-width: 386px;
            // min-width: 326px;
            flex-basis: 326px;
            height: 660px;
            flex-grow: 1;
            background-color: #16171a;
            border-radius: 1.0625rem;
            padding: 2.5rem 2.125rem 0 2.125rem;
            color: #fff;
            text-align: left;

            .mark {
                position: absolute;
                top: 0;
                right: 0;
                width: 83px;
                height: 83px;
            }

            .top {
                .title {
                    margin-bottom: 10px;
                    font-size: 1.75rem;
                    font-weight: 500;
                }

                .desc {
                    width: 280px;
                    font-size: 1.0625rem;
                    font-weight: 300;
                    line-height: 1.3;
                    margin: 0;
                }
            }

            .middle {
                padding: 1.875rem 0;
                margin: 1.875rem 0;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);

                .price {
                    font-size: 2.5rem;
                    font-weight: 500;
                    margin-bottom: 1.875rem;

                    span {
                        font-size: 16px;
                        font-weight: 400;
                        margin-left: 7px;
                        opacity: 0.7;
                    }
                }

                button {
                    width: 100%;
                    max-width: 100%;
                    background-color: #242529;
                }
            }

            .bottom {
                font-size: 1rem;

                p {
                    margin: 0;
                }

                ul {
                    margin: 0;
                    padding: 0;
                    margin-top: 1rem;

                    li {
                        position: relative;
                        list-style: none;
                        margin-left: 1.4rem;
                        margin-bottom: 8px;

                        &::before {
                            position: absolute;
                            content: "";
                            left: -1.6rem;
                            top: 1px;
                            background-size: cover;
                            width: 18px;
                            height: 18px;
                            opacity: 0.8;
                        }

                        &.user {
                            &::before {
                                background: url("@/assets/img/landingpage/icon_user.svg")
                                    no-repeat;
                            }
                        }

                        &.data {
                            &::before {
                                background: url("@/assets/img/landingpage/icon_data.svg")
                                    no-repeat;
                            }
                        }

                        &.file {
                            &::before {
                                background: url("@/assets/img/landingpage/icon_file.svg")
                                    no-repeat;
                            }
                        }

                        &.mail {
                            &::before {
                                background: url("@/assets/img/landingpage/icon_mail.svg")
                                    no-repeat;
                            }
                        }

                        &.forbiden {
                            &::before {
                                background: url("@/assets/img/landingpage/icon_forbiden.svg")
                                    no-repeat;
                            }
                        }

                        &.invitation {
                            &::before {
                                background: url("@/assets/img/landingpage/icon_invitation.svg")
                                    no-repeat;
                            }
                        }

                        &.global {
                            &::before {
                                background: url("@/assets/img/landingpage/icon_global.svg")
                                    no-repeat;
                            }
                        }
                    }
                }
            }

            &.blue {
                .mark {
                    fill: #0a4df1;
                }

                .top {
                    .title {
                        color: #306cff;
                    }
                }

                .middle {
                    button {
                        &:hover {
                            background-color: #0a4df1;
                        }
                    }
                }
            }

            &.green {
                .mark {
                    fill: #52dfa2;
                }

                .top {
                    .title {
                        color: #52dfc7;
                    }
                }

                .middle {
                    button {
                        &:hover {
                            background-color: #3ad08f;
                        }
                    }
                }
            }

            &.yellow {
                .mark {
                    fill: #fff06c;
                }

                .top {
                    .title {
                        color: #fff06c;
                    }
                }

                .middle {
                    button {
                        &:hover {
                            background-color: #e8ba3c;
                        }
                    }
                }
            }
        }
    }
}

.faq {
    padding: 5rem 0 5.625rem;

    .title {
        font-weight: 400;
        margin-bottom: 3.125rem;
    }

    .faq-list {
        padding: 0;
        margin: 0 auto;
        list-style: none;
        max-width: 62.5rem;
    }

    .faq-item {
        background-color: #16171a;
        border-radius: 0.875rem;
        margin-bottom: 1rem;
        text-align: left;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .item-title {
        font-size: 1.375rem;
        font-weight: 500;
        line-height: 1.4;
        padding: 1.875rem 6.125rem 1.875rem 2.5rem;
        position: relative;
        cursor: pointer;

        &::after {
            content: "";
            width: 2rem;
            height: 2rem;
            background: url(/src/assets/img/landingpage/icon_plus.svg) no-repeat;
            background-size: cover;
            position: absolute;
            right: 2.5rem;
            top: 1.8rem;
            transition: transform 0.5s ease;
            transform-origin: center;
        }

        &.open {
            &::after {
                transform: rotate(45deg);
            }
        }
    }

    .item-cont {
        padding: 0.25rem 4.5rem 2.5rem 2.75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.2;
        opacity: 0.7;

        ul {
            padding-left: 1.5rem;

            li {
                line-height: 1.3;
            }
        }
    }

    .text {
        margin: 0;
        word-break: keep-all;
    }
}

.contents {
    padding: 4.375rem 0;

    .title {
        margin-bottom: 2.25rem;
    }

    .tab-cont-wrap {
        max-width: 63.75rem;
        margin: 0 auto;
    }

    :deep(.tab-menu) {
        margin-bottom: 3.125rem;

        ul {
            box-shadow: none;
            gap: 0.625rem;
            padding: 0;
            border-radius: 0;
            background-color: transparent;

            li {
                padding: 0.75rem 1.875rem;
                border: 1px solid #fff;
                border-radius: 2.5rem;
                font-size: 1.25rem;
                font-weight: 500;
                color: #fff;

                &.active {
                    background-color: #fff;
                    color: #000;
                }
            }
        }

        .active-menu {
            display: none;
        }
    }

    .tab-cont {
        display: flex;
        align-items: flex-start;
        gap: 1.875rem;
        flex-wrap: wrap;
    }

    .tab-item {
        padding: 2.25rem 2.5rem;
        border-radius: 1rem;
        flex: 1;
        text-align: left;
        min-height: 26.25rem;
        display: flex;
        flex-direction: column;
        border-radius: 1rem;
        background: url("@/assets/img/landingpage/bg_contents1.png") lightgray
            50% / cover no-repeat;
        color: #000;

        &:nth-child(2) {
            background-image: url("@/assets/img/landingpage/bg_contents2.png");
        }

        &:nth-child(3) {
            background-image: url("@/assets/img/landingpage/bg_contents3.png");
        }

        .title {
            font-size: 2.125rem;
            font-weight: 500;
            line-height: 1.3;
            margin-bottom: 1.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .desc {
            font-size: 1rem;
            font-weight: 500;
            line-height: 1.3;
            margin-bottom: 3rem;
        }

        .btn-read-more {
            margin-top: auto;
            max-width: fit-content;
            padding: 0.875rem 1.375rem;
            border-radius: 2.5rem;
            border: 1px solid #000;
            background: transparent;
            font-size: 1.125rem;
            font-weight: 500;
            color: #000;

            &:hover {
                text-decoration: none;
                background-color: rgba(255, 255, 255, 0.05);
            }
        }

        &.videos {
            background: none;
            padding: 0;
            color: #fff;
            min-height: fit-content;

            .videos-wrap {
                border-radius: 1rem;
                overflow: hidden;

                position: relative;
                width: 100%;

                &::before {
                    content: "";
                    display: block;
                    padding-bottom: 56.25%;
                }
            }

            iframe {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
                background: #eee;

                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .title {
                font-size: 1.25rem;
                line-height: 1.5;
                margin-bottom: 0;
                margin-top: 1rem;
            }
        }
    }
}

.banner {
    padding: 7.5rem 0;
    margin: 0 5rem;

    .banner-inner {
        max-width: 1600px;
        margin: 0 auto 0;

        .title {
            background-image: linear-gradient(
                92.16deg,
                #0156ff 3.64%,
                #079af2 37.09%,
                #49c48d 51.65%,
                #e0fa1c 80%
            );
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            font-size: 3.125rem;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 0.625rem;
        }

        .desc {
            line-height: 1.4;
            margin-bottom: 1.875rem;
            color: rgba(255, 255, 255, 0.7);

            .wordset {
                display: block;
            }
        }
    }
}

.btn {
    padding: 0.875rem 4.375rem;
    background-color: #0a4df1;
    border-radius: 0.875rem;
    display: inline-block;
    font-size: 1.125rem;
    font-weight: 500;
    color: #fff;

    &:hover {
        text-decoration: none;
        background-color: #1656f2;
    }
}

@media (min-width: 1400px) {
    .feature {
        .feature-wrap {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media (max-width: 1280px) {
    .review {
        .review-swiper {
            padding: 0;

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

    .banner {
        padding-top: 80px;
    }
}

@media (max-width: 1000px) {
    .feature {
        .feature-wrap {
            max-width: 600px;
            margin: 0 auto;
            grid-template-columns: repeat(1, 1fr);

            .feature-item {
                .title {
                    height: initial;
                }
            }
        }
    }
}

@media (max-width: 900px) {
    .contents {
        .tab-cont {
            flex-direction: column;
            gap: 1.375rem;
        }

        .tab-item {
            min-height: 18.375rem;
            width: 100%;

            &.videos {
                min-height: fit-content;
                margin-bottom: 1.75rem;
            }
        }
    }
}

@media (max-width: 800px) {
    .hero {
        padding-bottom: 5rem;

        .title {
            margin-bottom: 0.875rem;
        }
    }

    .why {
        .reason-wrap {
            flex-direction: column;
            gap: 2.5rem;

            .reason-item {
                display: flex;
                align-items: center;
                text-align: left;
            }
        }
    }

    .review {
        .review-item {
            flex-direction: column;

            .content {
                text-align: center;

                .summary {
                    img {
                        margin-bottom: 2.5rem;
                    }
                }
            }
        }
    }

    .plan {
        .plan-swiper {
            max-width: 480px;
            margin: 0 auto;

            .plan-swiper-pagination {
                display: flex;
            }

            .plan-item {
                max-width: unset;
                flex-basis: unset;
            }
        }
    }

    .banner {
        margin: 0 3.75rem;

        .banner-inner {
            .title {
                font-size: 2.875rem;
            }

            .desc {
                font-size: 1.125rem;
            }
        }
    }
}

@media (max-width: 600px) {
    .why {
        .reason-wrap {
            .reason-item {
                flex-wrap: wrap;
                text-align: center;

                .image {
                    margin: 0 auto;
                }
            }
        }
    }

    .banner {
        .banner-inner {
            .desc {
                .wordset {
                    display: unset;
                }
            }
        }
    }
}

@media (max-width: 540px) {
    .feature {
        .feature-wrap {
            grid-gap: 2.25rem;

            .feature-item {
                text-align: center;
                justify-content: flex-start;
                gap: 30px;

                .img {
                    position: relative;
                    // height: 130px;
                    top: unset !important;
                    right: unset !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                &:nth-child(1) {
                    .img {
                        padding-right: 20px;
                    }
                }

                &:nth-child(2) {
                    .img {
                        padding-right: 50px;
                    }
                }

                &:nth-child(3) {
                    .img {
                        padding-left: 8px;
                    }
                }

                &:nth-child(4) {
                    .img {
                        padding-left: 20px;
                    }
                }

                &:nth-child(6) {
                    .img {
                        padding-left: 35px;
                    }
                }
            }
        }
    }

    .faq {
        padding: 3.125rem 0 3.75rem;

        .title {
            margin-bottom: 1.875rem;
        }

        .item-title {
            padding: 1rem 4rem 1rem 1.5rem;
            font-size: 1rem;

            &::after {
                width: 1.625rem;
                height: 1.625rem;
                right: 1.625rem;
                top: 1rem;
            }
        }

        .item-cont {
            padding: 0.25rem 1.5rem 1.875rem;
            font-size: 0.875rem;
        }
    }

    .contents {
        .tab-item {
            .btn-read-more {
                font-size: 0.9375rem;
                padding: 0.625rem 1rem;
            }
        }
    }
}

@media (max-width: 480px) {
    .review {
        .review-swiper {
            .swiper-button-prev,
            .swiper-button-next {
                display: none;
            }
        }
    }
}

@media (max-width: 430px) {
    .btn {
        font-size: 1rem;
        padding: 0.875rem;
        width: 14.375rem;
        max-width: 100%;
    }

    section {
        margin: 0 1.875rem;

        .title {
            font-size: 1.875rem;
            margin-bottom: 1rem;
        }

        .desc {
            font-size: 0.875rem;
        }
    }

    .hero-bg {
        &::before {
            height: 43rem;
        }
    }

    .hero {
        padding-top: 5rem;
        padding-bottom: 3.75rem;

        .title {
            font-size: 2.625rem;
            margin-bottom: 0.875rem;
        }

        .desc {
            padding: 0 1.25rem;
            margin-bottom: 2.5rem;
            font-size: 0.9375rem;
        }
    }

    .why {
        padding-top: 5rem;
        padding-bottom: 5rem;

        .title {
            margin-bottom: 2.5rem;
        }

        .reason-wrap {
            gap: 3.125rem;

            .reason-item {
                .image {
                    img {
                        width: 12rem;
                        height: 12rem;
                    }
                }

                .title {
                    font-size: 1.5625rem;
                    margin-bottom: 0.75rem;
                }

                .desc {
                    font-size: 0.9375rem;
                }
            }
        }
    }

    .review {
        padding: 3.125rem 0 2.5rem 0;

        .title {
            margin-bottom: 2.5rem;
        }

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

        .review-item {
            .reviewer {
                .profile {
                    left: 24px;
                    bottom: 24px;
                    font-size: 0.9375rem;

                    .name {
                        margin-bottom: 4px;
                    }
                }
            }

            .content {
                .summary {
                    p {
                        font-size: 1.625rem;
                    }
                }

                .entire {
                    font-size: 0.875rem;
                }
            }
        }
    }

    .feature {
        padding: 3.125rem 0;

        .title {
            margin-bottom: 1rem;
        }

        .desc {
            margin-bottom: 2.5rem;
        }

        .feature-wrap {
            display: block;

            .feature-item {
                gap: 6vw;
                padding: 11.5vw;
                margin-bottom: 1.5rem;

                &:last-child {
                    margin-bottom: 0;
                }

                .img {
                    img {
                        width: 46vw;
                    }
                }

                .title {
                    font-size: 1.625rem;
                }

                .content {
                    font-size: 0.875rem;
                }
            }
        }
    }

    .plan {
        .title {
            margin-bottom: 1rem;
        }

        .desc {
            margin-bottom: 1.25rem;
        }

        .plan-swiper {
            .plan-swiper-pagination {
                margin-bottom: 1.25rem;
                gap: 6px;
            }

            .plan-item {
                height: unset;
                padding-bottom: 2.5rem;

                .top {
                    .title {
                        font-size: 1.5rem;
                    }

                    .desc {
                        font-size: 0.9375rem;
                    }
                }

                .middle {
                    padding: 0.625rem 0 0.9375rem;
                    margin: 0.625rem 0;

                    .price {
                        font-size: 2rem;
                        margin-bottom: 0.9375rem;
                    }
                }

                .bottom {
                    ul {
                        li {
                            font-size: 0.875rem;
                        }
                    }
                }
            }
        }
    }

    .faq {
        .title {
            margin-bottom: 1.875rem;
        }
    }

    .contents {
        padding: 3.75rem 0 2.5rem;

        .title {
            margin-bottom: 1.875rem;
        }

        :deep(.tab-menu) {
            ul {
                gap: 0.375rem;

                li {
                    padding: 0.625rem 1rem;
                    font-size: 0.9375rem;
                }
            }
        }

        .tab-item {
            min-height: 23.75rem;

            .title {
                font-size: 1.75rem;
            }

            .desc {
                font-size: 0.875rem;
                margin-bottom: 2rem;
            }
        }
    }

    .banner {
        padding: 3.75rem 0 5rem 0;
        margin: 0 1.875rem;

        .banner-inner {
            padding: 18.5vw 9.5vw;

            .title {
                font-size: 1.75rem;
            }

            .desc {
                max-width: 240px;
                font-size: 0.9375rem;
                margin: 0 auto;
                margin-bottom: 1.25rem;
            }

            button {
                width: 100%;
            }
        }
    }
}

@media (max-width: 300px) {
    .hero {
        .title {
            font-size: clamp(30px, 14vw, 2.625rem);
        }
    }
}
</style>
