
import { AbstractWidget, PhysicalWidget } from "./foundation";
import KatonProps from "./props";
import type { 
  IAbstractWidget,
  IStyleDeclaration,
  IHeadlingWidget,
  IPhysicalWidget, 
  IWidgetChildren,
  IAttribution,
  IInputProps,
  IAttributesObject,
  IDropdownListProps,
  IDropdownListOption,
  IDropdownListOptionGroup,
  IDropdownListOptionExtended,
  ITableProps,
  ITableSectionWidget,
  ITableRowWidget,
  ITableCellWidget,
  ITableFragmentWidget,
  ITableRows,
  IAttributionProps,
  ITableColumns,
  IPictureProps
} from "./declarations";
import { defineElement } from "./elements";
import { 
  KatonElementHeadlingBig, 
  KatonElementHeadlingBigger, 
  KatonElementHeadlingMedium, 
  KatonElementHeadlingSmall, 
  KatonElementHeadlingSmaller 
} from "./elements-html";
import { VisualKitStyle } from "sensen-visualkit";
import MetricRandom from "sensen-metric-random";
import useVisualKit from "sensen-visualkit/index";
import KatonAttribution, { AttributesObject } from "./attribution";
import { 
  ExtendedDropdownListOption, 
  ExtendedDropdownListOptions 
} from "./extended";
import { FragmentedBuilder } from "./builder";




export class HeadlingWidget extends PhysicalWidget implements IHeadlingWidget{

  name ?: string = 'kt-h';
  
  children : IWidgetChildren[] = [];

  constructor( children : IWidgetChildren[] ){

    super( children );

    this.children = children;

    this.emitter.listen<typeof this>('render', ()=>{
      
      this.styling()

    })

  }

  styling(){

    return this;

  }
  
}

export class HeadlingBiggerWidget extends HeadlingWidget implements IHeadlingWidget{

  name ?: string = 'kt-h1';
  
  styling(){

    useVisualKit( this.element ).define({
      
      display: 'block',

      fontSize: '36px',
      
    }).use('kat-h1')

    return this;

  }
  
}

export class HeadlingBigWidget extends HeadlingWidget implements IHeadlingWidget{

  name ?: string = 'kt-h2';
  
  styling(){

    useVisualKit( this.element ).define({
      
      display: 'block',

      fontSize: '32px',
      
    }).use('kat-h2')

    return this;

  }
  
}

export class HeadlingMediumWidget extends HeadlingWidget implements IHeadlingWidget{

  name ?: string = 'kt-h3';
  
  styling(){

    useVisualKit( this.element ).define({
      
      display: 'block',

      fontSize: '28px',
      
    }).use('kat-h3')

    return this;

  }
  
}

export class HeadlingSmallWidget extends HeadlingWidget implements IHeadlingWidget{

  name ?: string = 'kt-h4';
  
  styling(){

    useVisualKit( this.element ).define({
      
      display: 'block',

      fontSize: '24px',
      
    }).use('kat-h4')

    return this;

  }
  
}

export class HeadlingSmallerWidget extends HeadlingWidget implements IHeadlingWidget{

  name ?: string = 'kt-h5';
  
  styling(){

    useVisualKit( this.element ).define({
      
      display: 'block',

      fontSize: '20px',
      
    }).use('kat-h5')

    return this;

  }
  
}

export class ParagraphWidget extends PhysicalWidget implements IPhysicalWidget{

  name ?: string = 'p';
  
}

export class TextualWidget extends PhysicalWidget implements IPhysicalWidget{

  name ?: string = 'span';
  
}

export class UListWidget extends PhysicalWidget implements IPhysicalWidget{

  name ?: string = 'ul';
  
}

export class LiWidget extends PhysicalWidget implements IPhysicalWidget{

  name ?: string = 'li';
  
}

export class StrongTextWidget extends PhysicalWidget implements IPhysicalWidget{

  name ?: string = 'b';
  
}

export class FormWidget extends PhysicalWidget implements IPhysicalWidget{

