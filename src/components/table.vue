<template lang="pug">
.tableWrap(ref='full')
    slot(name="msg")
    table.customTbl(ref='table' :class='{resizable}' style="width:0")
        thead(ref="thead")
            slot(name="head")

        tbody
            slot(name='body')
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, useSlots, onBeforeUnmount } from "vue";
let { resizable } = defineProps({
    resizable: Boolean,
});

let thead = ref(null);
let slots = useSlots();

let observer: MutationObserver = null;
let resizers_arr: Element[] = [];
let full = ref(null);
let removeSetup = () => {
    resizers_arr.forEach((resizer) => {
        resizer.removeEventListener("mousedown", mousedown);
    });
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseup);
};

let headFullWidth = 0;
let fakeWidth = ref(0);

if (resizable) {
    onMounted(async () => {
        // Check if slot is rendered

        if (slots.head) {
            if (resizable) {
                await setResize();

                // Create a MutationObserver to watch for changes in the 'thead' element
                observer = new MutationObserver((mutationsList) => {
                    for (let mutation of mutationsList) {
                        type MutationType = "childList" | "attributes";
                        let type = mutation.type as MutationType;

                        if (type === "childList") {
                            setResize();
                        }
                        // if (mutation.type === 'attributes') {
                        //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
                        // }
                    }
                });

                // Start observing the 'thead' element for configured mutations
                observer.observe(thead.value, {
                    // attributes: true,
                    childList: true,
                    subtree: true,
                });
            }
        }
    });
    onBeforeUnmount(() => {
        removeSetup();
        if (observer) {
            observer.disconnect();
        }
    });
}

// ResizeObserver 인스턴스 생성
const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
        // tableWrapWidth 계산
        let tableWrapWidth = entry.contentRect.width;

        // customTblWidth 계산
        let customTbl = entry.target.querySelector(".customTbl");
        if (!customTbl) return; // .customTbl 요소가 없는 경우 처리
        let customTblWidth = customTbl.getBoundingClientRect().width;

        // fakeWidth 계산 및 적용
        if (customTblWidth < tableWrapWidth) {
            let fakeWidth = tableWrapWidth - customTblWidth;
            document.body.style.setProperty("--fakeWidth", `${fakeWidth}px`);
        } else {
            document.body.style.setProperty("--fakeWidth", "0px"); // fakeWidth 초기화
        }

        // 디버깅 로그 출력
        // console.log({
        //     tableWrapWidth,
        //     customTblWidth,
        //     fakeWidth: parseFloat(document.body.style.getPropertyValue('--fakeWidth'))
        // });
    }
});

// full.value 요소를 관찰 대상으로 등록
onMounted(() => {
    if (full.value) {
        resizeObserver.observe(full.value);
    }
});

let currentHeadCol: HTMLElement = null;
let pageXMouseDown = 0;
let pageXMouseMoveDiff = 0;
let currentHeadColWidth = 0;

let thTotal = 0;
let currentSiblingHeadWidth = 0;

let mousedown = (e: MouseEvent) => {
    let el = thead.value;
    let ths = el.querySelectorAll("th");
    let th = (e.currentTarget as HTMLElement).parentElement;

    for (let i = 0; i < ths.length; i++) {
        if (ths[i] === th) {
            ths[i].classList.add("hovered");
        } else {
            ths[i].classList.add("nohover");
        }
    }

    thTotal = parseFloat(window.getComputedStyle(el).width);

    pageXMouseDown = e.pageX;
    let currentTarget = e.currentTarget as HTMLElement;
    currentHeadCol = currentTarget.parentNode as HTMLElement;
    if (!currentHeadCol) {
        return;
    }
    currentHeadColWidth = parseFloat(
        window.getComputedStyle(currentHeadCol).width
    );
    if (isNaN(currentHeadColWidth)) {
        return;
    }
    currentSiblingHeadWidth = parseFloat(
        window.getComputedStyle(
            currentHeadCol.nextElementSibling as HTMLElement
        ).width
    );
};

let mouseup = () => {
    currentHeadCol = null;
    pageXMouseDown = pageXMouseMoveDiff;
    if (thead.value) {
        let th = thead.value.querySelectorAll("th");
        for (let i = 0; i < th.length; i++) {
            th[i].classList.remove("hovered");
            th[i].classList.remove("nohover");
        }
    }
};

