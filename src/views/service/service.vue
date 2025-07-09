<template lang="pug">
section
    //- .page-title Service Settings

    //- hr

    .flex-wrap.space-between
        div
            .page-title {{ currentService.service.name }}
            //- .desc {{ currentService.service.description || 'No description provided.' }}
        .flex-wrap(style="gap:10px")
            button.inline-btn Rename
            button.inline-btn CORS
            button.inline-btn Secret Key
            button.inline-btn.blue Change Plan

    hr

    .flex-wrap.space-between(style="gap: 20px;")
        .card-wrap(style="flex: 2;")
            //- .card(style="background-color: #77DFA2; color: #121214;")
            .card
                //- .title Plan
                .plan-name 
                    span {{ currentService.service.plan + ' Plan' }}
                .flex-wrap.space-between
                    div
                        .data Renewal Date 
                        .date {{ currentService.subscription?.current_period_end ? dateFormat(currentService.subscription?.current_period_end * 1000) : '-' }}
                    div
                        .data Date Created 
                        .date {{ dateFormat(currentService.dateCreated) }}

                //- br

                //- button(style="max-width: unset") Change Subscription

                //- hr(style="background: rgba(0, 0, 0, 0.1);")
                hr

                .flex-wrap.space-between
                    .tit Users
                    .data {{ currentServiceSpec.dataSize?.users || 0 }} / {{ currentServiceSpec.servicePlan.users }}
                .bar-wrap
                    .bar(:style='{width: currentServiceSpec.dataPercent.users * 100 + "%"}')

                br

                .flex-wrap.space-between
                    .tit Database
                    .data {{ currentServiceSpec.dataSize?.database || 0 }} / {{ currentServiceSpec.servicePlan.storage.database }}
                .bar-wrap
                    .bar(:style='{width: currentServiceSpec.dataPercent.database * 100 + "%"}')

                br

                .flex-wrap.space-between
                    .tit File Storage
                    .data {{ currentServiceSpec.dataSize?.cloud || 0 }} / {{ currentServiceSpec.servicePlan.storage.cloud }}
                .bar-wrap
                    .bar(:style='{width: currentServiceSpec.dataPercent.cloud * 100 + "%"}')

                //- .card-wrap
                    .card
                        .title Users
                        .data {{ currentServiceSpec.dataSize?.users || 0 }} / {{ currentServiceSpec.servicePlan.users }}
                        .bar-wrap
                            .bar(:style='{width: currentServiceSpec.dataPercent.users * 100 + "%"}')
                    .card
                        .title Database
                        .data {{ currentServiceSpec.dataSize?.database || 0 }} / {{ currentServiceSpec.servicePlan.storage.database }}
                        .bar-wrap
                            .bar(:style='{width: currentServiceSpec.dataPercent.database * 100 + "%"}')
                    .card
                        .title File Storage
                        .data {{ currentServiceSpec.dataSize?.cloud || 0 }} / {{ currentServiceSpec.servicePlan.storage.cloud }}
                        .bar-wrap
                            .bar(:style='{width: currentServiceSpec.dataPercent.cloud * 100 + "%"}')
        .card-wrap(style="flex: 1;")
            .card
                //- .title Toggle Switches

                .flex-wrap.space-between
                    .data(style="position:relative; margin:0; font-size: 16px;") Disable/Enable
                        //- .tooltip-icon
                            Tooltip(tip-background-color="var(--main-color)" text-color="white")
                                template(v-slot:tip)
                                    | When the service is disabled, users cannot access the service.
                    Toggle(
                        style='display:inline-flex;align-items:center;'
                        :disabled="!user?.email_verified || currentService.service.suspended || updatingValue.enableDisable"
                        :active="currentService.service.active >= 1"
                        @click="enableDisable"
                    )
                
                br

                .flex-wrap.space-between
                    .data(style="position:relative; margin:0; font-size: 16px;") Allow Signup
                        //- .tooltip-icon
                            Tooltip(tip-background-color="var(--main-color)" text-color="white")
                                template(v-slot:tip)
                                    | When signup is disallowed, only the administrator can create accounts.
                    Toggle(
                        style='display:inline-flex;align-items:center;'
                        :active='!currentService.service.prevent_signup'
                        :disabled='updatingValue.prevent_signup'
                        @click="changeCreateUserMode(!currentService.service.prevent_signup)"
                    )

                br

                .flex-wrap.space-between
                    .data(style="position:relative; margin:0; font-size: 16px;") Prevent Inquiry
                        //- .tooltip-icon
                            Tooltip(tip-background-color="var(--main-color)" text-color="white")
                                template(v-slot:tip)
                                    | You can prevent users from sending inquiries via sendInquiry() to the service.
                    Toggle(
                        style='display:inline-flex;align-items:center;'
                        :active='currentService.service.prevent_inquiry'
                        :disabled='updatingValue.prevent_inquiry'
                        @click="changePreventInquiry(!currentService.service.prevent_inquiry)"
                    )

                br

                .flex-wrap.space-between
                    .data(style="position:relative; margin:0; font-size: 16px;") Freeze Database
                        //- .tooltip-icon
                            Tooltip(tip-background-color="var(--main-color)" text-color="white")
                                template(v-slot:tip)
                                    | You can prevent users from uploading any data to the database by freezing the database.
                    Toggle(
                        style='display:inline-flex;align-items:center;'
                        :active='currentService.service.freeze_database'
                        :disabled='updatingValue.freeze_database'
                        @click="changeFreezeDatabase(!currentService.service.freeze_database)"
                    )

