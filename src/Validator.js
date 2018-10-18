import JsonHelper from './JsonHelper'
import JsonSchema from './JsonSchema'

const Validator = {
  validate( parms ) {
    let { value, schema, path, errors, ...options } = parms

    path = path || '$'
    errors = errors || []

    if ( typeof value === 'undefined' ) {
      value = schema.default
    }

    const type = schema.type

    // basic type check
    const valueType = typeof value
    if ( valueType === 'undefined' ||
      ( type === 'array' && !Array.isArray( value )) ||
      ( type === 'integer' && valueType !== 'number' ) ||
      ([ 'object', 'string', 'number' ].indexOf( type ) != -1 && valueType !== type )) {
      errors.push({ path, error: `Not a value of type ${type}` })
      return errors
    }

    // type-specific checks
    switch ( type ) {
    case 'array':
      Validator.validateArray({ value, schema, path, errors, ...options })
      break
    case 'boolean':
      Validator.validateBoolean({ value, schema, path, errors, ...options })
      break
    case 'integer':
      Validator.validateInteger({ value, schema, path, errors, ...options })
      break
    case 'number':
      Validator.validateNumber({ value, schema, path, errors, ...options })
      break
    case 'object':
      Validator.validateObject({ value, schema, path, errors, ...options })
      break
    case 'string':
      Validator.validateString({ value, schema, path, errors, ...options })
      break
    }

    // Generic checks

    JsonHelper.isDefined( schema.const, constant => {
      if ( JSON.stringify( value ) !== JSON.stringify( constant )) {
        errors.push({ path, error: `Value must be ${constant}` })
      }
    })

    JsonHelper.isDefined( schema.enum, choices => {
      if ( choices.indexOf( JSON.stringify( value )) == -1 ) {
        errors.push({ path, error: 'Value must be one of the enumerated values' })
      }
    })

    JsonHelper.isDefined( schema.oneOf, oneOf => {
      let matches = 0
      for ( let sub of oneOf ) {
        let results = Validator.validate({ value, schema: sub, path, errors: [], ...options })
        if ( results.length == 0 ) {
          matches += 1
          if ( matches > 1 ) {
            errors.push({ path, error: 'Value must validate against only one schema' })
          }
        }
      }
      if ( matches == 0 ) {
        errors.push({ path, error: 'Value must match one schema' })
      }
    })

    return errors
  },

  validateArray({ values, schema, path, errors }) {
    const length = values.length

    JsonHelper.isDefined( schema.minItems, minItems => {
      if ( length < minItems ) {
        if ( minItems == 1 ) {
          errors.push({ path, error: 'Please select at least one item' })
        } else {
          errors.push({ path, error: `Please select at least ${minItems} items` })
        }
      }
    })

    JsonHelper.isDefined( schema.maxItems, maxItems => {
      if ( length > maxItems ) {
        if ( maxItems == 1 ) {
          errors.push({ path, errors: 'Please select no more than one item' })
        }
        errors.push({ path, errors: `Please select no more than ${maxItems} items` })
      }
    })

    JsonHelper.isDefined( schema.uniqueItems, uniqueItems => {
      if ( uniqueItems ) {
        const seen = {}
        for ( let value of values ) {
          value = JSON.stringify( value )
          if ( seen[ value ]) {
            errors.push({ path, error: 'Array items are not unique' })
            break
          } else {
            seen[ value ] == true
          }
        }
      }
    })

    const items = schema.items

    if ( !items ) {
      errors.push({ path, error: 'Schemas of type array must have items' })
    } else if ( Array.isArray( items )) {
      Validator.validateTupleArray( values, schema, path, errors )
    } else if ( typeof items === 'object' ) {
      Validator.validateListArray( values, schema, path, errors )
    } else {
      errors.push({ path, error: 'Schema items must be an array or object' })
    }
  },

  validateListArray({ values, schema, path, errors }) {
    const length = values.length
    const itemSchema = schema.items

    for ( let i = 0; i < length; ++i ) {
      const value = values[ i ]
      Validator.validate( value, itemSchema, `${path}.${i}`, errors )
    }
  },

  validateTupleArray({ values, schema, path, errors, ...options }) {
    const length = values.length
    const itemSchemas = schema.items

    const additionalItems = schema.addtionalItems || true

    for ( let i = 0; i < length; ++i ) {
      let value = values[ i ]
      if ( i < itemSchemas.length ) {
        Validator.validate( value, itemSchemas[ i ], `${path}.${i}`, errors )
      } else if ( typeof additionalItems === 'boolean' ) {
        if ( !additionalItems ) {
          errors.push({ path, error: `Additional array item at index ${i} not allowed` })
        }
      } else if ( additionalItems instanceof JsonSchema ) {
        Validator.validate({ value, schema: additionalItems, path: `${path}.${i}`, errors, ...options })
      }
    }
  },

  validateBoolean() {
    // nothing to validate
  },

  validateInteger({ value, schema, path, errors, ...options }) {
    if ( !Number.isInteger( value )) {
      errors.push({ path, error: `Not an integer: ${value}` })
    }

    Validator.validateNumber({ value, schema, path, errors, ...options })
  },

  remainder( value, divisor ) {
    var valCount = ( value.toString().split( '.' )[ 1 ] || '' ).length
    var divCount = ( divisor.toString().split( '.' )[ 1 ] || '' ).length
    var count = valCount > divCount ? valCount : divCount
    var valInt = parseInt( value.toFixed( count ).replace( '.', '' ))
    var divInt = parseInt( divisor.toFixed( count ).replace( '.', '' ))
    return ( valInt % divInt ) / Math.pow( 10, count )
  },

  validateNumber({ value, schema, path, errors }) {
    JsonHelper.isDefined( schema.multipleOf, multipleOf => {
      if ( typeof multipleOf !== 'number' ) {
        errors.push({ path, error: `multipleOf not a number: ${multipleOf}` })
        return
      }
      const remainder = Validator.remainder( value, multipleOf )
      if ( remainder !== 0 ) {
        errors.push({ path, error: `${value} is not a multiple of ${multipleOf}` })
      }
    })

    JsonHelper.isDefined( schema.minimum, minimum => {
      const exclusive = schema.exclusiveMinimum || false
      if ( exclusive && value <= minimum ) {
        errors.push({ path, error: `Value must be greater than ${minimum}` })
      } else if ( value < minimum ) {
        errors.push({ path, error: `Value must be at least ${minimum}` })
      }
    })

    JsonHelper.isDefined( schema.maximum, maximum => {
      const exclusive = schema.exclusiveMaximum || false
      if ( exclusive && value >= maximum ) {
        errors.push({ path, error: `Value must be less than ${maximum}` })
      } else if ( value > maximum ) {
        errors.push({ path, error: `Value must no more than ${maximum}` })
      }
    })
  },

  validateObject({ value, schema, path, errors, ...options }) {
    const properties = schema.properties

    const keys = Object.keys( value )

    JsonHelper.isDefined( schema.required, required => {
      for ( let name of required ) {
        if ( keys.indexOf[ name ] == -1 ) {
          errors.push({ path, error: `Property ${name} is required.` })
        } else {
          if ( value[ name ] === '' && schema.properties[ name ].minLength !== 0 ) {
            errors.push({ path: `${path}.${name}`, error: `Property ${name} is required.` })
          }
        }
      }
    })

    for ( let key of keys ) {
      let childSchema = properties[ key ]
      if ( typeof childSchema === 'undefined' ) {
        errors.push({ path, error: `Unknown property ${key}` })
      } else {
        Validator.validate({ value: value[ key ], schema: childSchema, path: `${path}.${key}`, errors, ...options })
      }
    }
  },

  validateString({ value, schema, path, errors }) {
    const length = value.length

    JsonHelper.isDefined( schema.minLength, minLength => {
      if ( minLength < 0 ) {
        errors.push({ path, error: 'minLength must not be negative' })
      } else if ( length < minLength ) {
        errors.push({ path, error: `Value length must be at least ${minLength}` })
      }
    })

    JsonHelper.isDefined( schema.maxLength, maxLength => {
      if ( maxLength < 0 ) {
        errors.push({ path, error: 'maxLength must not be negative' })
      } else if ( length > maxLength ) {
        errors.push({ path, error: `Value length must not exceed ${maxLength}` })
      }
    })

    JsonHelper.isDefined( schema.pattern, pattern => {
      const re = new RegExp( pattern )
      if ( !re.test( value )) {
        errors.push({ path, error: 'Value doesn\'t match the pattern' })
      }
    })

    JsonHelper.isDefined( schema.format, format => {
      const regex = Validator.regexes[ format ]
      if ( regex ) {
        if ( !regex.test( value )) {
          errors.push({ path, error: `Not a valid ${format}: ${value}` })
        }
      }
    })
  },

  regexes: {
    'date-time': /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)?(:)?(\d\d)?([.,]\d+)?($|Z|([+-])(\d\d)(:)?(\d\d)?)/i
  }
}

export default Object.freeze( Validator )
