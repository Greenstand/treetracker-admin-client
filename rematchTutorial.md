# A simple tutorial for Rematch/Redux

This simple tutorial explains why and how to use Rematch/Redux in our project.

Some points in this tutorial might be somewhat subjective; if you have any suggestions or opinions, please feel free to correct us or contribute to this article directly.

## Why Redux

Redux brings many benefits, one of them is that Redux gives us a universal and simple way to let components communicate with each other. For example, say we have a web app, to build all functionality on it, we created a component tree, see the picture:

<img alt="figure for redux" src="https://raw.githubusercontent.com/Greenstand/treetracker-admin/infrastructure/rebuild/figure_redux.png" width="600" >

The first one is 'R', it is also the root component. So, if component A wants to communicate with B (say click a button on A to let component B show or hide something), if we use an original way to do so, the pass of the function-call will be a nightmare, see the 'Raw' section in the picture.

Some people use React Context to replace Redux, and this is another solution. Yes, in some simple cases, it works, but in case of complicated situations, it is not good enough. Like this example, it needs people to add some code in the Root component. (Section 'Context')

However, if using Redux, it works like a message bus, so, handling this case is easy and graceful. (Section 'Redux')

And Redux also decouples the logic code and view code. If a component is complicated, it's good to strip the functional code from the presentation code. So you can build your model for it, and test it independently. Although you can use a library like Enzyme to test components, sometimes writing the test for components is difficult, especially you need to emulate the events.

## Why Rematch

Rematch is just a lightweight library above Redux, the best benefit of it is using Rematch, we can save a pretty amount of boilerplate code. It didn't change too much, compare to Redux.

## How to

To illustrate how to use Rematc, I will give a real example in our project. This example demonstrates how to migrate from a raw React component to a Redux-connected component with Rematch.

Below is a component: TreeImageScrubber, the main job for this component is: load a list of tree by requesting the cloud API server, and display the trees; when user scroll down to the end of the list, trigger a new request and load more trees; click 'approve'/'reject' button to approve/reject a tree.

<details>
<summary>
Original TreeImageScrubber.js (click to check it)
</summary>

