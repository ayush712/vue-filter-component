<template>
    <ValidationProvider tag="div" :vid="vid" :name="name" :rules="rules" v-slot="{ errors }">
        <b-field :type="{ 'is-danger': errors[0] }" :message="errors" :label="label">
            <b-select :placeholder="placeholder" v-model="currentValue" expanded>
                <slot>
                    <option v-for="item in items" :value="item" :key="item[keyProp]">
                        {{ item[valueProp] }}
                    </option>
                </slot>
            </b-select>
        </b-field>
    </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
    components: {
        ValidationProvider,
    },
    props: {
        items: {
            type: Array,
            default: function () {
                return [];
            },
        },
        keyProp: {
            type: String,
            default: 'id',
        },
        valueProp: {
            type: String,
            default: 'name',
        },
        vid: {
            type: String,
        },
        rules: {
            type: [Object, String],
            default: '',
        },
        // must be included in props
        value: {
            type: null,
        },
        placeholder: {
            type: String,
        },
        label: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    data: () => ({
        currentValue: null,
    }),
    watch: {
        // Handles internal model changes.
        currentValue(newVal) {
            this.$emit('input', newVal);
        },
        // Handles external model changes.
        value(newVal) {
            this.currentValue = newVal;
        },
    },
    created() {
        if (this.value) {
            this.currentValue = this.value;
        }
    },
};
</script>
<style scoped lang="scss">
::v-deep {
    .select {
        width: 100%;
        select {
            width: 100%;
        }
    }
}
</style>
