import JsonEditor from './JsonEditor';

export default class StringEditor extends JsonEditor {
  constructor( parms ) {
    super( parms );

    const { value, schema, container, options } = this;

    const format = schema.format;
    const input = this.createElement( format === 'textarea' ? 'textarea' : 'input' );
    this.setSchemaAttributes( input, schema );
    this.input = input;

    if ( !this.setAttribute( input, 'value', value )) {
      this.setAttribute( input, 'value', schema.default );
    }
    input.addEventListener( 'change', e => this.handleChange( e ));
    container.appendChild( input );

    this.setAttribute( input, 'maxLength', schema.maxLength );
    this.setAttribute( input, 'pattern', schema.pattern );

    if ( options.readOnly ) {
      input.setAttribute( 'readOnly', true );
    }
  }

  handleChange( e ) {
    this.fire( 'change' );
  }

  getValue() {
    return this.input.value;
  }

  setValue( value ) {
    this.input.value = value || '';
  }

  convertValue( value ) {
    switch( typeof value ) {
      case 'string': return value;
      case 'number': return '' + value;
      case 'undefined': return '';
      default: throw `Not a valid value: ${value}`;
    }
  }
}
