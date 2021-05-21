<template>
    <ValidationProvider tag="div" :rules="rules" :name="name" :vid="vid" v-slot="{ errors }">
        <b-field :type="{ 'is-danger': errors[0] }" :message="errors" :label="label">
            <b-datepicker
                :label="label"
                :name="name"
                :locale="undefined"
                :rules="updatedRules"
                :placeholder="placeholder"
                v-bind="$attrs"
                :value="currentValue"
                @input="inputEventHandler"
                :append-to-body="true"
                range
                icon="calendar"
                trap-focus
            ></b-datepicker>
        </b-field>
    </ValidationProvider>
</template>

<script lang="ts">
import { ValidationProvider } from 'vee-validate';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
    name: 'DateRangeInput',
    components: {
        ValidationProvider,
    },
})
export default class DateRangeInput extends Vue {
    @Prop({
        default: function () {
            return { from: undefined, to: undefined };
        },
    })
    value!: { from: number; to: number };
    @Prop({ default: '' }) name!: string;
    @Prop({ default: '' }) placeholder!: string;
    @Prop({ default: '' }) label!: string;
    @Prop() rules!: any;
    updatedRules = { ...this.rules, required: true };
    currentValue = this.value.from ? [this.value.from, this.value.to] : [];
    inputEventHandler(val: any) {
        this.currentValue = val;
        this.$emit('input', { from: val[0], to: val[1] });
    }
}
</script>
<style scoped lang="scss"></style>
