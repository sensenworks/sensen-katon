import { 
  IDropdownListOption, 
  IDropdownListOptionExtended
} from "./declarations";
import { DropdownOptionGroupWidget, DropdownOptionWidget } from "./foundation-html";



export function ExtendedDropdownListOptions( 
  
  widget : IDropdownListOptionExtended,

  options : IDropdownListOption[]

){

  options.map( option => ExtendedDropdownListOption( widget, option ) )

  return widget;
  
}



export function ExtendedDropdownListOption( 
  
  widget : IDropdownListOptionExtended,

  option : IDropdownListOption

){

  if( !option.group ){

    const child = (new DropdownOptionWidget( option )).prepare();

    widget.content( child )

    child.widgets?.push( widget )

  }
  
  else if( option.group ){

    const child = (new DropdownOptionGroupWidget( option )).prepare();

    widget.content( child )

    child.options( option.group )

  }
  
  return widget;
  
}


