import * as rules from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';
const messages = require('vee-validate/dist/locale/en.json');

for (const [rule, validation] of Object.entries(rules)) {
    const message = (messages as any)[rule];
    extend(rule, {
        ...(validation as any),
        message,
    });
}
