import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import IconLogo		from '../components/IconLogo';
import themeNew		from '../components/common/theme';
import Typography		from '@material-ui/core/Typography';
import {withTheme}		from '@material-ui/core/styles';
import {ThemeProvider, useTheme, }		from '@material-ui/core/styles';
import Button		from '@material-ui/core/Button';
import Box		from '@material-ui/core/Box';
import TextField		from '@material-ui/core/TextField';
import '../index.css';
import Paper		from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter		from '@material-ui/core/TableFooter';
import TablePagination		from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import Drawer		from '@material-ui/core/Drawer';
import Menu		from '../components/common/Menu';
import ListItemIcon		from '@material-ui/core/ListItemIcon';
import ListItemText		from '@material-ui/core/ListItemText';
import GSInputLabel		from '../components/common/InputLabel';
import MenuItem		from '@material-ui/core/MenuItem';
import Grid		from '@material-ui/core/Grid';
import IconSettings		from '@material-ui/icons/Settings';
import IconSearch		from '@material-ui/icons/Search';
import InputAdornment		from '@material-ui/core/InputAdornment';
import IconCloudDownload		from '@material-ui/icons/CloudDownload';
import confirm		from '../components/common/confirm';
import alert		from '../components/common/alert';
import notification		from '../components/common/notification';
import Inspector from 'react-inspector';

storiesOf('Welcome', module)
	.add('Greenstand logo', 
		() => <IconLogo/>
	);

function TypographyTest(){
	//{{{
  return (
    <div>
      <Typography variant="h1">
        h1. Heading
      </Typography>
      <Typography variant="h2" gutterBottom>
        h2. Heading
      </Typography>
      <Typography variant="h3" gutterBottom>
        h3. Heading
      </Typography>
      <Typography variant="h4" gutterBottom>
        h4. Heading
      </Typography>
      <Typography variant="h5" gutterBottom>
        h5. Heading
      </Typography>
      <Typography variant="h6" gutterBottom>
        h6. Heading
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      </Typography>
      <Typography variant="body1" gutterBottom>
        body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography variant="body2" gutterBottom>
        body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography variant="button" display="block" gutterBottom>
        button text
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        caption text
      </Typography>
      <Typography variant="overline" display="block" gutterBottom>
        overline text
      </Typography>
    </div>
  );
	//}}}
}

const PaletteTest		= withTheme(function(props){
	//{{{
	const {theme}		= props
	console.error('theme:%o', theme)
	return (
		<div>
			<h1>background color</h1>
			{['primary', 'secondary', 'error'].map(key => 
				<>
				<div
					style={{
						width		: 200,
						height		: 40,
						background		: theme.palette[key].main,
						color		: theme.palette[key].contrastText,
					}}
				>
					{key}.main
				</div>
				<div
					style={{
						width		: 200,
						height		: 40,
						background		: theme.palette[key].light,
						color		: theme.palette[key].contrastText,
					}}
				>
					{key}.light
				</div>
				<div
					style={{
						width		: 200,
						height		: 40,
						background		: theme.palette[key].dark,
						color		: theme.palette[key].contrastText,
					}}
				>
					{key}.dark
				</div>
				</>
			)}
			<h1>text color</h1>
			{['primary', 'secondary', 'disabled', 'hint'].map(key =>
				<div
					style={{
						color		: theme.palette.text[key],
					}}
				>
					{key}
				</div>
			)}
			<h1>some custom value</h1>
				<div
					style={{
						background		: theme.palette.primary.lightVery,
						padding		: 10,
						height		: 40,
					}}
				>
					theme.palette.primary.lightVery		(a very light primary color value)
				</div>
			<h1>grey</h1>
			{Object.keys(theme.palette.grey).map(key =>
				<div
					style={{
						color		: 'white',
						background		: theme.palette.grey[key],
					}}
				>
					{key}
				</div>
			)}
		</div>
	)
	//}}}
})

storiesOf('MatirialUITheme', module)
	.add('Theme', () => 
		<ThemeProvider theme={themeNew} >
			<h1>The theme we are using</h1>
			<Inspector
				data={themeNew}
				expandLevel={1}
			/>
		</ThemeProvider>
	)
	.add('Typography', () => 
		<ThemeProvider theme={themeNew} >
			<TypographyTest/>
		</ThemeProvider>
	)
	.add('Palette', () => {
    console.log('the theme:', themeNew)
    return (
		<ThemeProvider theme={themeNew} >
			<PaletteTest/>
		</ThemeProvider>
    )
  }
	)
