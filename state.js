var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _KatonStatePayloads_entries, _KatonState_instances, _KatonState_store, _KatonState_data, _KatonState_payloads, _KatonState_upgrade, _KatonState_proxy, _KatonState_nodeContains, _KatonState_listeners;
import { PhysicalWidgetBuilder } from "./builder";
import { KatonEmitter } from "./emitter";
import { PhysicalWidget, StateWidget } from "./foundation";
import { UiMutation } from "./ui";
export const StateExpression = () => new RegExp(`\\{\\{(.[a-zA-Z0-9 _-|(),]+)\\}\\}`, 'gm');
export function findState(data) {
    return [...(data || '').matchAll(StateExpression())];
}
export class KatonStatePayloads {
    constructor() {
        _KatonStatePayloads_entries.set(this, []);
    }
    add(payload) {
        if (!this.exists(payload.node).length) {
            __classPrivateFieldGet(this, _KatonStatePayloads_entries, "f").push(payload);
        }
        return this;
    }
    exists(node) { return __classPrivateFieldGet(this, _KatonStatePayloads_entries, "f").filter(payload => payload.node === node); }
    find(slots) {
        return __classPrivateFieldGet(this, _KatonStatePayloads_entries, "f").filter(payload => slots.filter(slot => payload.slots[slot]).length);
    }
    set(node, entry) {
        this.exists(node).map(payload => {
            if (!(entry.slot in payload.slots)) {
                payload.slots[entry.slot] = entry.value;
                payload.values.push(entry.value);
            }
            else {
                payload.values.push(entry.value);
            }
        });
        return this;
    }
    unset(node) {
        __classPrivateFieldSet(this, _KatonStatePayloads_entries, this.exists(node).filter(payload => payload.node !== node), "f");
        return this;
    }
    parse(node, callback) {
        if (node instanceof Element) {
            this.parseElement(node, callback);
        }
        else if (node instanceof Node) {
            this.parseNode(node, callback);
        }
        return this;
    }
    parseNode(node, callback) {
        const matches = findState(node.textContent);
        if (matches && matches.length && !node.$parsed) {
            const slots = {};
            matches.map(match => {
                const slot = (match[1] || '').trim();
                slots[slot] = match;
            });
            const payload = {
                slots,
                values: [],
                node: node,
                clone: node.cloneNode(true),
            };
            this.add(payload);
            payload.node.$parsed = true;
            callback(payload);
        }
        return this;
    }
    parseElement(node, callback) {
        if (node && node.childNodes) {
            node.childNodes.forEach(child => {
                this.parseNode(child, callback);
            });
        }
        return this;
    }
}
_KatonStatePayloads_entries = new WeakMap();
export class StateWatcher {
    constructor(state) {
        this.state = {};
        this.props = [];
        this.pointer = null;
        this.callback = null;
        this.state = state;
    }
    watch(props) {
        this.props = Array.isArray(props) ? props : [props];
        return this;
    }
    widget(callback) {
        this.callback = callback;
        if (this.state?.data) {
            this.pointer = this.callback(this.state.data);
            this.state.emitter.listen('change', ({ emit }) => {
                if (this.props.includes(emit.slot)) {
                    let widget = callback(this.state.data);
                    if (this.pointer?.builder) {
                        const building = PhysicalWidgetBuilder(this.pointer.builder, widget, undefined);
                        widget.builder = this.pointer.builder;
                        if (building instanceof PhysicalWidget && building.element) {
                            this.pointer.element?.parentNode?.replaceChild(building.element, this.pointer.element);
                            this.pointer = widget;
                        }
                    }
                }
            });
            return this.pointer;
        }
        return null;
    }
}
export default class KatonState {
    constructor(state) {
        _KatonState_instances.add(this);
        this.emitter = new KatonEmitter();
        _KatonState_store.set(this, {});
        _KatonState_data.set(this, {});
        _KatonState_payloads.set(this, new KatonStatePayloads());
        __classPrivateFieldSet(this, _KatonState_data, state, "f");
        __classPrivateFieldGet(this, _KatonState_instances, "m", _KatonState_listeners).call(this);
    }
    get data() {
        this.emitter.dispatch('get', this);
        return __classPrivateFieldGet(this, _KatonState_data, "f");
    }
    use() {
        const widget = new StateWidget(__classPrivateFieldGet(this, _KatonState_data, "f")).prepare();
        widget.emitter.listen('ready', ({ emit }) => {
            emit.builder?.emitter.listen('ready', () => {
                Object.entries(this.data).map(({ 0: slot, 1: value }) => this.add(slot, value));
                UiMutation(widget.parent, (mutations) => {
                    mutations.map(mutation => {
                        Array.from(mutation.target.childNodes).map(child => __classPrivateFieldGet(this, _KatonState_payloads, "f").parseNode(child, () => { }));
                        this.hydrates();
                    });
                });
                widget.widget = widget.parent;
                this.hydrates();
            });
        });
        return widget;
    }
    watch(affected) {
        const split = affected.split(' ');
        const watcher = (new StateWatcher(this)).watch(split);
        return watcher;
    }
    get(slot) {
        const value = __classPrivateFieldGet(this, _KatonState_store, "f")[slot];
        this.emitter.dispatch('use', { slot, value });
        return value;
    }
    set(slot, value) {
        __classPrivateFieldGet(this, _KatonState_data, "f")[slot] = value;
        return this;
    }
    add(slot, value) {
        __classPrivateFieldGet(this, _KatonState_store, "f")[slot] = value;
        this.emitter.dispatch('add', { slot, value });
        return __classPrivateFieldGet(this, _KatonState_instances, "m", _KatonState_upgrade).call(this, slot);
    }
    remove(slot) {
        const storeclone = __classPrivateFieldGet(this, _KatonState_store, "f");
        Object.entries(__classPrivateFieldGet(this, _KatonState_store, "f"))
            .filter(({ 0: name }) => name != slot)
            .map(({ 0: name, 1: value }) => storeclone[name] = value);
        __classPrivateFieldSet(this, _KatonState_store, storeclone, "f");
        this.emitter.dispatch('remove', { slot });
        return this;
    }
    hydrate(slots) {
        __classPrivateFieldGet(this, _KatonState_payloads, "f").find(Array.isArray(slots) ? slots : [slots]).map(payload => {
            if (__classPrivateFieldGet(this, _KatonState_instances, "m", _KatonState_nodeContains).call(this, payload.node)) {
                let content = payload.clone.textContent || '';
                Object.entries(payload.slots).map(({ 1: match }) => {
                    const slot = match[1].trim();
                    content = (`${content.replace(match[0], __classPrivateFieldGet(this, _KatonState_store, "f")[slot])}`);
                });
                payload.node.textContent = content;
            }
        });
        this.emitter.dispatch('hydrate', { slots });
        return this;
    }
    hydrates() {
        Object.entries(__classPrivateFieldGet(this, _KatonState_data, "f")).map(({ 0: slot }) => this.hydrate(slot));
        this.emitter.dispatch('hydrates', { state: __classPrivateFieldGet(this, _KatonState_store, "f") });
        return this;
    }
}
_KatonState_store = new WeakMap(), _KatonState_data = new WeakMap(), _KatonState_payloads = new WeakMap(), _KatonState_instances = new WeakSet(), _KatonState_upgrade = function _KatonState_upgrade(slot) {
    __classPrivateFieldGet(this, _KatonState_instances, "m", _KatonState_proxy).call(this, slot, __classPrivateFieldGet(this, _KatonState_data, "f")[slot]);
    this.emitter.dispatch('upgrade', { slot, value: __classPrivateFieldGet(this, _KatonState_store, "f")[slot] });
    return this;
}, _KatonState_proxy = function _KatonState_proxy(slot, value) {
    const driver = this;
    __classPrivateFieldGet(this, _KatonState_data, "f")[slot] = value;
    if (typeof __classPrivateFieldGet(this, _KatonState_data, "f")[slot] == 'object') {
        __classPrivateFieldGet(this, _KatonState_store, "f")[slot] = (new Proxy(Object.assign({}, __classPrivateFieldGet(this, _KatonState_data, "f")), {}));
        this.emitter.dispatch('proxy:set', { slot });
    }
    else {
        Object.defineProperty(__classPrivateFieldGet(this, _KatonState_data, "f"), slot, {
            set(v) {
                __classPrivateFieldGet(driver, _KatonState_store, "f")[slot] = v;
                driver.emitter.dispatch('proxy:set', { slot, value: v });
                driver.emitter.dispatch('change', { slot, value: v });
            },
            get() {
                const v = __classPrivateFieldGet(driver, _KatonState_store, "f")[slot];
                driver.emitter.dispatch('proxy:get', { slot, value: v });
                return v;
            }
        });
    }
    this.emitter.dispatch('proxy', { slot });
    return this;
}, _KatonState_nodeContains = function _KatonState_nodeContains(node) {
    return document.querySelector('body')?.contains(node);
}, _KatonState_listeners = function _KatonState_listeners() {
    this.emitter.listen('change', ({ emit }) => {
        this.hydrate(emit.slot);
    });
    return this;
};
