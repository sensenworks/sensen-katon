import { 
  IKatonGesture, 
  IKatonGestureCallback, 
  IKatonGestureDelta, 
  IKatonGestureInspector, 
  IKatonGesturePayload, 
  IKatonGestureSwipeConfig, 
  IPhysicalWidget, 
  IWidgetListenerCallback, 
  IWidgetListenerConfig, 
  IWidgetListenerContext
} from "./declarations";
import { KatonEmitter } from "./emitter";



export function DetectGestures<T extends IPhysicalWidget>( 
  
  widget : T, 
  
  names : string, 

  callback : IWidgetListenerCallback,
  
){

  const listen = (names.split(' '))

  listen.map( name =>{

    widget.on( name as keyof GlobalEventHandlersEventMap,  ( context )=>{

      callback( context )
      
    })
    
  })
  
  return widget;
  
}


export function DetectStaticGestures<T extends IPhysicalWidget>( 
  
  widget : T, 
  
  names : string, 

  callback : IWidgetListenerCallback,

  config ?: IWidgetListenerConfig,
  
){

  config = config || {}

  config.loop = typeof config.loop ? config.loop : true;

  // console.warn('Config', config )

  const listen = (names.split(' '))

  listen.map( name =>{

    if( widget.element ){

      const evname =  `on${ name }` as keyof typeof widget.element

      // @ts-ignore
      widget.element[ evname ] = (event)=>{

        callback( {

          widget: widget, 
          
          event, 
          
          builder : widget.builder 
        
        } );
        
        if( config && config.loop === false ){

          // @ts-ignore
          widget.element[ evname ] = null;

        }
        
      }
      
    }
    
  })
  
  return widget;
  
}








export class SwipeGesture<T extends IPhysicalWidget> implements IKatonGesture<T>{

  widget : T;

  config : IKatonGestureSwipeConfig = {} as IKatonGestureSwipeConfig
  
  emitter : KatonEmitter = new KatonEmitter()


  #inspector : IKatonGestureInspector = {

    start: false,

    move: false,
    
    stopImmediat: false,

  }

  #delta : IKatonGestureDelta = {

    x: 0,

    y: 0,
    
  }
  
  
  constructor( widget : T, config ?: IKatonGestureSwipeConfig ){

    this.widget = widget;

    this.config = config || {}

    // this.config.direction = this.config.direction || 'vertical';
    
    this.config.loop = typeof this.config.loop ? this.config.loop : true;

  }



  start( callback : IKatonGestureCallback<T> ){

    this.emitter.listen<IKatonGesturePayload<T>>( 'start', ( { emit } )=>{

      callback( {

        gesture : emit.gesture,

        context : emit.context,

        measue : this.widget.measure(),

        delta : emit.delta,
        
      } )
      
    } )

    return this;
    
  }
  



  move( callback : IKatonGestureCallback<T> ){

    this.emitter.listen<IKatonGesturePayload<T>>( 'move', ( { emit } )=>{

      callback( {

        gesture : emit.gesture,

        context : emit.context,

        measue : this.widget.measure(),

        delta : emit.delta,
        
      } )
      
    } )

    return this;
    
  }
  



  end( callback : IKatonGestureCallback<T> ){

    this.emitter.listen<IKatonGesturePayload<T>>( 'end', ( { emit } )=>{

      callback( {

        gesture : emit.gesture,

        context : emit.context,

        measue : this.widget.measure(),

        delta : emit.delta,
        
      } )
      
    } )

    return this;
    
  }
  

  #enter( context : IWidgetListenerContext, measure : IKatonGestureDelta ){

    this.#delta.x = measure?.x || 0;

    this.#delta.y = measure?.y || 0;

    this.emitter.dispatch( 'start', { 
      
      gesture : this, 
      
      context,

      measue : this.widget.measure(),

      delta : { x: 0, y: 0 }
    
    } )

    this.#inspector.start = true;

    this.#inspector.move = false;

    return this;
    
  }
  

  #exit( context : IWidgetListenerContext, measure : IKatonGestureDelta){

    this.widget.removeStyle(['userSelect'])

    this.#inspector.start = false;
    
    this.#inspector.move = false;

    this.emitter.dispatch( 'end', { 
    
      gesture : this, 
      
      context,

      measue : this.widget.measure(),

      delta : { x: (measure?.x || 0) - this.#delta.x, y: (measure?.y || 0) - this.#delta.y }
    
    } )

    this.#delta.x = 0;

    this.#delta.y = 0;

    this.#inspector.stopImmediat = false;
    
    return this;
    
  }
  

  observe(){

    this.#delta = { x: 0, y: 0}

    this.#inspector = {

      start : false,

      move : false,

      stopImmediat : false,
      
    };

    DetectStaticGestures( this.widget, 
        
      'mousedown mouseup mousemove touchstart touchmove touchend mouseleave', 
      
      ( context ) =>{

        const mouse = (context.event as MouseEvent)

        const measure = {

          x : mouse.clientX,

          y : mouse.clientY,
          
        }


        if( context.event.type == 'mousedown' || context.event.type == 'touchstart' ){

          this.#enter( context, measure)
          
        }

        if( 
          
          this.#inspector.start && this.#inspector.stopImmediat == false && (
            
            context.event.type == 'mouseleave' || 

            context.event.type == 'mousemove' || 
          
            context.event.type == 'touchmove'
            
          )
          
        ){


          this.widget.style({ userSelect: 'none' })
  

          if( context.event.type == 'mouseleave' ){

            console.error('Leave this')

            this.#inspector.stopImmediat = true;

            this.#exit( context, measure )

            return;

          }
  

          this.#inspector.move = true;

          this.emitter.dispatch( 'move', { 
            
            gesture : this, 
            
            context,

            measue : this.widget.measure(),

            delta : { x: (measure?.x || 0) - this.#delta.x, y: (measure?.y || 0) - this.#delta.y }
          
          } )

        }

        if( 

          this.#inspector.start && this.#inspector.move && (

            context.event.type == 'mouseup' || 
                
            context.event.type == 'touchend'
          )

        ){

          this.#exit( context, measure )

        }




      },

      {

        loop : this.config.loop 
        
      }

    );


    return this;
    
  }
  
  
}




export default class KatonGesture{

  static Swipe = SwipeGesture;
  
  
}