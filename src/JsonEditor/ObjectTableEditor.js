import JsonEditor from './JsonEditor'
import JsonHelper from '../JsonHelper'

export default class ObjectTableEditor extends JsonEditor {
  constructor( parms ) {
    super( parms )

    const { value, schema, container, options } = this

    const props = Object.keys( schema.properties )

    this.required = {}

    for ( let prop of schema.required || []) {
      this.required[ prop ] = true
    }

    for ( let prop of props ) {
      if ( !this.required[ prop ]) {
        throw `All properties must be required: ${prop}`
      }
    }

    let propSchema = schema.properties[ props[ 0 ] ]

    const isObject = propSchema.type === 'object'

    this.children = {}

    const table = this.createContainer( 'table' )

    // const numColumns = ( isObject ? Object.keys( propSchema.properties ).length : props.length );
    //
    // const columnWidth = Math.floor( 100 / numColumns ) + '%';
    // for ( let prop of props ) {
    //   const temp = schema.properties[ prop ];
    //   const $ref = temp.$ref;
    //   if ( !$ref || $ref !== propSchema.$ref ) {
    //     throw 'All properties must have the same schema $ref';
    //   }
    // }
    //
    // const colgroup = this.createElement( 'colgroup' );
    // table.appendChild( colgroup );
    // for ( let c = 0; c < numColumns + 1; ++c ) {
    //   let col = this.createElement( 'col' );
    //   colgroup.appendChild( col );
    //   col.style.width = c == 0 ? 1 : columnWidth;
    // }

    const thead = this.createElement( 'thead' )
    table.appendChild( thead )

    let row = this.createElement( 'tr' )
    thead.appendChild( row )

    let cell

    if ( isObject ) {
      cell = this.createElement( 'th' )
      row.appendChild( cell )
      for ( let prop of Object.keys( propSchema.properties )) {
        const childSchema = propSchema.properties[ prop ]
        cell = this.createElement( 'th', childSchema.schema.title || this.unCamelCase( prop ))
        this.setSchemaClasses( cell, childSchema )
        row.appendChild( cell )
      }
    } else {
      const title = propSchema.title
      if ( title ) {
        row.appendChild( this.createElement( 'th' ))
      }
      for ( let prop of props ) {
        const childSchema = schema.properties[ prop ]
        cell = this.createElement( 'th', childSchema.schema.title || this.unCamelCase( prop ))
        this.setSchemaClasses( cell, childSchema )
        row.appendChild( cell )
      }
    }

    const tbody = this.createElement( 'tbody' )
    table.appendChild( tbody )

    if ( isObject ) {
      for ( let prop of props ) {
        this.children[ prop ] = {}
        propSchema = schema.properties[ prop ]
        row = this.createElement(
          'tr',
          this.createElement( 'th', propSchema.title || this.unCamelCase( prop ))
        )
        tbody.appendChild( row )
        const childProps = propSchema.properties
        for ( let childProp of Object.keys( childProps )) {
          cell = this.createElement( 'td' )
          this.setSchemaClasses( cell, childProps[ childProp ])
          row.appendChild( cell )
          const child = JsonHelper.editor({ value: value[ prop ][ childProp ], schema: childProps[ childProp ], container: cell, ...options })
          this.children[ prop ][ childProp ] = child
          child.on( 'change', () => this.handleChange( prop, childProp ))
        }
      }
    } else {
      row = this.createElement( 'tr' )
      const title = propSchema.title
      if ( title ) {
        row.appendChild( this.createElement( 'th', title ))
      }
      tbody.appendChild( row )

      for ( let prop of props ) {
        const propSchema = schema.properties[ prop ]
        cell = this.createElement( 'td' )
        this.setSchemaClasses( cell, propSchema )
        row.appendChild( cell )
        const child = JsonHelper.editor({ value: value[ prop ], schema: propSchema, container: cell, ...options })
        this.children[ prop ] = child
        child.on( 'change', () => this.handleChange( prop ))
      }
    }

    container.appendChild( table )
    container.appendChild( this.errorHolder )
  }

  handleCheckbox( prop, e ) {
    if ( e.target.checked ) {
      this.children[ prop ].setValue( undefined )
      this.holders[ prop ].style.display = ''
    } else {
      this.holders[ prop ].style.display = 'none'
      this.value[ prop ] = this.children[ prop ].getValue()
    }
    this.fire( 'change' )
  }

  handleChange( prop, subProp ) {
    if ( typeof subProp === 'undefined' ) {
      this.value[ prop ] = this.children[ prop ].getValue()
    } else {
      this.value[ prop ][ subProp ] = this.children[ prop ][ subProp ].getValue()
    }

    this.fire( 'change' )
  }

  showErrors( errors ) {
    errors = errors || []
    const path = this.path
    const pathLength = path.length
    let myErrors = []
    let childErrors = {}
    for ( let error of errors ) {
      if ( error.path === path ) {
        myErrors.push( error )
      } else if ( error.path.lastIndexOf( path, 0 ) != -1 ) {
        let prop = error.path.substring( pathLength + 1 )
        let dot = prop.indexOf( '.' )
        if ( dot != -1 ) {
          prop = prop.substring( 0, dot )
        }
        if ( !childErrors[ prop ]) {
          childErrors[ prop ] = []
        }
        childErrors[ prop ].push( error )
      }
    }
    super.showErrors( myErrors )
    for ( let prop of Object.keys( childErrors )) {
      let errors = childErrors[ prop ]
      let child = this.children[ prop ]
      if ( child instanceof JsonEditor ) {
        child.showErrors( errors )
      } else {
        let subErrors = {}
        for ( let error of errors ) {
          let errorPath = error.path
          let subProp = errorPath.substring( `${this.path}.${prop}.`.length )
          if ( !subErrors[ subProp ]) {
            subErrors[ subProp ] = []
          }
          subErrors[ subProp ].push( error )
        }
        for ( let prop of Object.keys( subErrors )) {
          let errors = subErrors[ prop ]
          let editor = child[ prop ]
          if ( editor ) {
            editor.showErrors( errors )
          }
        }
      }
    }
  }
}
