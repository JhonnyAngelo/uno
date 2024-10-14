import I18N from './i18n.js';

let i18n = new I18N("en");
let _ = (key, ...args) => i18n.translate(key, args);

console.log(_('hello', 'Alice'));
console.log(_('time', '', new Date().toISOString()));
console.log(_('niceday'));

i18n.setLanguage("it");
console.log("----");

console.log(_('hello', 'Alice'));
console.log(_('time', '', new Date().toISOString()));
console.log(_('niceday'));