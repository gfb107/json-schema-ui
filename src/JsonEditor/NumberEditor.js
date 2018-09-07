import JsonEditor from './JsonEditor';

export default class NumberEditor extends JsonEditor {
  constructor( parms ) {
    super( parms );

    const { value, schema, container, options } = this;

    const holder = this.createContainer();
    this.holder = holder;

    const input = this.createElement( 'input' );
    holder.appendChild( input );
    this.input = input;

    this.setAttribute( input, 'type', schema.format || 'number' );

    this.setAttribute( input, 'step', schema.multipleOf || 0.01 );

    this.setAttribute( input, 'min', schema.minimum );

    this.setAttribute( input, 'max', schema.maximum );

    if ( options.readOnly ) {
      input.setAttribute( 'readOnly', true );
    }

    let temp = value;
    if ( typeof temp === 'undefined' ) {
      temp = schema.default;
    }
    if ( typeof temp === 'undefined' ) {
      temp = 0;
    }
    this.setAttribute( input, 'value', temp );

    input.addEventListener( 'change', e => this.handleChange( e ));

    const errorHolder = this.createElement( 'ul' );
    errorHolder.classList.add( 'errors' );
    this.errorHolder = errorHolder;

    holder.appendChild( errorHolder );
    container.appendChild( holder );

    if ( options.theme ) {
      options.theme.input( input );
    }
  }

  setErrors( errors ) {
    const errorHolder = this.errorHolder;
    errorHolder.innerHTML = '';
    if ( !errors || !errors.length ) {
      this.holder.classList.remove( 'has-error' );
    } else {
      this.holder.classList.add( 'has-error' );
      for ( let error of errors ) {
        errorHolder.appendChild( this.createElement( 'li', error ));
      }
    }
    this.errors = errors;
  }

  handleChange( e ) {
    this.value = Number.parseFloat( this.input.value );
    this.fire( 'change' );
  }

  setValue( value ) {
    this.input.value = value || '';
  }
}
