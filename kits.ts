import { IKitScrollingProps, IKitTabsProps } from "./declarations";
import { ScrollingWidget, TabsWidget } from "./foundation-kits";

export function Tabs( props : IKitTabsProps ){

  return (new TabsWidget( props )).prepare()

}


export function Scrolling( props : IKitScrollingProps ){

  return (new ScrollingWidget( props )).prepare()

}