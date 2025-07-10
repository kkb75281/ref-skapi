<template lang="pug">
.service-list
	section.section.top-area
		a.top-item(href="https://docs.skapi.com/introduction/getting-started.html" target="_blank")
			.title Documents
			.desc Refer to the documentation for details, including a dedicated page for training your AI.
		.top-item.service-swiper
			swiper(
				:slidesPerView="1"
				:spaceBetween="30"
				:loop="true"
                :autoplay="{ delay: 2000, disableOnInteraction: false }"
				:pagination="{ clickable: true }"
				:modules="[Pagination, Autoplay]"

			)
				swiper-slide.service-swiper-item
					.title Announcement
					.desc Stable release is live, and services are running smoothly! You’re good to go.
				swiper-slide.service-swiper-item
					.title Use Cases
					.desc Explore our example use cases for more project inspiration.
					a.btn-more(href="#") See more
				swiper-slide.service-swiper-item
					.title New Features
					.desc A new feature just dropped! Check your dashboard and enjoy the update.

				.swiper-pagination
		.top-item.create-service
			.title Create a new service
			button.icon-text(@click="openCreateService")
				svg
					use(xlink:href="@/assets/img/material-icon.svg#icon-add") 
				span Create
			modalCreateService(:visible="showCreateModal" :isFirstService="!hasNoServices" @close="showCreateModal = false")
	section.section.my-services-list
		.title My Services

		Table.tb-services-list(resizable style="width:100%;")
			template(v-slot:head)
				tr
					th.th.overflow Service Name
					th.th.overflow Plan
					th.th.overflow State
					th.th.overflow Users
					th.th.overflow Database
					th.th.overflow File Storage
					th.th.overflow File Hosting
					th.th.overflow Email

			template(v-slot:body)
				tr(v-if="fetchingServiceList")
					td(colspan="8").
						Loading ... &nbsp;
						#[.loader(style="--loader-color:black; --loader-size:12px")]
				tr(v-else-if="!Object.keys(serviceIdList).length")
					td(colspan="8") You have no services yet.

				template(v-else v-for="id in serviceIdList")
					tr(v-if="serviceList[id]" @click="() => goServiceDashboard(serviceList[id])" @mousedown="(e) => e.currentTarget.classList.add('active')" @mouseleave="(e) => e.currentTarget.classList.remove('active')" :class="{'hidden': serviceList[id].service.active === 0 || serviceList[id].service.suspended}")
						td.name {{ serviceList[id].service.name }}
						td.plan
							.state(v-if="serviceList[id].service.subs_id && !serviceList[id].subscription")
								.loader(style="--loader-color:black; --loader-size:12px")
							span.badge(v-else :class="serviceList[id].plan?.toLowerCase().split(' ')[0]") {{ serviceList[id].service.plan || serviceList[id].plan }}
						td.state
							span.running(v-if="serviceList[id].service.active > 0") Running
							span.disabled(v-else-if="serviceList[id].service.active == 0") Disabled
							span.suspended(v-else-if="serviceList[id].service.suspended") Suspended
							span.empty(v-else) -
						td.users
							span.value(:class="getClass(serviceSpecList[id], 'users')")
								template(v-if="serviceSpecList[id]?.plan === 'Unlimited'")
									| Unlimited
								template(v-else)
									span.num {{ serviceSpecList[id]?.dataSize?.users }}
									|  / {{ serviceSpecList[id]?.servicePlan?.users }}

						td.database
							span.value(:class="getClass(serviceSpecList[id], 'database')") {{ typeof(serviceSpecList[id]?.dataPercent?.database) === 'string' ? serviceSpecList[id]?.dataPercent?.database : serviceSpecList[id]?.dataPercent?.database + '%' }}

						td.file-storage
							span.value(:class="getClass(serviceSpecList[id], 'cloud')") {{ typeof(serviceSpecList[id]?.dataPercent?.cloud) === 'string' ? serviceSpecList[id]?.dataPercent?.cloud : serviceSpecList[id]?.dataPercent?.cloud + '%' }}

						td.hosting
							span.value(:class="getClass(serviceSpecList[id], 'host')") {{ typeof(serviceSpecList[id]?.dataPercent?.host) === 'string' ? serviceSpecList[id]?.dataPercent?.host : serviceSpecList[id]?.dataPercent?.host + '%' }}

						td.email
							span.value(:class="getClass(serviceSpecList[id], 'email')") {{ typeof(serviceSpecList[id]?.dataPercent?.email) === 'string' ? serviceSpecList[id]?.dataPercent?.email : serviceSpecList[id]?.dataPercent?.email + '%' }}
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { watch, ref, computed } from "vue";
import {
    fetchingServiceList,
    serviceList,
    serviceIdList,
    serviceSpecList,
} from "@/views/service-list";
import { user } from "@/code/user";
import type Service from "@/code/service";
import Table from "@/components/table.vue";
import modalCreateService from "@/views/create-service.vue";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css"; // import Swiper styles
import "swiper/css/pagination";

