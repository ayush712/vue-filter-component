<template>
    <ValidationProvider
        tag="div"
        class="autocomplete-container"
        :rules="rules"
        :name="name"
        :vid="vid"
        v-slot="{ errors }"
    >
        <b-field :label="label" :type="{ 'is-danger': errors[0] }" :message="errors">
            <b-autocomplete
                size="is-small"
                :data="data"
                :placeholder="placeholder"
                field="name"
                :loading="loading"
                :check-infinite-scroll="hasInfiniteScroll"
                :clear-on-select="true"
                @typing="debouncedSearch(arguments[0])"
                @select="(option) => onRowSelect(option)"
                @infinite-scroll="searchData"
            >
                <template slot-scope="{ option }">
                    <div>{{ option[valueProp] }}</div>
                </template>
            </b-autocomplete>
        </b-field>
        <section class="values is-flex is-flex-wrap-wrap" v-if="currentValue">
            <template v-if="multipleAllowed">
                <span
                    class="mx-1 mb-2 pl-2 is-flex is-align-items-center value"
                    v-for="(val, index) in currentValue"
                    :key="index"
                >
                    <span class="filterValue py-2 is-size-7">{{ val[valueProp] }}</span>
                    <span
                        class="iconContainer removeFilter ml-1 px-1 is-flex is-align-items-center"
                        @click="removeValue(index)"
                    >
                        <b-icon icon="close" size="is-small"> </b-icon>
                    </span>
                </span>
            </template>
            <template v-if="!multipleAllowed">
                <span
                    class="mx-1 mb-2 pl-2 is-flex is-align-items-center value"
                    v-if="currentValue"
                >
                    <span class="filterValue py-2 is-size-7">{{ currentValue[valueProp] }}</span>
                    <span
                        class="iconContainer removeFilter ml-1 px-1 is-flex is-align-items-center"
                        @click="removeValue()"
                    >
                        <b-icon icon="close" size="is-small"> </b-icon>
                    </span>
                </span>
            </template>
        </section>
    </ValidationProvider>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { debounce } from '../../services/Utils';
import { ValidationProvider } from 'vee-validate';
@Component({
    components: {
        ValidationProvider,
    },
})
export default class AutoComplete extends Vue {
    @Prop() fetchData!: Function;
    @Prop({ default: null }) value!: any;
    @Prop() rules!: any;
    @Prop({ default: '' }) name!: string;
    @Prop() vid!: string;
    @Prop() multipleAllowed!: boolean;
    @Prop({ default: 'name' }) valueProp!: string;
    @Prop({ default: '' }) placeholder!: string;
    @Prop({ default: '' }) label!: string;
    @Prop({ default: '' }) icon!: string;
    @Prop({ default: false }) hasInfiniteScroll!: boolean;

    currentValue = this.value;

    @Watch('currentValue')
    onCurrentValueChange(val: any) {
        // allows us to use v-model on our input.
        this.$emit('input', val);
    }
    private debouncedSearch = debounce(this.searchData, 300);
    private loading = false;
    private data: any[] = [];

    private searchData(search: string) {
        this.loading = true;
        this.fetchData(search)
            .then((res: any) => {
                this.data = [...this.data, ...res];
            })
            .catch(() => {})
            .finally(() => {
                this.loading = false;
            });
    }

    private onRowSelect(row: any) {
        if (row) {
            if (this.multipleAllowed) {
                this.currentValue = this.currentValue == null ? [] : this.currentValue;
                this.currentValue.push(row);
            } else {
                this.currentValue = row;
            }
        }
    }

    removeValue(index?: number) {
        if (index != undefined) {
            this.currentValue.splice(index, 1);
            if (!this.currentValue.length) {
                this.currentValue = undefined;
            }
        } else {
            this.currentValue = undefined;
        }
    }
}
</script>
<style lang="scss" scoped>
.autocomplete-container {
    --text-color3: #a19da4;
    --text-color2: #7c7a7e;
    --text-color1: #372541;
    --border-color1: #dcd7de;
    --border-color2: #e3e3e3;
    --border-color3: #f3f3f3;
    --filter-bgcolor-light: #f7f7f7;
    --filter-bgcolor-dark: #e3e7e9;
    --remove-filter-hover-bgcolor: #f5f7f8;
}
*,
*::after,
*::before {
    box-sizing: border-box;
}
.value {
    border-radius: 2.5em;
    height: 30px;
    max-width: 50ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-width: 1px solid var(--text-color3);
    border-radius: 100px;
    background-color: var(--filter-bgcolor-light);
    color: var(--text-color2);
    &:hover {
        background-color: var(--filter-bgcolor-dark);
    }
}

.removeFilter {
    cursor: pointer;
    height: 100%;
    border-left: 1px solid var(--border-color3);
    &:hover {
        color: var(--text-color1);
        background-color: var(--remove-filter-hover-bgcolor);
    }
}
</style>
