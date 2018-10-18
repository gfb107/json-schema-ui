import JsonEditor from './JsonEditor'

export default class BooleanEditor extends JsonEditor {
  constructor( parms ) {
    super( parms )

    const { value, schema, container, options } = this

    const holder = this.createContainer()
    this.holder = holder

    const input = this.createElement( 'input' )
    this.setSchemaClasses( input, schema )
    this.input = input

    input.addEventListener( 'change', e => this.handleChange( e ))
    this.setAttribute( input, 'type', 'checkbox' )
    this.setAttribute( input, 'checked', value )

    if ( options.readOnly ) {
      input.setAttribute( 'disabled', true )
    }

    holder.appendChild( input )
    holder.appendChild( this.errorHolder )
    container.appendChild( holder )
  }

  handleChange( e ) {
    this.value = e.target.checked

    this.fire( 'change' )
  }
}