</template>

<script setup lang="ts">
import { nextTick, reactive, ref, computed, onMounted } from 'vue';
import { currentService } from '@/views/service/main';
import { dateFormat } from '@/code/admin';
import { devLog } from '@/code/logger';
import { user } from '@/code/user';
import { currentServiceSpec } from '@/views/service/service-spec';

import Toggle from '@/components/toggle.vue';
import Tooltip from '@/components/tooltip.vue';

let inputName = '';
let inputCors = '';
let inputKey = '';
let modifyMode = reactive({
    name: false,
    cors: false,
    api_key: false,
    prevent_signup: false
})
let updatingValue = reactive({
    name: false,
    cors: false,
    api_key: false,
    prevent_signup: false,
    enableDisable: false,
    prevent_inquiry: false,
    freeze_database: false,
});
let focus_name = ref();
let focus_cors = ref();
let focus_key = ref();

let resetTime = (timestamp: number) => {
    // Convert the timestamp to a Date object
    let startDate = new Date(timestamp); // assuming the timestamp is in seconds
    let today = new Date();
    let resetDay = 14;

    // Calculate the difference in days
    const diffInDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    // Calculate the number of days since the last 7-day cycle
    const daysSinceLastCycle = diffInDays % resetDay;

    // Calculate the number of days until the next cycle
    let daysUntilNextCycle = (resetDay - daysSinceLastCycle) % resetDay;

    // If the cycle has just started today, then daysUntilNextCycle will be 0.
    // In that case, we want to return 7 (the next cycle will start in 7 days).
    if (daysUntilNextCycle === 0) {
        daysUntilNextCycle = resetDay;
    }

    // Add the number of days until the next cycle to today's date
    today.setDate(today.getDate() + daysUntilNextCycle);

    // Return the date as a 13-digit timestamp
    return dateFormat(today.getTime());
}

// edit/change name
let editName = () => {
    inputName = currentService.service.name;
    modifyMode.name = true;
    nextTick(() => {
        focus_name.value.focus();
    });
}
let changeName = () => {
    if (currentService.service.name !== inputName) {
        let regex = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
        if (inputName.match(regex)) {
            alert('Special characters are not allowed');

            return
        }

        let previous = currentService.service.name;

        updatingValue.name = true;

        currentService.updateService({
            name: inputName
        }).then(() => {
            updatingValue.name = false;
            currentService.service.name = inputName;
            modifyMode.name = false;
        }).catch(err => {
            updatingValue.name = false;
            currentService.service.name = previous;
            throw err;
        });
    } else {
        return false;
    }
}

// edit/change cors
let editCors = () => {
    inputCors = currentService.service.cors === '*' ? '' : currentService.service.cors;
    modifyMode.cors = true;
    nextTick(() => {
        focus_cors.value.focus();
    });
}
let changeCors = () => {
    updatingValue.cors = true;
    currentService.updateService({
        cors: inputCors
    }).then(() => {
        updatingValue.cors = false;
        modifyMode.cors = false;
    }).catch(err => {
        updatingValue.cors = false;
        nextTick(() => {
            document.getElementById('modifyCors').focus();
            document.getElementById('modifyCors').setCustomValidity(err.message);
            document.getElementById('modifyCors').reportValidity();
        });
    });
}

