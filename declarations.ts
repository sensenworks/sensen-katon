import { IKatonEmitter, KatonEmitter, KatonEmitterCallback } from "./emitter";



export type IWidgetUsable = IWidgetNode 
  | IPhysicalWidget 
  | IAbstractWidget 
  | IKatonBuilder<IWidgetNode>
  | IKatonContext
;


export interface IWidgetNode{

  codex : string | null;

  props ?: any;

  children ?: any;

  element ?: HTMLElement | null;

  parent : IWidgetNode | null;

  ancestor : IWidgetNode | null;
  
  context : IKatonContext | null;

  emitter : KatonEmitter;

  ready: boolean;

  builder : IKatonBuilder<IWidgetNode> | null;
  
  render() : this;

  prepare() : this;

  whenemit<T>( listen : string, callback : KatonEmitterCallback<T>) : this;

  beforePrepare() : this;

  afterPrepare() : this;

}


export interface IPhysicalWidget extends IWidgetNode{

  $element() : this;

  connect() : this;

  disconnect() : this;

  clean() : this;

  style( declarations : IStyleDeclaration ) : this;
  
  removeStyle( declarations : Array<keyof IStyleDeclaration> ) : this;

  offset( property ?: keyof IPhysicalOffset ) : number | IPhysicalOffset | undefined;

  measure() : DOMRect | undefined;

  addClass( tokens : string ) : this;

  remove() : this;

  getAttribution( attrib : IAttributionProps | string ) : string | null;

  attribution( attrib : IAttributionProps ) : this;
  
  toggleClass( tokens : string, force?: boolean | undefined ) : boolean | (boolean | undefined)[] | undefined;

  containsClass( tokens : string ) : boolean | (boolean | undefined)[] | undefined;

  supportsClass( tokens : string ) : boolean | (boolean | undefined)[] | undefined;

  removeClass( tokens : string ) : this;

  replaceClass( oldTokens : string, newTokens : string ) : this;

  content( data : IWidgetUsable ) : this;

  html( data : string | null ) : this;

  pushToRender( ...children : IWidgetChildren[] ) : this;

  append( ...nodes: (string | Node | IPhysicalWidget )[] ) : this;

  on( eventname : keyof IWidgetListenerMap, callback : IWidgetListenerCallback ) : this;
  
}


export type IPhysicalOffsetMap = {

  'height' : 'offsetHeight',

  'width' : 'offsetWidth',

  'top' : 'offsetTop',

  'left' : 'offsetLeft',

  'parent' : 'offsetParent',
  
}

export type IPhysicalOffset = {

  'height' : number | undefined,

  'width' : number | undefined,

  'top' : number | undefined,

  'left' : number | undefined,

  'parent' : number | undefined,
  
}

export interface IHeadlingWidget extends IPhysicalWidget{

}


export interface IAbstractWidget extends IWidgetNode{

}


export type IWidgetChildren = IWidgetNode 
  | IKatonBuilder<IWidgetNode> 
  | Node
  | Element
  | Text
  | string 
  | boolean 
  | null 
  | undefined;

export type IWidgetProps = {

  [ P : string ] : any

}


export type IUiAssignCallback =  ( e: HTMLElement ) => void;



export interface IKatonBuilder<C extends IWidgetNode> {

  widget: C;

  context : IKatonContext | null;
  
  // state : IKatonState<IState> | null
  
  ancestor : IKatonBuilder<IWidgetNode> | null;

  emitter: KatonEmitter;

  ready: boolean;

  prepare() : this;

  injector( widget : C) : this;

  render() : this;

  fragment( widget : IPhysicalWidget, parent?: IPhysicalWidget ) : this;

}


export type IWidgetListenerConfig = {

  loop ?: boolean;
  
}

export type IWidgetListenerMap = GlobalEventHandlersEventMap

export type IWidgetListenerCallback = ( listenerContext : IWidgetListenerContext ) => void

export type IWidgetListenerCallbacks = {

  [ k in keyof IWidgetListenerMap ] ?: IWidgetListenerCallback
  
}

export type IWidgetListenerContext = {

  event : Event;

  builder : IKatonBuilder<IWidgetNode> | null;

  widget : IPhysicalWidget
  
}

export interface IKatonPropsInstance<T extends IKatonProps>{

  emitter: KatonEmitter;

  get data() : T

  get<V extends unknown>( name : string ) : V;

  add( name : string, value : any ): this;

  remove( name : string ) : this;

  all() : T;
  
}

export interface IKatonProps{

  [ P : string ] : any
  
}




export interface IKatonContextStore{

  [ C : string ] : any
  
}

export interface IKatonContext{

  emitter : KatonEmitter;

  storage : IKatonContextStore;

  ready : boolean;
  
  slot<T extends unknown>( name : string ) : T;
  
  addSlot( name : string, value : any ) : this;
  
  removeSlot( name : string ) : this;


  render() : this;

}

export type IKatonContextCallback = ( context : IKatonContext | null ) => void





export interface IKatonReference extends IAbstractWidget{

  layer<T extends IWidgetNode>() : T

  measure() : DOMRect | undefined;

}

