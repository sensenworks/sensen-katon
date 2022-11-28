import { AbstractWidget, ActionWidget, AttributionWidget, PhysicalWidget, ReferenceWidget, } from "./foundation";
import { HeadlingBigWidget, HeadlingBiggerWidget, HeadlingMediumWidget, HeadlingSmallWidget, HeadlingSmallerWidget, LiWidget, ParagraphWidget, StrongTextWidget, StyleWidget, TextualWidget, UListWidget, VisualKitWidget, FormWidget, InputWidget, DropdownOptionWidget, DropdownListWidget, ButtonWidget, DropdownOptionGroupWidget, TableWidget, PictureWidget, } from "./foundation-html";
import KatonState from "./state";
import MetricRandom from "sensen-metric-random/index";
export function Context(callback) {
    const widget = new AbstractWidget();
    widget.emitter.listen('ready', ({ emit }) => {
        emit.builder?.emitter.listen('ready', builder => callback(builder.emit.context));
    });
    return widget;
}
export function Ref(ref) {
    const widget = new ReferenceWidget();
    widget.emitter.listen('ready', ({ emit }) => {
        emit.builder?.emitter.listen('ready', () => {
            if (emit.parent && !emit.parent.codex) {
                emit.parent.codex = (`${widget.codex}`).substring(2);
                ref(widget);
            }
        });
    });
    return widget;
}
export function Widget(...widgets) {
    return (new PhysicalWidget(widgets)).prepare();
}
export function FlexBox(...widgets) {
    widgets.push(Style({ display: 'flex', }));
    return (new PhysicalWidget(widgets)).prepare();
}
export function Row(...widgets) {
    widgets.push(Style({ flexDirection: 'row', }));
    return FlexBox.apply(null, widgets);
}
export function RowReverse(...widgets) {
    widgets.push(Style({ flexDirection: 'row-reverse', }));
    return FlexBox.apply(null, widgets);
}
export function Column(...widgets) {
    widgets.push(Style({ flexDirection: 'column', }));
    return FlexBox.apply(null, widgets);
}
export function ColumnReverse(...widgets) {
    widgets.push(Style({ flexDirection: 'column-reverse', }));
    return FlexBox.apply(null, widgets);
}
export function Center(...widgets) {
    widgets.push(Style({
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }));
    return FlexBox.apply(null, widgets);
}
export function HCenter(...widgets) {
    widgets.push(Style({ width: '100%', justifyContent: 'center', }));
    return Row.apply(null, widgets);
}
export function HColumnCenter(...widgets) {
    widgets.push(Style({ width: '100%', justifyContent: 'center', }));
    return Column.apply(null, widgets);
}
export function VCenter(...widgets) {
    widgets.push(Style({ height: '100%', alignItems: 'center', }));
    return Column.apply(null, widgets);
}
export function VColumnCenter(...widgets) {
    widgets.push(Style({ height: '100%', alignItems: 'center', }));
    return Column.apply(null, widgets);
}
export function Textual(...widgets) {
    return (new TextualWidget(widgets)).prepare();
}
export function H1(...widgets) {
    return (new HeadlingBiggerWidget(widgets)).prepare();
}
export function H2(...widgets) {
    return (new HeadlingBigWidget(widgets)).prepare();
}
export function H3(...widgets) {
    return (new HeadlingMediumWidget(widgets)).prepare();
}
export function H4(...widgets) {
    return (new HeadlingSmallWidget(widgets)).prepare();
}
export function H5(...widgets) {
    return (new HeadlingSmallerWidget(widgets)).prepare();
}
export function Paragraph(...widgets) {
    return (new ParagraphWidget(widgets)).prepare();
}
export function UL(...widgets) {
    return (new UListWidget(widgets)).prepare();
}
export function Li(...widgets) {
    return (new LiWidget(widgets)).prepare();
}
export function StrongText(...widgets) {
    return (new StrongTextWidget(widgets)).prepare();
}
export function Picture(props) {
    return (new PictureWidget(props)).prepare();
}
export function Form(...widgets) {
    return (new FormWidget(widgets)).prepare();
}
export function Input(props) {
    return (new InputWidget(props)).prepare();
}
export function DropdownList(props) {
    return (new DropdownListWidget(props)).prepare();
}
export function DropdownOption(props) {
    return (new DropdownOptionWidget(props)).prepare();
}
export function DropdownOptionGroup(props) {
    return (new DropdownOptionGroupWidget(props)).prepare();
}
export function Button(...widgets) {
    return (new ButtonWidget(widgets)).prepare();
}
export function Table(props) {
    return (new TableWidget(props)).prepare();
}
export function Style(selectors) {
    return (new StyleWidget(selectors)).prepare();
}
export function Action(name, callback, options) {
    return (new ActionWidget({ name, callback, options })).prepare();
}
export function UseAction(eventName, callback, options) {
    const anonymous = MetricRandom.CreateAplpha(32).join('');
    const widget = Action(anonymous, callback, options);
    widget.emitter.listen('beforeParse', () => {
        if (widget.parent instanceof PhysicalWidget) {
            const action = {};
            action[`:${eventName}`] = anonymous;
            widget.parent.attribution(action);
        }
    });
    return widget;
}
export function UseKit(declaration) {
    return new VisualKitWidget(declaration).prepare();
}
export function State(state) {
    return new KatonState(state);
}
export function Attribution(props) {
    return new AttributionWidget(props);
}
