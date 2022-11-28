import Builder, { Append } from "./builder"
import { 
  Widget, 
  H1, 
  Paragraph, 
  Textual, 
  Context, 
  H2, 
  // Ref, 
  Style,
  Action,
  UseKit,
  State,
  Row,
  Button,
  Column,
  Input,
  DropdownList,
  Form,
  Attribution,
  Table,
  Picture,
  Center
} from "./widgets"
import Ui from "./ui"
import { 
  IWidgetNode, 
  // IKatonReference,
  IKitTabsSwitchEmitter,
} from "./declarations"
import { PhysicalWidget } from "./foundation"
import { Scrolling, Tabs } from "./kits"




const paragraph = ()=> {

  // let ref : IKatonReference | null = null;

  return Builder(

    Widget(
  
      // Ref( r => ref = r ),
  
      Context(( context )=> context?.addSlot('Hello', 'Boy') ),
      

      
      Scrolling({

        direction : 'vertical',

        controller:{

          infinite: true,

          indicator: Widget(

            Center( Textual('Actualisation...') ).style({
              padding:'2rem 0'
            })

          ),

          refreshing : async( widgets ) => new Promise<boolean>(( done )=>{

            console.log('Refresh pending', widgets )

            setTimeout(()=>{

              done( true )

              console.log('Refresh done')

            }, 3000)
            
          }),

        },

        children: [

          Paragraph(`
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Repellat cum iusto officiis quod maxime, aspernatur ratione, 
            quia architecto, eius qui labore illo inventore qcodexem nobis? 
            Autem, commodi corporis! At, magni!
          `),
    

          Paragraph(`
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Repellat cum iusto officiis quod maxime, aspernatur ratione, 
            quia architecto, eius qui labore illo inventore qcodexem nobis? 
            Autem, commodi corporis! At, magni!
          `),
    

          Paragraph(`
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Repellat cum iusto officiis quod maxime, aspernatur ratione, 
            quia architecto, eius qui labore illo inventore qcodexem nobis? 
            Autem, commodi corporis! At, magni!
          `),
    

          Paragraph(`
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Repellat cum iusto officiis quod maxime, aspernatur ratione, 
            quia architecto, eius qui labore illo inventore qcodexem nobis? 
            Autem, commodi corporis! At, magni!
          `),
    

          Paragraph(`
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Repellat cum iusto officiis quod maxime, aspernatur ratione, 
            quia architecto, eius qui labore illo inventore qcodexem nobis? 
            Autem, commodi corporis! At, magni!
          `),
    

          Paragraph(`
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Repellat cum iusto officiis quod maxime, aspernatur ratione, 
            quia architecto, eius qui labore illo inventore qcodexem nobis? 
            Autem, commodi corporis! At, magni!
          `),
    
        ]

      }).style({
        height: '320px'
      }),
  
      Context(( )=>{

        // console.warn(
        //   'Paragraph Context :', 
        //   context?.slot('Hello'), 
        //   ref?.measure(), 
        // )

      }),
  
    ),
    
  )
  
}


interface MainState {
  
  firstname: string;
  
  lastname: string;

  hello: string;

  checker : boolean;

}

const mystate = State<MainState>({
  firstname: 'first',
  lastname: 'last',
  hello: 'test',
  checker: false
})



