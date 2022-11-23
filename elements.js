import { KatonEmitter } from "./emitter";
export default class KatonElement extends HTMLElement {
    constructor() {
        super();
        this.emitter = new KatonEmitter();
    }
    connectedCallback() {
        this.emitter.dispatch('connected', this);
    }
    adoptedCallback() {
        this.emitter.dispatch('adopted', this);
    }
    disconnectedCallback() {
        this.emitter.dispatch('disconnected', this);
    }
}
export function defineElement(name, constructor, options) {
    const element = customElements.get(name);
    if (!element) {
        customElements.define(name, constructor, options);
        return constructor;
    }
    return element;
}
defineElement('kt-layer', KatonElement);
