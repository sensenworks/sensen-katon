import { DropdownOptionGroupWidget, DropdownOptionWidget } from "./foundation-html";
export function ExtendedDropdownListOptions(widget, options) {
    options.map(option => ExtendedDropdownListOption(widget, option));
    return widget;
}
export function ExtendedDropdownListOption(widget, option) {
    if (!option.group) {
        const child = (new DropdownOptionWidget(option)).prepare();
        widget.content(child);
        child.widgets?.push(widget);
    }
    else if (option.group) {
        const child = (new DropdownOptionGroupWidget(option)).prepare();
        widget.content(child);
        child.options(option.group);
    }
    return widget;
}