const main = ()=>{


  const tabs = Tabs([

        {
          label:'Tab #1',
          default: true,
          children: Widget('Content tab #1')
            .on('click', ()=>{
              tabs.next() 
            })
        },
        
        {
          label:'Tab #2',
          children: Widget('Content tab #2')
            .on('click', ()=>{
              tabs.next() 
            })
        },
        
        {
          label:'Tab #3',
          children: Widget('Content tab #3')
            .on('click', ()=>{
              tabs.next() 
            })
        },
        
        {
          label:'Tab #4',
          children: Widget('Content tab #4')
            .on('click', ()=>{
              tabs.next()
            })
        },
        
        {
          label:'Tab #5',
          children: Widget('Content tab #5')
            .on('click', ()=>{
              tabs.next(  ) 
            })
        },
        
      ])
  
  return Builder<IWidgetNode>(

    Widget(

      // UseAction('click', ({ builder })=>{
      //   // event?.preventDefault()
      //   console.log('Submit form', builder?.widget )
      // }),

      mystate.use(),

      Style({
        backgroundColor: '#cacaca',
        padding: '2rem',
        borderRadius:'2rem',
        // width:'100vmin',
      }),

      Context(( context )=>{
        console.log('The Context', context?.addSlot('Hello', 'World') )
      }),


      tabs.whenemit<IKitTabsSwitchEmitter>('switch', ({ emit })=>{
        console.warn('Switch Tab', emit )
      }),

      
      H1('Sensen Katon', Style({
        fontSize:'15vmin'
      })),

      H2('Framework', 
        UseKit({
          color: '#F90000',
          fontSize:'48px'
        })
      ),

      Textual('{{ firstname }} ', 
        UseKit({
          color: '#777',
          fontSize:'24px'
        })
      ),

      Textual('{{ lastname }}, {{ hello }} ', 
        UseKit({
          color: '#777',
          fontSize:'24px'
        })
      ),

      mystate.watch('checker')
      .widget(( { checker } )=>
        checker == true 
          ? Textual( 'FirstName is Valid', 
            Style({backgroundColor:'green', color:'white', padding:'.4rem'}) ) 
          : Textual( 'FirstName is not valid', 
            Style({backgroundColor:'red', color:'white', padding:'.4rem'}) )
      ),

      paragraph(),

      Textual('License MIT'),

      Form(

        Attribution({
          action:'#',
          method:'post'
        }),
          
        Column(

          Row(
            Input({
              type:'text',
              name:'fullanme'
            })
          ),

          Row(
            Input({
              type:'text',
              rows: 3,
              name:'article',
              kit:{
                input:'outline'
              },
            })
          ),

          Row(
            DropdownList({
              name:'my-choice',
            }).options([
              { label:'choix 1', value:1 },
              { 
                label:'Group', 
                group: [
                  {label:'choix A', value:'A'},
                  {label:'choix B', value:'B'},
                  {label:'choix C', value:'C'},
                ]
              },
              { label:'choix 3', value:'3' },
              { label:'choix 4', value:'4' },
            ]).on('change', (context) =>{
              console.log('Choise changed', context )
            })
          ),

          Button(
            Textual('Fake Button')
          ).style({
            color:'#999',
            cursor:'pointer',
            borderRadius:'.5rem',
            padding:'1rem',
            backgroundColor:'#222',
            margin:'1.5rem 0 0',
            border:'0 solid'
          }),
    
        ),
      
      ).attribution({
        ':submit' : 'message'
      }),
       
      Picture({
        source: 'http://picsum.photos/225/225',
        media:[
          {
            query: 'min-width:960px',
            source: 'http://picsum.photos/800/300',
          }
        ],
        failed: Textual('Image Failed'),
        pending: Textual('Pending...'),
        // pending:'Image en cours de chargement...',
      }),

      Table({
        
        column:[
          [
            {
              name:'status',
              label:'#',
              type:'boolean'
            },
            {
              name:'firstname',
              label:'Nom',
              type:'text'
            },
            {
              name:'lastname',
              label:'Prénom',
              type:'text'
            },
          ]
        ],

        rows:[

          [
            { value: true, colspan: 1},
            { value:'Cater', colspan: 1},
            { value:'Ian', colspan: 1},
          ],

          [
            { value:'Gobou Y. Yannick', colspan: 3},
          ],
          
        ],
        
        footer:[

          [
            { value:'Save', colspan: 2},
            { value:'Edit', colspan: 1},
          ],

          
        ]
        
      }),
      
      
      Context(( context )=>{

        console.warn(
          'Main Context', 
          context?.slot('Hello'),
        )
  
      }),

      triggerAction,

    ),

        
  )
  
}



const triggerAction = Action<PhysicalWidget>('message', ({ builder , event}) =>{

  console.log('triggerAction', builder )

  event?.preventDefault()

  builder?.widget.style({
    backgroundColor:'black',
    color:'#fff',
    borderRadius:'1rem',
  })
  
  mystate.data.checker = !mystate.data.checker
  mystate.set('firstname', 'Carter')
  mystate.data.hello = 'make Sensen\'s Katon'
  mystate.data.lastname = 'Ian'
  
})



Append( main(), Ui.context('#root') )

