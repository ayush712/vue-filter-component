<template>
    <ValidationProvider tag="div" :vid="vid" :name="name" :rules="rules" v-slot="{ errors }">
        <b-field :message="errors" :label="label" :type="{ 'is-danger': errors[0] }">
            <b-datepicker
                v-model="currentValue"
                v-bind="$attrs"
                :locale="undefined"
                :placeholder="placeholder"
                icon="calendar"
                trap-focus
                :append-to-body="true"
            >
                <!--TODO: Append to body flag needs to be removed-->
            </b-datepicker>
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
        vid: {
            type: String,
        },
        rules: {
            type: [Object, String],
            default: '',
        },
        value: {
            type: [Date, String],
        },
        placeholder: {
            type: String,
        },
        name: {
            type: String,
        },
        label: {
            type: String,
        },
    },
    data: () => ({
        currentValue: null,
    }),
    watch: {
        currentValue(newVal) {
            this.$emit('input', newVal);
        },
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
