class JsonSchema {
  constructor( schema, root ) {
    if ( typeof schema !== 'object' ) {
      throw 'Not an object';
    }

    if ( schema instanceof JsonSchema ) {
      throw 'Already a JsonSchema';
    }

    if ( root && !root instanceof JsonSchema ) {
      throw 'Root must be a JsonSchema';
    }

    const definitions = schema.definitions;
    if ( !root ) {
      root = this;
      this.definitions = {};
      for ( let key of Object.keys( schema.definitions )) {
        this.definitions[ `#/definitions/${key}` ] = new JsonSchema( schema.definitions[ key ], this );
      }
    } else {
      this.root = root;
      if ( definitions ) {
        throw 'Definitions not allowed below root';
      }
    }

    this.schema = schema;

    if ( schema.$ref ) {
      schema.$ref = this.getSchema( schema.$ref );
      return;
    }

    const type = this.type;

    if ( typeof type === 'undefined' && typeof schema.const === 'undefined' ) {
      throw 'Type is required';
    }

    function processSchemas( schemas ) {
      for ( let i = 0; i < schemas.length; ++i ) {
        schemas[ i ] = new JsonSchema( schemas[ i ], root );
      }
    }

    switch( type ) {
      case 'object':
        const properties = schema.properties;
        for ( let prop of Object.keys( properties )) {
          properties[ prop ] = new JsonSchema( properties[ prop ], root );
        }
        if ( typeof schema.additionalProperties !== 'undefined' ) {
          console.error( 'additionalProperties are not supported' );
        }
        if ( typeof schema.patternProperties !== 'undefined' ) {
          console.warn( 'patternProperties not supported' );
        }
        const dependencies = schema.dependencies;
        if ( typeof dependencies === 'object' ) {
          for ( let prop of Object.keys( dependencies )) {
            let dependency = dependencies[ prop ];
            if ( !Array.isArray( dependency ) && typeof dependency === 'object' ) {
              dependencies[ prop ] = new JsonSchema( dependency );
            }
          }
        }
        break;
      case 'array':
        const items = schema.items;
        if ( Array.isArray( items )) {
          processSchemas( items );
        } else {
          schema.items = new JsonSchema( schema.items, root );
        }
        const additionalItems = schema.additionalItems;
        if ( typeof additionalItems === 'object' ) {
          schema.additionalItems = new JsonSchema( additionalItems, root );
        }
        break;
    }


    if ( schema.oneOf ) {
      processSchemas( schema.oneOf );
    }

    if ( schema.allOf ) {
      processSchemas( schema.allOf );
    }

    if ( schema.anyOf ) {
      processSchema( schema.anyOf );
    }

    if ( schema.not ) {
      this.not = new JsonSchema( schema.not, root );
    }
  }

  getSchema( ref ) {
    let root = this.root || this;

    if ( root.definitions ) {
      return root.definitions[ ref ];
    }
    return undefined;
  }

  get type() {
    return this.get( 'type' );
  }

  get format() {
    return this.get( 'format' );
  }

  get title() {
    return this.getMeta( 'title' );
  }

  get description() {
    return this.getMeta( 'description' );
  }

  get default() {
    return this.get( 'default' );
  }

  get 'const'() {
    return this.get( 'const' );
  }

  get enum() {
    return this.get( 'enum' );
  }

  get properties() {
    return this.get( 'properties' );
  }

  get additionalProperties() {
    return this.get( 'additionalProperties' );
  }

  get patternProperties() {
    return this.get( 'patternProperties' );
  }

  get dependencies() {
    return this.get( 'dependencies' );
  }

  get required() {
    return this.get( 'required' );
  }

  get items() {
    return this.get( 'items' );
  }

  get allOf() {
    return this.get( 'allOf' );
  }

  get anyOf() {
    return this.get( 'anyOf' );
  }

  get oneOf() {
    return this.get( 'oneOf' );
  }

  get not() {
    return this.get( 'not' );
  }

  get uniqueItems() {
    return this.get( 'uniqueItems' );
  }

  get $ref() {
    return this.schema.$ref;
  }

  get required() {
    return this.get( 'required' );
  }

  get multipleOf() {
    return this.get( 'multipleOf' );
  }

  get minimum() {
    return this.get( 'minimum' );
  }

  get maximum() {
    return this.get( 'maximum' );
  }

  get minLength() {
    return this.get( 'minLength' );
  }

  get maxLength() {
    return this.get( 'maxLenth' );
  }

  get pattern() {
    return this.get( 'pattern' );
  }

  get additonalItems() {
    return this.get( 'additionalItems' );
  }

  get maxItems() {
    return this.get( 'maxItems' );
  }

  get minItems() {
    return this.get( 'minItems' );
  }

  getMeta( key ) {
    const rc = this.schema[ key ];
    if ( typeof rc != 'undefined' ) {
      return rc;
    }
    const $ref = this.schema.$ref;
    if ( $ref ) {
      return $ref.get( key );
    }
    return undefined;
  }

  get( key ) {
    const ref = this.schema.$ref;
    if ( ref ) {
      return ref.get( key );
    } else {
      return this.schema[ key ];
    }
  }

  validate( value, path ) {
    path = path || '$';
    const errors = [];
    switch ( this.type ) {
      case 'array':
        if ( !Array.isArray( value )) {
          errors.push({
            path: path,
            property: 'type',
            message: `Not an array`
          });
        }
        break;
      case 'integer' :
        if ( typeof value !== 'number' || Math.floor( value ) !== value ) {
          error.push({
            path: path,
            property: 'type',
            message: `Not an integer`
          });
        }
        break;
      case 'number' :
        if ( typeof value !== 'number' ) {
          errors.push({
            path: path,
            property: 'type',
            message: `Not a number`
          });
        }
        break;
      case 'object' :
        if ( typeof value !== 'object' || Array.isArray( value )) {
          errors.push({
            path: path,
            property: 'type',
            message: `Not an object`
          });
        }
        break;
      case 'string' :
        if ( typeof value !== 'string' ) {
          errors.push({
            path: path,
            property: 'type',
            message: 'Not a string'
          });
        }
        break;
      default : {
        throw 'Schemas without type are not supported';
      }

      return errors;
    }
  }
}

export default JsonSchema;
