<template>
    <section
        class="is-flex data-filter-container"
        v-if="filterConfigurations && filterConfigurations.length"
    >
        <b-button
            outlined
            :size="filterSize"
            class="mr-1 is-relative"
            type="is-primary"
            icon-right="filter-variant"
            :class="{ bubble: !showFilters }"
            @click="filterIconClickHandler"
        ></b-button>
        <section class="appliedFilters is-flex is-flex-wrap-wrap is-size-7">
            <section class="is-flex is-flex-wrap-wrap" v-if="showFilters">
                <span
                    class="mx-1 mb-2 pl-2 is-flex is-align-items-center appliedFilter"
                    :class="[
                        {
                            'appliedFilter--active': filter.isActive,
                            'appliedFilter--inactive': !filter.isActive,
                        },
                        `appliedFilter--${filterSize}`,
                    ]"
                    v-for="(filter, index) in appliedFilterForTemplate"
                    :key="index"
                >
                    <b-field
                        tag="span"
                        class="is-flex mb-0 filterPadding"
                        v-if="filter.canDeactivate"
                    >
                        <b-checkbox
                            class="mr-0"
                            size="is-small"
                            :value="filter.isActive"
                            @input="checkboxEventHandler($event, index)"
                        ></b-checkbox>
                    </b-field>
                    <span
                        class="filterLabel filterPadding cursorPointer"
                        @click="openFilterModal(index)"
                        >{{ filter.field }}</span
                    >
                    <span
                        class="filterOperator px-1 filterPadding cursorPointer"
                        @click="openFilterModal(index)"
                        >{{ filter.operator }}</span
                    >
                    <span
                        class="filterValue filterPadding pr-2 cursorPointer"
                        @click="openFilterModal(index)"
                        >{{ filter.value }}</span
                    >
                    <span
                        @click="removeFilter(index)"
                        v-if="filter.isRemovable"
                        class="
                            removeFilter
                            px-2
                            is-flex is-align-items-center
                            cursorPointer
                            is-size-6
                        "
                    >
                        <b-icon icon="close" size="is-small"> </b-icon>
                    </span>
                </span>
            </section>
            <b-button
                class="mx-1"
                type="is-primary"
                outlined
                :size="filterSize"
                icon-left="plus"
                :disabled="allFiltersAdded"
                :title="allFiltersAdded ? 'All the filters are already applied' : 'Add New Filter'"
                @click="openFilterModal()"
            ></b-button>
        </section>
    </section>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AppliedFilter, ComponentType, FilterConfiguration } from './model';
import FilterModal from './FilterModal.vue';
import buefy from 'buefy';
import { BModalComponent } from 'buefy/types/components';
import dayjs from 'dayjs';
Vue.use(buefy);
@Component({
    components: {
        FilterModal,
    },
})
export default class DataFilter extends Vue {
    @Prop({
        required: true,
        default: function () {
            return [];
        },
    })
    filterConfigurations!: FilterConfiguration[];
    @Prop({
        default: function () {
            return [];
        },
    })
    appliedFilters!: AppliedFilter[];

    @Prop({
        default: function () {
            return 'is-small';
        },
    })
    filterSize!: 'is-small' | 'is-medium' | 'is-large';

    activeFilterIndex?: number;
    filterModalId?: BModalComponent;
    showFilters = true;

    get allFiltersAdded() {
        return this.appliedFilters.length === this.filterConfigurations.length;
    }

    get appliedFilterForTemplate() {
        let result = [];
        for (const appliedFilter of this.appliedFilters) {
            let filterConfig = this.getFilterConfig(appliedFilter);
            let appliedOperator = this.getOperator(filterConfig, appliedFilter.operator);
            let value = this.getValue(appliedFilter.value, appliedOperator?.componentType);
            let filterForTemplate: AppliedFilter = {
                field: filterConfig.field.value,
                operator: appliedOperator?.operator.value,
                value,
                isActive: appliedFilter.isActive,
                isRemovable: appliedFilter.isRemovable,
                canDeactivate: appliedFilter.canDeactivate,
            };
            result.push(filterForTemplate);
        }
        return result;
    }

    removeFilter(index: number) {
        this.appliedFilters.splice(index, 1);
        this.$emit('filterChange', this.appliedFilters);
    }

    openFilterModal(index?: number) {
        this.activeFilterIndex = index;
        this.filterModalId = this.$buefy.modal.open({
            parent: this,
            component: FilterModal,
            props: {
                existingFilter: index != undefined ? this.appliedFilters[index] : undefined,
                filterConfigurations: this.filterConfigurations,
                appliedFilters: this.appliedFilters,
            },
            hasModalCard: true,
            trapFocus: false,
            canCancel: false,
            events: {
                filterPopupClose: this.filterPopupCloseHandler,
                filterPopupFilterApply: this.filterPopupFilterApplyHandler,
            },
        });
    }

