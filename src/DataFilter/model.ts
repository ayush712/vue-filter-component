export interface KeyValue {
    key: string;
    value: string;
}
export interface AppliedFilter {
    field: string;
    operator?: string;
    value: any;
    isActive: boolean;
    isRemovable: boolean;
    canDeactivate: boolean;
}

export type ComponentName =
    | 'NumberInput'
    | 'TextInput'
    | 'AutoComplete'
    | 'NumberRangeInput'
    | 'DateInput'
    | 'SelectInput'
    | 'MultiSelectInput'
    | 'DateRangeInput';

export interface AllowedOperator {
    operator: KeyValue;
    componentType: ComponentType;
}

export interface ComponentType {
    componentName: ComponentName;
    props?: { [k: string]: any };
}
export interface FilterConfiguration {
    field: KeyValue;
    allowedOperators: AllowedOperator[];
}
