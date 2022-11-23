import { KatonEmitter } from "./emitter";
import type { 
  IKatonContext, 
  IKatonContextStore 
} from "./declarations";



export default class KatonContext implements IKatonContext{


  emitter : KatonEmitter = new KatonEmitter;

  storage : IKatonContextStore = {};

  ready : boolean = false;


  slot<T extends unknown>( name : string ){
    
    const store =  (this.storage[ name ] || undefined) as T

    this.emitter.dispatch('find', { slot : store, name } )

    return store;

  }
  
  addSlot( name : string, value : any ){

    this.storage[ name ] = value;
    
    this.emitter.dispatch('add', { slot : this.storage[ name ] } )

    return this;
    
  }
  
  removeSlot( name : string ){

    const store : IKatonContextStore = {}

    Object.entries( this.storage ).filter( ({ 0: store }) => store != name ).map( ({ 0: slot, 1: value}) => {

      store[ slot ] = value;
      
    } )
    
    this.storage = store;
    
    this.emitter.dispatch('remove', { store } )

    return this;
    
  }
  

  render(): this {

    this.ready = true;
    
    this.emitter.dispatch('render', this )

    return this;
    
  }

}