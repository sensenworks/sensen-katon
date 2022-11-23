import { AbstractWidget, PhysicalWidget } from "../foundation";
export function cloneClassInstance(instance) {
    return Object.assign(Object.create(Object.getPrototypeOf(instance)), instance);
}
export function isWidgetInstance(i) {
    return typeof i == 'object' && (i instanceof PhysicalWidget ||
        i instanceof AbstractWidget);
}
export function useTrait(origin, trait) {
    Object.entries(trait).map(({ 0: prop, 1: value }) => {
        const name = prop;
        origin[name] = value;
    });
    return origin;
}
