<template>
    <ValidationProvider tag="div" :vid="vid" :name="name" :rules="rules">
        <b-field :label="label">
            <b-dropdown aria-role="list" v-model="currentValue">
                <template #trigger>
                    <b-button icon-right="menu-down">
                        {{ selectedText }}
                    </b-button>
                </template>
                <b-dropdown-item :focusable="false" custom paddingless>
                    <section class="py-3 px-4 search-container" @click="$event.stopPropagation()">
                        <b-input
                            v-model="searchText"
                            icon-right="magnify"
                            placeholder="Search"
                            type="text"
                        ></b-input>
                    </section>
                    <section class="dropdown-list" @click="$event.stopPropagation()">
                        <b-checkbox
                            v-model="currentValue"
                            name="multiselectinput"
                            v-for="item in filteredList"
                            :native-value="item"
                            :key="item[keyProp]"
                            aria-role="listitem"
                            class="is-flex is-align-items-center py-2 px-4 mr-0"
                        >
                            <slot>{{ item[valueProp] }}</slot>
                        </b-checkbox>
                    </section>
                </b-dropdown-item>
            </b-dropdown>
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
        placeholder: {
            type: String,
            default: 'Please select values',
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
            type: Array,
            default: function () {
                return [];
            },
        },
        label: {
            type: String,
        },
        name: {
            type: String,
        },
    },
    data: () => ({
        currentValue: [],
        searchText: '',
        filteredList: [],
    }),
    watch: {
        // Handles internal model changes.
        currentValue(newVal) {
            this.$emit('input', newVal);
        },
        // Handles external model changes.
        value: {
            handler: function (newVal) {
                this.currentValue = newVal;
            },
            immediate: true,
        },
        items: {
            handler: function (newVal) {
                this.filteredList = JSON.parse(JSON.stringify(newVal));
            },
            immediate: true,
        },
        searchText(newVal) {
            this.filteredList =
                newVal && newVal.trim()
                    ? this.items.filter(
                          (m) => m[this.valueProp].toLowerCase().indexOf(newVal.toLowerCase()) >= 0,
                      )
                    : JSON.parse(JSON.stringify(this.items));
        },
    },
    computed: {
        selectedText: function () {
            return this.currentValue.length
                ? `${this.currentValue[0][this.valueProp]} ${
                      this.currentValue.length > 1
                          ? 'and ' + (this.currentValue.length - 1) + ' more'
                          : ''
                  }`
                : this.placeholder;
        },
    },
};
</script>
<style scoped lang="scss">
::v-deep {
    .dropdown {
        width: 100%;
        .dropdown-trigger {
            width: 100%;
            .button {
                width: 100%;
            }
        }
        .dropdown-content {
            display: flex;
            flex-direction: column;
        }
        .b-checkbox.checkbox {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            margin-right: 0;
            .control-label {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .dropdown-menu {
            width: 100%;
        }
        .dropdown-list {
            max-height: 200px;
            overflow: auto;
        }
        .search-container {
            border-bottom: 1px solid #dedede;
        }
    }
}
</style>
