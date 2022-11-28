import { AttributesObject } from "./attribution";
import { FragmentedBuilder, KatonBuilder } from "./builder";
import { KatonEmitter, KatonEmitterCallback } from "./emitter";
import KatonProps from "./props";

import type { 
  IWidgetNode, 
  IWidgetChildren, 
  IKatonContext, 
  IWidgetProps, 
  IPhysicalWidget, 
  IAbstractWidget, 
  IKatonProps, 
  IKatonReference, 
  IStyleDeclaration, 
  IAttributionProps, 
  IActionProps,
  IActionCallbackInstance,
  IKatonBuilder,
  IState,
  IWidgetUsable,
  IWidgetListenerMap,
  IWidgetListenerCallback,
  IPhysicalOffsetMap,
  IPhysicalOffset,
} from "./declarations";
import MetricRandom from "sensen-metric-random/index";



export default class WidgetNode<Props extends IKatonProps> implements IWidgetNode{

  codex : string | null = null;

  children?: any = undefined;

  props ?: KatonProps<Props> = undefined;

  context : IKatonContext | null = null;

  parent : WidgetNode<IKatonProps> | null = null;

  ancestor : WidgetNode<IKatonProps> | null = null;
  
  emitter : KatonEmitter = new KatonEmitter;

  ready: boolean = false;

  builder : KatonBuilder<IWidgetNode> | null = null

  constructor( props ?: any ){

    this.props = new KatonProps(props);

    this.emitter.listen('ready', () => this.ready = true )

  }
  
  beforePrepare(){ return this; }
  
  afterPrepare(){ return this; }

  prepare(): this { 

    this.beforePrepare()

    this.emitter.dispatch('prepare', this)

    this.afterPrepare()
    
    return this;

  }
  
  render(): this { 

    this.emitter.dispatch('render', this)
    
    return this;
    
  }

  whenemit<T>( listen : string, callback : KatonEmitterCallback<T>){

    this.emitter.listen( listen, callback )

    return this;
    
  }
  
}



export class PhysicalWidget extends WidgetNode<IKatonProps> implements IPhysicalWidget{

  props ?: KatonProps<IKatonProps> = undefined;

  children : IWidgetChildren[] = [];

  name ?: string = undefined;
  
  element : HTMLElement | null = null;

  #shadow = document.createDocumentFragment();


  constructor( children : IWidgetChildren[] ){

    super( children )

    this.props = new KatonProps({});

    this.children = children;

    this.name = this.name || 'div';

  }

  $element(){

    if( !this.element ){

      this.element = document.createElement( this.name || 'div' )

      this.ready = true;
      
      this.emitter.dispatch('created', this)
    
    }

    return this;
    
  }

  prepare(){

    this.$element();

    super.prepare();
    
    return this;
    
  }
  
  connect(){

    if( this.parent instanceof PhysicalWidget && this.parent.element && this.element  ){

      this.parent.element.append( this.element )

      this.emitter.dispatch('connect', this)
    
    }
    
    return this;
    
  }

  on( eventname : keyof IWidgetListenerMap, callback : IWidgetListenerCallback ){

    this.element?.addEventListener( eventname, ( event ) => {
    
      callback({ 
        
        widget: this, 
        
        event, 
        
        builder : this.builder 
      
      })

      this.emitter.dispatch(`on${eventname}`, this )

    })

    return this;
    
  }

  disconnect(){

    if( this.element ){

      this.#shadow.append( this.element )

      this.emitter.dispatch('disconnect', this)
    
    }
  
    return this;
    
  }
  
  clean(){

    if( this.element ){

      Object.values( this.element.children ).map( child => child.remove() )

      this.emitter.dispatch('clean', this)
      
    }
    
    return this;
    
  }


  style( declarations : IStyleDeclaration ){

    Object.entries( declarations ).map(({ 0 : name, 1 : value }) => {

      if( this.element instanceof HTMLElement ){
          const prop = (`${ name }`) as keyof CSSStyleDeclaration
          // @ts-ignore
          this.element.style[ prop ] = value;
      }

    })
    
    this.emitter.dispatch('style', { widget : this, declarations })
    
    return this;
      
  }


  removeStyle( declarations : Array<keyof IStyleDeclaration> ){

    declarations.map( name => {

      if( this.element instanceof HTMLElement ){

        this.element.style.removeProperty( name as string )

      }

    })
    
    this.emitter.dispatch('removeStyle', { widget : this, declarations })
    
    return this;
      
  }