const router = useRouter();

const showCreateModal = ref(false);

// 최초 서비스 생성 확인 여부
const hasNoServices = computed(() => !Object.keys(serviceIdList).length);

function openCreateService() {
    showCreateModal.value = true;
    // document.body.style.overflow = "hidden";
}

let goServiceDashboard = (service: { [key: string]: any }) => {
    router.push("/my-services/" + service.id);
};

let newServiceName = ref("");
let createService = () => {
    let regex = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    if (newServiceName.value.match(regex)) {
        alert("Special characters are not allowed");

        return;
    }
    router.push("/create/" + newServiceName.value);
};

let getClass = (service: ServiceSpec, what: string) => {
    let percentage: number | string;

    if (!service) {
        return "not-applicable";
    }

    if (service?.plan === "Unlimited") {
        return "unlimited";
    }

    percentage = service.dataPercent[what];

    if (percentage === "N/A") {
        return "not-applicable";
    } else if (typeof percentage === "number") {
        if (percentage >= 0 && percentage < 51) {
            return "green";
        } else if (percentage >= 51 && percentage < 81) {
            return "orange";
        } else if (percentage >= 81 && percentage < 101) {
            return "red";
        }
    }
    return "not-applicable";
};
</script>

<style lang="less" scoped>
a {
    text-decoration: none;
    color: inherit;

    &:hover {
        text-decoration: none;
    }
}

.service-list {
    max-width: 90rem;
    margin: 0 auto;
    padding: 3.75rem 4.5rem;
    width: 100%;
    height: 100%;
    flex: 1;
}

// top area
.top-area {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 3.75rem;
}

.top-item {
    color: #000;
    padding: 1.5rem 9rem 1.5rem 1.625rem;
    border-radius: 0.875rem;
    overflow: hidden;
    height: 13.125rem;
    position: relative;
    background: url("@/assets/img/myservice/bg_blue.png") no-repeat center;
    flex: 1;
    max-width: 27.125rem;

    .title {
        font-size: 1.375rem;
        font-weight: 600;
        line-height: 1.3;
        margin-bottom: 0.375rem;
    }

    .desc {
        font-size: 0.875rem;
        font-weight: 300;
        line-height: 1.4;
    }

    &::before {
        content: "";
        display: block;
        width: 10.625rem;
        height: 13.125rem;
        position: absolute;
        bottom: 0;
        right: 0;
        background: url("@/assets/img/myservice/img_docs.png") no-repeat center right;
    }

    &:last-child {
        font-size: 1rem;
        font-weight: 500;
        color: #fff;
        background: #000;
        padding: 3.375rem 2rem;
        text-align: center;

        &::before {
            content: none;
        }

        .title {
            font-size: 1.375rem;
            font-weight: 400;
            margin-bottom: 1.75rem;
        }

        button {
            max-width: 15.625rem;
            margin: 0 auto;
        }
    }
}

// swiper
.service-swiper {
    padding: 0;
    flex: none;

    &::before {
        content: none;
    }

    .swiper {
        height: 100%;
    }
}

.service-swiper-item {
    padding: 1.5rem 9rem 1.5rem 1.625rem;
    background: url("@/assets/img/myservice/bg_green.png") no-repeat center;
    position: relative;

    &::before {
        content: "";
        display: block;
        width: 10.625rem;
        height: 13.125rem;
        position: absolute;
        bottom: 0;
        right: 0;
        background: url("@/assets/img/myservice/img_announce.png") no-repeat center right;
    }

    &:nth-child(2) {
        background-image: url("@/assets/img/myservice/bg_purple.png");

        &::before {
            background-image: url("@/assets/img/myservice/img_useCase.png");
        }
    }

    &:last-child {
        background-image: url("@/assets/img/myservice/bg_yellow.png");

        &::before {
            background-image: url("@/assets/img/myservice/img_newFeature.png");
        }
    }

    .btn-more {
        font-size: 1rem;
        margin-top: 0.75rem;
        display: block;
        width: fit-content;
    }

    .swiper-pagination-fraction,
    .swiper-pagination-custom,
    .swiper-horizontal>.swiper-pagination-bullets,
    .swiper-pagination-bullets.swiper-pagination-horizontal {
        width: initial;
    }
}

