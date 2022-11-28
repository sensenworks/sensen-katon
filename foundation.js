var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PhysicalWidget_shadow;
import { AttributesObject } from "./attribution";
import { FragmentedBuilder } from "./builder";
import { KatonEmitter } from "./emitter";
import KatonProps from "./props";
import MetricRandom from "sensen-metric-random/index";
export default class WidgetNode {
    constructor(props) {
        this.codex = null;
        this.children = undefined;
        this.props = undefined;
        this.context = null;
        this.parent = null;
        this.ancestor = null;
        this.emitter = new KatonEmitter;
        this.ready = false;
        this.builder = null;
        this.props = new KatonProps(props);
        this.emitter.listen('ready', () => this.ready = true);
    }
    beforePrepare() { return this; }
    afterPrepare() { return this; }
    prepare() {
        this.beforePrepare();
        this.emitter.dispatch('prepare', this);
        this.afterPrepare();
        return this;
    }
    render() {
        this.emitter.dispatch('render', this);
        return this;
    }
    whenemit(listen, callback) {
        this.emitter.listen(listen, callback);
        return this;
    }
}
export class PhysicalWidget extends WidgetNode {
    constructor(children) {
        super(children);
        this.props = undefined;
        this.children = [];
        this.name = undefined;
        this.element = null;
        _PhysicalWidget_shadow.set(this, document.createDocumentFragment());
        this.props = new KatonProps({});
        this.children = children;
        this.name = this.name || 'div';
    }
    $element() {
        if (!this.element) {
            this.element = document.createElement(this.name || 'div');
            this.ready = true;
            this.emitter.dispatch('created', this);
        }
        return this;
    }
    prepare() {
        this.$element();
        super.prepare();
        return this;
    }
    connect() {
        if (this.parent instanceof PhysicalWidget && this.parent.element && this.element) {
            this.parent.element.append(this.element);
            this.emitter.dispatch('connect', this);
        }
        return this;
    }
    on(eventname, callback) {
        this.element?.addEventListener(eventname, (event) => {
            callback({
                widget: this,
                event,
                builder: this.builder
            });
            this.emitter.dispatch(`on${eventname}`, this);
        });
        return this;
    }
    disconnect() {
        if (this.element) {
            __classPrivateFieldGet(this, _PhysicalWidget_shadow, "f").append(this.element);
            this.emitter.dispatch('disconnect', this);
        }
        return this;
    }
    clean() {
        if (this.element) {
            Object.values(this.element.children).map(child => child.remove());
            this.emitter.dispatch('clean', this);
        }
        return this;
    }
    style(declarations) {
        Object.entries(declarations).map(({ 0: name, 1: value }) => {
            if (this.element instanceof HTMLElement) {
                const prop = (`${name}`);
                this.element.style[prop] = value;
            }
        });
        this.emitter.dispatch('style', { widget: this, declarations });
        return this;
    }
    removeStyle(declarations) {
        declarations.map(name => {
            if (this.element instanceof HTMLElement) {
                this.element.style.removeProperty(name);
            }
        });
        this.emitter.dispatch('removeStyle', { widget: this, declarations });
        return this;
    }
    measure() {
        return this.element?.getBoundingClientRect();
    }
    offset(property) {
        const keys = {
            'height': 'offsetHeight',
            'width': 'offsetWidth',
            'top': 'offsetTop',
            'left': 'offsetLeft',
            'parent': 'offsetParent',
        };
        return (this.element && property && keys[property])
            ? this.element[keys[property]]
            : {
                width: this.element?.offsetWidth,
                height: this.element?.offsetHeight,
                top: this.element?.offsetTop,
                left: this.element?.offsetHeight,
                parent: this.element?.offsetParent,
            };
    }
    addClass(tokens) {
        tokens.split(' ').map(name => this.element?.classList.add(name));
        this.emitter.dispatch('addClass', { widget: this, tokens });
        return this;
    }
    toggleClass(tokens, force) {
        const make = tokens.split(' ').map(name => this.element?.classList.toggle(name, force));
        this.emitter.dispatch('toggleClass', { widget: this, tokens, make });
        return make.length <= 1 ? make[0] : make;
    }
    containsClass(tokens) {
        const make = tokens.split(' ').map(name => this.element?.classList.contains(name));
        this.emitter.dispatch('containsClass', { widget: this, tokens, make });
        return make.length <= 1 ? make[0] : make;
    }
    removeClass(tokens) {
        tokens.split(' ').map(name => this.element?.classList.remove(name));
        this.emitter.dispatch('removeClass', { widget: this, tokens });
        return this;
    }
    supportsClass(tokens) {
        const make = tokens.split(' ').map(name => this.element?.classList.supports(name));
        this.emitter.dispatch('supportsClass', { widget: this, tokens });
        return make.length <= 1 ? make[0] : make;
    }
    replaceClass(oldTokens, newTokens) {
        this
            .removeClass(oldTokens)
            .addClass(newTokens);
        this.emitter.dispatch('replaceClass', { widget: this, oldTokens, newTokens });
        return this;
    }
    remove() {
        this.element?.remove();
        this.emitter.dispatch('remove', this);
        return this;
    }
    getAttribution(name) {
        return this.element?.getAttribute(name) || null;
    }
    attribution(attrib) {
        Object.entries(AttributesObject(attrib))
            .map(({ 0: name, 1: value }) => this.element?.setAttribute(name, value));
        return this;
    }
    html(data) {
        if (this.element) {
            if (data) {
                this.element.innerHTML = data;
            }
            else if (data === null) {
                this.element.innerHTML = '';
            }
        }
        return this;
    }
    content(data) {
        if (data instanceof PhysicalWidget && data.element) {
            const fn = (builder) => FragmentedBuilder(builder, data, this);
            if (this.builder) {
                fn(this.builder);
            }
            else {
                this.emitter.listen('ready', () => {
                    if (this.builder) {
                        fn(this.builder);
                    }
                });
            }
            this.element?.append(data.element);
        }
        else if (data instanceof Element ||
            data instanceof Node ||
            typeof data == 'string') {
            this.element?.append(data);
        }
        return this;
    }
    append(...nodes) {
        nodes.map(node => {
            if (this.element) {
                if (node instanceof PhysicalWidget) {
                    if (node.element) {
                        this.element.append(node.element);
                    }
                }
                else if (node instanceof Node || typeof node == 'string') {
                    this.element.append(node);
                }
            }
        });
        return this;
    }
    pushToRender(...children) {
        this.children = [...(this.children || []), ...children];
        return this;
    }
}
_PhysicalWidget_shadow = new WeakMap();
export class AbstractWidget extends WidgetNode {
    constructor(props) {
        super(props);
        this.props = undefined;
        this.props = new KatonProps({});
    }
}
export class ReferenceWidget extends AbstractWidget {
    constructor(props) {
        super(props);
        this.codex = '';
        this.props = undefined;
        this.props = new KatonProps(props || {});
        this.codex = `0x${MetricRandom.CreateHEX(6).join('')}`;
    }
    measure() {
        return (this.parent instanceof PhysicalWidget) ? this.parent.element?.getBoundingClientRect() : undefined;
    }
    layer() { return this.parent; }
}
export function ActionTrigger(artifact, immediat = true) {
    const fn = () => {
        const instance = {
            context: artifact.context,
            builder: artifact.builder,
            event: new CustomEvent('artifact')
        };
        artifact.props?.callback(instance);
        console.log('Trigger artifact', artifact, instance);
    };
    if (immediat === true) {
        artifact.emitter.listen(`ready`, () => fn());
    }
    else {
        fn();
    }
    return artifact;
}
export function ActionName(name) {
    return `kat:${name}`;
}
export class ActionWidget extends AbstractWidget {
    constructor(props) {
        super(props);
        this.props = {
            name: 'click',
            callback: (() => { })
        };
        this.props = props;
    }
    render() {
        this.parse();
        this.emitter.dispatch('render', this);
        return this;
    }
    parse() {
        this.emitter.dispatch('beforeParse', this);
        if (this.parent instanceof PhysicalWidget && this.parent.element) {
            this.parent.element.querySelectorAll('*')
                .forEach(node => this.make(node));
            this.make(this.parent.element);
        }
        this.emitter.dispatch('afterParse', this);
        return this;
    }
    make(node) {
        if (node.attributes.length) {
            Array.from(node.attributes).map(attribute => {
                [...attribute.name.matchAll(/^:(.\w*)/gi)].map(match => {
                    node.addEventListener(`${match[1].trim()}`, (ev) => {
                        if (attribute.value.trim() === this.props?.name.trim()) {
                            const instance = {
                                context: this.context,
                                builder: this.builder,
                                event: ev
                            };
                            this.props.callback(instance);
                        }
                    }, this.props?.options);
                });
            });
        }
        return this;
    }
}
export class StateWidget extends AbstractWidget {
    constructor(props) {
        super(props);
        this.props = {};
        this.widget = null;
        this.props = props;
    }
}
export class AttributionWidget extends AbstractWidget {
    constructor(props) {
        super(props);
        this.props = undefined;
        this.props = new KatonProps(props || {});
    }
    render() {
        super.prepare();
        const props = this.props?.mutate();
        if (props) {
            Object.entries(AttributesObject(props))
                .map(({ 0: name, 1: value }) => {
                if (this.parent instanceof PhysicalWidget && this.parent.element) {
                    this.parent.element?.setAttribute(name, value);
                }
            });
        }
        return this;
    }
}