let mouseMoveHandler = (e) => {
    if (!currentHeadCol) {
        return;
    }

    if (currentHeadCol.classList.contains("fixed")) return;

    // 마우스 이동 거리 계산
    pageXMouseMoveDiff = e.pageX - pageXMouseDown;

    // 새로운 너비 계산
    let newWidth = currentHeadColWidth + pageXMouseMoveDiff;

    // 너비가 음수가 되지 않도록 제한
    if (newWidth < 50) {
        newWidth = 50;
    }

    // 현재 열의 너비만 적용
    currentHeadCol.style.width = `${newWidth}px`;

    // .tableWrap 의 너비 가져오기
    let tableWrapWidth = parseFloat(window.getComputedStyle(full.value).width);
    // customTbl 의 너비 가져오기
    let customTblWidth = parseFloat(
        window.getComputedStyle(full.value.querySelector(".customTbl")).width
    );
    // customTbl 의 너비가 .tableWrap 의 너비보다 작으면
    if (customTblWidth < tableWrapWidth) {
        // 차이 값 만큼 fakeWidth 값 설정
        fakeWidth.value = tableWrapWidth - customTblWidth;
        // customTblWidth 의 가상요소 너비를 fakeWidth 값으로 설정
        document.body.style.setProperty("--fakeWidth", `${fakeWidth.value}px`);
    }
};

let setResize = async () => {
    // - initiallize start
    removeSetup();
    await nextTick();
    headFullWidth = parseFloat(window.getComputedStyle(full.value).width);

    // let tableWrapWidth = parseFloat(window.getComputedStyle(full.value).width);
    // let customTblWidth = parseFloat(window.getComputedStyle(full.value.querySelector('.customTbl')).width);
    // if (customTblWidth < tableWrapWidth) {
    // 	fakeWidth.value = tableWrapWidth - customTblWidth;
    // 	document.body.style.setProperty('--fakeWidth', `${fakeWidth.value + 10}px`);
    // }

    let el = thead.value;
    let th = el.querySelectorAll("th");

    // 마지막 th 에 last 클래스 추가
    th[th.length - 1].classList.add("last");

    // for (let i = 0; i < th.length - 1; i++) {
    // 	if (th[i].classList.contains('fixed')) continue;
    // 	let style = window.getComputedStyle(th[i]);
    // 	th[i].style.width = style.width;
    // }

    resizers_arr = [];
    // - initiallize end

    let resizers = el.querySelectorAll("th > .resizer:not(.fixed)");
    for (let i = 0; i < resizers.length; i++) {
        (resizers[i] as HTMLElement).addEventListener("mousedown", mousedown);
        resizers_arr.push(resizers[i]);
    }
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseup);
};
</script>

<style lang="less">
.customTbl.resizable > thead > tr > th > .resizer {
    cursor: col-resize;
}

.tableWrap {
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;
    border-radius: 10px;

    &::-webkit-scrollbar {
        width: 0.25rem;
        height: 0.25rem;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(225, 225, 225, 0.4);
        border-radius: 12px 12px 12px 12px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }
}

.tableMsg {
    position: absolute;
    top: 58px;
    left: 0;
    color: rgba(225, 225, 225, 0.8);
    font-size: 0.875rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;

    &.left {
        left: 16px;
    }

    &.center {
        left: 50%;
        transform: translateX(-50%);
    }

    &.empty {
        & ~ .customTbl {
            tbody {
                tr {
                    pointer-events: none;

                    &:hover {
                        background: transparent;
                    }
                }
            }
        }
    }
}

