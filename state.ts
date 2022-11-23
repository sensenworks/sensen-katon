import { PhysicalWidgetBuilder } from "./builder";
import { 
  IKatonBuilder,
  IKatonState, 
  IPhysicalWidget, 
  IState, 
  IStateData, 
  IStatePayload, 
  IStatePayloadNode, 
  IStatePayloadSlots, 
  IStateWatcherCallback, 
  IStateWatcherProps, 
  IWidgetNode
} from "./declarations";
import { KatonEmitter } from "./emitter";
import { PhysicalWidget, StateWidget } from "./foundation";
import { UiMutation } from "./ui";





export const StateExpression = () => new RegExp(`\\{\\{(.[a-zA-Z0-9 _-|(),]+)\\}\\}`, 'gm')

export function findState( data : string | null ){

    return [...(data || '').matchAll( StateExpression() )];
    
}


export class KatonStatePayloads<T extends IState>{

  #entries : Array<IStatePayload<T>> = []


  add( payload : IStatePayload<T> ){

    if( !this.exists( payload.node ).length ){

      this.#entries.push( payload );

    }

    return this;
    
  }

  exists( node : IStatePayloadNode ){ return this.#entries.filter( payload => payload.node === node ) }

  find( slots : Array<keyof T> ){

    return this.#entries.filter( payload => slots.filter( slot => payload.slots[ slot ] ).length )
    
  }

  set( node : IStatePayloadNode , entry : IStateData<T> ){

    this.exists( node ).map( payload => {

      if( !( entry.slot in payload.slots) ){

        payload.slots[ entry.slot ] = entry.value

        payload.values.push( entry.value )
        
      }

      else{

        payload.values.push( entry.value )
        
      }

    })

    return this;
    
  }

  unset( node : IStatePayloadNode ){

    this.#entries = this.exists( node ).filter( payload => payload.node !== node )

    return this;

  }
  
  parse( node : IStatePayloadNode, callback : ( data : IStatePayload<T> ) => void ){

    if( node instanceof Element ){
      
      this.parseElement( node, callback )
    }
    
    else if( node instanceof Node ){

      this.parseNode( node, callback )
      
    }
    
    return this;

  }

  parseNode( node : Node, callback : ( data : IStatePayload<T> ) => void ){

    const matches = findState( node.textContent );

    if( matches && matches.length && !node.$parsed  ){

      const slots : IStatePayloadSlots<T> = {} as IStatePayloadSlots<T>
      
      matches.map( match => {

        const slot = (match[1] || '').trim() as keyof T
        
        slots[ slot ] = match
        
      } )
      
      const payload = {

        slots,
        
        values : [],

        node : node,

        clone : node.cloneNode( true ),

      };

      this.add( payload )
      
      payload.node.$parsed = true;

      callback( payload );

    }
  
    return this;

  }

  parseElement( node : Element, callback : ( data : IStatePayload<T> ) => void ){

    if( node && node.childNodes ){

      node.childNodes.forEach( child => {

        this.parseNode( child, callback )

      })

    }

    return this;

  }
  
}




export class StateWatcher<T extends IState>{

  state : IKatonState<T> = {} as IKatonState<T>;

  props : IStateWatcherProps<T> = [];

  pointer : IPhysicalWidget | null = null;

  callback : IStateWatcherCallback<T> | null = null;


  constructor( state : IKatonState<T> ){

    this.state = state;
    
  }

  watch( props : Array<keyof T> | keyof T ){

    this.props = Array.isArray( props ) ? props : [ props ];

    return this;
    
  }


  widget( callback : IStateWatcherCallback<T> ){

    this.callback = callback;

    if( this.state?.data ){
      
      this.pointer = this.callback( this.state.data )

      this.state.emitter.listen<IStateData<T>>('change', ({ emit }) => {

        if( this.props.includes( emit.slot as string ) ){
  
          let widget = callback( this.state.data )
        
          if( this.pointer?.builder ){
  
            const building = PhysicalWidgetBuilder( this.pointer.builder, widget, undefined );
  
            widget.builder = this.pointer.builder
  
            if( building instanceof PhysicalWidget && building.element ){
      
              this.pointer.element?.parentNode?.replaceChild( building.element, this.pointer.element )
  
              this.pointer = widget;
  
            }
            
          }
  
        }
        
      })
  
      return this.pointer;
      
    }
    
    return null;
    
  }
  
  
}



export default class KatonState<T extends IState> implements IKatonState<T>{


  emitter: KatonEmitter = new KatonEmitter();

  #store : T = {} as T;

  #data : T = {} as T;
  
