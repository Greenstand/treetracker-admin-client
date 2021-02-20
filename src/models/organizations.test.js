import {init}		from '@rematch/core';
import organizations		from './organizations';
import * as loglevel		from 'loglevel';

const log		= loglevel.getLogger('../models/organizations.test');


describe('organizations', () => {
	//{{{
	let store
	let api

	beforeEach(() => {
		//mock the api
		api		= require('../api/treeTrackerApi').default
    api.getOrganizations = () => {
      log.debug('mock getOrganizations:')
      return Promise.resolve([{
        id: 0,
        name: 'Dummy Org',
      },{
        id: 1,
        name: 'Another Org',
      }])
    }
	})

	describe('with a default store', () => {
		//{{{
		beforeEach(() => {
			store		= init({
				models		: {
					organizations,
				},
			})
		})

    describe('load organizations', () => {
      beforeEach(async () => {
        await store.dispatch.organizations.loadOrganizations()
      })

      it('loaded 2 organizations', () => {
        expect(store.getState().organizations.organizationList).toHaveLength(2)
      })
    })

		//}}}
	})

	//}}}
})

