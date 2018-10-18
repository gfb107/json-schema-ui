class JsonSchema {
  constructor( schema, root ) {
    if ( typeof schema !== 'object' ) {
      throw new Error( 'Not an object' )
    }

    if ( schema instanceof JsonSchema ) {
      throw 'Already a JsonSchema'
    }

    if ( root && !( root instanceof JsonSchema )) {
      throw 'Root must be a JsonSchema'
    }

    const definitions = schema.definitions
    if ( !root ) {
      root = this
      this.definitions = {}
      if ( schema.definitions ) {
        for ( let key of Object.keys( schema.definitions )) {
          this.definitions[ `#/definitions/${key}` ] = new JsonSchema( schema.definitions[ key ], this )
        }
      }
    } else {
      this.root = root
      if ( definitions ) {
        throw new Error( 'Definitions not allowed below root' )
      }
    }

    this.schema = schema

    if ( schema.$ref ) {
      schema.$ref = this.getSchema( schema.$ref )
      return
    }

    const type = this.type

    if ( typeof type === 'undefined' && typeof schema.const === 'undefined' ) {
      throw new Error( 'Type is required' )
    }

    function processSchemas( schemas ) {
      for ( let i = 0; i < schemas.length; ++i ) {
        schemas[ i ] = new JsonSchema( schemas[ i ], root )
      }
    }

    switch ( type ) {
    case 'object': {
      const properties = schema.properties
      if ( typeof properties !== 'object' ) {
        throw new Error( 'properties is required for type object' )
      }
      const keys = Object.keys( properties )
      if ( keys.length === 0 ) {
        throw new Error( 'properties must not be empty' )
      }
      for ( let prop of Object.keys( properties )) {
        properties[ prop ] = new JsonSchema( properties[ prop ], root )
      }
      if ( typeof schema.additionalProperties !== 'undefined' ) {
        throw 'additionalProperties are not supported'
      }
      if ( typeof schema.patternProperties !== 'undefined' ) {
        throw 'patternProperties not supported'
      }
      const dependencies = schema.dependencies
      if ( typeof dependencies === 'object' ) {
        for ( let prop of Object.keys( dependencies )) {
          let dependency = dependencies[ prop ]
          if ( !Array.isArray( dependency ) && typeof dependency === 'object' ) {
            dependencies[ prop ] = new JsonSchema( dependency )
          }
        }
      }
      break
    }
    case 'array': {
      const items = schema.items
      if ( Array.isArray( items )) {
        processSchemas( items )
      } else {
        schema.items = new JsonSchema( schema.items, root )
      }
      const additionalItems = schema.additionalItems
      if ( typeof additionalItems === 'object' ) {
        schema.additionalItems = new JsonSchema( additionalItems, root )
      }
      break
    }
    }


    if ( schema.oneOf ) {
      processSchemas( schema.oneOf )
    }

    if ( schema.allOf ) {
      processSchemas( schema.allOf )
    }

    if ( schema.anyOf ) {
      processSchemas( schema.anyOf )
    }

    if ( schema.not ) {
      this.not = new JsonSchema( schema.not, root )
    }
  }

  getSchema( ref ) {
    let root = this.root || this

    if ( root.definitions ) {
      return root.definitions[ ref ]
    }
    return undefined
  }

  get type() {
    return this.get( 'type' )
  }

  get format() {
    return this.getMeta( 'format' )
  }

  get title() {
    return this.getMeta( 'title' )
  }

  get description() {
    return this.getMeta( 'description' )
  }

  get default() {
    return this.get( 'default' )
  }

  get 'const'() {
    return this.get( 'const' )
  }

  get enum() {
    return this.get( 'enum' )
  }

  get properties() {
    return this.get( 'properties' )
  }

  get additionalProperties() {
    return this.get( 'additionalProperties' )
  }

  get patternProperties() {
    return this.get( 'patternProperties' )
  }

  get dependencies() {
    return this.get( 'dependencies' )
  }

  get required() {
    return this.get( 'required' )
  }

  get items() {
    return this.get( 'items' )
  }

  get allOf() {
    return this.get( 'allOf' )
  }

  get anyOf() {
    return this.get( 'anyOf' )
  }

  get oneOf() {
    return this.get( 'oneOf' )
  }

  get not() {
    return this.get( 'not' )
  }

  get uniqueItems() {
    return this.get( 'uniqueItems' )
  }

  get $ref() {
    return this.schema.$ref
  }

  get multipleOf() {
    return this.get( 'multipleOf' )
  }

  get minimum() {
    return this.get( 'minimum' )
  }

  get maximum() {
    return this.get( 'maximum' )
  }

  get minLength() {
    return this.get( 'minLength' )
  }

  get maxLength() {
    return this.get( 'maxLength' )
  }

  get pattern() {
    return this.get( 'pattern' )
  }

  get mask() {
    return this.get( 'mask' )
  }

  get placeholder() {
    return this.get( 'placeholder' )
  }

  get additonalItems() {
    return this.get( 'additionalItems' )
  }

  get maxItems() {
    return this.get( 'maxItems' )
  }

  get minItems() {
    return this.get( 'minItems' )
  }

  get columns() {
    return this.getMeta( 'columns' )
  }

  get rows() {
    return this.getMeta( 'rows' )
  }

  get column() {
    return this.getMeta( 'column' )
  }

  get row() {
    return this.getMeta( 'row' )
  }

  getMeta( key ) {
    const rc = this.schema[ key ]
    if ( typeof rc != 'undefined' ) {
      return rc
    }
    const $ref = this.schema.$ref
    if ( $ref ) {
      return $ref.get( key )
    }
    return undefined
  }

  get( key ) {
    const ref = this.schema.$ref
    if ( ref ) {
      return ref.get( key )
    } else {
      return this.schema[ key ]
    }
  }
}

export default JsonSchema
