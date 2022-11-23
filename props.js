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
var _KatonProps_storage;
import { KatonEmitter } from "./emitter";
export default class KatonProps {
    constructor(props) {
        this.emitter = new KatonEmitter;
        _KatonProps_storage.set(this, {});
        __classPrivateFieldSet(this, _KatonProps_storage, props, "f");
    }
    get data() { return __classPrivateFieldGet(this, _KatonProps_storage, "f"); }
    get(name) {
        const store = (__classPrivateFieldGet(this, _KatonProps_storage, "f")[name] || undefined);
        this.emitter.dispatch('get', { slot: store });
        return store;
    }
    add(name, value) {
        __classPrivateFieldGet(this, _KatonProps_storage, "f")[name] = value;
        this.emitter.dispatch('add', { slot: __classPrivateFieldGet(this, _KatonProps_storage, "f")[name] });
        return this;
    }
    all() { return __classPrivateFieldGet(this, _KatonProps_storage, "f"); }
    mutate() {
        const remix = {};
        Object.entries(__classPrivateFieldGet(this, _KatonProps_storage, "f"))
            .map(({ 0: name, 1: value }) => remix[name] = value);
        return remix;
    }
    remove(name) {
        const store = {};
        Object.entries(__classPrivateFieldGet(this, _KatonProps_storage, "f")).filter(({ 0: store }) => store != name).map(({ 0: slot, 1: value }) => {
            store[slot] = value;
        });
        __classPrivateFieldSet(this, _KatonProps_storage, store, "f");
        this.emitter.dispatch('remove', { store });
        return this;
    }
}
_KatonProps_storage = new WeakMap();
