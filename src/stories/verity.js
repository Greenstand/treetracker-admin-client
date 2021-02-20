import React from 'react'
import { storiesOf } from '@storybook/react';
import LinearProgress from '@material-ui/core/LinearProgress';
import AppBar from '@material-ui/core/AppBar';
import Modal from '@material-ui/core/Modal';
import TreeImageScrubber		from '../components/TreeImageScrubber';
import verity		from '../models/verity';
import {ThemeProvider, useTheme, }		from '@material-ui/styles';
import theme		from '../components/common/theme';
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import * as models from '../models'
import api		from '../api/treeTrackerApi';

const store = init({ models });

function TestVerity(){
	const refContainer		= React.useRef()
	
	function getContainerRef(){
		return refContainer.current
	}
	return(
		<Provider
			store={store}
		>
			<ThemeProvider theme={theme}>
				<div
					ref={refContainer}
					style={{
						width		: '100%',
						height		: 600,
						overflow		: 'scroll',
					}}
				>
					<TreeImageScrubber
						getScrollContainerRef={getContainerRef}
					/>
				</div>
			</ThemeProvider>
		</Provider>
	)
}

storiesOf('verity', module)
	.add('verity', function(){
			//mock the api
			api.getTreeImages		= (() => {
				let counter		= 0
				let id		= 100
				return function(){
					switch(counter++){
						case 0:{
							return Promise.resolve(Array.from(new Array(6)).map((e,i) => ({
									id		: id-- ,
									planterId		: 2,
									deviceId		: 3,
									imageUrl		: 'http://xxx',
									i
							})))
							break;
						}
						case 1:{
							//last page
							return Promise.resolve(Array.from(new Array(5)).map((e,i) => ({
									id		: id-- ,
									imageUrl		: 'http://xxx',
							})))
						}
						default:{
							//finished
							return Promise.resolve([])
						}
					}
				}
			})()
			api.approveTreeImage		= () => new Promise(r => setTimeout(() => r(true), 500))
			api.rejectTreeImage		= () => new Promise(r => setTimeout(() => r(true), 500))
			api.undoTreeImage		= () => new Promise(r => setTimeout(() => r(true), 500))
      api.getSpecies = () => {
        return [
          {
            id: 0,
            name: 'apple',
          },{
            id: 1,
            name: 'pineapple2',
          }
        ]
      }
      api.createSpecies =() => {
        return {
          id: 108,
          name: 'orange',
        }
      }

			return (
				<TestVerity/>
			)
	})
	.add('verityApproveAllWithError', function(){
			//mock the api
			api.getTreeImages		= (() => {
				let counter		= 0
				let id		= 0
				return function(){
					switch(counter++){
						case 0:{
							return Promise.resolve(Array.from(new Array(6)).map((e,i) => ({
									id		: id++ ,
									imageUrl		: 'http://xxx',
							})))
							break;
						}
						case 1:{
							//last page
							return Promise.resolve(Array.from(new Array(5)).map((e,i) => ({
									id		: id++ ,
									imageUrl		: 'http://xxx',
							})))
						}
						default:{
							//finished
							return Promise.resolve([])
						}
					}
				}
			})()

			api.approveTreeImage		= (() => {
				let counter		= 0
				return function(){
					switch(counter++){
						case 0:
						case 1:{
							return new Promise(r => setTimeout(() => r(true), 500))
						}
						default:{
							throw Error('mock error when approve')
						}
					}
				}
			})()

			api.rejectTreeImage		= () => new Promise(r => setTimeout(() => r(true), 500))

			return (
				<TestVerity/>
			)
	})