  name ?: string = 'form';
  
}

export class InputWidget extends PhysicalWidget implements IPhysicalWidget{

  name ?: string = 'input';

  props?: KatonProps<IInputProps> = undefined;

  constructor( props : IInputProps ){

    super( [] )

    this.props = new KatonProps( props )
    
  }


  prepare(): this {

    const rows = this.props?.get('rows');

    this.name = ( rows ) ? 'textarea' : this.name;
    
    super.prepare();

    this.make();

    return this;
    
  }


  make(){

    const props = this.props?.mutate<IAttributesObject>();

    if( props ){

      Object.entries( AttributesObject( props ) ).map(({ 0: slot, 1: value }) => {

        value = typeof value == 'boolean' 
          
          ? ( value ? slot : `${ value }`)

          : `${ value }`
          
        this.element?.setAttribute( slot, `${ value }`)

      })

    }

    return this;
    
  }
  
  
}

export class DropdownListWidget extends PhysicalWidget 
  implements IPhysicalWidget, IDropdownListOptionExtended{


  name ?: string = 'select';

  jumplist : Array<string> = ['options']
  
  widgets ?: Array<DropdownOptionWidget> = [] 
  
  props?: KatonProps<IDropdownListProps> = undefined;
  

  constructor( props : IDropdownListProps ){

    super( [] )

    this.props = new KatonProps( props )
    
  }


  prepare(): this {

    super.prepare();

    this.make();

    if( this.props?.data.options ){

      this.options( this.props?.data.options )

    }
    
    return this;
    
  }

  make(){

    const props = this.props?.mutate<IAttributesObject>();

    if( props ){

      Object.entries( AttributesObject( props ) ).map(({ 0: slot, 1: value }) => {

        if( !this.jumplist.includes( slot ) ){

          value = typeof value == 'boolean' 
            
            ? ( value ? slot : `${ value }`)

            : `${ value }`
            
          this.element?.setAttribute( slot, `${ value }`)

        }

      });

    }

    return this;
    
  }


  options( options ?: IDropdownListOption[] ){

    const _options = ( options || this.props?.data.options || [] ) as IDropdownListOption[]

    ExtendedDropdownListOptions( this, _options )

    return this;
    
  }

  option( option : IDropdownListOption ){

    ExtendedDropdownListOption( this, option )

    return this;
    
  }


}

export class DropdownOptionWidget extends PhysicalWidget 
  implements IPhysicalWidget, IDropdownListOptionExtended{

  name ?: string = 'option';
  
  props?: KatonProps<IDropdownListOption> = undefined;
  
  widgets ?: Array<IDropdownListOptionExtended> = [] 
  
  jumplist : Array<string> = ['group']
  

  constructor( props : IDropdownListOption ){

    super( [] )

    this.props = new KatonProps( props )
    
  }


  prepare(): this {

    super.prepare();

    this.make();

    return this;
    
  }


  make(){

    const props = this.props?.mutate<IAttributesObject>();

    if( props ){

      Object.entries( AttributesObject( props ) ).map(({ 0: slot, 1: value }) => {

        if( !this.jumplist.includes( slot ) ){

          value = typeof value == 'boolean' 
            
            ? ( value ? slot : `${ value }`)

            : `${ value }`
            
          this.element?.setAttribute( slot, `${ value }`)

        }

      });

    }

    return this;
    
  }

  options( options ?: IDropdownListOption[] ){

    if( options ){

      ExtendedDropdownListOptions( this, options )

    }
    
    return this;
    
  }

  option( option : IDropdownListOption ){

    ExtendedDropdownListOption( this, option )

    return this;
    
  }

}

export class DropdownOptionGroupWidget extends DropdownOptionWidget 
  implements IPhysicalWidget, IDropdownListOptionExtended{

  name ?: string = 'optgroup';
  
  props?: KatonProps<IDropdownListOptionGroup> = undefined;
  
  widgets ?: Array<DropdownOptionWidget> = [] 
  
  jumplist : Array<string> = ['group']
  

  constructor( props : IDropdownListOptionGroup ){

    super( props )

    this.props = new KatonProps( props )
    
  }

  prepare(): this {

    super.prepare();

    this.make();

    return this;
    
  }

}


