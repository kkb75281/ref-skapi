<template lang="pug">
section.page-header
    .page-title {{ currentService.service.name }}
    .flex-wrap
        router-link(:to='`/subscription/${currentService.id}`')
            //- button.inline.sm.blue Change Plan
            button.inline.icon-text.sm.blue
                .icon
                    svg
                        use(xlink:href="@/assets/img/material-icon.svg#icon-change")
                | Change Plan
        router-link(v-if="currentService.plan == 'Trial' || currentService.plan == 'Unlimited' || currentService.service.plan == 'Canceled'" :to='"/delete-service/" + currentService.id' :class="{'nonClickable': currentService.service.active <= 0 || currentService.service.suspended || updatingValue.enableDisable }")
            //- button.inline.sm.gray.caution Delete Service
            button.inline.icon-text.sm.gray.caution(type="button" )
                .icon
                    svg
                        use(xlink:href="@/assets/img/material-icon.svg#icon-delete")
                | Delete Service

hr

section
    .info-value-set
        .info-edit-wrap
            .info
                .title Service Information
                .value {{ currentService.service.name }}
            button.only-icon.gray.edit-btn(type="button" @click="editName")
                //- Tooltip(tip-background-color="rgb(45 46 48)" text-color="white")
                    template(v-slot:tool)
                        svg.svgIcon
                            use(xlink:href="@/assets/img/material-icon.svg#icon-edit")
                    template(v-slot:tip) Edit
                .icon
                    svg
                        use(xlink:href="@/assets/img/material-icon.svg#icon-edit")
        .info-edit-wrap
            .info
                .title CORS
                .value {{ currentService.service.cors || '*' }}
            button.only-icon.gray.edit-btn(type="button" @click="editCors")
                .icon
                    svg
                        use(xlink:href="@/assets/img/material-icon.svg#icon-edit")

        .info-edit-wrap
            .info
                .title Secret Key
                .value {{ currentService.service.api_key ? currentService.service.api_key.slice(0, 2) + '*'.repeat(currentService.service.api_key.length - 2) + '...' : '-' }}
            button.only-icon.gray.edit-btn(type="button" :disabled="!user?.email_verified || currentService.service.active <= 0" @click="editApiKey")
                .icon
                    svg
                        use(xlink:href="@/assets/img/material-icon.svg#icon-edit")

    br

    .info-value-set
        .card-wrap(style="flex: 2;")
            .card
                .plan-name 
                    span {{ currentService.service.plan + ' Plan' }}
                .flex-wrap.space-between
                    div
                        .data Renewal Date 
                        .date {{ currentService.subscription?.current_period_end ? dateFormat(currentService.subscription?.current_period_end * 1000) : '-' }}
                    div
                        .data Date Created 
                        .date {{ dateFormat(currentService.dateCreated) }}

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
            //-     .card
            //-         .title Users
            //-         .data {{ currentServiceSpec.dataSize?.users || 0 }} / {{ currentServiceSpec.servicePlan.users }}
            //-         .bar-wrap
            //-             .bar(:style='{width: currentServiceSpec.dataPercent.users * 100 + "%"}')
            //-     .card
            //-         .title Database
            //-         .data {{ currentServiceSpec.dataSize?.database || 0 }} / {{ currentServiceSpec.servicePlan.storage.database }}
            //-         .bar-wrap
            //-             .bar(:style='{width: currentServiceSpec.dataPercent.database * 100 + "%"}')
            //-     .card
            //-         .title File Storage
            //-         .data {{ currentServiceSpec.dataSize?.cloud || 0 }} / {{ currentServiceSpec.servicePlan.storage.cloud }}
            //-         .bar-wrap
            //-             .bar(:style='{width: currentServiceSpec.dataPercent.cloud * 100 + "%"}')

        .toggle-wrap
            .title Service Settings
            .flex-wrap.space-between.toggle-div
                .data.flex-wrap(style="position:relative; margin:0; font-size: 16px;") 
                    span.label Disable/Enable
                    Tooltip(tip-background-color="var(--main-color)" text-color="white")
                        template(v-slot:tool)
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-help-circle")
                        template(v-slot:tip)
                            | When the service is disabled, users cannot access the service.
                Toggle(
                    style='display:inline-flex;align-items:center;'
                    :disabled="!user?.email_verified || currentService.service.suspended || updatingValue.enableDisable"
                    :active="currentService.service.active >= 1"
                    @click="enableDisable"
                )
            
            .flex-wrap.space-between.toggle-div
                .data.flex-wrap(style="position:relative; margin:0; font-size: 16px;")
                    span.label Allow Signup
                    Tooltip(tip-background-color="var(--main-color)" text-color="white")
                        template(v-slot:tool)
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-help-circle")
                        template(v-slot:tip)
                            | When signup is disallowed, only the administrator can create accounts.
                Toggle(
                    style='display:inline-flex;align-items:center;'
                    :active='!currentService.service.prevent_signup'
                    :disabled='updatingValue.prevent_signup'
                    @click="changeCreateUserMode(!currentService.service.prevent_signup)"
                )

            .flex-wrap.space-between.toggle-div
                .data.flex-wrap(style="position:relative; margin:0; font-size: 16px;")
                    span.label Prevent Inquiry
                    Tooltip(tip-background-color="var(--main-color)" text-color="white")
                        template(v-slot:tool)
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-help-circle")
                        template(v-slot:tip)
                            | When inquiry is prevented, users cannot send inquiries via sendInquiry() to the service.
                Toggle(
                    style='display:inline-flex;align-items:center;'
                    :active='currentService.service.prevent_inquiry'
                    :disabled='updatingValue.prevent_inquiry'
                    @click="changePreventInquiry(!currentService.service.prevent_inquiry)"
                )

            .flex-wrap.space-between.toggle-div
                .data.flex-wrap(style="position:relative; margin:0; font-size: 16px;")
                    span.label Freeze Database
                    Tooltip(tip-background-color="var(--main-color)" text-color="white")
                        template(v-slot:tool)
                            svg.svgIcon
                                use(xlink:href="@/assets/img/material-icon.svg#icon-help-circle")
                        template(v-slot:tip)
                            | When the database is frozen, users cannot upload any data to the database.
                Toggle(
                    style='display:inline-flex;align-items:center;'
                    :active='currentService.service.freeze_database'
                    :disabled='updatingValue.freeze_database'
                    @click="changeFreezeDatabase(!currentService.service.freeze_database)"
                )

