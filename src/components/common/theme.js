/*
 * The Material-UI theme for the whole UI
 */
import {createMuiTheme}		from '@material-ui/core/styles'

export const colorPrimary		= '#76BB23'

const colorPrimarySelected		= 'rgba(118, 187, 35, 0.3)'
const colorPrimaryHover		= 'rgba(118, 187, 35, 0.1)'

export default createMuiTheme({
	spacing		: 4,
	typography		: {
		fontSize		: 11,
		//htmlFontSize		: 20,
		fontFamily: [
			'Lato',
			'Roboto',
			'Helvetica',
			'Arial',
			'sans-serif',
		].join(','),
		h5		: {
			fontWeight		: 700,
		},
		h6		: {
			fontWeight		: 700,
		},
		subtitle1		: {
			fontWeight		: 700,
		},
	},
  palette: {
    primary: {
      main: colorPrimary,
			//very light primary color, for background sometimes
			lightVery		: '#F9FCF4',
    },
    secondary: {
			main: '#61892f',
			dark: 'rgba(135, 195, 46, .32)',
    },
		action		: {
			active		: 'rgba(135, 195, 46, .64)',
			hover		: 'rgba(135, 195, 46, .08)',
			selected		: 'rgba(135, 195, 46, .32)',
    },
    stats: {
      green: colorPrimary,
      red: 'rgb(233, 88, 57)',
      orange: 'rgb(239, 128, 49)'
    }
  },
	overrides		: {
		MuiButton		: {
			root		: {
				fontSize		: '.785rem',
			},
			label		: {
				textTransform		: 'capitalize',
			},
		},
		MuiOutlinedInput		: {
			input		: {
				padding		: '10.5px 10px',
			},
		},
		MuiInputLabel: {
			outlined: {
				transform: 'translate(10px, 12px) scale(1)',
			},
		},
		MuiListItem		: {
			root		: {
				'&.Mui-selected' : {
					color		: colorPrimary,
					backgroundColor		: colorPrimarySelected,
					'&:hover'		: {
						backgroundColor		: colorPrimarySelected,
					},
				},
			},
			button		: {
				'&:hover'		: {
					color		: colorPrimary,
					backgroundColor		: colorPrimaryHover,
				},
			},
    },
    'MuiRadio': {
      root: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
		MuiSelect		: {
			select		: {
				'&:focus'		: {
					color		: colorPrimary,
					backgroundColor		: colorPrimaryHover,
				},
			},
		},
		MuiTableRow		: {
			root		: {
				'&.MuiTableRow-hover'		: {
					'&:hover'		: {
						backgroundColor		: colorPrimaryHover,
					},
					'&:hover .MuiTableCell-body'		: {
						color		: colorPrimary,
					},
				},
			},
		},
		MuiTableCell		: {
			head		: {
				fontSize		: '.785rem',
				fontWeight		: 700,
				color		: '#494747',
			},
			body		: {
				fontSize		: '.785rem',
			},
		},
		/* No better way to adjust the table column width, so have to set css here*/
		MUIDataTableHeadCell: {
			root: {
				'&:nth-child(1)': {
					width: 20
				},
				'&:nth-child(2)': {
					width: 30
				},
				'&:nth-child(3)': {
					width: 30
				},
				'&:nth-child(4)': {
					width: 30
				},
				'&:nth-child(5)': {
					width: 30
				},
				'&:nth-child(6)': {
					width: 30
				},
				'&:nth-child(7)': {
					width: 30
				},
				'&:nth-child(8)': {
					width: 200,
				},
			}
		}
	},
	props		: {
		MuiButton		: {
			variant		: 'outlined',
		},
		MuiTextField		: {
			variant		: 'outlined',
		},
	},
})
