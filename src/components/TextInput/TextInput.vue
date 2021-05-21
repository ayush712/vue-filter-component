<template>
    <ValidationProvider tag="div" :rules="rules" :name="name" :vid="vid" v-slot="{ errors }">
        <b-field :label="label" :type="{ 'is-danger': errors[0] }" :message="errors">
            <b-input
                v-model="currentValue"
                :icon="icon"
                :placeholder="placeholder"
                data-vv-validate-on="blur"
                :type="type"
            ></b-input>
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
export default class TextInput extends Vue {
    @Prop({ default: '' }) value!: string;
    @Prop() rules!: any;
    @Prop({ default: '' }) name!: string;
    @Prop() vid!: string;
    @Prop({ default: 'text' }) type!: string;
    @Prop({ default: '' }) placeholder!: string;
    @Prop({ default: '' }) label!: string;
    @Prop({ default: '' }) icon!: string;

    currentValue = this.value;
    @Watch('currentValue')
    onValueChange(val: any) {
        // allows us to use v-model on our input.
        this.$emit('input', val);
    }
}
</script>
<style scoped lang="scss"></style>
