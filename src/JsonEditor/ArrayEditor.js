/* global document:false */

import JsonEditor from './JsonEditor'
import JsonHelper from '../JsonHelper'

export default class ArrayEditor extends JsonEditor {
  constructor( parms ) {
    super( parms )

    const { value, schema, container } = parms

    this.children = []

    const div = this.createElement( 'div' )

    this.checkboxes = {}
    this.holders = {}

    for ( let prop of Object.keys( schema.properties )) {
      const label = this.createElement( 'label' )
      div.appendChild( label )
      const holder = this.createElement( 'div' )

      this.holders[ prop ] = holder
      holder.setAttribute( 'role', 'property' )

      div.appendChild( holder )
      if ( !this.required[ prop ]) {
        const checkbox = this.createElement( 'input' )
        checkbox.setAttribute( 'type', 'checkbox' )
        label.appendChild( checkbox )
        if ( typeof value[ prop ] != 'undefined' ) {
          checkbox.setAttribute( 'checked', true )
        } else {
          holder.style.display = 'none'
        }

        checkbox.addEventListener( 'change', e => this.handleCheckbox( prop, e ))
        this.checkboxes[ prop ] = checkbox
      }
      const propSchema = schema.properties[ prop ]
      const title = propSchema.title || JsonHelper.unCamelCase( prop )
      label.appendChild( document.createTextNode( title ))


      const description = propSchema.description
      if ( description ) {
        const div = this.createElement( 'div', description )
        div.classList.add( 'description' )
        holder.appendChild( div )
      }
      const child = JsonHelper.create({ value: value[ prop ], schema: propSchema, container: holder })
      if ( !child ) {
        throw 'No child'
      }
      this.children[ prop ] = child
      child.on( 'change', () => this.handleChange( prop ))
    }

    container.appendChild( div )
  }

  handleCheckbox( prop, e ) {
    if ( e.target.checked ) {
      this.children[ prop ].setValue = undefined
      this.holders[ prop ].style.display = ''
    } else {
      this.holders[ prop ].style.display = 'none'
      this.value[ prop ] = this.children[ prop ].getValue()
    }
    this.fire( 'change' )
  }

  handleChange( prop ) {
    this.value[ prop ] = this.children[ prop ].value

    this.fire( 'change' )
  }
}
