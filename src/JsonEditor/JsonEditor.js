import JsonHelper from '../JsonHelper'

export default class JsonEditor {
  constructor( parms ) {
    let { value, schema, container, path, ...options } = parms
    this.value = value
    this.schema = schema
    this.container = container
    this.path = path || '$'
    this.options = options
    if ( schema.readOnly ) {
      options.readOnly = true
    }

    this.errorHolder = document.createElement( 'ul' )
    this.errorHolder.classList.add( 'jsu-errors' )

    // just in case the sub-class doesn't do this
    container.appendChild( this.errorHolder )

    this.listeners = {}

    if ( !schema.root ) {
      container.classList.add( 'jsu-main' )
      this.on( 'change', () => this.handleRootChange())
    }
  }

  on( event, func ) {
    let listeners = this.listeners[ event ]
    if ( !Array.isArray( listeners )) {
      listeners = []
      this.listeners[ event ] = listeners
    }
    listeners.push( func )
  }

  off( event, func ) {
    const listeners = this.listeners[ event ]
    if ( Array.isArray( listeners )) {
      const index = listeners.indexOf( func )
      if ( index !== -1 ) {
        listeners.splice( index, 1 )
      }
    }
  }

  fire( event, data ) {
    const listeners = this.listeners[ event ]
    if ( Array.isArray( listeners )) {
      for ( let listener of listeners ) {
        listener( this, data )
      }
    }
  }

  setSchemaClasses( element, schema ) {
    if ( typeof schema === 'undefined' ) {
      schema = this.schema
    }
    element.classList.add( `jsu-type-${schema.type}` )
    const format = schema.format
    if ( format ) {
      element.classList.add( `jsu-format-${format}` )
    }
  }

  createElement( tag, child ) {
    const el = document.createElement( tag )
    if ( typeof child === 'string' ) {
      child = document.createTextNode( child )
    }
    if ( child instanceof Node ) {
      el.appendChild( child )
    }

    if ([ 'input', 'select', 'textarea' ].indexOf( tag ) != -1 ) {
      el.addEventListener( 'focus', e => this.handleFocus( e ))
      el.addEventListener( 'blur', e => this.handleBlur( e ))
    }
    return el
  }

  handleFocus( e ) {
    const container = e.target.closest( '.jsu-property' )
    if ( container ) {
      container.classList.add( 'jsu-active' )
    }
  }

  handleBlur( e ) {
    const container = e.target.closest( '.jsu-property' )
    const text = e.target.value
    if ( text.length > 0 ) {
      const pattern = this.schema.pattern
      const mask = this.schema.mask
      if ( pattern && mask ) {
        const re = new RegExp( pattern )
        if ( re.test( text )) {
          const temp = text.replace( re, mask )
          if ( temp !== text && temp.match( re )) {
            this.value = temp
            e.target.value = temp
            this.handleInput()
          }
        }
      }
    }
    if ( container ) {
      container.classList.remove( 'jsu-active' )
    }
  }

  createContainer( tag ) {
    const container = this.createElement( tag || 'div' )
    container.setAttribute( 'role', 'container' )
    this.setSchemaClasses( container )
    return container
  }

  setAttribute( element, name, value ) {
    if ( typeof value !== 'undefined' ) {
      element.setAttribute( name, value )
      return true
    }
    return false
  }

  setValue( value ) {
    this.value = value
    JsonHelper.isDefined( this.input, input => {
      input.value = typeof value === 'undefined' ? null : value
    })
  }

  getValue() {
    return this.value
  }

  isUpperCase( c ) {
    return !!c && c != c.toLocaleLowerCase()
  }

  unCamelCase( text ) {
    text = text.trim()
    let result = ''
    let first = true
    let c

    for ( let i = 0; i < text.length; ++i ) {
      c = text.charAt( i )
      if ( first ) {
        c = c.toUpperCase()
        first = false
      } else if ( this.isUpperCase( c )) {
        result += ' '
      }
      result += c
    }
    return result
  }

  isSimpleType( type ) {
    return [ 'boolean', 'integer', 'number', 'string' ].indexOf( type ) != -1
  }

  showErrors( errors ) {
    errors = errors || []
    const hasError = errors.length > 0
    const { errorHolder, input, feedback } = this
    // this.container.classList.toggle( 'has-error', hasError );
    if ( errorHolder ) {
      errorHolder.innerHTML = ''
      errorHolder.classList.toggle( 'has-error', hasError )
      for ( let error of errors ) {
        errorHolder.appendChild( this.createElement( 'li', error.error ))
      }
    }

    if ( input ) {
      input.classList.toggle( 'has-error', hasError )
    }

    if ( feedback ) {
      feedback.classList.toggle( 'has-error', hasError )
    }
  }

  handleRootChange() {
    this.validate()
  }

  validate() {
    this.errors = JsonHelper.validate({ value: this.value, schema: this.schema, options: this.options })
    this.valid = this.errors.length == 0
    this.showErrors( this.errors )
  }
}
