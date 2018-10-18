import JsonEditor from './JsonEditor'

export default class StringEditor extends JsonEditor {
  constructor( parms ) {
    super( parms )

    const { value, schema, container, options, errorHolder } = this

    const format = schema.format

    const input = this.createElement( format === 'textarea' ? 'textarea' : 'input' )
    this.setSchemaClasses( input )
    this.input = input
    if ( !format ) {
      input.setAttribute( 'type', format || 'text' )
    } else if ( format !== 'textarea' ) {
      input.setAttribute( 'type', format )
    }

    input.addEventListener( 'input', () => this.handleInput())
    // input.addEventListener( 'invalid', e => this.handleError( e ));
    this.setAttribute( input, 'value', value )
    this.setAttribute( input, 'minLength', schema.minLength )
    this.setAttribute( input, 'maxLength', schema.maxLength )
    // this.setAttribute( input, 'pattern', schema.pattern );
    this.setAttribute( input, 'placeholder', schema.placeholder )
    this.setAttribute( input, 'readOnly', options.readOnly )
    // this.setAttribute( input, 'required', options.required );

    // JsonHelper.isDefined( schema.maxLength, maxLength => input.style.maxWidth = maxLength + 'em' );

    container.insertBefore( input, errorHolder )

    const feedback = this.createElement( 'span' )
    feedback.classList.add( 'jsu-feedback', `jsu-type-${schema.type}` )
    this.feedback = feedback
    container.insertBefore( feedback, errorHolder )
  }

  handleInput() {
    this.value = this.input.value

    if ( this.input.checkValidity()) {
      this.fire( 'change' )
    } else {
      this.showErrors([ { path: this.path, error: this.input.validationMessage } ])
    }
  }
}