Modal(:open="modifyMode.name" @close="modifyMode.name = false")
    .modal-close(@click="modifyMode.name = false;")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

    .modal-title Change Service Name

    .modal-desc
        | Enter a new name for the service.
        br
        | (Maximum 40 characters.)

    form(@submit.prevent="changeName")
        input.block(type="text" ref="focus_name" placeholder="Maximum 40 characters" maxlength="40" :value='inputName' @input="(e) => inputName = e.target.value" :disabled="updatingValue.name" required)

        .modal-btns
            .loader-wrap(v-if='updatingValue.name')
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else)
                button.block(type="submit") Save

Modal(:open="modifyMode.cors" @close="modifyMode.cors = false")
    .modal-close(@click="modifyMode.cors = false;")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")

    .modal-title Change CORS

    .modal-desc
        | Enter the CORS settings for the service.
        br
        | Leave empty for all origins, or enter a specific origin.
        br
        | (https://your.domain.com, http://second.domain.net, ...)

    form(@submit.prevent="changeCors")
        input#modifyCors.block(ref="focus_cors" :disabled="updatingValue.cors || null" type="text" placeholder='https://your.domain.com, http://second.domain.net, ...' :value='inputCors' @input="(e) => {e.target.setCustomValidity(''); inputCors = e.target.value;}")

        .modal-btns
            .loader-wrap(v-if='updatingValue.cors')
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else)
                button.block(type="submit") Save

Modal(:open="modifyMode.api_key" @close="modifyMode.api_key = false")
    .modal-close(@click="modifyMode.api_key = false;")
        svg.svgIcon
            use(xlink:href="@/assets/img/material-icon.svg#icon-x")
    
    .modal-title Change API Key

    .modal-desc
        | Enter a new API key for the service.
        br
        | (Maximum 256 characters, At least 4 characters.)

    form(@submit.prevent="changeApiKey")
        input.block(ref="focus_key" :disabled="updatingValue.api_key || null" type="text" minlength="4" maxlength="256" placeholder='Maximum 256 characters, At least 4 characters.' :value='inputKey' @input="(e) => inputKey = e.target.value")

        .modal-btns
            .loader-wrap(v-if='updatingValue.api_key')
                .loader(style="--loader-color:white; --loader-size:12px")
            template(v-else)
                button.block(type="submit") Save
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, computed, onMounted } from "vue";
import { currentService } from "@/views/service/main";
import { dateFormat } from "@/code/admin";
import { devLog } from "@/code/logger";
import { user } from "@/code/user";
import { currentServiceSpec } from "@/views/service/service-spec";

import Modal from "@/components/modal.vue";
import Toggle from "@/components/toggle.vue";
import Tooltip from "@/components/tooltip.vue";

let inputName = "";
let inputCors = "";
let inputKey = "";
let modifyMode = reactive({
    name: false,
    cors: false,
    api_key: false,
    prevent_signup: false,
});
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
};

