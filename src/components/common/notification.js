/*
 * A utility just show some notificiation
 * TODO still not support show mutiple notification at the same time.
 */
import React, {useState}		from 'react';
import ReactDOM		from 'react-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as d3		from 'd3-selection';
import theme		from './theme';
import {ThemeProvider, useTheme, }		from '@material-ui/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton		from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import Grid		from '@material-ui/core/Grid';
import { amber, green } from '@material-ui/core/colors';

const icons = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

export default function notification(
	message,
	type		= 'info' ,
	delay		= 3000,
){
	return new Promise((resolve, reject) => {

		const Icon		= icons[type]

		function handleClose(isConfirmed:boolean){
			d3.select('.confirm-container').remove()
			d3.select('#confirmDialog').remove()
			resolve(isConfirmed)
		}

		setTimeout(() => {
			handleClose()
		}, delay)

		let style		= {
			backgroundColor		: theme.palette.primary.main,
			maxWidth		: 400,
			position		: 'fixed',
			bottom		: 10,
			left		: 10,
		}

		switch(type){
			case 'success':{
				style.backgroundColor		= green[600];
				break;
			}
			case 'warning':{
				style.backgroundColor		= amber[700];
				break;
			}
			case 'error':{
				style.backgroundColor		= theme.palette.error.main;
				break;
			}
		}

		const dialog		= 
			<ThemeProvider theme={theme} >
				<SnackbarContent
					style={style}
					aria-describedby="client-snackbar"
					message={
						<Grid 
							container
							spacing={1}
							justify='flex-start'
							alignItems='center'
						>
							<Grid item>
								<Icon/>
							</Grid>
							<Grid item>
								{message}
							</Grid>
						</Grid>
					}
					action={[
						<IconButton 
							key="close" 
							aria-label="Close" 
							color="inherit" 
							onClick={handleClose} 
						>
							<CloseIcon />
						</IconButton>,
					]}
				/>
			</ThemeProvider>
		d3.select('body').append('div')
			.classed('confirm-container', true)
			.append('div')
			.classed('confirm-dialog', true)
		ReactDOM.render(
			dialog,
			d3.select('.confirm-dialog').node(),
		)
	})
}
