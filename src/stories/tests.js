import React from 'react'
import { storiesOf } from '@storybook/react';
import LinearProgress from '@material-ui/core/LinearProgress';
import AppBar from '@material-ui/core/AppBar';
import Modal from '@material-ui/core/Modal';
import * as loglevel		from 'loglevel';

const log		= loglevel.getLogger('../stories/tests')

function TestProgress(){
		const count		= 100
		const [isApproving, setApproving] = React.useState(false)
		const [complete, setComplete]		= React.useState(0)
		const [pictures, setPictures] = React.useState(Array.from(new Array(count)).map((e,i) => i))
		const [isAllSelected, setAllSelected]		= React.useState(false)
		//[0, 2] select 0-2
		const [range, setRange]		= React.useState([-1, -1])
		console.log('with pictures:%d', pictures.length)

		React.useEffect(() => {
			console.log('approve...')
			let timer
			if(isApproving && range[0] >= 0 && range[1] >= 0){
				timer		= setTimeout(() => {
					if(range[0] > range[1]){
						setRange([-1, -1])
					}else{
						//pictures.shift()
						const picturesNew		= [
							...pictures.slice(0, range[1] - 1),
							...pictures.slice(range[1]),
						]
						log.log('new list:', picturesNew)
						setPictures(picturesNew)
						const rangeNew		= [range[0], range[1] - 1]
						log.log('range new:', rangeNew)
						setRange(rangeNew)
					}
				}, 300)
			}else if(isApproving && range[0] === -1 && range[1] === -1){
				console.log('finished')
				setApproving(false)
//				setTimeout(() => {
//					window.alert('all tree has been approved')
//				}, 100)
			}
			return () => {
				clearInterval(timer)
			}
		}, [isApproving, pictures, range])

		//set the complete of progress
		React.useEffect(() => {
			setComplete((count - pictures.length) * count)
		}, [pictures])

		function handleApproveAll(){
			if(window.confirm(
				`are you sure to approve these ${range[1] - range[0]} trees?`,
			)){
				setApproving(true)
			}
		}

		//click picture to select it
		function handlePictureClick(e, i){
			console.log('click with:', e.shiftKey)
			console.log('set range:', i)
			if(e.shiftKey){
				setRange([Math.min(i, range[0]), Math.max(i, range[1])])
			}else{
				setRange([i, i])
			}
		}

		function handleSelectAll(){
			if(isAllSelected){
				setRange([-1, -1])
				setAllSelected(false)
			}else{
				setAllSelected(true)
				setRange([0, count])
			}
		}

		return (
			<div>
				<h1>
					tree images
					{range[1] >= 0 && range[0] >= 0 &&
						<span>({range[1] - range[0] + 1} trees selected)</span>
					}
				</h1>
				<input type='checkbox' checked={isAllSelected} onClick={handleSelectAll} />select all
				<button onClick={handleApproveAll}>approve all</button>
				<div
					style={{
						display		: 'flex',
						flexWrap		: 'wrap',
						userSelect		: 'none',
					}}
				>
					{pictures.map((e,i) => 
						<div
							style={{
								width		: 200,
								height		: 200,
								border		: '2px solid black',
									'2px solid green'
									:
									'2px solid black',
								background		: i >= range[0] && i <= range[1] ?
									'green'
									:
									'white',
								margin		: 20,
							}}
							onClick={(e) => handlePictureClick(e,i)}
						>
							PICTURE {e}
						</div>
					)}
				</div>
				{isApproving &&
					<AppBar
						position='fixed'
						style={{
							zIndex		: 10000,
						}}
					>
						<LinearProgress
							color='primary'
							variant='determinate'
							value={complete}
						/>
					</AppBar>
				}
				{false && isApproving &&
					<div
						style={{
							position		: 'absolute',
							top		: 0,
							left		: 0,
							backgroundColor		: 'black',
							width		: '100%',
							height		: '100vh',
							opacity		: 0.5,
						}}
					>

					</div>
				}
				{isApproving && 
					<Modal open={true}>
						<div></div>
					</Modal>
				}
			</div>
		)
}

storiesOf('tests', module)
	.add('progress', () => 
		<TestProgress/>
	)
