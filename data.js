const schema = {
  title: 'Test Schema',
  'definitions': {
    'contact': {
      'type': 'object',
      'properties': {
        'name': {
          'title': 'Name',
          'description': 'Please provide your full name',
          'type': 'string',
          'column': '1 / span 6',
        },
        'phone': {
          'title': 'Phone',
          'type': 'string',
          'format': 'tel',
          'pattern': '^(\\d{3})[-. ]?(\\d{3})[-. ]?(\\d{4})|\\((\\d{3})\\) ?(\\d{3})-(\\d{4})$',
          'mask': '($1) $2-$3',
          'column': '1 / span 3'
        },
        'email': {
          'title': 'Email address',
          'type': 'string',
          'format': 'email',
          'minLength': 3,
          'column': '4 / span 3'
        },
        'address': {
          'title': 'Street address',
          'type': 'string',
          'column': '1 / span 6'
        },
        'city': {
          'title': 'City',
          'type': 'string',
          'column': '1 / span 2'
        },
        'state': {
          'title': 'State',
          'type': 'string',
          'format': 'checkbox',
          'column': '3 / span 2',
          'oneOf': [ {
            'title': 'Alabama',
            'const': 'AL'
          }, {
            'title': 'Alaska',
            'const': 'AK'
          }, {
            'title': 'Arizona',
            'const': 'AZ'
          }, {
            'title': 'Arkansas',
            'const': 'AR'
          }, {
            'title': 'California',
            'const': 'CA'
          }, {
            'title': 'Colorado',
            'const': 'CO'
          }, {
            'title': 'Connecticut',
            'const': 'CT'
          }, {
            'title': 'Delaware',
            'const': 'DE'
          }, {
            'title': 'Florida',
            'const': 'FL'
          }, {
            'title': 'Georgia',
            'const': 'GA'
          }, {
            'title': 'Hawaii',
            'const': 'HI'
          }, {
            'title': 'Idaho',
            'const': 'ID'
          }, {
            'title': 'Illinois',
            'const': 'IL'
          }, {
            'title': 'Indiana',
            'const': 'IN'
          }, {
            'title': 'Iowa',
            'const': 'IA'
          }, {
            'title': 'Kansas',
            'const': 'KS'
          }, {
            'title': 'Kentucky',
            'const': 'KY'
          }, {
            'title': 'Louisiana',
            'const': 'LA'
          }, {
            'title': 'Maine',
            'const': 'ME'
          }, {
            'title': 'Maryland',
            'const': 'MD'
          }, {
            'title': 'Massachusetts',
            'const': 'MA'
          }, {
            'title': 'Michigan',
            'const': 'MI'
          }, {
            'title': 'Minnesota',
            'const': 'MN'
          }, {
            'title': 'Mississippi',
            'const': 'MS'
          }, {
            'title': 'Missouri',
            'const': 'MO'
          }, {
            'title': 'Montana',
            'const': 'MT'
          }, {
            'title': 'Nebraska',
            'const': 'NE'
          }, {
            'title': 'Nevada',
            'const': 'NV'
          }, {
            'title': 'New Hampshire',
            'const': 'NH'
          }, {
            'title': 'New Jersey',
            'const': 'NJ'
          }, {
            'title': 'New Mexico',
            'const': 'NM'
          }, {
            'title': 'New York',
            'const': 'NY'
          }, {
            'title': 'North Carolina',
            'const': 'NC'
          }, {
            'title': 'North Dakota',
            'const': 'ND'
          }, {
            'title': 'Ohio',
            'const': 'OH'
          }, {
            'title': 'Oklahoma',
            'const': 'OK'
          }, {
            'title': 'Oregon',
            'const': 'OR'
          }, {
            'title': 'Pennsylvania',
            'const': 'PA'
          }, {
            'title': 'Rhode Island',
            'const': 'RI'
          }, {
            'title': 'South Carolina',
            'const': 'SC'
          }, {
            'title': 'South Dakota',
            'const': 'SD'
          }, {
            'title': 'Tennessee',
            'const': 'TN'
          }, {
            'title': 'Texas',
            'const': 'TX'
          }, {
            'title': 'Utah',
            'const': 'UT'
          }, {
            'title': 'Vermont',
            'const': 'VT'
          }, {
            'title': 'Virginia',
            'const': 'VA'
          }, {
            'title': 'Washington',
            'const': 'WA'
          }, {
            'title': 'West Virginia',
            'const': 'WV'
          }, {
            'title': 'Wisconsin',
            'const': 'WI'
          }, {
            'title': 'Wyoming',
            'const': 'WY'
          }, {
            'title': 'American Samoa',
            'const': 'AS'
          }, {
            'title': 'District of Columbia',
            'const': 'DC'
          }, {
            'title': 'Federated States of Micronesia',
            'const': 'FM'
          }, {
            'title': 'Guam',
            'const': 'GU'
          }, {
            'title': 'Marshall Islands',
            'const': 'MH'
          }, {
            'title': 'Northern Mariana Islands',
            'const': 'MP'
          }, {
            'title': 'Palau',
            'const': 'PW'
          }, {
            'title': 'Puerto Rico',
            'const': 'PR'
          }, {
            'title': 'Virgin Islands',
            'const': 'VI'
          }, {
            'title': 'Armed Forces Africa',
            'const': 'AE'
          }, {
            'title': 'Armed Forces Americas',
            'const': 'AA'
          }, {
            'title': 'Armed Forces Canada',
            'const': 'AE'
          }, {
            'title': 'Armed Forces Europe',
            'const': 'AE'
          }, {
            'title': 'Armed Forces Middle East',
            'const': 'AE'
          }, {
            'title': 'Armed Forces Pacific',
            'const': 'AP'
          } ]
        },
        'zip': {
          'title': 'ZIP Code',
          'type': 'string',
          'minLength': 5,
          'maxLength': 5,
          'column': '5 / span 2'
        }
      },
      'required': [ 'name', 'phone', 'address', 'city', 'state', 'zip' ]
    }
  },
  'type': 'object',
  'properties': {
    'default': {
      '$ref': '#/definitions/contact',
      'title': 'Object with default format (column)',
      'description': 'display: flex; flex-flow: column wrap'
    },
    'row': {
      '$ref': '#/definitions/contact',
      'title': 'Object with format: row',
      'description': 'display: flex, flex-flow: row wrap',
      'format': 'row'
    },
    'grid': {
      '$ref': '#/definitions/contact',
      'title': 'Object with grid format',
      'description': 'display: grid, use columns to arrange items',
      'format': 'grid',
      'columns': '1fr 1fr 1fr 1fr 1fr 1fr'
    }
  },
  'required': [ 'default', 'row' ]

};

const value = {
  'default': {
    state: 'NC'
  }
};