export type IKatonReferenceCallback = ( context : IKatonReference ) => void





export type IStyleDefault =  'unset' | 'initial';

export type IStylePropImportant<P> = { [ K in keyof P ] : P[ K ] | `${ P[ K ] | any } !important` }

export type IStylePropDisplay = 'flex' 
  | 'grid' 
  | 'inline' 
  | 'inline-block' 
  | 'block' 
  | 'none' 
  | IStyleDefault;

export interface IStyleDeclaration extends Partial<CSSStyleDeclaration>{

  display ?: IStylePropDisplay;

  flexDirection ?: 'column' | 'column-reverse' | 'row' | 'row-reverse' | IStyleDefault

  backdropFilter ?: string;
  
}

export interface IStyleSelectorDeclarations {

  [ selector : string ] : IStyleDeclaration
    
}






export interface IAttributionProps extends IAttributesObject{

  [ A : string ] : IAttributionProps | string  | number | boolean | null
  
}

export type IAttributesObjectValues = IAttributesObject | Array<any> | string  | number | boolean | null | Function

export type IAttributesObject = {

  [ A : string ] : IAttributesObjectValues
  
}

export type IAttributesParsed = {

    [ A : string ] : string;
    
}




export type IActionCallbackInstance<C extends IWidgetNode> = {

  context: IKatonContext | null;

  builder : IKatonBuilder<C> | null;

  event : Event | null;
  
}

export type IActionCallback<C extends IWidgetNode> = ( argument : IActionCallbackInstance<C> ) => void;

export interface IActionProps<C extends IWidgetNode> extends IKatonProps{

  name : string;

  callback : IActionCallback<C>;

  options ?: boolean | AddEventListenerOptions | undefined;
  
}



export interface IKatonElement extends HTMLElement{

  emitter?: KatonEmitter;

  connectedCallback?: () => void;

  adoptedCallback?: () => void;

  disconnectedCallback?: () => void;
  
}



export type IState = {

  [ S : string ] : any
  
}

export type IStateWidgetStore = {

  [ S : string ] : any
  
}

export type IStatePayloadNode = Element | Node;

export type IStatePayloadSlots<T extends IState> = {

  [ K in keyof T ] : RegExpMatchArray;
  
}

export type IStatePayload<T extends IState> = {

  values: ( T[keyof T] )[];

  slots : IStatePayloadSlots<T>;

  node : Element | Node;

  clone : Element | Node;
  
}

export type IStateSlot = {

  name: string;

  value: any;

  persistance ?: boolean;
  
}

export type IStateData<T extends IState> = {

  slot: keyof T;

  value : T[ keyof T ]

}

export interface IKatonState<T extends IState>{

  emitter : KatonEmitter;

  get data() : T;

  use() : IAbstractWidget;

  get( slot : keyof T ) : T[keyof T];

  set( slot : keyof T, value : T[ keyof T] ) : this;

  // upgrade( slot : keyof T ) : this;

  // proxy( slot : keyof T, value ?: T[ keyof T] ) : this | T[keyof T];
  
  add( slot : keyof T, value : T[ keyof T] ) : this;

  remove( slot : keyof T ) : this;

  // parseChild( widget : IPhysicalWidget | Element | Node ) : this;

  // parseNode( widget : IPhysicalWidget | Element | Node ) : this;

  hydrate( slot : keyof T ) : this;

  hydrates() : this;

}


export type IStateWatcherProps<T extends IState> = Array<keyof T>

export type IStateWatcherCallback<T extends IState> = ( state : T ) => IPhysicalWidget




export interface IAttribution{

  attributeName : string;
  
  get entries() : string[];

  get value() : string;

  sync( attribute ?: string ) : this;

  add( value : string ) : this;

  remove( value : string ) : this;

  replace( older : string, value : string ) : this;

  contains( value : string ) : boolean;
  
  link() : this;

  unlink( property ?: string | string[] ) : this;
  
}





export type IPictureMedia = {
  query: string;
  source: string;
}

export type IPictureProps = {
  source: string;
  media?: Array<IPictureMedia>;
  pending ?: IPhysicalWidget | string;
  failed ?: IPhysicalWidget | string;
}



export type IInputProps = IAttributesObject & {

  rows ?: boolean | number;

  placeholder ?: string;

  type : 'button' 
      | 'checkbox'
      | 'color'
      | 'date'
      | 'datetime-local'
      | 'email'
      | 'file'
      | 'hidden'
      | 'image'
      | 'month'
      | 'number'
      | 'password'
      | 'username'
      | 'fistname'
      | 'lastname'
      | 'radio'
      | 'range'
      | 'reset'
      | 'search'
      | 'submit'
      | 'tel'
      | 'text'
      | 'time'
      | 'url'
      | 'week'
  ;

  accept ?: string;

  alt ?: string;

  autocomplete ?: 'on' | 'off';

  autofocus ?: boolean;

  checked ?: boolean;

  dirname ?: string;

  disabled ?: boolean;

  form ?: string;

  formaction ?: string;

  formmethod ?: 'get' | 'post';

  formnovalidate ?: string;

  formtarget ?: '_blank' | '_self' | '_parent' | '_top' | string;

  list ?: string;

  max ?: number | string;

  maxlength ?: number;

  min ?: number | string;

  multiple ?: boolean;

  name ?: string;

  pattern ?: string;

  readonly ?: boolean;

  required ?: boolean;

  size ?: number;

  src ?: string;

  step ?: number;

  value ?: string | number;

};




