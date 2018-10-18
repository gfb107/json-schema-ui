/* global document:false */

import JsonEditor from './JsonEditor'

export default class MultiSelectCheckboxes extends JsonEditor {
  constructor( parms ) {
    super( parms )

    const { value, schema, container, options } = this

    const div = this.createContainer()
    div.classList.add( 'multi-select-checkboxes' )

    const itemSchema = schema.items

    const choices = itemSchema.enum || itemSchema.oneOf

    this.checkboxes = []

    let length = 0
    for ( let choice of choices ) {
      choice = choice.title || choice
      if ( choice.length > length ) {
        length = choice.length
      }
    }
    length = Math.floor( length / 2 ) + 1.5
    let width = length + 'em'

    for ( let choice of choices ) {
      const label = document.createElement( 'label' )
      div.appendChild( label )
      label.style.width = width

      const checkbox = document.createElement( 'input' )
      checkbox.setAttribute( 'type', 'checkbox' )
      label.appendChild( checkbox )
      label.appendChild( document.createTextNode( choice.title || choice ))

      if ( value.indexOf( choice.const || choice ) != -1 ) {
        checkbox.setAttribute( 'checked', true )
      }

      if ( options.readOnly ) {
        checkbox.setAttribute( 'disabled', true )
      }

      checkbox.addEventListener( 'change', () => this.handleCheckbox())
      this.checkboxes.push( checkbox )
    }

    const errorHolder = this.createElement( 'ul' )
    errorHolder.classList.add( 'errors' )
    this.errorHolder = errorHolder

    container.appendChild( div )

    container.appendChild( errorHolder )
  }


  handleCheckbox() {
    const itemsSchema = this.schema.items

    const choices = itemsSchema.enum || itemsSchema.oneOf.map( s => s.const )

    this.value = []
    for ( let c = 0; c < choices.length; ++c ) {
      if ( this.checkboxes[ c ].checked ) {
        this.value.push( choices[ c ])
      }
    }

    this.fire( 'change' )
  }
}