  measure(){

    return this.element?.getBoundingClientRect()
    
  }
  
  offset( property ?: keyof IPhysicalOffset ) : number | IPhysicalOffset | undefined {

    const keys : IPhysicalOffsetMap = {

      'height' : 'offsetHeight',

      'width' : 'offsetWidth',

      'top' : 'offsetTop',

      'left' : 'offsetLeft',

      'parent' : 'offsetParent',
      
    }
    
    return ( this.element && property && keys[ property ] )

    //@ts-ignore
    ? this.element[ keys[ property ] ] as (undefined | number)

    : {

      width: this.element?.offsetWidth,

      height: this.element?.offsetHeight,

      top: this.element?.offsetTop,

      left: this.element?.offsetHeight,

      parent: this.element?.offsetParent,
      
    } as IPhysicalOffset
    
  }
  

  


  addClass( tokens : string ){

    tokens.split(' ').map( name => this.element?.classList.add( name ))

    this.emitter.dispatch('addClass', { widget : this, tokens })

    return this;
      
  }
  
  toggleClass( tokens : string, force?: boolean | undefined ){

    const make = tokens.split(' ').map( name => this.element?.classList.toggle( name, force ))

    this.emitter.dispatch('toggleClass', { widget : this, tokens, make })
    
    return make.length <= 1 ? make[0] : make;
    
  }
  
  containsClass( tokens : string ){

    const make = tokens.split(' ').map( name => this.element?.classList.contains( name ))

    this.emitter.dispatch('containsClass', { widget : this, tokens, make })
    
    return make.length <= 1 ? make[0] : make;

  }
  
  removeClass( tokens : string ){

    tokens.split(' ').map( name => this.element?.classList.remove( name ))

    this.emitter.dispatch('removeClass', { widget : this, tokens })
    
    return this;
    
  }
  
  supportsClass( tokens : string ){

    const make = tokens.split(' ').map( name => this.element?.classList.supports( name ))

    this.emitter.dispatch('supportsClass', { widget : this, tokens })
    
    return make.length <= 1 ? make[0] : make;
    
  }
  
  replaceClass( oldTokens : string, newTokens : string ){

    this

        .removeClass( oldTokens )
        
        .addClass( newTokens )

    ;

    this.emitter.dispatch('replaceClass', { widget : this, oldTokens, newTokens })
    
    return this;
    
  }
  
  remove(){

    this.element?.remove();

    this.emitter.dispatch('remove', this)
    
    return this;
    
  }
  

  getAttribution( name : string ){

    return this.element?.getAttribute( name ) || null

  }
  
  attribution( attrib : IAttributionProps ){

    Object.entries( AttributesObject( attrib ) )

    .map( ({ 0 : name, 1 : value }) => this.element?.setAttribute( name, value ) ) 
    
    return this;
    
  }
  

  html( data : string | null ){

    if( this.element ){

      if( data ){ this.element.innerHTML = data; }

      else if( data === null ){ this.element.innerHTML = ''; }

    }
    
    return this;
    
  }

  content( data : IWidgetUsable | IWidgetChildren ){

    if( data instanceof PhysicalWidget && data.element ){

      const fn = ( builder : KatonBuilder<IWidgetNode> )=> 

        FragmentedBuilder( builder, data as IWidgetUsable, this );

      if( this.builder ){ fn( this.builder ) }

      else{

        this.emitter.listen<IPhysicalWidget>('ready', ()=>{

          if( this.builder ){ fn( this.builder ) }

        })
        
      }

      this.element?.append( data.element )

    }

    else if( 

      data instanceof Element || 
      
      data instanceof Node || 
      
      typeof data == 'string' 
      
    ){

      this.element?.append( data )

    }

    // else{
  
    //   const fn = ( builder : KatonBuilder<IWidgetNode> )=> 

    //     FragmentedBuilder( builder, data as IWidgetUsable, this );

    //   if( this.builder ){ fn( this.builder ) }

    //   else{

    //     this.emitter.listen<IPhysicalWidget>('ready', ()=>{

    //       if( this.builder ){ fn( this.builder ) }

    //     })
        
    //   }

    // }
    
    return this;
    
  }


