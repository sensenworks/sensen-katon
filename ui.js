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
var _Ui_element;
export default class Ui {
    constructor(selector, parent) {
        this.selector = null;
        _Ui_element.set(this, null);
        this.selector = selector || 'body';
        this.parent = parent || document.documentElement;
        __classPrivateFieldSet(this, _Ui_element, this.parent.querySelector(this.selector), "f");
    }
    get root() { return __classPrivateFieldGet(this, _Ui_element, "f"); }
    get roots() { return Array.from(this.parent.querySelectorAll(`${this.selector}`)); }
    get exists() { return this.root instanceof HTMLElement; }
    static context(selector, parent) {
        return new this(selector, parent);
    }
    assign(callback) {
        this.roots.forEach(e => callback(e));
        return this;
    }
}
_Ui_element = new WeakMap();
export function UiMutation(widget, callback, initier) {
    if (widget && widget.element) {
        const make = (new MutationObserver(callback));
        make.observe(widget.element, initier || {
            childList: true,
            subtree: true,
            attributeOldValue: true,
        });
        return make;
    }
    return undefined;
}
