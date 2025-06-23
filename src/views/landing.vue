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
					.imgage
						img(src="@/assets/img/landingpage/icon_reason1.svg", alt="Why Skapi Icon1")
					.reason
						.title Affordable Backend API
						.desc Most APIs cost $140+/month plus dev time. Skapi starts at just $19 — no servers, no backend hires, no bugs. Just copy code and go.

				.reason-item
					.imgage
						img(src="@/assets/img/landingpage/icon_reason2.svg", alt="Why Skapi Icon2")
					.reason
						.title Built-In Backend Security
						.desc Secure APIs, access, indexing, and data storage by default. Set permissions from the frontend. Skapi handles the rest.
				
				.reason-item
					.imgage
						img(src="@/assets/img/landingpage/icon_reason3.svg", alt="Why Skapi Icon3")
					.reason
						.title No servers. No stress.
						.desc No more server config, maintenance, and email hacks. Skapi gives you everything out of the box — so you can launch faster and sleep better.
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { npmVersion } from "@/main.ts";
import { user } from "@/code/user";
import { planSpec } from "@/views/service/service-spec";

import Code from "@/components/code.vue";
import TabMenu from '@/components/tab.vue';

let activeTabs = ref({
	pureHTML: 0,
	plan: 0,
	standardPlan: 0,
	premiumPlan: 0,
});

let selectedIcon = ref("Authentication");

let selectedIconDesc = {
	"Authentication": "Secure, AWS Cognito-based user management",
	"Database": "Scalable, auto-indexing database",
	"File Storage": "Reliable, S3-based storage",
	"CDN": "Deliver content globally with ease",
	"Realtime Data": "Instant WebRTC and WebSocket implementation",
	"API Bridge": "Connect external APIs effortlessly",
	"Automated Emails": "Built-in email automation & sending bulk emails",
	"Website Hosting": "Easy file & website hosting",
}

let hoverFramework = ref(null);

let copyVscode = (e) => {
	// console.log(e.currentTarget)
	// let allcopy = document.querySelectorAll('.copyMsg');
	// for (let i = 0; i < allcopy.length; i++) {
	//     allcopy[i].textContent = 'Copy code';
	// }
	let code = e.currentTarget.parentElement.nextElementSibling.querySelector('.body > pre');
	let doc = document.createElement('textarea');
	doc.textContent = code.textContent;
	document.body.append(doc);
	doc.select();
	document.execCommand('copy');
	doc.remove();

	let copied = e.currentTarget.parentElement.parentElement.querySelector('.copied');
	copied.classList.add('show');
	setTimeout(() => {
		copied.classList.remove('show');
	}, 1000);
}

onMounted(() => {
	let slideInner = document.querySelector(".slide-inner");
	let slideWrap = document.querySelector(".slide-wrap");
	let clone1 = slideInner.cloneNode(true); // 복제본 생성
	let clone2 = slideInner.cloneNode(true); // 복제본 생성

	slideWrap.appendChild(clone1); // 복제본 추가
	slideWrap.appendChild(clone2); // 복제본 추가
	// document.querySelector(".slide-inner").offsetWidth + "px"; // 원본, 복제본 위치 지정

	// slideInner.classList.add("original");
	// clone.classList.add("clone");
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
	}

	.desc {
		max-width: 43.75rem;
		margin: 0 auto;
		padding: 0.625rem 2.5rem;
		opacity: 0.7;
		line-height: 1.5;
		font-weight: 300;
		font-size: 1.25rem;
		margin-bottom: 1.25rem;
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

@media (max-width: 800px) {
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
}

@media (max-width: 559px) {
	.why {
		.reason-wrap {
			.reason-item {
				flex-wrap: wrap;
				text-align: center;

				.imgage {
					margin: 0 auto;
				}
			}
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
		.title {
			margin-bottom: 2.5rem;
		}

		.reason-wrap {
			gap: 3.125rem;

			.reason-item {
				.imgage {
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
}
</style>