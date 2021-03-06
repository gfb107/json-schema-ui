import NumberEditor from './NumberEditor'

export default class IntegerEditor extends NumberEditor {
  constructor( parms ) {
    super( parms )

    const { schema } = parms

    this.setAttribute( this.input, 'step', schema.multipleOf || 1 )
  }

  getValue() {
    return Number.parseInt( this.input.value )
  }
}