.customTbl {
    width: auto; // 테이블 너비는 자동으로 조정
    min-width: fit-content; // 최소 너비는 내용에 맞춤
    border-collapse: collapse;
    table-layout: fixed;

    &.resizable {
        thead {
            th {
                &.hovered,
                &:hover {
                    .resizer {
                        display: block;
                    }
                }
            }
        }
    }

    .overflow {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    thead {
        background-color: #f9f9f9;
        text-align: left;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);

        tr {
            position: relative;
            height: 60px;

            &::before {
                position: absolute;
                content: "";
                display: block;
                height: 100%; // 높이는 최소화
                background-color: #121214;
                min-width: var(--fakeWidth); // 화면 너비만큼 확장
                top: 0;
                right: calc(var(--fakeWidth) * -1);
                z-index: -1; // 테이블 뒤쪽으로 배치
                border-top-left-radius: 0.625rem;
                border-bottom-left-radius: 0.625rem;
            }

            &::after {
                position: absolute;
                content: "";
                display: block;
                background-color: #121214;
                min-width: var(--fakeWidth); // 화면 너비만큼 확장
                height: 100%;
                bottom: -0.5px;
                right: calc(var(--fakeWidth) * -1);
                border-top-right-radius: 0.625rem;
                border-bottom-right-radius: 0.625rem;
            }
        }

        th {
            position: relative;
            font-size: 0.7rem;
            font-weight: 500;
            padding: 0 20px;
            white-space: nowrap;
            user-select: none;

            span {
                display: inline-block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 100%;
            }

            text-overflow: ellipsis;

            &.center {
                text-align: center;
            }

            &.last {
                background-color: transparent !important;

                .resizer {
                    display: none !important;
                }
            }

            &.nohover,
            &.fixed {
                &:hover {
                    background: linear-gradient(
                            0deg,
                            rgba(255, 255, 255, 0.03) 0%,
                            rgba(255, 255, 255, 0.03) 100%
                        ),
                        #141315;

                    .resizer {
                        display: none;
                    }
                }
            }

            .resizer {
                position: absolute;
                top: 0px;
                right: -9px;
                width: 12px; // enough width for user to grab
                border-left: 4px solid transparent;
                border-right: 12px solid transparent;
                display: none;
                height: 20px;

                &::before {
                    content: "";
                    display: block;
                    height: 100%;
                    width: 2px;
                    background-color: rgba(225, 225, 225, 0.5);
                }

                &.contrast {
                    background-color: #fff !important;
                }
            }
        }
    }

    tbody {
        overflow-y: auto;
        background-color: #fff;

        tr {
            position: relative;
            height: 60px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);

            &::before {
                position: absolute;
                content: "";
                display: block;
                height: 3.75rem; // 높이는 최소화
                background-color: #121214;
                min-width: var(--fakeWidth); // 화면 너비만큼 확장
                top: 0;
                right: calc(var(--fakeWidth) * -1);
                z-index: -1; // 테이블 뒤쪽으로 배치
                border-top-left-radius: 0.625rem;
                border-bottom-left-radius: 0.625rem;
            }

            &::after {
                position: absolute;
                content: "";
                display: block;
                background-color: #121214;
                min-width: var(--fakeWidth); // 화면 너비만큼 확장
                height: 3.75rem;
                bottom: -1px;
                right: calc(var(--fakeWidth) * -1);
                // z-index: -1; // 테이블 뒤쪽으로 배치
                border-top-right-radius: 0.625rem;
                border-bottom-right-radius: 0.625rem;
            }

            &:last-child {
                border-bottom: none;
            }
        }

        td {
            position: relative;
            padding: 0 1rem;
            font-size: 0.8rem;

            &.center {
                text-align: center;
            }
        }
    }

    // new style
    border-collapse: separate;
    border-spacing: 0 0.5rem;
    color: rgba(225, 225, 225, 0.8);

    .left {
        text-align: left;
    }

    .nohover {
        &:hover {
            cursor: default;
            background: transparent;

            td {
                border: none;

                &:first-child {
                    border-left: none;
                }
            }

            &::before,
            &::after {
                height: calc(100% + 1px);
                background: #121214;
                border-top: none;
                border-bottom: none;
                border-right: none;
            }
        }
    }

    thead {
        background-color: #121214;

        tr {
            width: 100%;
            height: 2.625rem;
            overflow: hidden;
        }

        th {
            font-size: 0.8125rem;
            font-weight: 400;
            color: rgba(225, 225, 225, 0.8);
            text-align: center;
            width: 100%;
            padding: 0 0.625rem;

            &:first-child {
                border-top-left-radius: 0.625rem;
                border-bottom-left-radius: 0.625rem;
            }

            &:hover {
                background: linear-gradient(
                        0deg,
                        rgba(255, 255, 255, 0.03) 0%,
                        rgba(255, 255, 255, 0.03) 100%
                    ),
                    #141315;
            }
        }
    }

    tbody {
        background-color: #121214;

        tr {
            height: 3.75rem;
            overflow: hidden;

            &:hover {
                cursor: pointer;
                background: linear-gradient(
                        0deg,
                        rgba(255, 255, 255, 0.03) 0%,
                        rgba(255, 255, 255, 0.03) 100%
                    ),
                    #141315;

                td {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

                    &:first-child {
                        border-left: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    &:last-child {
                        border-right: none;
                    }
                }

                &::before,
                &::after {
                    background: linear-gradient(
                            0deg,
                            rgba(255, 255, 255, 0.03) 0%,
                            rgba(255, 255, 255, 0.03) 100%
                        ),
                        #141315;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                }

                &::after {
                    height: calc(100% - 1px);
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
            text-align: center;

            &:first-child {
                border-top-left-radius: 0.625rem;
                border-bottom-left-radius: 0.625rem;
            }
        }
    }

    .empty-value {
        position: absolute;
        top: 78px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        pointer-events: none;
        cursor: default;
        height: fit-content;

        ~ tr {
            &:hover {
                cursor: default;
                background: transparent;

                &::before,
                &::after {
                    background: #121214;
                    border: none;
                }

                td {
                    border: none;
                }
            }
        }

        &:hover {
            cursor: default;
            background: transparent;

            ~ tr {
                pointer-events: none;

                &:hover {
                    background: transparent;
                }
            }

            td {
                border: none;
            }

            &::before,
            &::after {
                background: #121214;
                border: none;
            }
        }
    }
}

@media (max-width: 768px) {
    .customTbl {
        tbody {
            tr {
                &:hover {
                    &::before,
                    &::after {
                        border-right: none;
                    }
                }
            }
        }
    }
}
</style>
