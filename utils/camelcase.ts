

export function uncamelize( value : string ){

  return value.replace( /([A-Z])/g, `-$&`).toLowerCase();

}


export function camelize( value : string ){

  return value.replace( /(?:^\w|[A-Z]|\b\w)/g, (text, index) =>

    index === 0 ? text.toLowerCase() : text.toUpperCase()
    
  ).replace( /\s+/g, '' );

}
