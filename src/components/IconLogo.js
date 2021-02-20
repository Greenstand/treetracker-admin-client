/*
 * Just a logo icon
 */
import React		from 'react'

export default function IconLogo(){
	return (
		<img
			style={{
				maxWidth		: 149,
				maxHeight		: 32,
        marginBottom: '-6px'
			}}
			src={require('./images/logo.png')}
			alt='Greenstand logo'/>
	)
}
