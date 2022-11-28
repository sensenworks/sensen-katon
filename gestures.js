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
var _SwipeGesture_instances, _SwipeGesture_inspector, _SwipeGesture_delta, _SwipeGesture_enter, _SwipeGesture_exit;
import { KatonEmitter } from "./emitter";
export function DetectGestures(widget, names, callback) {
    const listen = (names.split(' '));
    listen.map(name => {
        widget.on(name, (context) => {
            callback(context);
        });
    });
    return widget;
}
export function DetectStaticGestures(widget, names, callback, config) {
    config = config || {};
    config.loop = typeof config.loop ? config.loop : true;
    const listen = (names.split(' '));
    listen.map(name => {
        if (widget.element) {
            const evname = `on${name}`;
            widget.element[evname] = (event) => {
                callback({
                    widget: widget,
                    event,
                    builder: widget.builder
                });
                if (config && config.loop === false) {
                    widget.element[evname] = null;
                }
            };
        }
    });
    return widget;
}
export class SwipeGesture {
    constructor(widget, config) {
        _SwipeGesture_instances.add(this);
        this.config = {};
        this.emitter = new KatonEmitter();
        _SwipeGesture_inspector.set(this, {
            start: false,
            move: false,
            stopImmediat: false,
        });
        _SwipeGesture_delta.set(this, {
            x: 0,
            y: 0,
        });
        this.widget = widget;
        this.config = config || {};
        this.config.loop = typeof this.config.loop ? this.config.loop : true;
    }
    start(callback) {
        this.emitter.listen('start', ({ emit }) => {
            callback({
                gesture: emit.gesture,
                context: emit.context,
                measue: this.widget.measure(),
                delta: emit.delta,
            });
        });
        return this;
    }
    move(callback) {
        this.emitter.listen('move', ({ emit }) => {
            callback({
                gesture: emit.gesture,
                context: emit.context,
                measue: this.widget.measure(),
                delta: emit.delta,
            });
        });
        return this;
    }
    end(callback) {
        this.emitter.listen('end', ({ emit }) => {
            callback({
                gesture: emit.gesture,
                context: emit.context,
                measue: this.widget.measure(),
                delta: emit.delta,
            });
        });
        return this;
    }
    observe() {
        __classPrivateFieldSet(this, _SwipeGesture_delta, { x: 0, y: 0 }, "f");
        __classPrivateFieldSet(this, _SwipeGesture_inspector, {
            start: false,
            move: false,
            stopImmediat: false,
        }, "f");
        DetectStaticGestures(this.widget, 'mousedown mouseup mousemove touchstart touchmove touchend mouseleave', (context) => {
            const mouse = context.event;
            const measure = {
                x: mouse.clientX,
                y: mouse.clientY,
            };
            if (context.event.type == 'mousedown' || context.event.type == 'touchstart') {
                __classPrivateFieldGet(this, _SwipeGesture_instances, "m", _SwipeGesture_enter).call(this, context, measure);
            }
            if (__classPrivateFieldGet(this, _SwipeGesture_inspector, "f").start && __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").stopImmediat == false && (context.event.type == 'mouseleave' ||
                context.event.type == 'mousemove' ||
                context.event.type == 'touchmove')) {
                this.widget.style({ userSelect: 'none' });
                if (context.event.type == 'mouseleave') {
                    console.error('Leave this');
                    __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").stopImmediat = true;
                    __classPrivateFieldGet(this, _SwipeGesture_instances, "m", _SwipeGesture_exit).call(this, context, measure);
                    return;
                }
                __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").move = true;
                this.emitter.dispatch('move', {
                    gesture: this,
                    context,
                    measue: this.widget.measure(),
                    delta: { x: (measure?.x || 0) - __classPrivateFieldGet(this, _SwipeGesture_delta, "f").x, y: (measure?.y || 0) - __classPrivateFieldGet(this, _SwipeGesture_delta, "f").y }
                });
            }
            if (__classPrivateFieldGet(this, _SwipeGesture_inspector, "f").start && __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").move && (context.event.type == 'mouseup' ||
                context.event.type == 'touchend')) {
                __classPrivateFieldGet(this, _SwipeGesture_instances, "m", _SwipeGesture_exit).call(this, context, measure);
            }
        }, {
            loop: this.config.loop
        });
        return this;
    }
}
_SwipeGesture_inspector = new WeakMap(), _SwipeGesture_delta = new WeakMap(), _SwipeGesture_instances = new WeakSet(), _SwipeGesture_enter = function _SwipeGesture_enter(context, measure) {
    __classPrivateFieldGet(this, _SwipeGesture_delta, "f").x = measure?.x || 0;
    __classPrivateFieldGet(this, _SwipeGesture_delta, "f").y = measure?.y || 0;
    this.emitter.dispatch('start', {
        gesture: this,
        context,
        measue: this.widget.measure(),
        delta: { x: 0, y: 0 }
    });
    __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").start = true;
    __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").move = false;
    return this;
}, _SwipeGesture_exit = function _SwipeGesture_exit(context, measure) {
    this.widget.removeStyle(['userSelect']);
    __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").start = false;
    __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").move = false;
    this.emitter.dispatch('end', {
        gesture: this,
        context,
        measue: this.widget.measure(),
        delta: { x: (measure?.x || 0) - __classPrivateFieldGet(this, _SwipeGesture_delta, "f").x, y: (measure?.y || 0) - __classPrivateFieldGet(this, _SwipeGesture_delta, "f").y }
    });
    __classPrivateFieldGet(this, _SwipeGesture_delta, "f").x = 0;
    __classPrivateFieldGet(this, _SwipeGesture_delta, "f").y = 0;
    __classPrivateFieldGet(this, _SwipeGesture_inspector, "f").stopImmediat = false;
    return this;
};
export default class KatonGesture {
}
KatonGesture.Swipe = SwipeGesture;
