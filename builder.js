import KatonContext from "./context";
import { KatonEmitter } from "./emitter";
import WidgetNode, { AbstractWidget, PhysicalWidget, } from "./foundation";
export class KatonBuilder {
    constructor(widget) {
        this.widget = {};
        this.context = null;
        this.ancestor = null;
        this.emitter = new KatonEmitter;
        this.ready = false;
        this.widget = widget;
        this.context = new KatonContext();
    }
    prepare() {
        return this.injector(this.widget);
    }
    injector(widget, parent) {
        if (widget instanceof KatonContext) {
            widget.builder = (parent instanceof WidgetNode) ? parent.builder : this;
        }
        else if (widget instanceof KatonBuilder) {
            if (widget.widget instanceof WidgetNode) {
                widget.widget.builder = this;
            }
        }
        else if (widget instanceof WidgetNode) {
            if (Array.isArray(widget.children)) {
                widget.children.map(child => {
                    if (child instanceof WidgetNode) {
                        child.builder = this;
                    }
                    else if (child instanceof KatonBuilder) {
                        child.widget.builder = this;
                    }
                    this.injector(child, widget);
                });
            }
        }
        return this;
    }
    render() {
        FragmentedBuilder(this, this.widget).render();
        this.ready = true;
        this.context?.render();
        this.widget.emitter.dispatch('ready', this.widget);
        this.emitter.dispatch('ready', this.widget);
        return this;
    }
}
export function FragmentedBuilder(builder, widget, parent) {
    if (widget instanceof KatonContext) {
        widget.render();
        widget.emitter.dispatch('context:used', widget);
    }
    else if (widget instanceof KatonBuilder) {
        widget.ancestor = builder;
        if (widget.widget instanceof WidgetNode) {
        }
        widget.render();
        widget.emitter.dispatch('builder:used', widget);
    }
    else if (widget instanceof WidgetNode) {
        widget.ancestor = builder.widget;
        widget.parent = parent || widget;
        widget.context = !widget.context ? builder.context : widget.context;
        if (widget instanceof PhysicalWidget) {
            PhysicalWidgetBuilder(builder, widget, parent);
            widget.emitter.dispatch('ready', widget);
        }
        else if (widget instanceof AbstractWidget) {
            widget.parent = parent || builder.widget;
            widget.context = !widget.context ? builder.context : widget.context;
            widget.ready = true;
        }
        else if (widget instanceof WidgetNode) {
            if (Array.isArray(widget.children)) {
                widget.children.forEach(child => FragmentedBuilder(builder, child, widget).render());
            }
        }
        else {
            console.error(widget);
            throw (`Unknown widget instance`);
        }
    }
    else {
        console.error(widget);
        throw (`Unknown instance`);
    }
    return widget;
}
export function PhysicalWidgetBuilder(builder, widget, parent) {
    if (widget instanceof WidgetNode) {
        if (widget instanceof PhysicalWidget) {
            if (Array.isArray(widget.children)) {
                widget.children.forEach(child => {
                    if (child instanceof WidgetNode) {
                        child.ancestor = builder.widget;
                        child.parent = parent || widget;
                        if (child instanceof PhysicalWidget &&
                            child.element instanceof HTMLElement &&
                            child.parent instanceof PhysicalWidget &&
                            child.parent.element instanceof HTMLElement) {
                            child.parent.element.append(child.element);
                            child.parent.emitter.dispatch('append:child', child);
                        }
                        FragmentedBuilder(builder, child, widget);
                        child.ready = true;
                        child.render();
                        child.emitter.dispatch('ready', child);
                    }
                    else {
                        if (widget.element instanceof HTMLElement) {
                            if (typeof child == 'string' || child instanceof Node) {
                                widget.element.append(child);
                                widget.emitter.dispatch('append:child', widget);
                            }
                            else {
                                if (child instanceof KatonBuilder) {
                                    if (child.widget instanceof WidgetNode) {
                                        child.widget.ancestor = parent || widget;
                                    }
                                    if (child.widget instanceof PhysicalWidget && child.widget.element) {
                                        widget?.element?.append(child.widget.element);
                                        widget.emitter.dispatch('append:child', widget);
                                    }
                                    child.ancestor = builder;
                                    child.render();
                                    child.emitter.dispatch('append', child);
                                }
                                else if (child instanceof KatonContext) {
                                    child.render();
                                }
                                else if (child instanceof PhysicalWidget) {
                                    FragmentedBuilder(builder, child, widget);
                                }
                                else {
                                    console.error(child);
                                    throw (`Unknown Child instance!`);
                                }
                            }
                        }
                    }
                });
            }
            if (widget.element && parent instanceof PhysicalWidget) {
                parent.element?.append(widget.element);
                parent.emitter.dispatch('append', parent);
                builder.emitter.dispatch('append', builder);
            }
        }
    }
    return widget;
}
export function Append(entry, ui) {
    if (ui.exists && entry.widget.element) {
        ui.root?.append(entry.widget.element);
        entry.render();
        entry.widget.emitter.dispatch('append', entry.widget);
        entry.emitter.dispatch('append', entry);
    }
}
export default function Builder(widget) {
    return (new KatonBuilder(widget)).prepare();
}
