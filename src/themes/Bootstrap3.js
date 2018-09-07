export default class Boostrap3 {
  formGroup( element ) {
    console.log( 'formGroup', element );
    element.classList.add( 'form-group' );
  }

  checkboxLabel( label ) {
    label.classList.add( 'checkbox-inline' );
  }

  input( element ) {
    console.log( 'input', element );
    element.classList.add( 'form-control' );
  }

  description( element ) {
    element.classList.add( 'help-block' );
  }

  table( element ) {
    element.classList.add( 'table', 'table-striped', 'table-condensed', 'table-hover' );
  }
}
