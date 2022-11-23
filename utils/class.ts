import { AbstractWidget, PhysicalWidget } from "../foundation";


export function cloneClassInstance( instance : object ){

  return Object.assign(

    Object.create(

      Object.getPrototypeOf( instance )
      
    ), 

    instance
    
  )

}

export function isWidgetInstance( i : any ){

  return typeof i == 'object' && (

    i instanceof PhysicalWidget || 
  
    i instanceof AbstractWidget

  );
  

}


export function useTrait( origin : { [ O : string ] : any }, trait : object ){

  Object.entries( trait ).map( ({ 0: prop, 1: value }) => {

    const name = prop as string

    origin[ name ] = value;
    
  })

  return origin;
  
}