```
import React, { useEffect, useReducer } from 'react'
import {
  getTreeImages,
  approveTreeImage,
  rejectTreeImage
} from '../api/treeTrackerApi'

import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button' // replace with icons down the line
import { selectedHighlightColor } from '../common/variables.js'
import * as loglevel from 'loglevel'

const log = loglevel.getLogger('../components/TreeImageScrubber')

const styles = theme => ({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '2rem 2rem 4rem'
  },
  cardImg: {
    width: '100%',
    height: 'auto'
  },
  cardTitle: {
    color: '#f00'
  },
  card: {
    cursor: 'pointer',
    margin: '0.5rem',
    border: `2px #eee solid`
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`
  },
  cardMedia: {
    height: '12rem'
  },
  cardWrapper: {
    width: '33.33%'
  }
})

const initialState = {
  treeImages: [],
  isLoading: false,
  pagesLoaded: -1,
  moreTreeImagesAvailable: true,
  pageSize: 20
};

const reducer = (state, action) => {
  let treeImages = {}
  switch (action.type) {
    case 'loadMoreTreeImages':
      let newTreeImages = [...state.treeImages, ...action.treeImages]
      let newState = {
        ...state,
        treeImages: newTreeImages,
        isLoading: action.isLoading
      };
      return newState;
    case "noMoreTreeImages":
      return {
        ...state,
        isLoading: false,
        moreTreeImagesAvailable: false
      };
    case "approveTreeImage":
      treeImages = state.treeImages.filter(
        treeImage => treeImage.id !== action.id
      )
      return { ...state, treeImages: treeImages }
    case 'rejectTreeImage':
      treeImages = state.treeImages.filter(
        treeImage => treeImage.id !== action.id
      )
      return { ...state, treeImages: treeImages }
    default:
      throw new Error('the actions got messed up, somehow!')
  }
}

const TreeImageScrubber = ({ classes, getScrollContainerRef, ...props }) => {
	log.debug('render TreeImageScrubber...')
  const [state, dispatch] = useReducer(reducer, { ...initialState })
  let treeImages = state.treeImages;
  let scrollContainerRef;
  const onApproveTreeImageClick = (e, id) => {
    approveTreeImage(id)
      .then(result => {
        dispatch({ type: 'approveTreeImage', id })
      })
      .catch(e => {
        // don't change the state if the server couldnt help us
        alert("Couldn't approve Tree Image: " + id + '!', e)
      })
  }

  const onRejectTreeImageClick = (e, id) => {
    rejectTreeImage(id)
      .then(result => {
        dispatch({ type: 'rejectTreeImage', id })
      })
      .catch(e => {
        // don't change the state if the server couldnt help us
        alert("Couldn't reject Tree Image: " + id + '!', e)
      })
  }

  const setIsLoading = loading => {
    state.isLoading = loading
  }

  const needtoLoadMoreTreeImages = () => {
    return state.moreTreeImagesAvailable && treeImages.length < state.pageSize;
  };

  const loadMoreTreeImages = () => {
    if (state.isLoading || !state.moreTreeImagesAvailable) return;
    setIsLoading(true);
    const nextPage = state.pagesLoaded + 1;
    const pageParams = {
      page: nextPage,
      rowsPerPage: state.pageSize
    }
    getTreeImages(pageParams)
      .then(result => {
        state.pagesLoaded = nextPage;
        dispatch({
          type: "loadMoreTreeImages",
          treeImages: result,
          isLoading: false
        });
      })
      .catch(error => {
        // no more to load!
        dispatch({ type: "noMoreTreeImages" });
      });
  };

  const handleScroll = e => {
    if (
      state.isLoading ||
      (scrollContainerRef &&
        Math.floor(scrollContainerRef.scrollTop) !==
          Math.floor(scrollContainerRef.scrollHeight) -
            Math.floor(scrollContainerRef.offsetHeight))
    ) {
      return
    }
    loadMoreTreeImages()
  }

  scrollContainerRef = getScrollContainerRef();
  if (scrollContainerRef) {
    scrollContainerRef.addEventListener("scroll", handleScroll);
  }

  useEffect(() => {
    if (needtoLoadMoreTreeImages()) {
      loadMoreTreeImages();
    }

    return () => {
      if (scrollContainerRef) {
        scrollContainerRef.removeEventListener('scroll', handleScroll)
      }
    };
  }, [state]);

  let treeImageItems = treeImages.map(tree => {
    if (tree.imageUrl) {
      return (
        <div className={classes.cardWrapper} key={tree.id}>
          <Card id={`card_${tree.id}`} className={classes.card}>
            <CardContent>
              <CardMedia className={classes.cardMedia} image={tree.imageUrl} />
              <Typography gutterBottom>Tree# {tree.id}</Typography>
            </CardContent>
            <CardActions>
              <Button
                color="secondary"
                size="small"
                onClick={e => onRejectTreeImageClick(e, tree.id)}
              >
                Reject
              </Button>
              <Button
                color="primary"
                size="small"
                onClick={e => onApproveTreeImageClick(e, tree.id)}
              >
                Approve
              </Button>
            </CardActions>
          </Card>
        </div>
      )
    }
  })

  return <section className={classes.wrapper}>{treeImageItems}</section>
}

export default compose(
  withStyles(styles, { withTheme: true, name: 'ImageScrubber' })
)(TreeImageScrubber)
```
</details>

This component was written in style of React Hook, and used the hook: useReducer, if you are not familiar about hook, please check the document on the official website. We will stick with the hook style, but change to use Rematch to control the state of this component.

To change to use Rematch, first, we need to build a model, and move all of the states in the component (both include states in the component and the states in the way of 'useReducer'), here is the code:

<details>
<summary>
model.js (click to check it)
</summary>

```
/*
 * The model for treeImageScrubber.js
 */
import * as loglevel		from 'loglevel'
import * as api		from '../api/treeTrackerApi'

const log		= loglevel.getLogger('../models/model')

const model = {
	state		 : {
		treeImages		: [],
		isLoading		: false,
		pagesLoaded		: -1,
		moreTreeImagesAvailable		: true,
		pageSize		: 20,
	},
	reducers		: {
		appendTreeImages(state, treeImages){
      let newTreeImages = [...state.treeImages, ...treeImages]
      let newState = {
        ...state,
        treeImages: newTreeImages,
				pagesLoaded		: state.pagesLoaded + 1,
				isLoading		: false,
      };
      return newState;
		},
		setLoading(state, isLoading){
			return {
				...state,
				isLoading,
			};
		},
		setPagesLoaded(state, pagesLoaded){
			return {
				...state,
				pagesLoaded,
			}
		},
		approvedTreeImage(state, treeId){
      const treeImages = state.treeImages.filter(
        treeImage => treeImage.id !== treeId
      )
      return { ...state, treeImages: treeImages }
		},
		rejectedTreeImage(state, treeId){
      const treeImages = state.treeImages.filter(
        treeImage => treeImage.id !== treeId
      )
      return { ...state, treeImages: treeImages }
		},

	},
	effects		: {
		/*
		 * approve a tree, given tree id
		 */
		async approveTreeImage(id){
			await api.approveTreeImage(id)
			this.approvedTreeImage(id)
			return true
		},
		/*
		 * reject a tree, given tree id
		 */
		async rejectTreeImage(id){
			await api.rejectTreeImage(id)
			this.rejectedTreeImage(id)
			return true
		},
		/*
		 * To load more trees into the list
		 */
		async loadMoreTreeImages(payload, state){
			//{{{
			log.debug('to load images')
			const verityState		= state.verity
			if (verityState.isLoading || !verityState.moreTreeImagesAvailable){
				log.debug('cancel load because condition doesn\'t meet')
				return true;
			}
			//set loading status
			this.setLoading(true)
			const nextPage = verityState.pagesLoaded + 1;
			const pageParams = {
				page: nextPage,
				rowsPerPage: verityState.pageSize
			};
			log.debug('load page with params:', pageParams)
			const result		= await api.getTreeImages(pageParams)
			//verityState.pagesLoaded = nextPage;
			this.appendTreeImages(result);
			//restore loading status
			this.setLoading(false)
			return true;
			//}}}
		},
	},
}

export default model
```
</details>

