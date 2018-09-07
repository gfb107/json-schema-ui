import JsonHelper from '../JsonHelper';
import JsonSchema from '../JsonSchema';

export default class JsonEditor {
  constructor( parms ) {
    let { value, schema, container, path, ...options } = parms;
    this.value = value;
    this.schema = schema;
    this.container = container;
    this.path = path || '$';
    this.options = options;
    if ( schema.readOnly ) {
      options.readOnly = true;
    }

    this.errorHolder = document.createElement( 'ul' );
    this.errorHolder.classList.add( 'errors' );

    this.listeners = {};

    if ( !schema.root ) {
      container.classList.add( 'json-editor' );
      this.on( 'change', () => this.handleRootChange());
    }
  }

  on( event, func ) {
    let listeners = this.listeners[ event ];
    if ( ! Array.isArray( listeners )) {
      listeners = [];
      this.listeners[ event ] = listeners;
    }
    listeners.push( func );
  }

  off( event, func ) {
    const listeners = this.listeners[ event ];
    if ( Array.isArray( listeners )) {
      const index = listeners.indexOf( func );
      if ( index !== -1 ) {
        listeners.splice( index, 1 );
      }
    }
  }

  fire( event, data ) {
    const listeners = this.listeners[ event ];
    if ( Array.isArray( listeners )) {
      for ( let listener of listeners ) {
        listener( this, data );
      }
    }
  }

  setSchemaAttributes( element, schema ) {
    if ( typeof schema === 'undefined' ) {
      schema = this.schema;
    }
    element.setAttribute( 'x-type', schema.type );
    const format = schema.format;
    if ( format ) {
      element.setAttribute( 'x-format', format );
    }
  }

  createElement( tag, child ) {
    const el = document.createElement( tag );
    if ( typeof child === 'string' ) {
      child = document.createTextNode( child );
    }
    if ( child instanceof Node ) {
      el.appendChild( child );
    }
    return el;
  }

  createContainer( tag ) {
    const container = this.createElement( tag || 'div' );
    container.setAttribute( 'role', 'container' );
    this.setSchemaAttributes( container );
    return container;
  }

  setAttribute( element, name, value ) {
    if ( typeof value !== 'undefined' ) {
      element.setAttribute( name, value );
      return true;
    }
    return false;
  }

  setValue( value ) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  isUpperCase( c ) {
    return !!c && c != c.toLocaleLowerCase();
  }

  unCamelCase( text ) {
    text = text.trim();
    let result = ''
    let first = true;
    let c;

    for ( let i = 0; i < text.length; ++i ) {
      c = text.charAt( i );
      if ( first ) {
        c = c.toUpperCase()
        first = false;
      } else if ( this.isUpperCase( c )) {
        result += ' ';
      }
      result += c;
    }
    return result;
  }

  isSimpleType( type ) {
    return [ 'boolean', 'integer', 'number', 'string' ].indexOf( type ) != -1;
  }

  showErrors( errors ) {
    const errorHolder = this.errorHolder;
    if ( errorHolder ) {
      errorHolder.innerHTML = '';
      if ( !errors || errors.length === 0 ) {
        errorHolder.parentElement.classList.remove( 'has-error' );
      } else {
        errorHolder.parentElement.classList.add( 'has-error' );
        for ( let error of errors ) {
          errorHolder.appendChild( this.createElement( 'li', error.error ));
        }
      }
    }
  }

  handleRootChange() {
    this.errors = JsonHelper.validate( this.value, this.schema );
    this.valid = this.errors.length == 0;
    this.showErrors( this.errors );
  }
}
