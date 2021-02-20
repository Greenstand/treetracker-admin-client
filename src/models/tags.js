/*
 * The model for tag function
 */
import * as loglevel from 'loglevel'
import api from '../api/treeTrackerApi'
import * as _ from 'lodash';

const log		= loglevel.getLogger('../models/tags')

const tags = {
	state: {
		tagList: [],
    tagInput: [],
	},
	reducers: {
    appendToTagList(state, tags){
      const sortedTagList = _.unionBy(state.tagList, tags, 'id').sort(
        (a,b) => a.tagName.localeCompare(b.tagName)
      )
      return {
        ...state,
        tagList: sortedTagList,
      }
    },
    setTagInput(state, tags){
      return {
        ...state,
        tagInput: tags,
      }
    },
	},
	effects: {
    /*
     * Lazy-load tags on demand and append to existing lists
     */
    async getTags(filter){
      const newTags = await api.getTags(filter)
      log.debug('load more tags from api:', newTags.length)
      this.appendToTagList(newTags)
    },
    /*
     * check for new tags in tagInput and add them to the database
     */
    createTags(payload, state){
      const savedTags = state.tags.tagInput.map(async t => {
        return api.createTag(t)
      })

      return Promise.all(savedTags)
    },
	},
}

export default tags
