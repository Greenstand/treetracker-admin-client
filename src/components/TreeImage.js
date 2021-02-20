/*
 * The image of tree, used to verify a tree, in the verify page
 */
import React		from 'react';
import Card		from '@material-ui/core/Card';
import CardMedia		from '@material-ui/core/CardMedia';
import {makeStyles}		from '@material-ui/styles';
import CardActions		from '@material-ui/core/CardActions';
import IconButton		from '@material-ui/core/IconButton';
import IconCheck		from '@material-ui/icons/Check';
import IconClose		from '@material-ui/icons/Close';
import IconMore		from '@material-ui/icons/MoreHoriz';
import IconInfo		from '@material-ui/icons/InfoOutlined';
import Grid		from '@material-ui/core/Grid';
import Collapse		from '@material-ui/core/Collapse';
import MenuList		from '@material-ui/core/MenuList';
import MenuItem		from '@material-ui/core/MenuItem';
import ListItemIcon		from '@material-ui/core/ListItemIcon';
import Typography		from '@material-ui/core/Typography';

const useStyles		= makeStyles(() => ({
	card		: {
		width		: 177,
	},
	cardMedia		: {
		height		: 160,
		width		: 177,
		backgroundSize		: 'contain',
	},
	iconButton		: {
		padding		: 0,
	},
	listMenuItem		: {
		minWidth		: 44,
	},
}))

const menuItems		= [
	{
		name		: 'Planted',
		icon		: <IconCheck
								color='primary'
							/>,
	},{
		name		: 'Hole dug',
		icon		: <IconCheck
								color='primary'
							/>,
	},{
		name		: 'Not a tree',
		icon		: <IconCheck
								color='error'
							/>,
	},{
		name		: 'Blurry',
		icon		: <IconCheck
								color='error'
							/>,
	}
]

export default function TreeImage(props){
	const classes		= useStyles();
	const [isCollapsed, setCollapsed]		= React.useState(true) 

	function toggleCollapse(){
		setCollapsed(!isCollapsed)
	}

	return (
		<Card
			className={classes.card}
			elevation={4}
		>
			<CardMedia
				className={classes.cardMedia}
				image={require('./images/logo.png')}
				title=''
			/>
			<CardActions>
				<Grid 
						justify='space-between'
						container>
					<Grid item>
						<Grid 
							spacing={4}
							container>
							<Grid item>
								<IconButton
									className={classes.iconButton}
								>
									<IconCheck
										color='primary'
									/>
								</IconButton>
							</Grid>
							<Grid item>
								<IconButton
									className={classes.iconButton}
								>
									<IconClose
										color='error'
									/>
								</IconButton>
							</Grid>
							<Grid item>
								<IconButton
									className={classes.iconButton}
									onClick={toggleCollapse}
								>
									<IconMore
										color='disabled'
									/>
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<IconButton
							className={classes.iconButton}
						>
							<IconInfo
								color='disabled'
							/>
						</IconButton>
					</Grid>
				</Grid>
			</CardActions>
			<Collapse in={!isCollapsed} timeout='auto'>
				<MenuList>
				{menuItems.map(item => 
					<MenuItem key={item.name}>
						<ListItemIcon className={classes.listMenuItem}>
							{item.icon}
						</ListItemIcon>
						<Typography>{item.name}</Typography>
					</MenuItem>
				)}
				</MenuList>
			</Collapse>
		</Card>
	)
}
