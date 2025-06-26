<template lang="pug">
footer#footer
	.top
		.top-inner
			.left
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
							img(src="@/assets/img/landingpage/icon_github.svg", alt="GitHub")
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
				p.small Terms of service / Privacy policy
	.bottom
		.bottom-inner
			span BROADWAYINC PTE. LTD. Singapore.
			.icon-wrap
				img(src="@/assets/img/landingpage/icon_discord.svg")
				img(src="@/assets/img/landingpage/icon_instagram.svg")
				img(src="@/assets/img/landingpage/icon_youtube.svg")
				img(src="@/assets/img/landingpage/icon_x.svg")
				img(src="@/assets/img/landingpage/icon_linkedin.svg")
				img(src="@/assets/img/landingpage/icon_facebook.svg")
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const hoveredMenu = ref('');

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
	const footerElement = document.getElementById('footer');

	if (!footerElement) {
		return;
	}

	const height = footerElement.offsetHeight;

	if (height) {
		document.body.style.setProperty('--footer-height', height + 'px');
	}
}

onMounted(() => {
	setFooterHeight();
	window.addEventListener('resize', setFooterHeight);
})

onUnmounted(() => {
	window.removeEventListener('resize', setFooterHeight);
});
</script>
<style lang="less" scoped>
#footer {
	position: relative;
	height: 100%;
	// height: var(--footer-height);
	// transform: translateY(-100%);
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
			max-width: 528px;
			display: flex;
			flex-wrap: wrap;
			gap: 30px;
			flex-grow: 1;
			align-items: flex-start;
			justify-content: space-between;

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

				&.small {
					font-size: 15px;
					opacity: 0.5;
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
			gap: 1rem;
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
				.logo {
					gap: 20px;

					img {
						width: 90px;
					}
				}

				ul {
					li {
						margin-bottom: 8px;
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