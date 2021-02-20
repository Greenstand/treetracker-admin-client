import {init}		from '@rematch/core';
import species		from './species';
import * as loglevel		from 'loglevel';

const log		= loglevel.getLogger('../models/species.test');


describe('species', () => {
	//{{{
	let store
	let api

	beforeEach(() => {
		//mock the api
		api		= require('../api/treeTrackerApi').default
    api.getSpecies = () => {
      log.debug('mock getSpecies:')
      return Promise.resolve([{
        id: 0,
        name: 'Pine',
      },{
        id: 1,
        name: 'apple',
      }])
    }
    api.createSpecies = jest.fn(() => {
      log.debug('mock createSpecies')
      return Promise.resolve({
        id: 2,
        name: 'm',
      })
    })
    api.getTreeCountPerSpecies = jest.fn(() => {
      return Promise.resolve({ count: (Math.random() * 10) >> 0 })
    })
	})

	describe('with a default store', () => {
		//{{{
		beforeEach(() => {
			store		= init({
				models		: {
					species,
				},
			})
		})

    describe('load species', () => {
      beforeEach(async () => {
        await store.dispatch.species.loadSpeciesList()
      })

      it('loaded 2 species', () => {
        expect(store.getState().species.speciesList).toHaveLength(2)
      })

      it('species are sorted alphabetically', () => {
        const speciesNames = store.getState().species.speciesList.map(el => el.name);
        expect(speciesNames).toStrictEqual(['apple','Pine'])
      })

      describe('input: water melon, create species', () => {
        beforeEach(async () => {
          await store.dispatch.species.onChange('water melon')
          await store.dispatch.species.createSpecies({ name: 'water melon' })
        })

        it('api.createSpecies should be called with water melon', () => {
          expect(api.createSpecies.mock.calls[0][0].name).toBe('water melon')
        })

        it('species list should be 3(added)', () => {
          expect(store.getState().species.speciesList).toHaveLength(3)
        })
      })

    })

		//}}}
	})

	//}}}
})

