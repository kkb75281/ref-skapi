<template lang="pug">
main.landing-page-root
	.bg-blue.hero-bg
		section.hero
			.title #[span.linear-gradient Zero-Setup] #[span.wordset Backend API]
			.desc Skapi is a serverless backend platform that gives frontend developers,no-coders, and product teams everything they need: auth, database,file storage, and real-time APIs.  Launch your app in minutes.
			button Get Started

		section.video
			.wrap
				.inner

		section.why
			.title Why Skapi?
			.reason-wrap
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
	.bg-dark(style="padding: 0 2.5rem;")
		section.review
			.title Real Reviews
			.review-swiper
				swiper(
					:slidesPerView="1"
					:spaceBetween="30"
					:loop="true"
					:pagination="{ clickable: true }"
					:navigation="true"
					:modules="modules"
					@swiper="onSwiperReady"
				)
					swiper-slide
						.review-item
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
	.bg-blue
		section.feature
			.title Features
			.desc All You Need for Modern Web Apps. #[br]Discover 6 Unique Advantages Only Skapi Delivers.
			.feature-wrap
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
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import { npmVersion } from "@/main.ts";
import { user } from "@/code/user";

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css'; // import Swiper styles
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const modules = [Pagination, Navigation];

function setSwiperImageWidth() {
	let swiperImage = document.getElementById('reviewerImg');
	let swiperImageWidth = swiperImage.getBoundingClientRect().height + 10;

	console.log('swiperImageWidth', swiperImageWidth);

	document.body.style.setProperty('--swiper-pagination-translate-y', `${swiperImageWidth}px`);
}

function onSwiperReady(swiper) {
	console.log('Swiper is ready!');
	setTimeout(() => {
		setSwiperImageWidth();
	}, 100); // 약간의 딜레이로 DOM이 완전히 렌더링되도록 함
}

onMounted(() => {
	window.addEventListener('resize', setSwiperImageWidth);
});

onUnmounted(() => {
	window.removeEventListener('resize', setSwiperImageWidth);
});
</script>

<style lang="less" scoped>
button {
	display: inline-flex;
	padding: .875rem 4.375rem;
	justify-content: center;
	align-items: center;
	gap: 10px;
	border-radius: 13px;
	background: #0A4DF1;
	border: 0;
	color: #FFF;
	font-size: 1.125rem;
	font-weight: 500;
	line-height: 1.5;
}

section {
	margin: 0 2.5rem;
	color: #fff;
	text-align: center;
}

.bg-blue {
	background-color: #16171A;
}

.bg-dark-blue {
	background-color: #121214;
}

.bg-dark {
	background-color: #111112;
}

.hero-bg {
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 54.25rem;
		background-color: #121214;
	}
}

.title {
	font-size: 3rem;
}

.hero {
	position: relative;
	padding-top: 8.125rem;
	padding-bottom: 6.25rem;
	z-index: 1;

	.title {
		font-size: 4rem;
		font-weight: 500;
		margin-bottom: 1.25rem;
	}

	.desc {
		max-width: 43.75rem;
		margin: 0 auto;
		opacity: 0.7;
		line-height: 1.5;
		font-weight: 300;
		font-size: 1.25rem;
		margin-bottom: 1.875rem;
	}

	.linear-gradient {
		background-image: linear-gradient(92.16deg, #0156FF 3.64%, #079AF2 37.09%, #49C48D 61.65%, #E0FA1C 100%);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}
}

.video {
	position: relative;
	margin-bottom: 4.625rem;
	z-index: 1;

	.wrap {
		max-width: 1200px;
		// height: 853px;
		margin: 0 auto;
		border-radius: 1.5rem;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		aspect-ratio: 16/9;

		.inner {
			width: 100%;
			height: 100%;
			background-color: #1C1C1C;
			object-fit: cover;
		}
	}
}

.why {
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
				margin-bottom: .875rem;
			}

			.desc {
				font-size: 1.125rem;
				font-weight: 300;
				line-height: 1.5;
				opacity: 0.7;
			}
		}
	}
}

.review {
	max-width: 1450px;
	margin: 0 auto;
	padding: 3.75rem 0 5rem 0;

	.title {
		margin-bottom: 5rem;
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
			border-radius: .8125rem;
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
				color: white;
				/* 프로필 텍스트 색상 */
				font-size: 1.25rem;
				line-height: 1.5;

				.name {
					font-weight: 500;
					margin-bottom: 7px;
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

	.title {
		margin-bottom: 1.25rem;
	}

	.desc {
		opacity: 0.7;
		line-height: 1.4;
		font-size: 1.25rem;
		margin-bottom: 5rem;
	}

	.feature-wrap {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 50px;

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

			.img {
				position: absolute;
				top: 50px;
				right: 50px;
			}

			.title {
				position: relative;
				margin: 0;
				font-size: 2rem;
				line-height: 1.2;
				z-index: 1;
			}

			.content {
				opacity: 0.7;
				font-size: 1.0625rem;
				line-height: 1.3;
			}
		}
	}
}

@media (max-width: 1280px) {
	.feature {
		.feature-wrap {
			grid-template-columns: repeat(2, 1fr);
		}
	}
}

@media (max-width: 800px) {
	.hero {
		padding-bottom: 5rem;

		.title {
			margin-bottom: .875rem;
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

	.feature {
		.feature-wrap {
			.feature-item {
				text-align: center;
				justify-content: flex-start;
				gap: 30px;

				.img {
					position: relative;
					top: unset;
					right: unset;
				}

				&:nth-child(2) {
					.img {
						padding-left: 20px;
					}
				}

				&:nth-child(3) {
					.img {
						padding-left: 8px;
					}
				}

				&:nth-child(4) {
					.img {
						padding-left: 10px;
					}
				}
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

	.feature {
		.feature-wrap {
			grid-template-columns: repeat(1, 1fr);
		}
	}
}

@media (max-width: 430px) {
	button {
		font-size: 1rem;
	}

	.hero-bg {
		&::before {
			height: 40rem;
		}
	}

	.title {
		font-size: 1.875rem;
	}

	.hero {
		padding-top: 5rem;
		padding-bottom: 3.75rem;

		.title {
			font-size: 2.625rem;
			margin-bottom: .875rem;
		}

		.desc {
			padding: 0 1.25rem;
			margin-bottom: 2.5rem;
			font-size: .9375rem;
		}
	}

	.video {
		margin: 0 1.5625rem;
		margin-bottom: 5.125rem;
	}

	.why {
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
					margin-bottom: .75rem;
				}

				.desc {
					font-size: .9375rem;
				}
			}
		}
	}

	.review {
		padding: 3.125rem 0 2.5rem 0;

		.title {
			margin-bottom: 2.5rem;
		}

		.review-item {
			.reviewer {
				.profile {
					left: 24px;
					bottom: 24px;
					font-size: .9375rem;

					.name {
						margin-bottom: 4px;
					}
				}
			}

			.content {
				.summary {
					p {
						font-size: 1.625rem
					}
				}

				.entire {
					font-size: .875rem;
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
			font-size: .875rem;
			margin-bottom: 2.5rem;
		}

		.feature-wrap {
			.feature-item {
				.title {
					font-size: 1.625rem;
				}

				.content {
					font-size: .875rem;
				}
			}
		}
	}
}
</style>