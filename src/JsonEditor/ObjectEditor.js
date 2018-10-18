import JsonEditor from './JsonEditor'
import JsonHelper from '../JsonHelper'

export default class ObjectEditor extends JsonEditor {
  constructor( parms ) {
    super( parms )

    const { value, schema, container, path, options } = this

    const props = Object.keys( schema.properties )

    this.children = {}

    const required = {}
    for ( let prop of props ) {
      required[ prop ] = false
    }

    for ( let prop of ( schema.required || [])) {
      required[ prop ] = true
    }

    let titles = {}
    let titleLength = 0
    for ( let prop of props ) {
      const propSchema = schema.properties[ prop ]
      let title = propSchema.title || this.unCamelCase( prop )
      if ( title.length > titleLength ) {
        titleLength = title.length
      }
      titles[ prop ] = title
    }

    this.checkboxes = {}
    this.holders = {}

    const format = schema.format || 'column'

    const propertiesContainer = this.createElement( 'div' )
    propertiesContainer.classList.add( 'jsu-properties' )
    if ( format ) {
      propertiesContainer.classList.add( `jsu-format-${format}` )
    }

    if ( format === 'grid' ) {
      JsonHelper.isDefined( schema.columns, columns => propertiesContainer.style.gridTemplateColumns = columns )
      JsonHelper.isDefined( schema.rows, rows => propertiesContainer.style.gridTemplateRows = rows )
    }

    for ( let prop of props ) {
      const holder = this.createElement( 'div' )
      propertiesContainer.appendChild( holder )
      this.holders[ prop ] = holder
      holder.classList.add( 'jsu-property' )

      const propSchema = schema.properties[ prop ]
      this.setSchemaClasses( holder, propSchema )

      if ( format === 'grid' ) {
        JsonHelper.isDefined( propSchema.column, column => holder.style.gridColumn = column )
        JsonHelper.isDefined( propSchema.row, row => holder.style.gridRow = row )
      }

      const label = document.createElement( 'label' )
      const title = this.createElement( 'div', titles[ prop ])
      title.classList.add( 'jsu-title' )

      if ( required[ prop ] == false ) {
        label.classList.add( 'jsu-optional' )
        const checkbox = document.createElement( 'input' )
        checkbox.setAttribute( 'type', 'checkbox' )
        checkbox.classList.add( 'jsu-optional' )
        label.appendChild( checkbox )
        if ( typeof value[ prop ] != 'undefined' ) {
          checkbox.setAttribute( 'checked', true )
        } else {
          holder.classList.add( 'removed' )
        }

        if ( options.readOnly ) {
          checkbox.setAttribute( 'disabled', true )
        }

        checkbox.addEventListener( 'change', e => this.handleCheckbox( prop, e ))
        this.checkboxes[ prop ] = checkbox

        title.classList.add( 'jsu-optional' )
      }

      label.appendChild( title )
      holder.appendChild( label )

      let description = propSchema.description
      if ( description ) {
        description = this.createElement( 'div', description )
        description.classList.add( 'jsu-description' )
        holder.appendChild( description )
      }

      const child = JsonHelper.editor({ value: value[ prop ], schema: propSchema, container: this.isSimpleType( propSchema.type ) ? label : holder, path: `${path}.${prop}`, required: required[ prop ], ...options })
      if ( this.isSimpleType( propSchema.type )) {
        holder.appendChild( child.errorHolder )
      }

      if ( typeof value[ prop ] === 'undefined' && required[ prop ]) {
        value[ prop ] = child.value
      }

      this.children[ prop ] = child
      child.on( 'change', () => this.handleChange( prop ))
    }

    container.appendChild( propertiesContainer )
  }

  handleCheckbox( prop, e ) {
    const target = e.target
    if ( target.checked ) {
      target.closest( '.jsu-property' ).classList.remove( 'removed' )
      this.value[ prop ] = this.children[ prop ].value
    } else {
      target.closest( '.jsu-property' ).classList.add( 'removed' )
      // this.children[ prop ].setValue( undefined );
      delete this.value[ prop ]
    }

    this.fire( 'change' )
  }

  handleChange( prop ) {
    if ( typeof this.value === 'undefined' ) {
      this.value = {}
    }
    this.value[ prop ] = this.children[ prop ].getValue()

    this.fire( 'change' )
  }

  setValue( value ) {
    if ( typeof value === 'undefined' ) {
      value = {}
    }
    this.value = value
    for ( let prop of Object.keys( this.schema.properties )) {
      this.children[ prop ].setValue( value[ prop ])
    }
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
    for ( let prop of Object.keys( this.children )) {
      this.children[ prop ].showErrors( childErrors[ prop ])
    }
  }
}
