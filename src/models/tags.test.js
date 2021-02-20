import {init} from '@rematch/core';
import tags from './tags';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../models/tags.test');

const TAGS = [{
  id: 0,
  tagName: 'tag_b',
  public: true,
  active: true,
},{
  id: 1,
  tagName: 'tag_a',
  public: true,
  active: true,
}]

describe('tags', () => {
  //{{{
  let store
  let api

  beforeEach(() => {
    //mock the api
    api = require('../api/treeTrackerApi').default
    api.getTags = (filter) => {
      log.debug('mock getTags:')
      return Promise.resolve(TAGS)
    }
    api.createTag = jest.fn((tagName) => {
      log.debug('mock createTag')
      return Promise.resolve({
        id: 2,
        tagName: 'new_tag',
        public: true,
        active: true,
      })
    })
  })

  describe('with a default store', () => {
    //{{{
    beforeEach(() => {
      store    = init({
        models    : {
          tags,
        },
      })
    })

    describe('query all tags', () => {
      beforeEach(async () => {
        await store.dispatch.tags.getTags()
      })

      it('loaded all tags', () => {
        expect(store.getState().tags.tagList.map(t => t.id).sort()).toStrictEqual(TAGS.map(t => t.id).sort())
      })

      it('tags are sorted alphabetically', () => {
        const tagNames = store.getState().tags.tagList.map(el => el.tagName);
        expect(tagNames).toStrictEqual(['tag_a','tag_b'])
      })

      describe('input: new_tag, create tags', () => {
        beforeEach(async () => {
          await store.dispatch.tags.setTagInput(['newly_created_tag'])
          await store.dispatch.tags.createTags()
        })

        it('api.createTag should be called with newly_created_tag', () => {
          expect(api.createTag.mock.calls[0][0]).toBe('newly_created_tag')
        })
      })

    })

    //}}}
  })

  //}}}
})

