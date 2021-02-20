import Filter from './Filter'

describe('Filter, with initial values about this filter object', () => {
	let filter

	beforeEach(() => {
		filter = new Filter()
		filter.treeId = 10
		filter.dateStart = '2019-07-25'
		filter.dateEnd = '2019-07-30'
		filter.approved = true
		filter.active	= true
		filter.planterId = '1'
		filter.deviceId = '1'
		filter.planterIdentifier = '1'
	})

	it('getWhereObj() should be: ', () => {
		expect(filter.getWhereObj()).toEqual(expect.objectContaining({id: 10}))
	})

	it('getWhereObj() should match: timeCreated between', () => {
		expect(filter.getWhereObj()).toEqual(expect.objectContaining({timeCreated: {between: ['2019-07-25', '2019-07-30']}}))
	})

	it('getWhereObj() should match: approved=true', () => {
		expect(filter.getWhereObj()).toEqual(expect.objectContaining({approved: true}))
	})

	it('getWhereObj() should match: active=true', () => {
		expect(filter.getWhereObj()).toEqual(expect.objectContaining({active: true}))
	})

	describe('change approved = false', () => {
		//{{{
		beforeEach(() => {
			filter.approved		= false
		})

		it('getWhereObj() should be approved=false', () => {
			expect(filter.getWhereObj()).toEqual(expect.objectContaining({approved: false}))
		})

		//}}}
	})

	it('getWhereObj() should match: planterId=1', () => {
		expect(filter.getWhereObj()).toEqual(expect.objectContaining({planterId: '1'}))
	})

	it('getWhereObj() should match: deviceId=1', () => {
		expect(filter.getWhereObj()).toEqual(expect.objectContaining({deviceId: '1'}))
	})

	it('getWhereObj() should match: planterIdentifier=1', () => {
		expect(filter.getWhereObj()).toEqual(expect.objectContaining({planterIdentifier: '1'}))
	})

	describe('set treeId = ""', () => {
		//{{{
		beforeEach(() => {
			filter.treeId		= ''
		})

		it('loopback object should not match any [id]', () => {
			expect(filter.getWhereObj()).not.toHaveProperty('id')
		})
		//}}}
	})

	describe('set planterId = ""', () => {
		//{{{
		beforeEach(() => {
			filter.planterId		= ''
		})

		it('loopback object should not match any [planterId]', () => {
			console.error('the where:', filter.getWhereObj())
			expect(filter.getWhereObj()).not.toHaveProperty('planterId')
		})
		//}}}
	})

	describe('set deviceId = ""', () => {
		//{{{
		beforeEach(() => {
			filter.deviceId		= ''
		})

		it('loopback object should not match any deviceId', () => {
			expect(filter.getWhereObj()).not.toHaveProperty('deviceId')
		})
		//}}}
	})

	describe('set planterIdentifier = ""', () => {
		//{{{
		beforeEach(() => {
			filter.planterIdentifier		= ''
		})

		it('loopback object should not match any planterIdentifier', () => {
			expect(filter.getWhereObj()).not.toHaveProperty('planterIdentifier')
		})
		//}}}
	})

	describe('remove dateStart', () => {
		//{{{
		beforeEach(() => {
			delete filter.dateStart
		})

		it('should be lte', () => {
			expect(filter.getWhereObj()).toEqual(expect.objectContaining({timeCreated: {lte: '2019-07-30'}}))
		})
		//}}}
	})

	describe('remove dateEnd', () => {
		//{{{
		beforeEach(() => {
			delete filter.dateEnd
		})

		it('should be gte', () => {
			expect(filter.getWhereObj()).toEqual(expect.objectContaining({timeCreated: {gte: '2019-07-25'}}))
		})
		//}}}
	})

	describe('new Filter({approved:false})', () => {
		//{{{
		beforeEach(() => {
			filter		= new Filter({
				approved		: false,
			})
		})

		it('filter.approved should be false', () => {
			expect(filter.approved).toBe(false)
		})

		//}}}
	})

	describe('a data array', () => {
		//{{{
		let data

		beforeEach(() => {
			data		= [{
				id		: 'a',
				active		: true,
				approved		: false,
			},{
				id		: 'b',
				active		: true,
				approved		: true,
			},{
				id		: 'c',
				active		: false,
				approved		: true,
			}]
		})

		describe('new Filter({active: true, approved:false})', () => {
			//{{{
			let filter

			beforeEach(() => {
				filter		= new Filter({
					active		: true,
					approved		: false,
				})
			})

			it('filter() should get a ', () => {
				expect(data.filter(filter.filter)).toHaveLength(1)
				expect(data.filter(filter.filter)[0].id).toBe('a')
			})

			//}}}
		})

		describe('new Filter({active: false, approved:true})', () => {
			//{{{
			let filter

			beforeEach(() => {
				filter		= new Filter({
					active		: false,
					approved		: true,
				})
			})

			it('filter() should get c ', () => {
				expect(data.filter(filter.filter)).toHaveLength(1)
				expect(data.filter(filter.filter)[0].id).toBe('c')
			})

			//}}}
		})


		//}}}
	})


})
