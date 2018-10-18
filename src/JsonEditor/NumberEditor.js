import JsonEditor from './JsonEditor'

export default class NumberEditor extends JsonEditor {
  constructor( parms ) {
    super( parms )

    const { value, schema, container, options, errorHolder } = this

    const feedback = this.createElement( 'div' )
    feedback.classList.add( 'jsu-feedback', `jsu-type-${schema.type}` )
    container.insertBefore( feedback, errorHolder )
    this.feedback = feedback

    const input = this.createElement( 'input' )
    this.setSchemaClasses( input )
    container.insertBefore( input, errorHolder )
    this.input = input

    this.setAttribute( input, 'type', schema.format || 'number' )

    this.setAttribute( input, 'step', schema.multipleOf || 0.01 )

    this.setAttribute( input, 'min', schema.minimum )

    this.setAttribute( input, 'max', schema.maximum )

    if ( options.readOnly ) {
      input.setAttribute( 'readOnly', true )
    }

    let temp = value
    if ( typeof temp === 'undefined' ) {
      temp = schema.default
    }
    if ( typeof temp === 'undefined' ) {
      temp = 0
    }
    this.setAttribute( input, 'value', temp )

    input.addEventListener( 'input', () => this.handleInput())
  }

  setErrors( errors ) {
    const errorHolder = this.errorHolder
    errorHolder.innerHTML = ''
    if ( !errors || !errors.length ) {
      this.holder.classList.remove( 'has-error' )
    } else {
      this.holder.classList.add( 'has-error' )
      for ( let error of errors ) {
        errorHolder.appendChild( this.createElement( 'li', error ))
      }
    }
    this.errors = errors
  }

  handleInput() {
    this.value = Number.parseFloat( this.input.value )
    this.fire( 'change' )
  }

  setValue( value ) {
    this.input.value = value || ''
  }
}