export class ButtonWidget extends PhysicalWidget implements IPhysicalWidget{

  name ?: string = 'button';
  
}


export class VisualKitWidget extends AbstractWidget implements IAbstractWidget{

  props ?: KatonProps<IStyleDeclaration> | undefined = undefined;

  constructor( props ?: IStyleDeclaration ){

    super( props )

    this.props = new KatonProps( props || {} );

    this.listener('render', ()=>{ 

      this.builder?.emitter.listen('ready', ()=>{

        this.make()
        
      })
      
     })

  }

  make(){
    
    if( this.parent instanceof PhysicalWidget && this.parent.element ){

    useVisualKit( this.parent.element )
    
      .define( this.props?.all() || {} )
      
      .use().append()

    }

    return this;
    
  }
  
  
  
}


export class StyleWidget extends AbstractWidget implements IAbstractWidget{

  props ?: KatonProps<IStyleDeclaration> | undefined = undefined;

  #dom : HTMLStyleElement | null = null;

  selector : string = '';

  attribution : IAttribution | null = null;

  constructor( props ?: IStyleDeclaration ){

    super( props )

    this.props = new KatonProps( props || {} );

    this.#dom = document.createElement('style')

    this.selector = MetricRandom.CreateAplpha( 16 ).join('')

  }

  prepare(): this {
    
    this.#dom?.setAttribute('type', 'text/css');

    this.#dom?.setAttribute('kat:kit:respository', `${ this.selector }`);

    this.emitter.dispatch('prepare', this )

    return this;
    
  }

  remove(){

    this.#dom?.remove();

    this.emitter.dispatch('remove', this )

    return this;
      
  }

  render(): this {

    if( this.parent instanceof PhysicalWidget && this.#dom ){

      const declarations = this.props?.all();

      const computed = VisualKitStyle.parse( declarations || {} ).join('')


      this.#dom.append(`[kat\\:kit~="${ this.selector }"] { ${ computed } }`)

      this.parent.element?.prepend( this.#dom );

      this.attribution = (new KatonAttribution( this.parent.element ))
        
        .sync('kat:kit')

        .add( this.selector )

        .link()

      ;

    }

    this.emitter.dispatch('render', this )

    return this;

  }
  
}





export class TableFragmentWidget extends PhysicalWidget implements ITableFragmentWidget{

  element : HTMLElement | null = null;
  
  children : IWidgetChildren[] = [];
  
  constructor( children : IWidgetChildren[] ){

    super( children );

    this.children = children;
    
  }

  prepare(): this {
      
    super.prepare()

    this.process()
    
    return this;
    
  }
  
  process() : this{
    
    return this;
    
  }

}
  
export class TableRowWidget extends TableFragmentWidget implements ITableRowWidget{
  
  name ?: string = 'tr';

  element : HTMLTableRowElement | null = null;

  children : IWidgetChildren[] = [];
  
  constructor( children : IWidgetChildren[] ){

    super( children );

    this.children = children;
    
  }

  process() : this{
    
    return this;
    
  }

}

export class TableCellWidget extends TableFragmentWidget implements ITableCellWidget{
  
  name ?: string = 'td';

  element : HTMLTableCellElement | null = null;

  children : IWidgetChildren[] = [];
  
  constructor( children : IWidgetChildren[] ){

    super( children );

    this.children = children;
    
  }

  process() : this{
    
    return this;
    
  }
  
}


export class TableSectionWidget extends TableFragmentWidget implements ITableSectionWidget{
  
  name ?: string = '';

  element : HTMLTableSectionElement | null = null;

  children : IWidgetChildren[] = [];
  
  constructor( children : IWidgetChildren[] ){

    super( children );

    this.children = children;
    
  }

