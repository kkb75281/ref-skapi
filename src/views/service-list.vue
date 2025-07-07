<template lang="pug">
.service-list
	section.section.top-area
		.top-item
			.title Documents
			.desc Refer to the documentation for details, including a dedicated page for training your AI.
		.top-item.service-swiper
			swiper(
				:slidesPerView="1"
				:spaceBetween="30"
				:loop="true"
				:modules="[Pagination]"
				:pagination="{ clickable: true }"
				@swiper="onSwiper"
				@slideChange="onSlideChange"
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
			button.btn-create(@click="createService")
				svg.svgIcon
					use(xlink:href="@/assets/img/material-icon.svg#icon-add") 
				span Create
	section.section.my-services-list
		//- .title.faktum My Services

		//- .iconbutton(@click="router.push('/create')")
		//- 	svg.svgIcon
		//- 		use(xlink:href="@/assets/img/material-icon.svg#icon-add") 
		//- 	span &nbsp;&nbsp;Create New Service
		.title My Services

		Table.tb-services-list(resizable)
			template(v-slot:head)
				tr
					th.th.overflow(style="width:166px;")
						| Service Name
						.resizer
					th.th.overflow(style="width:150px;")
						| Plan
						.resizer
					th.th.overflow(style="width:120px;")
						| State
						.resizer
					th.th.overflow(style="width:144px;")
						| Users
						.resizer
					th.th.overflow(style="width:144px;")
						| Database
						.resizer
					th.th.overflow(style="width:144px;")
						| File Storage
						.resizer
					th.th.overflow(style="width:144px;")
						| File Hosting
						.resizer
					th.th.overflow(style="width:144px;")
						| Email

			template(v-slot:body)
				tr(v-if="fetchingServiceList")
					td(colspan="8").
						Loading ... &nbsp;
						#[.loader(style="--loader-color:black; --loader-size:12px")]
				tr(v-else-if="!Object.keys(serviceIdList).length")
					td(colspan="8") You have no services yet.

				template(v-else v-for="id in serviceIdList")
					tr.hoverRow(v-if="serviceList[id]" @click="() => goServiceDashboard(serviceList[id])" @mousedown="(e) => e.currentTarget.classList.add('active')" @mouseleave="(e) => e.currentTarget.classList.remove('active')")
						td.overflow {{ serviceList[id].service.name }}
						td.overflow(style="white-space:nowrap")
							// plans
							.state(v-if="serviceList[id].service.subs_id && !serviceList[id].subscription")
								.loader(style="--loader-color:black; --loader-size:12px")
							span(v-else :style="{fontWeight: serviceList[id].service.plan === 'Canceled' ? 'normal' : null, color: serviceList[id].service.plan === 'Canceled' ? 'var(--caution-color)' : null}") {{ serviceList[id].service.plan || serviceList[id].plan }}
						td.overflow
							// active state
							.state(v-if="serviceList[id].service.active > 0" style="color:var(--text-green);font-weight:normal;") Running
							.state(v-else-if="serviceList[id].service.active == 0") Disabled
							.state(v-else-if="serviceList[id].service.suspended" style='color:var(--caution-color);font-weight:normal') Suspended
							.state(v-else) -
						td.overflow
							// users
							.percent(:class="getClass(serviceSpecList[id], 'users')") {{ serviceSpecList[id]?.plan === 'Unlimited' ? 'Unlimited' : serviceSpecList[id]?.dataSize?.users + '/' + serviceSpecList[id]?.servicePlan?.users }}

						td.overflow
							// database
							.percent(:class="getClass(serviceSpecList[id], 'database')") {{ typeof(serviceSpecList[id]?.dataPercent?.database) === 'string' ? serviceSpecList[id]?.dataPercent?.database : serviceSpecList[id]?.dataPercent?.database + '%' }}

						td.overflow
							// cloud storage
							.percent(:class="getClass(serviceSpecList[id], 'cloud')") {{ typeof(serviceSpecList[id]?.dataPercent?.cloud) === 'string' ? serviceSpecList[id]?.dataPercent?.cloud : serviceSpecList[id]?.dataPercent?.cloud + '%' }}

						td.overflow
							// host storage
							.percent(:class="getClass(serviceSpecList[id], 'host')") {{ typeof(serviceSpecList[id]?.dataPercent?.host) === 'string' ? serviceSpecList[id]?.dataPercent?.host : serviceSpecList[id]?.dataPercent?.host + '%' }}

						td.overflow
							// email storage
							.percent(:class="getClass(serviceSpecList[id], 'email')") {{ typeof(serviceSpecList[id]?.dataPercent?.email) === 'string' ? serviceSpecList[id]?.dataPercent?.email : serviceSpecList[id]?.dataPercent?.email + '%' }}

	br
	br
	br
	br
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { watch, ref } from "vue";
import {
    fetchingServiceList,
    serviceList,
    serviceIdList,
    serviceSpecList,
} from "@/views/service-list";
import { user } from "@/code/user";
import type Service from "@/code/service";
import Table from "@/components/table.vue";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css"; // import Swiper styles
import "swiper/css/pagination";

const router = useRouter();

console.log("serviceList", serviceList);

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
        return "grey";
    }

    if (service?.plan === "Unlimited") {
        return "purple";
    }

    percentage = service.dataPercent[what];

    if (percentage === "N/A") {
        return "grey";
    } else if (typeof percentage === "number") {
        if (percentage >= 0 && percentage < 51) {
            return "green";
        } else if (percentage >= 51 && percentage < 81) {
            return "orange";
        } else if (percentage >= 81 && percentage < 101) {
            return "red";
        }
    }
    return "grey";
};