To add this model to Redux, we need init Rematch like this:

```
import {init}		from '@rematch/core';
import model		from './model';

store		= init({
    models		: {
        model,
    },
})
```

Then, let's use it in the component file.

<details>
<summary>
new TreeImageScrubber.js (click)
</summary>

```
import React, { useEffect, useReducer } from 'react'
import {connect}		from 'react-redux'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button' // replace with icons down the line
import { selectedHighlightColor } from '../common/variables.js';
import * as loglevel from 'loglevel';

const log = require('loglevel').getLogger('../components/TreeImageScrubber')

const styles = theme => ({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '2rem 2rem 4rem'
  },
  cardImg: {
    width: '100%',
    height: 'auto'
  },
  cardTitle: {
    color: '#f00'
  },
  card: {
    cursor: 'pointer',
    margin: '0.5rem',
    border: `2px #eee solid`
  },
  selected: {
    border: `2px ${selectedHighlightColor} solid`
  },
  cardMedia: {
    height: '12rem'
  },
  cardWrapper: {
    width: '33.33%'
  }
})

const TreeImageScrubber = ({ classes, getScrollContainerRef, ...props }) => {
	log.debug('render TreeImageScrubber...')
	log.debug('complete:', props.verityState.approveAllComplete)
	const [complete, setComplete]		= React.useState(0)
	
	/*
	 * effect to load page when mounted
	 */
	useEffect(() => {
		log.debug('mounted')
		props.verityDispatch.loadMoreTreeImages();
	}, [])

	/*
	 * effect to set the scroll event
	 */
	useEffect(() => {
		log.debug('verity state changed')
		//move add listener to effect to let it refresh at every state change
		let scrollContainerRef = getScrollContainerRef();
		const handleScroll = e => {
			if (
				scrollContainerRef &&
				Math.floor(scrollContainerRef.scrollTop) !==
					Math.floor(scrollContainerRef.scrollHeight) -
					Math.floor(scrollContainerRef.offsetHeight)
			) {
				return
			}
			props.verityDispatch.loadMoreTreeImages()
		}
		let isListenerAttached		= false
		if (
			scrollContainerRef &&
			//should not listen scroll when loading
			!props.verityState.isLoading
		) {
			log.debug('attaching listener')
			scrollContainerRef.addEventListener("scroll", handleScroll);
			isListenerAttached		= true
		}else{
			log.debug('do not attach listener')
		}

		return () => {
			if (isListenerAttached) {
				scrollContainerRef.removeEventListener('scroll', handleScroll)
			}
		}
	}, [props.verityState])

  let treeImageItems = props.verityState.treeImages.map(tree => {
    if (tree.imageUrl) {
      return (
				<div className={classes.cardWrapper} key={tree.id}>
					<Card id={`card_${tree.id}`} className={classes.card}>
						<CardContent>
							<CardMedia className={classes.cardMedia} image={tree.imageUrl} />
							<Typography gutterBottom>Tree# {tree.id}</Typography>
						</CardContent>
						<CardActions>
							<Button
								color="secondary"
								size="small"
								onClick={e => props.verityDispatch.rejectTreeImage(tree.id)}
							>
								Reject
							</Button>
							<Button
								color="primary"
								size="small"
								onClick={e => props.verityDispatch.approveTreeImage(tree.id)}
							>
								Approve
							</Button>
						</CardActions>
					</Card>
				</div>
      )
    }
  })

  return <section className={classes.wrapper}>{treeImageItems}</section>
}

