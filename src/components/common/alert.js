/*
 * A utility just like window.alert()
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
import {ThemeProvider, useTheme, }		from '@material-ui/core/styles';

export default function alert(
		title,
		message,
){
	return new Promise((resolve, reject) => {

		function handleClose(isConfirmed:boolean){
			d3.select('.confirm-container').remove()
			d3.select('#confirmDialog').remove()
			resolve(isConfirmed)
		}

		const dialog		= 
			<ThemeProvider theme={theme} >
				<Dialog
					open={true}
					onClose={handleClose}
					id='confirmDialog'
					PaperProps={{
						style		: {
							minWidth		: 400,
						},
					}}
				>
					<DialogTitle >{title}</DialogTitle>
					<DialogContent>
						<DialogContentText >
							{message}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => handleClose(true)} color="primary">
							OK
						</Button>
					</DialogActions>
				</Dialog>
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
