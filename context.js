import { KatonEmitter } from "./emitter";
export default class KatonContext {
    constructor() {
        this.emitter = new KatonEmitter;
        this.storage = {};
        this.ready = false;
    }
    slot(name) {
        const store = (this.storage[name] || undefined);
        this.emitter.dispatch('find', { slot: store, name });
        return store;
    }
    addSlot(name, value) {
        this.storage[name] = value;
        this.emitter.dispatch('add', { slot: this.storage[name] });
        return this;
    }
    removeSlot(name) {
        const store = {};
        Object.entries(this.storage).filter(({ 0: store }) => store != name).map(({ 0: slot, 1: value }) => {
            store[slot] = value;
        });
        this.storage = store;
        this.emitter.dispatch('remove', { store });
        return this;
    }
    render() {
        this.ready = true;
        this.emitter.dispatch('render', this);
        return this;
    }
}
