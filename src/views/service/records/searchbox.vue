<template lang="pug">
form#searchForm(@submit.prevent="callSearch")
    .inner
        input(hidden name='service' :value='currentService.id')
        input(hidden name='owner' :value='currentService.owner')
        
        .content
            .row
                .key Table

            .row
                .key.txt-sm Access Group
                .key(style="width: 10rem")
                    select(v-model='accessGroup' style='width: 100%;')
                        option(selected value='public') Public
                        option(value='auth') Access Group
                        option(value='private') Private
                        
                .value(v-if='accessGroup === "auth"')
                    input.line(required placeholder="1 ~ 99" value='1' type='number' name='table[access_group]')

                template(v-else)
                    input.line(hidden v-if='accessGroup === "public"' placeholder="1 ~ 99" value='public' name='table[access_group]')
                    input.line(hidden v-else-if='accessGroup === "Private"' value='Private' name='table[access_group]')

            .row
                .key.txt-sm Table Name
                .value
                    input.line(placeholder="Table.Name" name='table[name]' v-model='tableName')
            

            .row.line(:class="{'nonClickable': !tableName}")
                .key.txt-sm Subscription
                .value
                    input.line(placeholder="xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" name='table[subscription]')

            .row
                .key Index

            .row(:class="{'nonClickable': !tableName}")
                .key.txt-sm Search By
                .value
                    select(v-model='searchIndex')
                        option(selected value='name') By Index Name
                        option(value='$updated') By Updated Timestamp
                        option(value='$uploaded') By Uploaded Timestamp
                        option(value='$referenced_count') By Referenced Count
                        option(value='$user_id') By User ID

            .row(v-if='searchIndex == "name"' :class="{'nonClickable': !tableName}")
                .key.txt-sm Index Name
                .value
                    input.line(name='index[name]' placeholder='Alphanumeric, periods only.')
            
            input(v-else name='index[name]' hidden :value='searchIndex')

            template(v-if='searchIndex == "name"')
                .row(:class="{'nonClickable': !tableName}")
                    .key.txt-sm Value
                    .value
                        select(v-model='searchIndexType' style="width: 10rem;")
                            option(value='string' selected) String
                            option(value='number') Number
                            option(value='boolean') Boolean

                        input.line(
                            v-if="searchIndexType !== 'boolean'"
                                name='index[value]'
                                :type='searchIndexType' :placeholder='searchIndexType === "string" ? "Alphanumeric, space only." : searchIndexType === "number" ? "Number value" : "Boolean value"'
                                style="flex-grow:30; width:unset; vertical-align:middle;")
                        
                        template(v-else)
                            label(style='width:unset;display: flex;align-items: center;')
                                input(type='radio' name='index[value]' value='true' checked style='margin:0;width:unset;')
                                | &nbsp;True
                            label(style='width:unset;display: flex;align-items: center;')
                                input(type='radio' name='index[value]' value='false' style='margin:0;width:unset;')
                                | &nbsp;False

                .row.line(v-if='searchIndexType !== "boolean"' :class="{'nonClickable': !tableName}")
                    .key.txt-sm Condition
                    .value
                        select(v-model='searchIndexCondition' style="width: 10rem;")
                            option(value='=' selected) =
                            option(value='>=') Greater or =
                            option(value='>') Greater
                            option(value='<=') Less or =
                            option(value='<') Less
                            option(value='range') Range

                        input(v-if='searchIndexCondition !== "range"' hidden :value='searchIndexCondition' name='index[condition]')
                        template(v-else)
                            input.line(
                                name='index[range]'
                                :type='searchIndexType' :placeholder='searchIndexType === "string" ? "Alphanumeric, space only." : searchIndexType === "number" ? "Number value" : "Boolean value"'
                                style="flex-grow:30; width:unset; vertical-align:middle;")

            template(v-else-if='searchIndex == "$user_id"')
                .row(:class="{'nonClickable': !tableName}")
                    .key.txt-sm Value
                    .value
                        input.line(
                            name='index[value]'
                            type='string' placeholder='xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                            required
                            pattern='[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
                            title='Invalid user\'s ID'
                            style="flex-grow:30; width:unset; vertical-align:middle;")

            template(v-else)
                .row(:class="{'nonClickable': !tableName}")
                    .key.txt-sm Value
                    .value
                        input.line(
                                name='index[value]'
                                type='number' :placeholder='searchIndex == "$referenced_count" ? "Number of references" : "1234567890123"'
                                required
                                style="flex-grow:30; width:unset; vertical-align:middle;")

                .row.line(:class="{'nonClickable': !tableName}")
                    .key.txt-sm Condition
                    .value
                        select(v-model='searchIndexCondition' name='index[condition]' style="width: 10rem;")
                            option(value='=' selected) =
                            option(value='>=') Greater or =
                            option(value='>') Greater
                            option(value='<=') Less or =
                            option(value='<') Less
                            option(value='range') Range

                        input(v-if='searchIndexCondition !== "range"' hidden :value='searchIndexCondition' name='index[condition]')
                        template(v-else)
                            input.line(
                                name='index[range]'
                                type='name' :placeholder='searchIndex == "$referenced_count" ? "Number of references" : "1234567890123"'
                                required
                                style="flex-grow:30; width:unset; vertical-align:middle;")

            .row.line(:class="{'nonClickable': !tableName}")
                    .key Reference
                    .value
                        input.line(placeholder="xxxxxxxxxxxxxxxx" name='reference')

            .row(:class="{'nonClickable': !tableName}")
                .key Tag
                .value
                    input.line(name='tag' placeholder="Tag name. Alphanumeric and space only.")

            //- div(style='text-align:right')
                button.btn.final.wideOnMobile(type="submit") Search

</template>

<script setup lang="ts">
import { currentService } from "@/views/service/main";
import { ref, reactive } from "vue";

// let { callSearch } = defineProps({
//     callSearch: Function,
// });
let tableName = ref("");
let searchBy = ref("record_id");
let searchIndex = ref("name");
let searchIndexCondition = ref("=");
let searchIndexType = ref("string");
let accessGroup = ref("public");

const props = defineProps({
    callSearch: Function,
    isInModal: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped lang="less">
#searchForm {
    .inner {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
    }

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
        width: 140px;
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
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    font-size: 0.8rem;

    .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 12px;

        &.indent {
            // padding-left: 20px;

            .key {
                font-weight: normal;
                width: 150px;
            }
        }
    }

    .key {
        font-weight: 500;
        width: 170px;
    }

    .value {
        flex-grow: 1;
        min-width: 270px;
        margin: 6px 0 6px;

        input {
            width: 100%;
        }
    }
}

// new style
.txt-sm {
    font-size: 0.875rem;
}

.content {
    font-size: 1rem;
    width: 100%;
    padding: 0;
    overflow: visible;

    .value {
        margin: 0;
    }

    .row {
        text-align: left;
        margin-bottom: 1.5rem;

        .value {
            display: flex;
            flex-wrap: wrap;
            gap: 0.625rem;
        }

        &.line {
            border-bottom: 1px solid rgba(225, 225, 225, 0.1);
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
        }
    }
}
</style>
