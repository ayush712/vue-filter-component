<template>
    <div class="columns">
        <NumberInput
            class="is-6 column"
            v-bind="$attrs"
            data-vv-validate-on="blur"
            :name="name1"
            :placeholder="placeholder1"
            :label="label1"
            :rules="updatedRules"
            step="1"
            v-model="currentValue.from"
        ></NumberInput>
        <NumberInput
            class="is-6 column"
            v-bind="$attrs"
            data-vv-validate-on="blur"
            :name="name2"
            step="1"
            :placeholder="placeholder2"
            :label="label2"
            :rules="updatedRules"
            v-model="currentValue.to"
        ></NumberInput>
    </div>
</template>

<script lang="ts">
import { NumberInput } from '../NumberInput';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
    name: 'NumberRangeInput',
    components: {
        NumberInput,
    },
})
export default class NumberRangeInput extends Vue {
    @Prop({
        default: function () {
            return { from: undefined, to: undefined };
        },
    })
    value!: { from: number; to: number };
    @Prop({ default: '' }) name1!: string;
    @Prop({ default: '' }) name2!: string;
    @Prop({ default: '' }) placeholder1!: string;
    @Prop({ default: '' }) placeholder2!: string;
    @Prop({ default: '' }) label1!: string;
    @Prop({ default: '' }) label2!: string;
    @Prop() rules!: any;
    updatedRules = { ...this.rules, required: true };
    currentValue = this.value;
    @Watch('currentValue.from')
    onFromChange(val: any) {
        this.$emit('input', { from: val, to: this.currentValue.to });
    }
    @Watch('currentValue.to')
    onToChange(val: any) {
        this.$emit('input', { from: this.currentValue.from, to: val });
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
