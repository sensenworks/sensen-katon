export function EmitterResponse(type, emit) {
    return { type, emit };
}
export class KatonEmitter {
    constructor() {
        this.entries = {};
        this.listener = [];
        this.dispatcher = [];
    }
    reset(type) {
        if (type) {
            if (type in this.entries) {
                this.entries[type] = [];
            }
        }
        else {
            this.entries = {};
        }
        return this;
    }
    listen(type, callback) {
        this.entries = this.entries || {};
        if (this.listener.indexOf(type) == -1) {
            this.listener[this.listener.length] = type;
        }
        if (typeof type == 'string' && typeof callback == 'function') {
            this.entries[type] = Array.isArray(this.entries[type]) ? this.entries[type] : [];
            this.entries[type].push(callback);
        }
        return this;
    }
    dispatch(type, args, resolve, reject) {
        if (this.dispatcher.indexOf(type) == -1) {
            this.dispatcher[this.dispatcher.length] = type;
        }
        if (typeof type == 'string') {
            if (type in this.entries) {
                if (this.entries[type] instanceof Array) {
                    this.entries[type].map((entry) => {
                        if (entry instanceof Function) {
                            KatonEmitter.resolveDispatcher({
                                instance: this,
                                type,
                                callback: entry,
                                args,
                                resolve,
                                reject,
                            });
                        }
                    });
                }
            }
        }
        return this;
    }
    static resolveDispatcher({ instance, type, args, callback, resolve, reject, }) {
        const $args = {
            emit: args,
            type,
        };
        const applied = callback.apply(instance, [$args]);
        if (applied instanceof Promise) {
            return applied.then(response => {
                if (typeof resolve == 'function') {
                    resolve(EmitterResponse(type, response));
                }
            }).catch(err => {
                if (typeof reject == 'function') {
                    reject(err);
                }
            });
        }
        else if (typeof applied == 'boolean') {
            return applied;
        }
        else {
            return this;
        }
    }
}
