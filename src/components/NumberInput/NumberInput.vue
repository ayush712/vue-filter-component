<template>
    <ValidationProvider tag="div" :rules="rules" :name="name" :vid="vid" v-slot="{ errors }">
        <b-field :type="{ 'is-danger': errors[0] }" :message="errors" :label="label">
            <b-numberinput
                v-model="currentValue"
                :icon="icon"
                :placeholder="placeholder"
                :controls="false"
                data-vv-validate-on="blur"
                :step="step"
            ></b-numberinput>
        </b-field>
    </ValidationProvider>
</template>

<script lang="ts">
import { ValidationProvider } from 'vee-validate';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
    name: 'TextInput',
    components: {
        ValidationProvider,
    },
})
export default class NumberInput extends Vue {
    @Prop({ default: null }) value!: number;
    @Prop() rules!: any;
    @Prop({ default: '' }) name!: string;
    @Prop() vid!: string;
    @Prop({ default: '' }) placeholder!: string;
    @Prop({ default: '' }) label!: string;
    @Prop({ default: '' }) icon!: string;
    @Prop({ default: 1 }) step!: number;

    currentValue = this.value;
    @Watch('currentValue')
    onValueChange(val: any) {
        // allows us to use v-model on our input.
        this.$emit('input', val);
    }
}
</script>
<style scoped lang="scss">
::v-deep {
    .has-numberinput .b-numberinput input[type='number'] {
        text-align: left;
    }
}
</style>
