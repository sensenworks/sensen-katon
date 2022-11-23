
/**
 * Sensen Emitter
 */

 export type KatonEmitterType = string

 export type KatonEmitterArguments<T> = {
      
   emit: T;
   
   type : string;
      
 }
  
 export type KatonEmitterCallback<T> = ((arg: KatonEmitterArguments<T>) => Promise< T | KatonEmitterArguments<T> > | boolean | void)
  
 export type KatonEmitterError = {
 
   code: number;
 
   message: string;
      
 }
  
  export type KatonEmitterErrorCallback = ((arg: KatonEmitterError) => void)
  
  export type KatonEmitterEntries = {
  
   [K: KatonEmitterType] : KatonEmitterCallback<any>[] 
  
 }
  
 export type EmitterDispatcherProps<T> = {
       
   instance : IKatonEmitter, 
   
   type : KatonEmitterType, 
   
   args: any,
   
   callback: KatonEmitterCallback<T>,
   
   resolve? : KatonEmitterCallback<T>,
   
   reject? : (err : KatonEmitterErrorCallback ) => void,
 
 }
   
 
 export interface IKatonEmitter{
 
   entries: KatonEmitterEntries
 
   listener: KatonEmitterType[]
 
   dispatcher: KatonEmitterType[]
 
   returned?: any
 
 
   listen: <T>(type : KatonEmitterType, callback : KatonEmitterCallback<T>) => this;
 
   dispatch : <T>(
 
       type : KatonEmitterType,
       
       args : {}, 
       
       resolve? : KatonEmitterCallback<T>,
       
       reject? : (err : KatonEmitterErrorCallback ) => void
 
   ) => this;
 
   resolveDispatcher?: <T>(args :  EmitterDispatcherProps<T>) => (boolean | Promise<void> | IKatonEmitter);
   
 }
 
   
  /**
   * Sensen Event Emitter Response
   */
 export function EmitterResponse<T>(type: string, emit: any) : KatonEmitterArguments<T>{
 
   return { type, emit }
   
 }
  
 
 
 /**
 * Sensen Event Emitter
 */
 export class KatonEmitter implements IKatonEmitter{
 
 
   entries: KatonEmitterEntries
 
   listener: KatonEmitterType[]
 
   dispatcher: KatonEmitterType[]
 
   returned?: any
   
 
 
   constructor(){
 
       this.entries = {};
 
       this.listener = [];
 
       this.dispatcher = [];
           
   }
 
 
 
 
   reset(type ?: KatonEmitterType){
 
       if(type){
 
           if(type in this.entries){
 
               this.entries[type] = [];
 
           }
           
       }
 
       else{ this.entries = {}; }
       
       return this;
       
   }
 
 
 
 
   /**
   * Listener
   */
   listen<T>(type : KatonEmitterType, callback : KatonEmitterCallback<T>){
 
       this.entries = this.entries || {};
 
       if(this.listener.indexOf(type) == -1){
 
           this.listener[this.listener.length] = type;
 
       }
 
       if(typeof type == 'string' && typeof callback == 'function'){
 
           this.entries[type] = Array.isArray(this.entries[type]) ? this.entries[type] : [];
 
           this.entries[type].push(callback);
 
       }
 
       return this;
       
   }
 
 
 
 
 
   /**
   * Dispatcher
   */
   dispatch<T>(
       
       type : KatonEmitterType,
       
       args : {}, 
       
       resolve? : KatonEmitterCallback<T>,
       
       reject? : (err : KatonEmitterErrorCallback ) => void
 
   ){
       
 
       if(this.dispatcher.indexOf(type) == -1){
 
           this.dispatcher[this.dispatcher.length] = type;
           
       }
       
       
       if(typeof type == 'string'){
           
           if(type in this.entries){
 
               if(this.entries[type] instanceof Array){
 
                   this.entries[type].map((entry)=>{
 
                       if(entry instanceof Function){
 
                           KatonEmitter.resolveDispatcher<T>({
                               
                               instance : this, 
                               
                               type, 
                               
                               callback: entry, 
                               
                               args, 
                               
                               resolve, 
                               
                               reject,
 
                           })
 
                       }
 
                   });
                   
               }
               
           }
           
       }
       
       return this;
 
   }
 
 
 
 
 
   static resolveDispatcher<T>({
       
       instance, 
       
       type, 
       
       args,
       
       callback,
       
       resolve,
       
       reject,
 
   } : EmitterDispatcherProps<T>){
 
       const $args : KatonEmitterArguments<T> = {
 
           emit: args,
           
           type,
 
       }
 
       const applied = callback.apply(instance, [$args]);
 
   
       /**
       * Promise
       */
       if(applied instanceof Promise){
 
           return applied.then(response=>{
 
               if(typeof resolve == 'function'){ 
                   
                   resolve( EmitterResponse<T>(type, response) ) 
 
               }
 
           }).catch(err=>{
 
               if(typeof reject == 'function'){ reject(err) }
 
           });
 
           
       }
 
       else if(typeof applied == 'boolean'){
 
           return applied;
           
       }
 
       else{
 
           return this;
           
       }
                       
   }
   
   
   
 
   
 }
 