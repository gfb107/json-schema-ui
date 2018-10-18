import JsonSchema from './JsonSchema'
import { describe, test, expect } from 'jest'

describe( 'JsonSchema tests', () => {
  test( 'constructor requires an object', () => {
    function create() {
      return new JsonSchema()
    }

    expect( create ).toThrow( /^Not an object$/ )
  })

  test( 'type is required', () => {
    function create() {
      return new JsonSchema({})
    }

    expect( create ).toThrow( /^Type is required$/ )
  })

  test( 'const is allowed without type', () => {
    const schema = new JsonSchema({ const: 'abc' })

    expect( schema ).toBeInstanceOf( JsonSchema )
    expect( schema.const ).toBe( 'abc' )
    expect( schema.type ).toBeUndefined()
  })

  test( 'constructor does not allow JsonSchema', () => {
    function create() {
      const schema = new JsonSchema({ 'type': 'string' })
      return new JsonSchema( schema )
    }

    expect( create ).toThrow( /^Already a JsonSchema$/ )
  })

  test( 'properties are required for object', () => {
    function create() {
      return new JsonSchema({ 'type': 'object' })
    }

    expect( create ).toThrow( /^properties is required for type object$/ )
  })

  test( 'properties for object must not be empty', () => {
    function create() {
      return new JsonSchema({ 'type': 'object', 'properties': {} })
    }

    expect( create ).toThrow( /^properties must not be empty$/ )
    const schema = new JsonSchema({ 'type': 'object', 'properties': { 'name': { 'type': 'string' } } })
    expect( schema.type ).toBe( 'object' )
    const properties = schema.properties
    expect( properties.name ).toBeInstanceOf( JsonSchema )
    expect( properties.name.type ).toBe( 'string' )
  })
})
