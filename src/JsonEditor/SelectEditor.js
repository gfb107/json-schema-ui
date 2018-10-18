import JsonEditor from './JsonEditor'

export default class SelectEditor extends JsonEditor {
  constructor( parms ) {
    super( parms )

    const { value, schema, container, options, errorHolder } = this

    const input = this.createElement( 'select' )
    this.setSchemaClasses( input )
    this.input = input

    input.addEventListener( 'change', e => this.handleSelect( e ))

    const choices = schema.oneOf || schema.enum

    let validValue = false
    for ( let choice of choices ) {
      if ( value === choice.const || value == choice ) {
        validValue = true
        break
      }
    }

    if ( !validValue ) {
      let option = this.createElement( 'option' )
      input.appendChild( option )
      option.setAttribute( 'value', value )
      option.setAttribute( 'selected', true )
      option.appendChild( document.createTextNode( 'Please choose...' ))
    }

    for ( let choice of choices ) {
      let option = this.createElement( 'option' )
      input.appendChild( option )
      option.setAttribute( 'value', choice.const || choice )
      option.appendChild( document.createTextNode( choice.title || choice ))
      if ( value === choice.const || value === choice ) {
        option.setAttribute( 'selected', true )
      }
    }
    this.setAttribute( input, 'disabled', options.readOnly )

    container.insertBefore( input, errorHolder )

    const feedback = this.createElement( 'span' )
    feedback.classList.add( 'jsu-feedback', `jsu-type-${schema.type}` )
    this.feedback = feedback
    container.insertBefore( feedback, errorHolder )
  }

  handleSelect( e ) {
    const value = e.target.value
    const type = this.schema.type;
    if ( type === 'integer' ) {
      this.value = Number.parseInt( value )
    } else if ( type === 'number' ) {
      this.value = Number.parseFloat( value )
    } else {
      this.value = value
    }
    this.fire( 'change' )
  }
}
