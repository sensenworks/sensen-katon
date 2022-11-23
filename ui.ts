import type { IPhysicalWidget, IUiAssignCallback } from "./declarations";


export default class Ui{

  selector : string | null = null;

  #element : HTMLElement | null = null;
  
  parent : HTMLElement;
  
  constructor( selector : string | null, parent ?: HTMLElement ){

    this.selector = selector || 'body';

    this.parent = parent || document.documentElement;

    this.#element = this.parent.querySelector( this.selector )

  }

  get root(){ return this.#element; }

  get roots(){ return Array.from(this.parent.querySelectorAll<HTMLElement>(`${ this.selector }`)); }

  get exists(){ return this.root instanceof HTMLElement; }

  static context(  selector : string | null, parent ?: HTMLElement ){ 
    
    return new this( selector, parent );

  }

  assign( callback : IUiAssignCallback ){

    this.roots.forEach( e=> callback(e))

    return this;
    
  }
  
}


export function UiMutation( 
  
  widget : IPhysicalWidget | null, 
  
  callback : MutationCallback,

  initier ?: MutationObserverInit | undefined
  
){

  if( widget && widget.element ){

    const make = (new MutationObserver( callback ));
    
    make.observe( widget.element, initier || {

      childList: true,

      subtree: true,

      attributeOldValue: true,

    });
    
    return make;
    
  }

  return undefined;
  
}

