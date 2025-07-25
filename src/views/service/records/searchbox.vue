<template lang="pug">
form#searchForm(@submit.prevent="callSearch")
    .inner
        input(hidden name='service' :value='currentService.id')
        input(hidden name='owner' :value='currentService.owner')

        .content 
            .tit Table
            .row
                .key Access Group
                .value
                    select.fix(v-model='accessGroup')
                        option(selected value='public') Public
                        option(value='auth') Access Group
                        option(value='private') Private

                    input(v-if='accessGroup === "public"' value='public' name='table[access_group]' disabled)
                    input(v-else-if='accessGroup === "auth"' placeholder="1 ~ 99" value='1' type='number' name='table[access_group]' required)
                    input(v-else-if='accessGroup === "private"' value='private' name='table[access_group]' disabled)
            .row
                .key Name
                .value
                    input(placeholder="Table.Name" name='table[name]' v-model='tableName')
            .row.line(:class="{'disabled': !tableName}")
                .key Subscription
                .value
                    input(placeholder="xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" name='table[subscription]' :disabled="!tableName")

            div(:class="{'disabled': !tableName}")
                .tit Index
                .row
                    .key Search By
                    .value
                        select(v-model='searchIndex' :disabled="!tableName")
                            option(selected value='name') By Index Name
                            option(value='$updated') By Updated Timestamp
                            option(value='$uploaded') By Uploaded Timestamp
                            option(value='$referenced_count') By Referenced Count
                            option(value='$user_id') By User ID
                .row
                    .key Name
                    .value
                        input(v-if='searchIndex == "name"' name='index[name]' placeholder='Alphanumeric, periods only.' :disabled="!tableName")
                        input(v-else name='index[name]' :value='searchIndex' :disabled="!tableName || searchIndex !== 'name'")
                
                .row(:class="{line: searchIndex === '$user_id'}")
                    .key Value
                    .value
                        template(v-if='searchIndex == "name"')
                            select.fix(v-model='searchIndexType' :disabled="!tableName")
                                option(value='string' selected) String
                                option(value='number') Number
                                option(value='boolean') Boolean

                            input(v-if="searchIndexType !== 'boolean'"
                                name='index[value]'
                                :disabled="!tableName"
                                :type='searchIndexType' :placeholder='searchIndexType === "string" ? "Alphanumeric, space only." : searchIndexType === "number" ? "Number value" : "Boolean value"'
                            )

                            .flex-wrap.toggle-wrap(v-else style="flex-grow:1;")
                                input(hidden type='radio' name='index[value]' :value="booleanToggle" :disabled="!tableName")
                                Toggle(
                                    :disabled="!tableName"
                                    :active="booleanToggle"
                                    @click="booleanToggle = !booleanToggle"
                                )
                        template(v-else-if='searchIndex == "$user_id"')
                            input(
                            name='index[value]'
                            type='string' placeholder='xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                            required
                            pattern='[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
                            title='Invalid user\'s ID'
                            :disabled="!tableName"
                        )
                        template(v-else)
                            input(
                                name='index[value]'
                                type='number' :placeholder='searchIndex == "$referenced_count" ? "Number of references" : "1234567890123"'
                                :disabled="!tableName"
                                required)

                .row.line(v-if='searchIndex !== "$user_id"')
                    .key Condition
                    .value
                        template(v-if='searchIndex == "name"')
                            select#selectCondition(v-model='searchIndexCondition' :disabled="!tableName")
                                option(value='=' selected) =
                                option(value='>=') Greater or =
                                option(value='>') Greater
                                option(value='<=') Less or =
                                option(value='<') Less
                                option(value='range') Range

                            input(v-if='searchIndexCondition !== "range"' hidden :value='searchIndexCondition' name='index[condition]' :disabled="!tableName")
                            input(v-else name='index[range]' :type='searchIndexType' :placeholder='searchIndexType === "string" ? "Alphanumeric, space only." : searchIndexType === "number" ? "Number value" : "Boolean value"' :disabled="!tableName")
                        template(v-else)
                            select#selectCondition(v-model="searchIndexCondition" :disabled="!tableName")
                                option(value='=' selected) =
                                option(value='>=') Greater or =
                                option(value='>') Greater
                                option(value='<=') Less or =
                                option(value='<') Less
                                option(value='range') Range

                            input(v-if='searchIndexCondition !== "range"' hidden :value='searchIndexCondition' name='index[condition]' :disabled="!tableName")
                            input(v-else name='index[range]' type='name' :placeholder='searchIndex == "$referenced_count" ? "Number of references" : "1234567890123"' required :disabled="!tableName")

                .tit Reference
                .row.line
                    .key
                    .value
                        input(placeholder="Unique_id or Record_id or User_id" name='reference' :disabled="!tableName")

                .tit Tag
                .row.line
                    .key 
                    .value
                        input(name='tag' placeholder="Tag name. Alphanumeric and space only." :disabled="!tableName")

            div(style='text-align:right')
                button.btn.sm.wideOnMobile.btn-search(type="submit") Search