  #payloads : KatonStatePayloads<T> = new KatonStatePayloads<T>()


  get data(){ 
    
    this.emitter.dispatch('get', this )

    return this.#data; 

  }

  constructor( state : T ){

    this.#data = state;

    this.#listeners();
    
  }
  

  use(){

    const widget = new StateWidget<T>( this.#data ).prepare()
  
    widget.emitter.listen<IWidgetNode>('ready', ({ emit }) => {

      emit.builder?.emitter.listen<IKatonBuilder<typeof emit>>('ready', () => {

        Object.entries( this.data ).map( ({0: slot, 1 : value }) => this.add( slot, value ) )

        UiMutation( widget.parent as PhysicalWidget, ( mutations ) => {

          mutations.map( mutation => {

            Array.from( mutation.target.childNodes ).map( 
              
              child => this.#payloads.parseNode( child, () =>{} )
              
            )

            this.hydrates()
  
          })
            
        })

  
        widget.widget = widget.parent as PhysicalWidget;

        this.hydrates()
        
      })
      
    });
    
    return widget;
    
  }


  /**
   * 
   * @param affected state's name. Separate the names os states by a space to use serveral.
   */
  watch( affected : string ){

    const split : Array<keyof T> | keyof T = affected.split(' ')

    const watcher = (new StateWatcher( this )).watch( split )

    return watcher;

  }
  
  
  get( slot : keyof T ) : T[ keyof T ]{

    const value = this.#store[ slot as keyof T ];
    
    this.emitter.dispatch('use', {slot, value} )
    
    return value as T[ keyof T ];
    
  }


  set( slot : keyof T, value : T[ keyof T] ){

    this.#data[ slot ] = value;

    return this;
    
  }
  

  add(  slot : keyof T, value : T[ keyof T ] ){

    this.#store[ slot ] = value;

    this.emitter.dispatch('add', {slot, value} )

    return this.#upgrade( slot );
    
  }


  remove(slot: keyof T ): this {

    const storeclone : T = this.#store;
    
    Object.entries( this.#store )
      
      .filter( ({ 0: name }) => name != slot )

      .map( ({ 0: name, 1: value }) => storeclone[ name as keyof T ] = value )

      
    this.#store = storeclone;

    this.emitter.dispatch('remove', {slot} )

    return this;
      
  }


  #upgrade( slot : keyof T ){

    this.#proxy( slot, this.#data[ slot ] )

    this.emitter.dispatch('upgrade', {slot, value : this.#store[ slot ]} )

    return this;
    
  }


  #proxy( slot : keyof T, value ?: any ) {

    const driver = this;
  

    this.#data[ slot ] = value;

    if( typeof this.#data[ slot ] == 'object' ){

      this.#store[ slot ] = ( new Proxy( Object.assign({}, this.#data ), {} ) ) as T[ keyof T ];

      this.emitter.dispatch('proxy:set', { slot } )
            
    }

    else{

      Object.defineProperty(

        this.#data, slot, {

          set( v ){

            driver.#store[ slot ] = v;

            driver.emitter.dispatch('proxy:set', { slot, value : v } )

            driver.emitter.dispatch('change', { slot, value : v } )
            
          },
          
          get(){

            const v = driver.#store[ slot ]

            driver.emitter.dispatch('proxy:get', { slot, value : v } )
            
            return v
            
          }
          
        }

      )
      
    }

    this.emitter.dispatch('proxy', { slot } )
    
    return this;  
    
  }
  

  #nodeContains( node : Node | null){

    return document.querySelector<HTMLBodyElement>('body')?.contains( node );
    
  }
  
  #listeners(){

    this.emitter.listen<IStateData<T>>('change', ({ emit }) => {

      this.hydrate( emit.slot )

    })
    
    return this;
    
  }
  

  hydrate( slots : keyof T | Array<keyof T> ){

    this.#payloads.find( Array.isArray( slots ) ? slots : [ slots ] ).map( payload =>{

      if( this.#nodeContains( payload.node ) ){

        let content = payload.clone.textContent || ''

        Object.entries( payload.slots ).map(({ 1: match }) => {

          const slot = match[1].trim() as keyof T;

          content = (`${ content.replace( match[0], this.#store[ slot ] ) }`)
          
        })

        payload.node.textContent = content

      }

    } )
    
    this.emitter.dispatch('hydrate', { slots } )

    return this;
    
  }
  
  

  hydrates() : this {

    Object.entries( this.#data ).map( ({ 0: slot }) => this.hydrate( slot ) )
    
    this.emitter.dispatch('hydrates', { state : this.#store } )

    return this;

  }
  
  
}





