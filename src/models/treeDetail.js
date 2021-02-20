/*
 * The model for the TreeDetailDialog component
 */
import * as loglevel from 'loglevel'
import api from '../api/treeTrackerApi'

const log = loglevel.getLogger('../models/treeDetail')

const STATE_EMPTY = {
  tree: null,
  species: null,
  tags: [],
}

const treeDetail = {
  state: STATE_EMPTY,
  reducers: {
    setTree(state, tree) {
      return { ...state, tree }
    },
    setSpecies(state, species) {
      return { ...state, species }
    },
    setTags(state, tags) {
      return { ...state, tags }
    },
    reset() {
      return STATE_EMPTY
    },
  },
  effects: {
    async getTreeDetail(id) {
      this.reset()
      
      return Promise.all([
        this.getTree(id).then(tree => {
          this.getSpecies(tree && tree.speciesId)
          this.getTags(tree && tree.treeTags)
        }),
      ])
    },
    async getTree(id) {
      if (id == null) {
        log.debug('getTree called with no id')
        return Promise.resolve(STATE_EMPTY.tree)
      }

      return api.getTreeById(id).then(tree => {
        this.setTree(tree)
        return tree
      })
    },
    async getSpecies(speciesId) {
      if (speciesId == null) {
        log.debug('getSpecies called with no speciesId')
        return Promise.resolve(STATE_EMPTY.speciesId)
      }

      return api.getSpeciesById(speciesId).then(species => {
        this.setSpecies(species)
        return species
      })
    },
    async getTags(treeTags) {
      if (treeTags == null) {
        log.debug('getTags called with no speciesId')
        return Promise.resolve(STATE_EMPTY.tags)
      }

      Promise.all(
        treeTags.map(tag => {
          return api.getTagById(tag.tagId)
        })
      ).then(tags => {
        this.setTags(tags)
        return tags
      })
    }
  },
}

export default treeDetail