</template>

<script setup lang="ts">
import { currentService } from "@/views/service/main";
import { ref, reactive, watch, nextTick } from "vue";

import Toggle from "@/components/toggle.vue";

// let { callSearch } = defineProps({
//     callSearch: Function,
// });
let tableName = ref("");
let searchBy = ref("record_id");
let searchIndex = ref("name");
let searchIndexCondition = ref("=");
let searchIndexType = ref("string");
let accessGroup = ref("public");
let booleanToggle = ref(true);

const props = defineProps({
    callSearch: Function,
    isInModal: {
        type: Boolean,
        default: false,
    },
});

watch(searchIndexCondition, (nv) => {
    let select = document.getElementById("selectCondition");
    if (!select) return;

    if (nv === "range") {
        console.log(select);
        nextTick(() => {
            select.classList.add("fix");
        });
    } else {
        nextTick(() => {
            select.classList.remove("fix");
        });
    }
});
</script>

<style scoped lang="less">
#searchForm {
    // .inner {
    //     display: flex;
    //     flex-wrap: wrap;
    //     align-items: center;
    //     gap: 8px;
    // }

    .search {
        position: relative;
        flex-grow: 50;

        .icon {
            &:hover {
                @media (pointer: fine) {
                    color: var(--main-color) !important;
                }
            }

            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            user-select: none;

            &::before {
                display: none;
            }
        }
    }

    .groupWrap {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 6px;
        border-style: hidden;
        cursor: pointer;
        user-select: none;

        .group {
            position: relative;
            height: 44px;
            padding: 10px;
            flex-grow: 1;
            text-align: center;
            background-color: #fff;
            color: rgba(0, 0, 0, 0.4);
            fill: rgba(0, 0, 0, 0.4);

            svg {
                width: 23px;
                height: 23px;
                vertical-align: unset !important;
            }

            &::after {
                position: absolute;
                content: "";
                top: 0;
                left: -1px;
                bottom: 0;
                right: 0;
                border: 1px solid rgba(0, 0, 0, 0.5);
            }

            &:first-child {
                border-radius: 6px 0 0 8px;

                &::after {
                    border-radius: 6px 0 0 8px;
                }
            }

            &:nth-child(2) {
                &::after {
                    border-left: 0;
                }
            }

            &:last-child {
                border-radius: 0 8px 8px 0;

                &::after {
                    border-left: 0;
                    border-radius: 0 8px 8px 0;
                }
            }

            &.active {
                background-color: rgba(41, 63, 230, 0.05);
                color: var(--main-color);
                fill: var(--main-color);

                &::after {
                    border: 1px solid var(--main-color);
                }
            }
        }
    }

    .btn {
        flex-grow: 1;
        width: 5.625rem;
    }

    .advanced {
        font-size: 0.8rem;
        user-select: none;

        .infoBox {
            input {
                outline: 0;
                background-color: rgba(0, 0, 0, 0.05);
            }
        }
    }
}

.content {
    padding: 0;
    text-align: center;

    .disabled {
        cursor: default;
        pointer-events: none;

        .key {
            opacity: 0.5;
        }
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.625rem;
        margin-bottom: 1.5rem;

        &.line {
            border-bottom: 1px solid rgba(225, 225, 225, 0.1);
            padding-bottom: 1.5rem;
            margin-bottom: 1rem;
        }

        .key {
            width: 150px;
            width: 100%;
            font-size: 0.9rem;
            text-align: left;
        }

        .value {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.625rem;
            flex-grow: 1;

            input,
            select {
                flex-grow: 1;
            }

            .fix {
                flex-grow: unset;
                width: 180px;
            }
        }
    }
}
</style>