export type IDropdownListOptionGroup = {

  label?: string;

  disabled?: boolean;

}

export type IDropdownListOption = IDropdownListOptionGroup & {

  value?: string | number;

  selected?: boolean;

  group ?: Array<IDropdownListOption>;

}

export type IDropdownListProps = IAttributesObject & {

  autofocus ?: boolean;

  disabled ?: boolean;

  form ?: string;

  multiple ?: true;

  name ?: string;

  required ?: boolean;

  size ?: number;

  options?: Array<IDropdownListOption>;

}


export interface IDropdownListOptionExtended extends IPhysicalWidget{

  widgets?: Array<IDropdownListOptionExtended>

  options( options ?: IDropdownListOption[] ): this;

  option( option : IDropdownListOption ): this;

}






export type ITableType = 'text' 

  | 'number' 

  | 'boolean' 

  | 'date' 

  | 'time' 

  | 'datetime'

  | 'username'

  | 'email'

  | 'selection'

  | 'image'

  | 'video'

  | 'file'

  | 'longtext'

  | 'custom'

;

export type ITableColumn = {

  label : string;

  name ?: string;

  type ?: ITableType;
  
  colspan?: number;
  
  rowspan?: number;
  
}

export type ITableColumns = Array<ITableColumn>


export type ITableCellCallableProps<T> = { 
  
  entry : T;
  
  row ?: ITableRowWidget;

  cellule ?: ITableCellWidget

}

export type ITableCellCallable<T> = ( props : ITableCellCallableProps<T> ) => IWidgetChildren

export type ITableRowObject = {

  [ K : string | number ] : any
  
}


export type ITableRowValues = string | number | boolean | ITableRowObject | Array<string> | IPhysicalWidget;

export type ITableRowAvailableValue<T> = ITableRowValues | ITableCellCallable<T>

export type ITableRow = {

  value: ITableRowValues | ITableCellCallable<any>;
  
  colspan?: number;
  
  rowspan?: number;
  
};

export type ITableRows = Array<ITableRow>;

export type ITableProps = {

  // editable ?: boolean;

  column : Array<ITableColumns>;

  rows : Array<ITableRows>

  footer ?: Array<ITableRows>
  
}


export interface ITableFragmentWidget extends IPhysicalWidget{


}

export interface ITableRowWidget extends ITableFragmentWidget{

  element: HTMLTableRowElement | null;

}

export interface ITableColWidget extends ITableFragmentWidget{

  element: HTMLTableColElement | null;

}

export interface ITableCellWidget extends ITableFragmentWidget{

  element: HTMLTableCellElement | null;

}

export interface ITableSectionWidget extends ITableFragmentWidget{

  element: HTMLTableSectionElement | null;

}






export interface IKitTabProps extends IKatonProps {

  default ?: boolean;

  label : string | IPhysicalWidget;

  icon ?: string;

  about ?: string | IPhysicalWidget;
  
  children : IPhysicalWidget;
  
}

export type IKitTabsProps = Array<IKitTabProps>

export type IKitTabsSwitchEmitter = {

  index : number;

  helmet : IPhysicalWidget;

  frame : IPhysicalWidget;
  
}




export type IKitScrollingControllerCallbackProps = {

  indicator ?: IPhysicalWidget;
  
  container ?: IPhysicalWidget;

  area : IKitScrollingArea;
  
}

export interface IKitScrollingProps extends IKatonProps {

  direction ?: IWidgetKitDirection;

  controller ?: {

    indicator ?: IPhysicalWidget;

    infinite ?: boolean;

    refreshing : ( widgets : IKitScrollingControllerCallbackProps ) => Promise<boolean>;
    
  };

  children : Array<IPhysicalWidget>
  
}

export type IWidgetKitDirection  = 'vertical' | 'horizontal'

export type IKitScrollingArea  = 'end' | 'start'

export type IKitScrollingAreaEmitter  = {

  area : IKitScrollingArea;

  level : number;
  
}




export type IKatonGestureDelta = {

  x : number;

  y : number;
  
}

export type IKatonGestureSwipeConfig = IWidgetListenerConfig & {

  // direction ?: IWidgetKitDirection
  
}

export type IKatonGesturePayload<T extends IPhysicalWidget> = {

  gesture : IKatonGesture<T>; 
  
  context : IWidgetListenerContext;

  measue: DOMRect | undefined;

  delta: IKatonGestureDelta;
  
}

export type IKatonGestureCallback<T extends IPhysicalWidget> = ( payload : IKatonGesturePayload<T> ) => void;

export interface IKatonGesture<T extends IPhysicalWidget> {

  widget : T;

  emitter : IKatonEmitter;
  
}

export interface IKatonGestureInspector {

  start: boolean;

  move: boolean;

  stopImmediat: boolean;

}