    filterPopupCloseHandler() {
        this.filterModalId?.close();
    }

    filterPopupFilterApplyHandler(newFilter: AppliedFilter) {
        this.filterModalId?.close();
        if (this.activeFilterIndex != undefined) {
            this.appliedFilters.splice(this.activeFilterIndex, 1, newFilter);
        } else {
            this.appliedFilters.push(newFilter);
        }
        this.showFilters = true;
        this.$emit('filterChange', this.appliedFilters);
    }

    checkboxEventHandler(isChecked: boolean, index: number) {
        this.appliedFilters.splice(index, 1, {
            ...this.appliedFilters[index],
            isActive: isChecked,
        });
        this.$emit('filterChange', this.appliedFilters);
    }

    filterIconClickHandler() {
        if (this.appliedFilters.length) {
            this.showFilters = !this.showFilters;
        }
    }

    private getValue(value: any, componentType?: ComponentType) {
        let result = '';
        let valueProp = componentType?.props?.valueProp || 'name';
        switch (componentType?.componentName) {
            case 'AutoComplete':
                if (componentType.props?.multipleAllowed) {
                    result = `${value[0][valueProp]} ${
                        value.length > 1 ? 'and ' + (value.length - 1) + 'more' : ''
                    }`;
                } else {
                    result = value[valueProp];
                }
                break;
            case 'MultiSelectInput':
                result = `${value[0][valueProp]} ${
                    value.length > 1 ? 'and ' + (value.length - 1) + ' more' : ''
                }`;
                break;
            case 'SelectInput':
                result = value[valueProp];
                break;
            case 'NumberRangeInput':
                result = `${value.from} - ${value.to}`;
                break;
            case 'DateInput':
                result = dayjs(value).format(componentType.props?.format || 'DD/MM/YYYY');
                break;
            case 'DateRangeInput':
                result = `${dayjs(value.from).format(
                    componentType.props?.format || 'DD/MM/YYYY',
                )} - ${dayjs(value.to).format(componentType.props?.format || 'DD/MM/YYYY')}`;
                break;
            default:
                result = value;
        }
        return result;
    }

    private getFilterConfig(filter: AppliedFilter) {
        return this.filterConfigurations.find((m) => m.field.key == filter.field)!;
    }

    private getOperator(filterConfig: FilterConfiguration, operator: string = '') {
        return filterConfig.allowedOperators.find((m) => m.operator.key == operator);
    }
}
</script>
<style lang="scss" scoped>
.data-filter-container {
    --filter-text-color3: #a19da4;
    --filter-text-color2: #7c7a7e;
    --filter-text-color1: #372541;
    --filter-border-color1: #dcd7de;
    --filter-border-color2: #e3e3e3;
    --filter-border-color3: #f3f3f3;
    --filter-bgcolor-light: #f7f7f7;
    --filter-bgcolor-dark: #e3e7e9;
    --filter-remove-hover-bgcolor: #f5f7f8;
    --filter-bubble-bgcolor: #f7b500;
    --filter-height: 2rem;
    --filter-max-width: 50ch;
}
*,
*::after,
*::before {
    box-sizing: border-box;
}
.appliedFilter {
    border-radius: 1000px;
    max-width: var(--filter-max-width, 50ch);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-width: 1px;
    border-color: var(--filter-text-color3, #a19da4);
    background-color: var(--filter-bgcolor-light, #f7f7f7);
    font-size: 1rem;
    &:hover {
        background-color: var(--filter-bgcolor-dark, #e3e7e9);
    }
    &--active {
        border-style: solid;
    }
    &--inactive {
        border-style: dashed;
    }
    &--is-small {
        font-size: 0.75rem;
    }
    &--is-medium {
        font-size: 1.25rem;
    }
    &--is-large {
        font-size: 1.5rem;
    }
}

.filterPadding {
    padding-top: calc(0.5em - 1px);
    padding-bottom: calc(0.5em - 1px);
}

.filterLabel {
    color: var(--filter-text-color1, #372541);
}

.filterOperator {
    color: var(--filter-text-color3, #a19da4);
}

.filterValue {
    color: var(--filter-text-color1, #372541);
}
.removeFilter {
    height: 100%;
    border-left: 1px solid var(--filter-border-color3, #f3f3f3);
    &:hover {
        color: var(--filter-text-color1);
        background-color: var(--filter-remove-hover-bgcolor, #f5f7f8);
    }
}
.cursorPointer {
    cursor: pointer;
}
.bubble {
    &::after {
        content: '';
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        background: var(--filter-bubble-bgcolor, #f7b500);
        position: absolute;
        top: -0.375rem;
        right: -0.375rem;
    }
}
</style>
