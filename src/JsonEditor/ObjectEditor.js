import JsonEditor from './JsonEditor';
import JsonSchema from '../JsonSchema';
import JsonHelper from '../JsonHelper';

export default class ObjectEditor extends JsonEditor {
  constructor( parms ) {
    super( parms );

    const { value, schema, container, path, options } = this;

    const props = Object.keys( schema.properties );

    this.children = {};

    this.required = {};

    for ( let prop of schema.required || [] ) {
      this.required[ prop ] = true;
    }

    const div = this.createContainer();
    div.appendChild( this.errorHolder );

    let titles = {};
    let titleLength = 0;
    for ( let prop of props ) {
      const propSchema = schema.properties[ prop ];
      const title = propSchema.title || this.unCamelCase( prop );
      if ( title.length > titleLength ) {
        titleLength = title.length;
      }
      titles[ prop ] = title;
    }

    const width = Math.floor( titleLength / 2 ) + 0.5 + 'em';

    this.checkboxes = {};
    this.holders = {}

    for ( let prop of props ) {
      const holder = this.createElement( 'div' );
      div.appendChild( holder );
      this.holders[ prop ] = holder;
      holder.setAttribute( 'role', 'property' );

      const propSchema = schema.properties[ prop ];
      this.setSchemaAttributes( holder, propSchema );

      const label = document.createElement( 'label' );
      label.style.width = width;

      if ( !this.required[ prop ]) {
        if ( options.theme ) {
          options.theme.checkboxLabel( label );
        }
        const checkbox = document.createElement( 'input' );
        checkbox.setAttribute( 'type', 'checkbox' );
        label.appendChild( checkbox );
        if ( typeof value[ prop ] != 'undefined' ) {
          checkbox.setAttribute( 'checked', true );
        } else {
          holder.classList.add( 'removed' );
        }

        if ( options.readOnly ) {
          checkbox.setAttribute( 'disabled', true );
        }

        checkbox.addEventListener('change', e => this.handleCheckbox( prop, e ));
        this.checkboxes[ prop ] = checkbox;
      }

      label.appendChild( document.createTextNode( titles[ prop ]));
      holder.appendChild( label );

      let description = propSchema.description;
      let icon;

      if ( description ) {
        description = this.createElement( 'div', description );
        description.classList.add( 'description' );
        if ( options.theme ) {
          options.theme.description( description );
        }
        if ( !this.isSimpleType( propSchema.type )) {
          holder.appendChild( description );
        }
      }

      const child = JsonHelper.editor({ value: value[ prop ], schema: propSchema, container: holder, path: `${path}.${prop}`, ...options });
      if ( description && this.isSimpleType( propSchema.type )) {
        holder.appendChild( description );
      }

      if ( options.theme ) {
        options.theme.formGroup( holder );
      }
      this.children[ prop ] = child;
      child.on( 'change', () => this.handleChange( prop ));
    }

    container.appendChild( div );
  }

  handleCheckbox( prop, e ) {
    if ( e.target.checked ) {
      this.children[ prop ].setValue( undefined );
      this.holders[ prop ].classList.remove( 'removed' );
    } else {
      this.holders[ prop ].classList.add( 'removed' );
      this.value[ prop ] = this.children[ prop ].getValue();
    }
    this.fire( 'change' );
  }

  handleChange( prop ) {
    this.value[ prop ] = this.children[ prop ].getValue();

    this.fire( 'change' );
  }

  showErrors( errors ) {
    errors = errors || [];
    const path = this.path;
    const pathLength = path.length;
    let myErrors = []
    let childErrors = {};
    for ( let error of errors ) {
      if ( error.path === path ) {
        myErrors.push( error )
      } else if ( error.path.lastIndexOf( path, 0 ) != -1 ) {
        let prop = error.path.substring( pathLength + 1 );
        let dot = prop.indexOf( '.' );
        if ( dot != -1 ) {
          prop = prop.substring( 0, dot );
        }
        if ( !childErrors[ prop ] ) {
          childErrors[ prop ] = [];
        }
        childErrors[ prop ].push( error );
      }
    }
    super.showErrors( myErrors );
    for ( let prop of Object.keys( childErrors )) {
      let child = this.children[ prop ];
      if ( child ) {
        child.showErrors( childErrors[ prop ]);
      }
    }
  }
}
