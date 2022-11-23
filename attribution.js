var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _KatonAttribution_entries, _KatonAttribution_element;
import { KatonEmitter } from "./emitter";
export function AttributesObjectValues(value) {
    let parsed = value;
    if (typeof value == 'object' && value) {
        parsed = JSON.stringify(value);
    }
    return parsed;
}
export function AttributesObject(attributes, ns, separator) {
    const nms = (ns ? `${ns}${separator || '-'}` : '');
    let output = {};
    Object.entries(attributes).map(({ 0: name, 1: value }) => {
        if (typeof value == 'object' && value) {
            if (Array.isArray(value)) {
                output[`${nms}${name}`] = `${AttributesObjectValues(value)}`;
            }
            else {
                output = {
                    ...output,
                    ...AttributesObject(value, `${nms}${name}`)
                };
            }
        }
        else if (typeof value != 'undefined') {
            output[`${nms}${name}`] = `${AttributesObjectValues(value)}`;
        }
    });
    return output;
}
export default class KatonAttribution {
    constructor(element, attributeName = '') {
        _KatonAttribution_entries.set(this, []);
        _KatonAttribution_element.set(this, null);
        this.attributeName = '';
        this.emitter = new KatonEmitter();
        __classPrivateFieldSet(this, _KatonAttribution_element, element, "f");
        this.attributeName = attributeName;
        this.sync(this.attributeName);
    }
    get entries() { return __classPrivateFieldGet(this, _KatonAttribution_entries, "f"); }
    get value() { return __classPrivateFieldGet(this, _KatonAttribution_entries, "f").filter(value => value.trim().length).join(' ').trim(); }
    sync(attributeName) {
        this.attributeName = attributeName || this.attributeName;
        (__classPrivateFieldGet(this, _KatonAttribution_element, "f")?.getAttribute(`${this.attributeName}`) || '').split(' ')
            .filter(value => value.trim().length)
            .map(value => this.add(`${value.trim()}`));
        this.emitter.dispatch('sync', { entries: __classPrivateFieldGet(this, _KatonAttribution_entries, "f") });
        return this;
    }
    add(value) {
        if (!this.contains(value)) {
            __classPrivateFieldGet(this, _KatonAttribution_entries, "f").push(value);
            this.emitter.dispatch('add', { added: value });
        }
        return this;
    }
    remove(value) {
        __classPrivateFieldSet(this, _KatonAttribution_entries, __classPrivateFieldGet(this, _KatonAttribution_entries, "f").filter(entry => entry != value), "f");
        this.emitter.dispatch('remove', { removed: value });
        return this;
    }
    replace(older, value) {
        this.remove(older).add(value);
        this.emitter.dispatch('replace', { older, newer: value });
        return this;
    }
    contains(value) {
        return __classPrivateFieldGet(this, _KatonAttribution_entries, "f").includes(value, 0);
    }
    link() {
        __classPrivateFieldGet(this, _KatonAttribution_element, "f")?.setAttribute(this.attributeName, `${this.value}`);
        this.emitter.dispatch('link', this);
        return this;
    }
    unlink(attributes) {
        if (attributes) {
            if (Array.isArray(attributes)) {
                attributes.map(attribute => this.remove(attribute));
            }
            __classPrivateFieldGet(this, _KatonAttribution_element, "f")?.setAttribute(this.attributeName, `${this.value}`);
            this.emitter.dispatch('unlink', { value: attributes || this.value });
        }
        else {
            __classPrivateFieldGet(this, _KatonAttribution_element, "f")?.removeAttribute(this.attributeName);
            this.emitter.dispatch('unlinks', this);
        }
        return this;
    }
}
_KatonAttribution_entries = new WeakMap(), _KatonAttribution_element = new WeakMap();