// edit/change api_key
let editApiKey = () => {
    inputKey = currentService.service.api_key;
    modifyMode.api_key = true;
    nextTick(() => {
        focus_key.value.focus();
    });
}
let changeApiKey = () => {
    let previous = currentService.service.api_key;

    updatingValue.api_key = true;

    currentService.updateService({
        api_key: inputKey
    }).then(() => {
        updatingValue.api_key = false;
        currentService.service.api_key = inputKey;
        modifyMode.api_key = false;
    }).catch(err => {
        currentService.service.api_key = previous;
        throw err;
    });
}

// change prevent_signup
let changeCreateUserMode = async (onlyAdmin: boolean) => {
    updatingValue.prevent_signup = true;
    currentService.setServiceOption({
        prevent_signup: onlyAdmin,
    }).catch(err => {
        alert(err.message);
    }).finally(() => {
        updatingValue.prevent_signup = false;
    });
}
let enableDisable = async () => {
    updatingValue.enableDisable = true;
    try {
        if (currentService.service.active >= 1)
            await currentService.disableService()
        else
            await currentService.enableService()
    }
    catch (error) {
        window.alert(error.message)
        throw error;
    }
    finally {
        updatingValue.enableDisable = false;
    }
}

// change prevent_inquiry
let changePreventInquiry = async (onlyAdmin: boolean) => {
    updatingValue.prevent_inquiry = true;
    currentService.setServiceOption({
        prevent_inquiry: onlyAdmin,
    }).catch(err => {
        alert(err.message);
    }).finally(() => {
        updatingValue.prevent_inquiry = false;
    });
}

// change freeze_database
let changeFreezeDatabase = async (onlyAdmin: boolean) => {
    updatingValue.freeze_database = true;
    currentService.setServiceOption({
        freeze_database: onlyAdmin,
    }).catch(err => {
        alert(err.message);
    }).finally(() => {
        updatingValue.freeze_database = false;
    });
}
</script>

<style lang="less" scoped>
.page-title {
    font-size: 38px;
}

.middle-title {
    font-size: 26px;
    margin-bottom: 16px;
}

hr {
    background: rgba(255, 255, 255, 0.1);
}

button {
    display: inline-flex;
    max-width: 240px;
    padding: 0 0.875rem;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 13px;
    background: #0a4df1;
    border: 0;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    white-space: nowrap;

    &:hover {
        background-color: #1656f2;
    }
}

.inline-btn {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 14px;
    width: auto;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    &.blue {
        background-color: #0a4df1;

        &:hover {
            background-color: #1656f2;
        }
    }
}

.tooltip-icon {
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-57%);
    z-index: 1;
}

.icon-btn {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 8px;
    margin: 0 4px;
    border-radius: 50%;
    cursor: pointer;
}

.plan-name {
    margin-bottom: 20px;

    span {
        // background-color: #77DFA2;
        // color: #121214;
        font-size: 18px;
        border-radius: 5px;
        font-weight: bold;
    }
}

.flex-wrap {
    display: flex;
    flex-wrap: wrap;

    &.space-between {
        justify-content: space-between;
    }

    &.center {
        justify-content: center;
    }
}

.card-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;

    .card {
        background-color: #121214;
        padding: 20px;
        border-radius: 13px;
        flex: 1;
        min-width: 170px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        .title {
            font-size: 20px;
            margin-bottom: 20px;
        }

        .data {
            font-size: 14px;
            font-weight: 300;
            opacity: 0.6;

            @media (max-width: 600px) {
                font-size: 12px;
            }
        }

        .date {
            font-size: 14px;
            margin-top: 5px;
            opacity: 0.6;

            @media (max-width: 600px) {
                font-size: 12px;
            }
        }

        .bar-wrap {
            margin-top: 10px;
            height: 8px;
            background-color: #2c2c2e;
            border-radius: 4px;
            overflow: hidden;

            .bar {
                height: 100%;
                background-color: var(--main-color);
                transition: width 0.3s ease-in-out;
                display: flex;
                align-items: center;
                justify-content: center;

            }

            span {
                color: white;
                font-size: 12px;
            }
        }
    }
}

// .question {
//     display: inline-block;
//     font-size: 14px;
//     color: var(--black-4);
//     vertical-align: middle;

//     &:hover {
//         text-decoration: none;
//     }
// }

// .svgIcon.nohover {
//     background-color: unset;
// }

// .svgIcon:hover {
//     border-radius: 50%;
//     background-color: #293FE61A;
// }</style>