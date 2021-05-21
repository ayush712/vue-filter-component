<template>
    <ValidationObserver tag="form" class="modal-card" v-slot="{ invalid }">
        <header class="modal-card-head">
            <p class="modal-card-title">Add Filter</p>
        </header>
        <section class="modal-card-body">
            <section class="columns mb-0">
                <b-field class="column is-6">
                    <b-select
                        placeholder="Select Flter"
                        expanded
                        :value="activeFilter.field"
                        :disabled="existingFilter && existingFilter.field"
                        @input="filterFieldChangeHandler"
                    >
                        <option
                            v-for="fl of fieldList"
                            :value="fl.field.key"
                            :key="fl.field.key"
                            :disabled="fl.disabled"
                        >
                            {{ fl.field.value }}
                        </option>
                    </b-select>
                </b-field>

                <b-field class="column is-6">
                    <b-select
                        expanded
                        placeholder="Select Operator"
                        v-model="activeFilter.operator"
                    >
                        <option
                            v-for="o of operatorList"
                            :value="o.operator.key"
                            :key="o.operator.key"
                        >
                            {{ o.operator.value }}
                        </option>
                    </b-select>
                </b-field>
            </section>
            <section v-if="componentType">
                <component
                    :is="componentType.componentName"
                    v-bind="componentType.props"
                    v-model="activeFilter.value"
                ></component>
            </section>
        </section>
        <footer class="modal-card-foot">
            <b-button label="Cancel" @click="cancelButtonClickHandler" />
            <b-button
                label="Apply"
                type="is-primary"
                :disabled="invalid || activeFilter.value == undefined"
                @click="applyButtonClickHandler"
            />
        </footer>
    </ValidationObserver>
</template>
<script lang="ts">
import { ValidationObserver } from 'vee-validate';
import { AppliedFilter, FilterConfiguration, AllowedOperator } from './model';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
    TextInput,
    NumberInput,
    AutoComplete,
    SelectInput,
    MultiSelectInput,
    DateRangeInput,
    DateInput,
    NumberRangeInput,
} from '../components';
import '../services/Validations';
@Component({
    components: {
        TextInput,
        NumberInput,
        ValidationObserver,
        AutoComplete,
        NumberRangeInput,
        DateInput,
        SelectInput,
        MultiSelectInput,
        DateRangeInput,
    },
})
export default class FilterModal extends Vue {
    @Prop()
    existingFilter!: AppliedFilter;
    @Prop({
        default: function () {
            return [];
        },
    })
    filterConfigurations!: FilterConfiguration[];
    @Prop() appliedFilters!: AppliedFilter[];

    activeFilter: AppliedFilter = Object.assign(
        {},
        {
            field: undefined,
            operator: undefined,
            value: undefined,
            isActive: true,
            isRemovable: true,
            canDeactivate: true,
        },
        this.existingFilter,
    );

    get fieldList() {
        return this.filterConfigurations.map((m) => {
            let disabled = this.appliedFilters.find((n) => m.field.key === n.field);
            return {
                ...m,
                disabled,
            };
        });
    }

    get operatorList() {
        let operatorsList: AllowedOperator[] = [];
        if (this.activeFilter.field) {
            let selectedField = this.filterConfigurations.find(
                (m) => m.field.key == this.activeFilter.field,
            );
            operatorsList = selectedField ? selectedField.allowedOperators : [];
        }
        return operatorsList;
    }

    get componentType() {
        let componentType = undefined;
        if (this.activeFilter.operator) {
            let selectedOperator = this.operatorList.find(
                (m) => m.operator.key == this.activeFilter.operator,
            );
            componentType = selectedOperator ? selectedOperator.componentType : undefined;
        }
        return componentType;
    }

    filterFieldChangeHandler(val: string) {
        this.activeFilter.field = val;
        this.activeFilter.operator = undefined;
    }

    @Watch('activeFilter.operator')
    operatorWatcher() {
        this.activeFilter.value = undefined;
    }

    cancelButtonClickHandler() {
        this.$emit('filterPopupClose');
    }

    applyButtonClickHandler() {
        this.$emit('filterPopupFilterApply', this.activeFilter);
    }
}
</script>
<style lang="scss" scoped>
.modal-card-body {
    overflow: visible;
}

.modal-card {
    width: 416px;
    height: 400px;
    max-width: 100vw;
    max-height: 100vh;
    overflow: visible;
}
</style>
