import { KatonEmitter } from "./emitter";
import { IKatonElement } from "./declarations";


export default class KatonElement extends HTMLElement implements IKatonElement{

  emitter : KatonEmitter = new KatonEmitter();
  
  constructor(){
    
    super();

  }
  
  connectedCallback(){

    this.emitter.dispatch('connected', this );
    
  }
  
  adoptedCallback(){

    this.emitter.dispatch('adopted', this );
    
  }
  
  disconnectedCallback(){

    this.emitter.dispatch('disconnected', this );
    
  }
  
}

export function defineElement( 
  
  name : string, 
  
  constructor: CustomElementConstructor, 
  
  options?: ElementDefinitionOptions | undefined 
  
){

  const element = customElements.get( name )

  if( !element ){

    customElements.define( name, constructor, options )

    return constructor;
    
  }

  return element;
  
}

defineElement('kt-layer', KatonElement )