export default compose(
	//redux
	connect(
		//state
		state		=> ({
			verityState		: state.verity,
		}),
		//dispatch
		dispatch		=> ({
			verityDispatch		: dispatch.verity,
		}),
	),
  withStyles(styles, { withTheme: true, name: 'ImageScrubber' })
)(TreeImageScrubber) 
```
</details>

That's all. We use Rematch api to wrap our model, the skeleton of model of Rematch like this:

```
{
    states      : {
        ...
    },
    reducers       : {
        ...
    },
    effects     : {
        ...
    }
}
```

States contain the initial states for this model. Reducer is the core reducer function to update these Redux states. And effects works similarly to Redux actions.

Then, connect this model to component with 'connect', a common HOC (High Order Component) way to wrap raw component and connect to Redux state.

```
connect(
    //state
    state		=> ({
        verityState		: state.verity,
    }),
    //dispatch
    dispatch		=> ({
        verityDispatch		: dispatch.verity,
    }),
),
```

Here, for convenience, I passed the whole state object (state.model) and dispatchs (dispatch.model) to component, you also can use the original way shown on official Redux website:

```
const mapState = state => {
  const keys = Object.keys(state.trees.data);
  return {
    treesArray: keys.map(id => ({
      ...state.trees.data[id]
    })),
    page: state.trees.page,
    rowsPerPage: state.trees.rowsPerPage,
    selected: state.trees.selected,
    order: state.trees.order,
    orderBy: state.trees.orderBy,
    numSelected: state.trees.selected.length,
    byId: state.trees.byId,
    isOpen: state.trees.displayDrawer.isOpen,
    tree: state.trees.tree,
    treeCount: state.trees.treeCount
  };
};

const mapDispatch = dispatch => ({
  getTreesAsync: ({ page, rowsPerPage, order, orderBy , filter}) =>
    dispatch.trees.getTreesAsync({
      page: page,
      rowsPerPage: rowsPerPage,
      order: order,
      orderBy: orderBy,
      filter: filter,
    }),
  getLocationName: (id, lat, lon) =>
    dispatch.trees.getLocationName({ id: id, latitude: lat, longitude: lon }),
  getTreeAsync: id => dispatch.trees.getTreeAsync(id),
  sortTrees: (order, orderBy) =>
    dispatch.trees.sortTrees({ order: order, orderBy: orderBy })
});

connect(
mapState,
mapDispatch
)(TreeTable)
```

With this approach, we can:

* Separate logic code and presentation code, by doing so, we make the component code pretty simple, as you see, the new TreeImageScrubber.js is less complicated than before. 

* We can test the model by writing unit test code, so, we can test almost all the core code/logic about this tree list functionality. Also, we will get benefit from it for future maintenance and bug fixing. Below is a example to test model.js .

## Unit Test Example
<details>
<summary>
model.test.js (click)
</summary>

```
import {init}		from '@rematch/core';
import verity		from './verity';

jest.mock('../api/treeTrackerApi')

//mock the api
const api		= require('../api/treeTrackerApi')
api.getTreeImages		= () => Promise.resolve([{
		id		: '1',
	}]);
api.approveTreeImage		= () => Promise.resolve(true);
api.rejectTreeImage		= () => Promise.resolve(true);

describe('verity', () => {
	let store

	beforeEach(() => {
		store		= init({
			models		: {
				verity,
			},
		})
	})

	it('check initial state', () => {
		expect(store.getState().verity.isLoading).toBe(false)
	})

	describe('loadMoreTreeImages() ', () => {
		beforeEach(async () => {
			const result		= await store.dispatch.verity.loadMoreTreeImages() 
			expect(result).toBe(true)
		})

		it('should get some trees', () => {
			expect(store.getState().verity.treeImages).toHaveLength(1)
		})

		describe('approveTreeImage(1)', () => {
			beforeEach(async () => {
				const result		= await store.dispatch.verity.approveTreeImage('1');
				expect(result).toBe(true)
			})

			it('state tree list should removed the tree, so, get []', () => {
				expect(store.getState().verity.treeImages).toHaveLength(0)
			})
		})

		describe('rejectTreeImage(1)', () => {
			beforeEach(async () => {
				const result		= await store.dispatch.verity.rejectTreeImage('1');
				expect(result).toBe(true)
			})

			it('state tree list should removed the tree, so, get []', () => {
				expect(store.getState().verity.treeImages).toHaveLength(0)
			})
		})
	})
})
```

</details>

And we can also test the component using Storybook, please check our Storybook test for this component. 

<img alt='storybook example' src='https://raw.githubusercontent.com/Greenstand/treetracker-admin/infrastructure/rebuild/figure_storybook.png' width='600' >

That's it, hope you enjoy coding with Rematch/Redux.

