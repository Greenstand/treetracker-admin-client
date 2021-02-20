/*
 * Label put above the form input (text field)
 */
import React		from 'react';
import Box		from '@material-ui/core/Box';
import Typography		from '@material-ui/core/Typography';

export default function GSInputLabel({text}){
	return (
		<Box pt={2} pb={2} >
			<Typography variant='subtitle1' >{text}</Typography>
		</Box>
	)
}