  append( ...nodes: (string | Node | IPhysicalWidget )[] ){

    nodes.map( node => {
      
      if( this.element ){

        if( node instanceof PhysicalWidget ){

          if( node.element ){ this.element.append( node.element ); }
          
        }

        else if( node instanceof Node || typeof node == 'string'){ 

          this.element.append( node ); 
          
        }

      }
        
    })

    return this;
    
  }
  

  pushToRender( ...children : IWidgetChildren[] ){

    this.children = [ ...(this.children || []), ...children ]

    return this;
    
  }
  
  
}




export class AbstractWidget extends WidgetNode<IKatonProps> implements IAbstractWidget{

  props ?: any = undefined;

  constructor( props ?: IWidgetProps ){

    super( props )

    this.props = new KatonProps({});

  }
  
}




export class ReferenceWidget extends AbstractWidget implements IKatonReference{

  codex: string = '';

  props ?: KatonProps<IKatonProps> = undefined;

  constructor( props ?: IWidgetProps ){

    super( props )

    this.props = new KatonProps( props || {} );

    this.codex = `0x${ MetricRandom.CreateHEX( 6 ).join('') }`;

  }

  measure(){

    return (this.parent instanceof PhysicalWidget) ? this.parent.element?.getBoundingClientRect() : undefined;
    
  }

  layer<T extends WidgetNode<IKatonProps>>(){ return this.parent as T; }
  
}




export function ActionTrigger<C extends IWidgetNode>( 
  
  artifact : ActionWidget<C>,
  
  immediat : boolean = true
  
){

  const fn = ()=>{

    const instance : IActionCallbackInstance<C> = {
                  
      context: artifact.context,
      
      builder: artifact.builder as IKatonBuilder<C>,

      event : new CustomEvent('artifact')

    }
    
    artifact.props?.callback( instance )

    console.log('Trigger artifact', artifact, instance )

  }


  if( immediat === true ){ artifact.emitter.listen(`ready`, ()=> fn() ) }

  else{ fn(); }

  return artifact;
  
}



export function ActionName( name : keyof GlobalEventHandlersEventMap ){

  return `kat:${ name }`

}

export class ActionWidget<C extends IWidgetNode> extends AbstractWidget{

  props?: IActionProps<C> = {

    name: 'click',

    callback: (()=>{})
    
  };

  constructor( props : IActionProps<C> ){

    super( props );

    this.props = props;
    
  }
  
  render(): this {
      
    this.parse();
    
    this.emitter.dispatch('render', this )
    
    return this;
    
  }

  parse(){
    
    this.emitter.dispatch('beforeParse', this )
    
    if( this.parent instanceof PhysicalWidget && this.parent.element ){

      this.parent.element.querySelectorAll<HTMLElement>('*')
        
        .forEach( node => this.make( node ))

      ;
    
      this.make( this.parent.element )

    }

    
    this.emitter.dispatch('afterParse', this )
    
    return this;
      
  }

  make( node : HTMLElement ){

    if( node.attributes.length ){

      Array.from( node.attributes ).map( attribute =>{

        [...attribute.name.matchAll( /^:(.\w*)/gi )].map( match => {

          node.addEventListener( `${ match[1].trim() }`, ( ev )=>{

            if( attribute.value.trim() === this.props?.name.trim() ){

              const instance : IActionCallbackInstance<C> = {
                
                context: this.context,
                
                builder: this.builder as IKatonBuilder<C>,

                event : ev

              }
              
              this.props.callback( instance )
        
            }
              
          }, this.props?.options)

        });

      })
        
    }
      
    return this;
      
  }


}




export class StateWidget<T extends IState> extends AbstractWidget implements IAbstractWidget {

  props : T = {} as T;

  widget : PhysicalWidget | null = null;

  constructor( props : T ){

    super( props );

    this.props = props;

  }

}




export class AttributionWidget extends AbstractWidget implements IAbstractWidget{

  props ?: KatonProps<IAttributionProps> | undefined = undefined;

  constructor( props ?: IAttributionProps ){

    super( props )

    this.props = new KatonProps( props || {} );

  }

  render(): this {

    super.prepare()

    const props = this.props?.mutate<IAttributionProps>();

    if( props ){

    Object.entries( AttributesObject( props ) )

      .map( ({ 0 : name, 1 : value }) => {

        if( this.parent instanceof PhysicalWidget && this.parent.element ){

          this.parent.element?.setAttribute( name, value )

        }
        
      }) 
    
    }
      
    return this;

  }

}

