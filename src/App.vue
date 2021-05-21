<template>
    <div id="app">
        <DataFilter
            :filterConfigurations="filterConfigurations"
            :appliedFilters="appliedFilters"
        ></DataFilter>
    </div>
</template>

<script lang="ts">
import { extend } from 'vee-validate';
import { Component, Vue } from 'vue-property-decorator';
import { AppliedFilter, DataFilter, FilterConfiguration } from './DataFilter';

/*You can write your own rules*/
extend('minvalue', {
    validate(value: string | number, { minimum }: Record<string, any>) {
        return Number(value) >= minimum;
    },
    message: (field, { msg }) => msg,
    params: ['minimum', 'msg'],
});

@Component({
    components: {
        DataFilter,
    },
})
export default class App extends Vue {
    statusList = [
        { id: 'failed', text: 'Failed' },
        { id: 'passed', text: 'Passed' },
    ];
    statusProps = {
        name: 'status',
        placeholder: 'Select status',
        items: this.statusList.map((m) => {
            return {
                id: m.id,
                name: m.text,
            };
        }),
        keyProp: 'id',
        valueProp: 'text',
        rules: {
            required: true,
        },
    };
    filterConfigurations: FilterConfiguration[] = [
        {
            field: {
                key: 'status',
                value: 'Status',
            },
            allowedOperators: [
                {
                    operator: {
                        key: 'eq',
                        value: 'Equals',
                    },
                    componentType: {
                        componentName: 'SelectInput',
                        props: this.statusProps,
                    },
                },
                {
                    operator: {
                        key: 'in',
                        value: 'Is One Of',
                    },
                    componentType: {
                        componentName: 'MultiSelectInput',
                        props: this.statusProps,
                    },
                },
            ],
        },
        {
            field: { key: 'quantity', value: 'No of students' },
            allowedOperators: [
                {
                    operator: {
                        key: 'eq',
                        value: 'Equals',
                    },
                    componentType: {
                        componentName: 'NumberInput',
                        props: {
                            name: 'quantity',
                            placeholder: 'No of students',
                            rules: { minvalue: { minimum: 0 } },
                        },
                    },
                },
            ],
        },
    ];

    appliedFilters: AppliedFilter[] = [
        {
            field: 'status',
            value: { id: 'failed', text: 'Failed' },
            isActive: true,
            isRemovable: false,
            canDeactivate: true,
            operator: 'eq',
        },
    ];
}
</script>

<style lang="scss"></style>