// my services list
.my-services-list {
    .title {
        font-size: 1.5rem;
        font-weight: 400;
        line-height: 1.3;
        color: #fff;
        margin-bottom: 1.25rem;
    }
}

.tableMenu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5rem;
    padding: 0 10px;

    .pageName {
        font-size: 1.4rem;
        font-weight: 500;
    }
}

.iconbutton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--main-color);
    color: #fff;
    font-weight: 500;
    font-size: 0.8rem;
    border-radius: 12px;
    padding: 0.6rem 1.2rem;
    cursor: pointer;

    svg {
        width: 20px;
        height: 20px;
        fill: #fff;
    }
}

// table style
.tb-services-list {
    border: none;

    ::v-deep(.customTbl) {
        border-collapse: separate;
        border-spacing: 0 0.5rem;
        color: rgba(225, 225, 225, 0.8);
        width: 100% !important;
        text-align: center;
        min-width: 75rem;

        thead {
            background-color: #121214;

            tr {
                width: 100%;
                height: 2.625rem;
                overflow: hidden;

                &::before {
                    content: none;
                }
            }

            th {
                font-size: 0.8125rem;
                font-weight: 400;
                color: rgba(225, 225, 225, 0.8);
                text-align: center;
                width: 100%;
                padding: 0 0.625rem;

                &:first-child {
                    padding-left: 3rem;
                    border-top-left-radius: 0.625rem;
                    border-bottom-left-radius: 0.625rem;
                }

                &:last-child {
                    padding-right: 3rem;
                    border-top-right-radius: 0.625rem;
                    border-bottom-right-radius: 0.625rem;
                }

                &:hover {
                    background-color: transparent;
                }
            }
        }

        tbody {
            background-color: #121214;

            tr {
                height: 3.75rem;
                overflow: hidden;

                &::before,
                &::after {
                    content: none;
                }

                &:hover {
                    cursor: pointer;
                    background: linear-gradient(0deg,
                            rgba(255, 255, 255, 0.03) 0%,
                            rgba(255, 255, 255, 0.03) 100%),
                        #141315;

                    td {
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

                        &:first-child {
                            border-left: 1px solid rgba(255, 255, 255, 0.1);
                        }

                        &:last-child {
                            border-right: 1px solid rgba(255, 255, 255, 0.1);
                        }
                    }
                }

                &.hidden {
                    >*:not(.name) {
                        opacity: 0.5;
                    }
                }
            }

            td {
                font-size: 0.9375rem;
                font-weight: 400;
                color: #fff;
                padding: 0 0.625rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &:first-child {
                    padding-left: 3rem;
                    border-top-left-radius: 0.625rem;
                    border-bottom-left-radius: 0.625rem;
                }

                &:last-child {
                    padding-right: 3rem;
                    border-top-right-radius: 0.625rem;
                    border-bottom-right-radius: 0.625rem;
                }
            }
        }

        .plan {
            .badge {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                border-radius: 0.375rem;
                background-color: #888888;
                font-size: 0.75rem;
                font-weight: 500;
                color: #000;

                &.trial {
                    background-color: #3c94ff;
                }

                &.standard {
                    background-color: #77dfa2;
                }

                &.premium {
                    background-color: #f0e577;
                }

                &.canceled {
                    background-color: var(--caution-color);
                    color: #fff;
                }
            }
        }

        .state {
            span {
                &::before {
                    content: "";
                    display: inline-block;
                    width: 0.6875rem;
                    height: 0.6875rem;
                    background-color: #33d165;
                    border-radius: 50%;
                    margin-right: 0.375rem;
                }
            }

            .disabled {
                color: rgba(225, 225, 225, 0.5);
                opacity: 1;

                &::before {
                    background-color: #888888;
                }
            }

            .suspended {
                &::before {
                    background-color: #f33838;
                }
            }
        }

        .users {
            .value {
                color: rgba(225, 225, 225, 0.5);
            }

            .num {
                color: #fff;
            }
        }

        .value {
            &.not-applicable {
                position: relative;
                font-size: 0;
                display: flex;
                justify-content: center;

                &::before {
                    content: "";
                    display: block;
                    width: 1.25rem;
                    height: 1.25rem;
                    background: url("@/assets/img/myservice/icon_lock.svg") no-repeat center;
                }
            }
        }
    }
}

@media (max-width: 1080px) {
    .top-area {
        flex-direction: column;
    }

    .top-item {
        width: 100%;
        max-width: 100%;
        flex: auto;
    }
}

@media (max-width: 800px) {
    .service-list {
        padding: 3.75rem 1.25rem;
    }
}
</style>
