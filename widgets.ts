import { 
  AbstractWidget, 
  ActionWidget, 
  AttributionWidget, 
  PhysicalWidget, 
  ReferenceWidget, 
} from "./foundation";

import type { 
  IStyleDeclaration,
  IActionCallback,
  IWidgetChildren, 
  IWidgetNode, 
  IKatonContextCallback, 
  IKatonReferenceCallback,
  IKatonBuilder,
  IState,
  IInputProps,
  IDropdownListProps,
  IDropdownListOption,
  IAttributionProps,
  ITableProps,
} from "./declarations";

import { 
  HeadlingBigWidget, 
  HeadlingBiggerWidget, 
  HeadlingMediumWidget, 
  HeadlingSmallWidget, 
  HeadlingSmallerWidget, 
  LiWidget, 
  ParagraphWidget, 
  StrongTextWidget, 
  StyleWidget, 
  TextualWidget, 
  UListWidget, 
  VisualKitWidget,
  FormWidget,
  InputWidget,
  DropdownOptionWidget,
  DropdownListWidget,
  ButtonWidget,
  DropdownOptionGroupWidget,
  TableWidget,
} from "./foundation-html";
import KatonState from "./state";
import MetricRandom from "sensen-metric-random/index";



export function Context( callback : IKatonContextCallback ){

  const widget = new AbstractWidget()
  
  widget.emitter.listen<IWidgetNode>('ready', ({ emit }) => {

    emit.builder?.emitter.listen<IKatonBuilder<typeof emit>>('ready', builder => 
      
      callback( builder.emit.context )

    )
    
  } )

  return widget;
  
}


export function Ref( ref : IKatonReferenceCallback ){

  const widget = new ReferenceWidget()

  widget.emitter.listen<IWidgetNode>('ready', ({ emit }) => {

    emit.builder?.emitter.listen<IKatonBuilder<typeof widget>>('ready', () => {
    
      if( emit.parent && !emit.parent.codex ){

        emit.parent.codex = (`${ widget.codex }`).substring(2);

        ref( widget )

      }
      
    })
    
  })

  return widget;
  
}


export function Widget( ...widgets : IWidgetChildren[] ){

  return (new PhysicalWidget( widgets )).prepare()
  
}


export function FlexBox( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ display:'flex', }) )

  return (new PhysicalWidget( widgets )).prepare()
  
}

export function Row( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ flexDirection:'row', }) )

  return FlexBox.apply( null, widgets )
  
}

export function RowReverse( ...widgets : IWidgetChildren[] ){
  
  widgets.push( Style({ flexDirection:'row-reverse', }) )

  return FlexBox.apply( null, widgets )
  
}


export function Column( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ flexDirection: 'column', }) )

  return FlexBox.apply( null, widgets )
  
}

export function ColumnReverse( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ flexDirection: 'column-reverse', }) )

  return FlexBox.apply( null, widgets )
  
}


export function Center( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ 
    width:'100%', 
    height: '100%', 
    justifyContent:'center',
    alignItems:'center',
  }) )

  return FlexBox.apply( null, widgets )
  
}

export function HCenter( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ width:'100%', justifyContent:'center', }) )

  return Row.apply( null, widgets )
  
}

export function HColumnCenter( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ width:'100%', justifyContent:'center', }) )

  return Column.apply( null, widgets )
  
}

export function VCenter( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ height:'100%', alignItems:'center', }) )

  return Row.apply( null, widgets )
  
}

export function VColumnCenter( ...widgets : IWidgetChildren[] ){

  widgets.push( Style({ height:'100%', alignItems:'center', }) )

  return Column.apply( null, widgets )
  
}


export function Textual( ...widgets : IWidgetChildren[] ){

  return (new TextualWidget( widgets )).prepare()
  
}

export function H1( ...widgets : IWidgetChildren[] ){

  return (new HeadlingBiggerWidget( widgets )).prepare()
  
}

export function H2( ...widgets : IWidgetChildren[] ){

  return (new HeadlingBigWidget( widgets )).prepare()
  
}

export function H3( ...widgets : IWidgetChildren[] ){

  return (new HeadlingMediumWidget( widgets )).prepare()
  
}

export function H4( ...widgets : IWidgetChildren[] ){

  return (new HeadlingSmallWidget( widgets )).prepare()
  
}

export function H5( ...widgets : IWidgetChildren[] ){

  return (new HeadlingSmallerWidget( widgets )).prepare()
  
}

export function Paragraph( ...widgets : IWidgetChildren[] ){

  return (new ParagraphWidget( widgets )).prepare()
  
}

export function UL( ...widgets : IWidgetChildren[] ){

  return (new UListWidget( widgets )).prepare()
  
}

export function Li( ...widgets : IWidgetChildren[] ){

  return (new LiWidget( widgets )).prepare()
  
}

export function StrongText( ...widgets : IWidgetChildren[] ){

  return (new StrongTextWidget( widgets )).prepare()
  
}

export function Form( ...widgets : IWidgetChildren[] ){

  return (new FormWidget( widgets )).prepare()
  
}

export function Input( props : IInputProps ){

  return (new InputWidget( props )).prepare()
  
}

export function DropdownList( props : IDropdownListProps){

  return (new DropdownListWidget( props )).prepare()
  
}

export function DropdownOption( props: IDropdownListOption ){

  return (new DropdownOptionWidget( props )).prepare()
  
}

export function DropdownOptionGroup( props: IDropdownListOption ){

  return (new DropdownOptionGroupWidget( props )).prepare()
  
}

export function Button( ...widgets : IWidgetChildren[] ){

  return (new ButtonWidget( widgets )).prepare()
  
}



export function Table( props : ITableProps ){

  return (new TableWidget( props )).prepare()
  
}



export function Style( selectors : IStyleDeclaration ){

  return (new StyleWidget( selectors )).prepare()
  
}


export function Action<C extends IWidgetNode>( 

  name : string,

  callback : IActionCallback<C>,

  options ?: boolean | AddEventListenerOptions | undefined,

){

  return (new ActionWidget<C>( { name, callback, options } )).prepare()
  
}


export function UseAction<C extends IWidgetNode>(

  eventName : keyof GlobalEventHandlersEventMap,

  callback : IActionCallback<C>,

  options ?: boolean | AddEventListenerOptions | undefined,
  
){

  const anonymous = MetricRandom.CreateAplpha( 32 ).join('');

  const widget = Action(anonymous, callback, options)
  
  widget.emitter.listen('beforeParse', ()=>{

    if( widget.parent instanceof PhysicalWidget ){

      const action : IAttributionProps = {}

      action[ `:${ eventName }` ] = anonymous;

      widget.parent.attribution( action );

      // widget.parse()
      
    }
    
  })

  return widget;
  
}


export function UseKit( declaration ?: IStyleDeclaration ){

  return new VisualKitWidget( declaration ).prepare()

}


export function State<T extends IState>( state : T ){

  return new KatonState<T>( state )
  
}


export function Attribution( props : IAttributionProps ){

  return new AttributionWidget( props )
  
}