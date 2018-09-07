import JsonEditor from './JsonEditor';
import JsonSchema from '../JsonSchema';
import JsonHelper from '../JsonHelper';

export default class MultiSelect extends JsonEditor {
  constructor( parms ) {
    super( parms );

    const { value, schema, container, options } = this;

    const holder = this.createContainer();
    this.holder = holder;

    const itemSchema = schema.items;

    const choices = itemSchema.enum || itemSchema.oneOf;

    const input = this.createElement( 'select' );
    this.input = input;
    holder.appendChild( input );
    input.setAttribute( 'multiple', true );

    for ( let choice of choices ) {
      const option = document.createElement( 'option' );
      input.appendChild( option );
      option.setAttribute( 'value', choice.const || choice );
      option.appendChild( document.createTextNode( choice.title || choice ));

      if ( value.indexOf( choice.const || choice ) != -1 ) {
        option.setAttribute( 'selected', true );
      }

      input.addEventListener('change', e => this.handleSelect( e ));
    }

    holder.appendChild( this.errorHolder );

    container.appendChild( holder );
  }

  handleSelect( e ) {
    const options = e.target.options;

    const value = [];
    for ( let i = 0; i < options.length; ++i ) {
      const option = options[ i ];
      if ( option.selected ) {
        value.push( option.value );
      }
    }

    this.value = value;

    this.fire( 'change' );
  }
}
