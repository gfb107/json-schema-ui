import JsonSchema from './JsonSchema'
import ArrayEditor from './JsonEditor/ArrayEditor'
import BooleanEditor from './JsonEditor/BooleanEditor'
import IntegerEditor from './JsonEditor/IntegerEditor'
import NumberEditor from './JsonEditor/NumberEditor'
import MultiSelectCheckboxes from './JsonEditor/MultiSelectCheckboxes'
import SelectEditor from './JsonEditor/SelectEditor'
import MultiSelect from './JsonEditor/MultiSelect'
import ObjectEditor from './JsonEditor/ObjectEditor'
import ObjectTableEditor from './JsonEditor/ObjectTableEditor'
// import ObjectGridEditor from './ObjectGridEditor';
import StringEditor from './JsonEditor/StringEditor'
import Validator from './Validator'

const JsonHelper = {
  schema: obj => new JsonSchema( obj ),

  editor: parms => {
    let { value, schema, container } = parms

    if ( !( schema instanceof JsonSchema )) {
      if ( typeof schema !== 'object' ) {
        throw 'A schema must be provided'
      }
      schema = new JsonSchema( schema )
      parms.schema = schema
    }

    if ( typeof container === 'string' ) {
      container = document.getElementById( container )
    }

    if ( !( container instanceof Element )) {
      throw 'A container must be provided'
    }

    const type = schema.type
    if ( typeof value === 'undefined' ) {
      if ( typeof schema.default !== 'undefined' ) {
        parms.value = schema.default
      } else {
        const defaults = {
          array: [],
          boolean: false,
          integer: 0,
          number: 0.0,
          object: {},
          string: ''
        }
        parms.value = defaults[ type ]
      }
    }

    const format = schema.format
    let editor
    switch ( type ) {
    case 'array': {
      const items = schema.items
      if ( Array.isArray( items )) {
        throw 'Tuples not yet supported'
      } else {
        if ( schema.uniqueItems === true && ( !!items.enum || !!items.oneOf )) {
          if ( format === 'select' ) {
            editor = new MultiSelect( parms )
          } else {
            editor = new MultiSelectCheckboxes( parms )
          }
        }
        editor = new ArrayEditor( parms )
      }
      break
    }
    case 'boolean':
      editor = new BooleanEditor( parms )
      break
    case 'integer':
      if ( schema.oneOf || schema.enum ) {
        editor = new SelectEditor( parms )
      } else {
        editor = new IntegerEditor( parms )
      }
      break
    case 'number':
      if ( schema.oneOf || schema.enum ) {
        editor = new SelectEditor( parms )
      } else {
        editor = new NumberEditor( parms )
      }
      break
    case 'string':
      if ( schema.oneOf || schema.enum ) {
        editor = new SelectEditor( parms )
      } else {
        editor = new StringEditor( parms )
      }
      break
    case 'object':
      switch ( schema.format ) {
      case 'table':
        editor = new ObjectTableEditor( parms )
        break
        // case 'grid': return new ObjectGridEditor( parms );
      default:
        editor = new ObjectEditor( parms )
      }
      break
    default:
      throw `Unsupported schema type ${type}`
    }
    editor.validate()
    return editor
  },

  validate: ( value, schema ) => Validator.validate( value, schema ),

  isDefined: ( value, callback ) => {
    if ( typeof value !== 'undefined' ) {
      if ( callback ) {
        callback( value )
      }
      return true
    }
    return false
  }
}

export default Object.freeze( JsonHelper )