// edit/change name
let editName = () => {
    inputName = currentService.service.name;
    modifyMode.name = true;
    nextTick(() => {
        focus_name.value.focus();
    });
};
let changeName = () => {
    if (currentService.service.name !== inputName) {
        let regex = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
        if (inputName.match(regex)) {
            alert("Special characters are not allowed");

            return;
        }

        let previous = currentService.service.name;

        updatingValue.name = true;

        currentService
            .updateService({
                name: inputName,
            })
            .then(() => {
                updatingValue.name = false;
                currentService.service.name = inputName;
                modifyMode.name = false;
            })
            .catch((err) => {
                updatingValue.name = false;
                currentService.service.name = previous;
                throw err;
            });
    } else {
        // If the name is not changed, just close the modal
        updatingValue.name = false;
        currentService.service.name = inputName;
        modifyMode.name = false;
    }
};

// edit/change cors
let editCors = () => {
    inputCors =
        currentService.service.cors === "*" ? "" : currentService.service.cors;
    modifyMode.cors = true;
    nextTick(() => {
        focus_cors.value.focus();
    });
};
let changeCors = () => {
    updatingValue.cors = true;
    currentService
        .updateService({
            cors: inputCors,
        })
        .then(() => {
            updatingValue.cors = false;
            modifyMode.cors = false;
        })
        .catch((err) => {
            updatingValue.cors = false;
            nextTick(() => {
                document.getElementById("modifyCors").focus();
                (
                    document.getElementById("modifyCors") as HTMLInputElement
                ).setCustomValidity(err.message);
                (
                    document.getElementById("modifyCors") as HTMLInputElement
                ).reportValidity();
            });
        });
};

// edit/change api_key
let editApiKey = () => {
    inputKey = currentService.service.api_key;
    modifyMode.api_key = true;
    nextTick(() => {
        focus_key.value.focus();
    });
};
let changeApiKey = () => {
    let previous = currentService.service.api_key;

    updatingValue.api_key = true;

    currentService
        .updateService({
            api_key: inputKey,
        })
        .then(() => {
            updatingValue.api_key = false;
            currentService.service.api_key = inputKey;
            modifyMode.api_key = false;
        })
        .catch((err) => {
            currentService.service.api_key = previous;
            throw err;
        });
};

// change prevent_signup
let changeCreateUserMode = async (onlyAdmin: boolean) => {
    updatingValue.prevent_signup = true;
    currentService
        .setServiceOption({
            prevent_signup: onlyAdmin,
        })
        .catch((err) => {
            alert(err.message);
        })
        .finally(() => {
            updatingValue.prevent_signup = false;
        });
};
let enableDisable = async () => {
    updatingValue.enableDisable = true;
    try {
        if (currentService.service.active >= 1)
            await currentService.disableService();
        else await currentService.enableService();
    } catch (error) {
        window.alert(error.message);
        throw error;
    } finally {
        updatingValue.enableDisable = false;
    }
};

// change prevent_inquiry
let changePreventInquiry = async (onlyAdmin: boolean) => {
    updatingValue.prevent_inquiry = true;
    currentService
        .setServiceOption({
            prevent_inquiry: onlyAdmin,
        })
        .catch((err) => {
            alert(err.message);
        })
        .finally(() => {
            updatingValue.prevent_inquiry = false;
        });
};

// change freeze_database
let changeFreezeDatabase = async (onlyAdmin: boolean) => {
    updatingValue.freeze_database = true;
    currentService
        .setServiceOption({
            freeze_database: onlyAdmin,
        })
        .catch((err) => {
            alert(err.message);
        })
        .finally(() => {
            updatingValue.freeze_database = false;
        });
};
</script>

<style lang="less" scoped>
a {
    text-decoration: none;
}

hr {
    background: rgba(255, 255, 255, 0.1);
}

.title {
    margin-bottom: 10px;
    opacity: 0.6;
}

.plan-name {
    margin-bottom: 20px;

    span {
        font-size: 18px;
        border-radius: 5px;
        font-weight: bold;
    }
}

.toggle-wrap {
    padding: 20px;
    border-radius: 13px;
    background-color: #121214;

    .title {
        margin-bottom: 1rem !important;
    }

    .toggle-div {
        margin-bottom: 14px;

        .svgIcon {
            width: 1.25rem;
            height: 1.25rem;
            position: relative;
            top: -2px;
        }

        ._tooltip {
            ::v-deep(.tip) {
                max-width: 9rem;
            }
        }
    }

    .flex-wrap {
        gap: 0.5rem;
    }
}

.card-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .card {
        position: relative;
        background-color: #121214;
        padding: 20px;
        border-radius: 13px;
        flex: 1;
        min-width: 170px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        .data {
            font-size: 14px;
            font-weight: 300;
            max-width: 12.5rem;

            @media (max-width: 600px) {
                // font-size: 12px;
            }
        }

        .date {
            font-size: 14px;
            margin-top: 5px;
            opacity: 0.6;

            @media (max-width: 600px) {
                // font-size: 12px;
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
</style>