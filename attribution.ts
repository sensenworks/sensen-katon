import type { 
  IAttributesObject, 
  IAttributesObjectValues, 
  IAttributesParsed, 
  IAttribution
} from "./declarations";
import { KatonEmitter } from "./emitter";




/**
 * 
 * @param value Attribute Object
 */
export function AttributesObjectValues( value : IAttributesObjectValues ){

    let parsed = value;

    if( typeof value == 'object' && value ){

        parsed = JSON.stringify( value )
        
    }

    return parsed;
    
}


/**
 * 
 * @param attributes Attribute Object
 * @param ns namespace
 */
export function AttributesObject( 
  
  attributes : IAttributesObject, 
  
  ns ?: string | undefined,

  separator ?: string | undefined
    
){

    const nms = ( ns ? `${ ns }${ separator || '-'}` : '' );

    let output : IAttributesParsed = {}
    

    Object.entries( attributes ).map( ({ 0 : name, 1 : value }) => {

        if( typeof value == 'object' && value ){

          if( Array.isArray( value ) ){

            output[ `${ nms }${ name }` ] = `${ AttributesObjectValues( value ) }`;
          
          }

          else{

            output =  {
                
                ...output, 
                
                ...AttributesObject( value , `${ nms }${ name }` ) 

            }

          }
          
        }

        else if( typeof value != 'undefined' ){

          output[ `${ nms }${ name }` ] = `${ AttributesObjectValues( value ) }`;
          
        }
        
    })
    
    return output;
    
}




 
export default class KatonAttribution implements IAttribution{


  #entries : string[] = [];
  
  #element : HTMLElement | null = null;

  attributeName : string = ''

  emitter : KatonEmitter = new KatonEmitter()


  get entries(){ return this.#entries; }

  get value(){ return this.#entries.filter( value => value.trim().length ).join(' ').trim(); }


  constructor( element : HTMLElement | null, attributeName : string = '' ){

    this.#element = element;

    this.attributeName = attributeName;

    this.sync( this.attributeName );
    
  }


  sync( attributeName ?: string ){

    this.attributeName = attributeName || this.attributeName;

    (this.#element?.getAttribute(`${ this.attributeName }`)||'').split(' ')

    .filter( value => value.trim().length )
    
    .map( value => this.add(`${ value.trim() }`))

    this.emitter.dispatch('sync', { entries : this.#entries })
    
    return this;
    
  }


  add( value : string ){

    if( !this.contains( value ) ){

      this.#entries.push( value )

      this.emitter.dispatch('add', { added : value })
    
    }

    return this;
    
  }
  

  remove( value : string ){

    this.#entries = this.#entries.filter( entry => entry != value );

    this.emitter.dispatch('remove', { removed : value })
    
    return this;
    
  }


  replace( older : string, value : string ){

    this.remove( older ).add( value )
    
    this.emitter.dispatch('replace', { older, newer : value })
    
    return this;
    
  }


  contains( value : string ){

    return this.#entries.includes( value, 0 )
    
  }
  

  link(){

    this.#element?.setAttribute( this.attributeName , `${ this.value }`)

    this.emitter.dispatch('link', this )
    
    return this;

  }
  

  unlink( attributes ?: string | string[] ){

    if( attributes ){
      
      if( Array.isArray( attributes ) ){ attributes.map( attribute => this.remove( attribute ) ); }

      this.#element?.setAttribute( this.attributeName , `${ this.value }`)

      this.emitter.dispatch('unlink', { value : attributes || this.value })
    
    }

    else{

      this.#element?.removeAttribute( this.attributeName  )
      
      this.emitter.dispatch('unlinks', this )
    
    }

    return this;

  }



  // static Widget( props?: IAttributesObject | undefined ){

  //   return new AttributionWidget( props )
    
  // }



}

