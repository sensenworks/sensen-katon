import { ScrollingWidget, TabsWidget } from "./foundation-kits";
export function Tabs(props) {
    return (new TabsWidget(props)).prepare();
}
export function Scrolling(props) {
    return (new ScrollingWidget(props)).prepare();
}
