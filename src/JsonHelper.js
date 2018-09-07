import JsonSchema from './JsonSchema';
import ArrayEditor from './JsonEditor/ArrayEditor';
import IntegerEditor from './JsonEditor/IntegerEditor';
import NumberEditor from './JsonEditor/NumberEditor';
import MultiSelectCheckboxes from './JsonEditor/MultiSelectCheckboxes';
import MultiSelect from './JsonEditor/MultiSelect';
import ObjectEditor from './JsonEditor/ObjectEditor';
import ObjectTableEditor from './JsonEditor/ObjectTableEditor';
// import ObjectGridEditor from './ObjectGridEditor';
import StringEditor from './JsonEditor/StringEditor';
import Validator from './Validator';

import Bootstrap3 from './Themes/Bootstrap3';

const JsonHelper = {
  schema: obj => new JsonSchema( obj ),

  editor: parms => {
    let { value, schema, container } = parms;

    if ( !( schema instanceof JsonSchema )) {
      if ( typeof schema !== 'object' ) {
        throw 'A schema must be provided';
      }
      schema = new JsonSchema( schema );
    }

    if ( typeof value === 'undefined' && typeof schema.default === 'undefined' ) {
      throw 'A value must be provided, or the schema must have a default value';
    }

    if ( typeof container === 'string' ) {
      container = document.getElementById( container );
    }

    if ( !container instanceof Element ) {
      throw 'A container must be provided';
    }

    const type = schema.type;
    const format = schema.format;
    switch ( type ) {
      case 'array': {
        const items = schema.items;
        if ( Array.isArray( items )) {
          throw 'Tuples not yet supported';
        } else {
          if ( schema.uniqueItems === true && ( !!items.enum || !!items.oneOf )) {
            if ( format === 'select' ) {
              return new MultiSelect( parms );
            } else {
              return new MultiSelectCheckboxes( parms );
            }
          }
          return new ArrayEditor( parms );
        }
      }
      case 'integer':
        return new IntegerEditor( parms );
      case 'number':
        return new NumberEditor( parms );
      case 'string':
        return new StringEditor( parms );
      case 'object':
        switch( schema.format ) {
          case 'table': return new ObjectTableEditor( parms );
          // case 'grid': return new ObjectGridEditor( parms );
          default: return new ObjectEditor( parms );
        }
      default:
        throw `Unsupported schema type ${type}`;
    }
  },

  theme: name => {
    switch( name ) {
      case 'bootstrap3':
        return new Bootstrap3();
      default:
        throw `Unknown theme ${name}`
    }
  },

  validate: ( value, schema ) => Validator.validate( value, schema )
}

export default Object.freeze( JsonHelper );
