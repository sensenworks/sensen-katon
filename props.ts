import { KatonEmitter } from "./emitter";
import type { 
  IKatonProps, 
  IKatonPropsInstance 
} from "./declarations";


export default class KatonProps<T extends IKatonProps> implements IKatonPropsInstance<T>{

  emitter : KatonEmitter = new KatonEmitter;

  #storage : T = {} as T;

  get data(){ return this.#storage }

  constructor( props : T ){

    this.#storage = props;

  }
  
  get<V extends T[ keyof T ]>( name : keyof T ){
    
    const store =  (this.#storage[ name ] || undefined) as V

    this.emitter.dispatch('get', { slot : store } )

    return store;

  }
  
  add( name : keyof T, value : any ){

    this.#storage[ name ] = value;
    
    this.emitter.dispatch('add', { slot : this.#storage[ name ] } )

    return this;
    
  }

  all() { return this.#storage; }

  mutate<Remix extends IKatonProps>(){

    const remix : Remix = {} as Remix

    Object.entries( this.#storage )
    
      .map( ({0 : name, 1 : value}) => remix[ name as keyof Remix ] = value )
    
    return remix
    
  }
  
  remove( name : string ){

    const store : T = {} as T

    Object.entries( this.#storage ).filter( ({ 0: store }) => store != name ).map( ({ 0: slot, 1: value}) => {

      store[ slot as keyof T ] = value;
      
    } )
    
    this.#storage = store;
    
    this.emitter.dispatch('remove', { store } )

    return this;
    
  }
  
}