  process() : this{
    
    return this;
    
  }
  
}


export class TableHeadWidget extends TableSectionWidget implements ITableSectionWidget{
  
  name ?: string = 'thead';

  children : IWidgetChildren[] = [];
  
  constructor( children : IWidgetChildren[] ){

    super( children );

    this.children = children;
    
  }

  process() : this{
    
    return this;
    
  }
  
}

export class TableBodyWidget extends TableSectionWidget implements ITableSectionWidget{
  
  name ?: string = 'tbody';

  children : IWidgetChildren[] = [];
  
  constructor( children : IWidgetChildren[] ){

    super( children );

    this.children = children;
    
  }

  process() : this{
    
    return this;
    
  }
  
}

export class TableFootWidget extends TableSectionWidget implements ITableSectionWidget{
  
  name ?: string = 'tfoot';

  children : IWidgetChildren[] = [];
  
  constructor( children : IWidgetChildren[] ){

    super( children );

    this.children = children;
    
  }

  process() : this{
    
    return this;
    
  }
  
}

export class TableWidget extends PhysicalWidget implements IPhysicalWidget{

  props?: KatonProps<ITableProps> | undefined;

  name ?: string = 'table';
  
  head : ITableSectionWidget | null = null;

  body : ITableSectionWidget | null = null;

  foot : ITableSectionWidget | null = null;


  constructor( props: ITableProps ){

    super([]);

    this.props = new KatonProps( props || {} );
    
  }


  prepare(): this {
      
    super.prepare()
    
    this.head = ( new TableHeadWidget([])).prepare();

    this.body = ( new TableBodyWidget([]) ).prepare();

    this.foot = ( new TableFootWidget([]) ).prepare();
    

    this.pushToRender( 

      this.head, 
      
      this.body, 
      
      this.foot,
      
    );
    
    this.attribution({ kit:{ table:'default' } })

    return this;
    
  }
  
  render() : this{

    super.render();

    this.parseColumns().parseRows().parseFoot()

    
    return this;
    
  }


  parseColumns(){

    const columns = this.props?.get<ITableColumns[]>('column')
    
    columns?.map( column => {

      const line : IWidgetChildren[] = []

      column.map( data => {

        const a : IAttributionProps = {}

        if( data.colspan ){ a['colspan'] = `${ data.colspan }` }

        if( data.rowspan ){ a['colspan'] = `${ data.rowspan }` }
        
        a.table = { column: `${ data.type || 'text' }` }
        
        line.push(

          ( new TableCellWidget([

            (new TextualWidget([ data.label ])).prepare()

          ])).prepare().attribution( a )
          
        )

      })

      const r = (new TableRowWidget(line)).prepare()
      
      this.head?.content( r );

    })
    

    return this;
    
  }
  


  parseRows(){

    const rows = this.props?.get<ITableRows[]>('rows')
    
    rows?.map( row => {

      const line : IWidgetChildren[] = []

      row.map( data => {

        const a : IAttributionProps = {}

        if( data.colspan ){ a['colspan'] = `${ data.colspan }` }

        if( data.rowspan ){ a['colspan'] = `${ data.rowspan }` }
        
        a.table = { cell: `body` }
        
        line.push(

          ( new TableCellWidget([

            (new TextualWidget([ this.parseCellValue(data.value) ])).prepare()

          ])).prepare().attribution( a )
          
        )

      })

      const r = (new TableRowWidget(line)).prepare()
      
      this.body?.content( r );

    })
    
    return this;
    
  }
  
  

  parseFoot(){

    const footers = this.props?.get<ITableRows[]>('footer')
    
    footers?.map( footer => {

      const line : IWidgetChildren[] = []

      footer.map( data => {

        const a : IAttributionProps = {}

        if( data.colspan ){ a['colspan'] = `${ data.colspan }` }

        if( data.rowspan ){ a['colspan'] = `${ data.rowspan }` }
        
        a.table = { cell: `foot` }
        
        line.push(

          ( new TableCellWidget([

            (new TextualWidget([ this.parseCellValue(data.value) ])).prepare()

          ])).prepare().attribution( a )
          
        )

      })

      const r = (new TableRowWidget(line)).prepare()
      
      this.foot?.content( r );

    })
    
    return this;
    
  }
  