// 상단 swiper
// Swiper 인스턴스를 받을 때 실행되는 콜백
const onSwiper = (swiper: any) => {
    console.log("Swiper instance:", swiper);
};

// 슬라이드 변경 이벤트 콜백
const onSlideChange = () => {
    console.log("Slide changed");
};
</script>

<style lang="less" scoped>
.service-list {
    max-width: 90rem;
    margin: 0 auto;
    padding: 3.75rem 7.5rem;
    height: 100%;
}

// top area
.top-area {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    // flex-wrap: wrap;
    margin-bottom: 3.75rem;
}

.top-item {
    padding: 1.5rem 9rem 1.5rem 1.625rem;
    border-radius: 0.875rem;
    overflow: hidden;
    height: 13.125rem;
    position: relative;
    background: url("@/assets/img/myservice/bg_blue.png") no-repeat center;
    flex: 1;
    max-width: 24.125rem;

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
        background: url("@/assets/img/myservice/img_docs.png") no-repeat center
            right;
    }

    &:last-child {
        font-size: 1rem;
        font-weight: 500;
        color: #fff;
        background: #000;
        padding: 3.375rem 3.625rem;
        text-align: center;

        &::before {
            content: none;
        }

        .title {
            font-size: 1.375rem;
            font-weight: 400;
            margin-bottom: 1.75rem;
        }

        .btn-create {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.25rem;
            font-size: 1rem;
            font-weight: 500;
            color: #fff;
            width: 100%;
            height: 2.75rem;
            border-radius: 0.5rem;
            background-color: #0a4df1;
            border: none;
            padding: 1rem;

            .svgIcon {
                fill: #fff;
                width: 1.125rem;
                height: 1.125rem;
            }

            &:hover {
                background-color: #1656f2;
            }
        }
    }
}

.service-swiper {
    padding: 0;

    &::before {
        content: none;
    }

    .swiper {
        height: 100%;
    }

    .swiper-pagination-bullet {
        opacity: 0.3;
    }

    .swiper-pagination-bullet-active {
        opacity: 0.8 !important;
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
        background: url("@/assets/img/myservice/img_announce.png") no-repeat
            center right;
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
        font-weight: 500;
        color: #000;
        margin-top: 0.75rem;
        display: block;

        &:hover {
            text-decoration: none;
        }
    }

    .swiper-pagination-fraction,
    .swiper-pagination-custom,
    .swiper-horizontal > .swiper-pagination-bullets,
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
        border-spacing: 0 1rem;

        tbody {
            background-color: #121214;
        }
    }
}

td {
    .percent {
        position: relative;
        display: inline-block;
        padding: 3px 12px 3px 24px;
        border-radius: 8px;
        // box-shadow: 0px -1px 1px 0px rgba(0, 0, 0, 0.15) inset;
        border: 1px solid rgba(0, 0, 0, 0.15);
        color: #fff;
        font-size: 0.7rem;
        font-weight: 500;

        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 11px;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #000;
        }

        &.green {
            color: #52d687;
            border-color: #52d687;
            background-color: #52d6870e;

            &::before {
                background-color: #52d687;
            }
        }

        &.orange {
            color: #fca642;
            border-color: #fca642;
            background-color: #fca6420e;

            &::before {
                background-color: #fca642;
            }
        }

        &.red {
            border-color: var(--caution-color);

            &::before {
                background-color: var(--caution-color);
            }
        }

        &.purple {
            color: #b881ff;
            border-color: #b881ff;
            background-color: #b881ff0e;

            &::before {
                background-color: #b881ff;
            }
        }

        &.grey {
            padding: 3px 12px;
            color: #bbb;
            border-color: #bbb;
            background-color: #cccccc0e;

            &::before {
                display: none;
            }
        }
    }
}
</style>