  parseCellValue( data : any ){

    if( data instanceof PhysicalWidget ){

      return data;
      
    }

    return `${ data }`
    
  }
  
  
}





export class PictureWidget extends PhysicalWidget implements IPhysicalWidget{

  name?: string | undefined = 'picture';

  props?: KatonProps<IPictureProps> | undefined = undefined

  element: HTMLPictureElement | null = null;
  
  #pendingElement ?: HTMLElement | null = null;

  #failedElement ?: HTMLElement | null = null;

  source ?: HTMLImageElement | null = null;

  sources ?: Array<HTMLSourceElement> = []
  
  constructor( props : IPictureProps ){

    super([])

    this.props = new KatonProps( props )
    
  }


  prepare(): this {

    super.prepare();

    this.#pendingElement = document.createElement('div');

    this.#failedElement = document.createElement('div');

    this.source = document.createElement('img');

    this.source.style.display = 'none'

    this.sources = []
      
    this.append( this.#pendingElement, this.#failedElement, this.source, )

    return this;
    
  }
  

  pending(){

    if( this.props?.data.pending ){

      if( this.builder ){

        if( this.props.data.pending instanceof PhysicalWidget  ){

          FragmentedBuilder( this.builder, this.props.data.pending, this )

          if( this.props.data.pending.element ){
            
            this.#pendingElement?.append( this.props.data.pending.element )

          }

        }

        else if( typeof this.props.data.pending && this.#pendingElement ){

          this.#pendingElement.innerHTML = `${ this.props.data.pending }`
          
        }

      }
      

    }

    return this;
    
  }


  #loaded(){

    this.#failedElement?.remove()

    this.#pendingElement?.remove()

    this.emitter.dispatch('load', this )

    if( this.source ){ this.source.style.removeProperty('display') }
    
    return this;
    
  }
  
  #unloaded(){

    this.#pendingElement?.remove()
    
    if( this.source ){ this.source.style.display = 'none' }

    if( this.props?.data.failed ){

      if( this.builder ){

        if( this.props.data.failed instanceof PhysicalWidget  ){

          FragmentedBuilder( this.builder, this.props.data.failed, this )

          if( this.props.data.failed.element ){
            
            this.#failedElement?.append( this.props.data.failed.element )

          }

        }

        else if( typeof this.props.data.failed && this.#failedElement ){

          this.#failedElement.innerHTML = `${ this.props.data.failed }`
          
        }

      }
      
    }

    this.emitter.dispatch('error', this )

    return this;
    
  }


  
  sourceListener( element : HTMLElement | null | undefined ){

    element?.addEventListener('load', ()=> this.#loaded())

    element?.addEventListener('error', ()=> this.#unloaded())

    return this;
    
  }
  

  medias(){

    if( this.props?.data.media ){

      this.props.data.media.map( ({ query, source }) =>{

        const element = document.createElement('source')

        this.sourceListener( element )

        element.setAttribute('media', `(${ query })`)

        element.setAttribute('srcset', `${ source }`)

        this.sources?.push( element )
    
        this.element?.prepend( element )
        
      })
      
    }
    
    return this;
    
  }
  
  
  render(): this {

    super.render()

    this.pending()

    .medias()
    
    .sourceListener( this.source )

    .source?.setAttribute('src', `${ this.props?.data.source }`)
    
    return this;
    
  }
  
}


defineElement('kt-h1', KatonElementHeadlingBigger )
defineElement('kt-h2', KatonElementHeadlingBig )
defineElement('kt-h3', KatonElementHeadlingMedium )
defineElement('kt-h4', KatonElementHeadlingSmall )
defineElement('kt-h5', KatonElementHeadlingSmaller )

