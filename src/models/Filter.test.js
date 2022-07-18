import { log } from 'loglevel';
import Filter from './Filter';

describe('Filter, with initial values about this filter object', () => {
  let filter;

  beforeEach(() => {
    filter = new Filter();
    filter.uuid = '11942400-6617-4c6c-bf5e';
    filter.captureId = '10';
    filter.planterId = '1-grower-account';
    filter.deviceIdentifier = '1-abcdef123456';
    filter.planterIdentifier = '1-wallet';
    filter.dateStart = '2019-07-25';
    filter.dateEnd = '2019-07-30';
    filter.speciesId = '';
    filter.organizationId = '';
    filter.stakeholderUUID = '';
    filter.status = 'unprocessed';
  });

  it('getWhereObj() should be: ', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ id: '11942400-6617-4c6c-bf5e' })
    );
  });

  it('getWhereObj() should be: ', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ reference_id: '10' })
    );
  });

  it('getWhereObj() should match: startDate', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ startDate: '2019-07-25' })
    );
  });

  it('getWhereObj() should match: endDate', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ endDate: '2019-07-30' })
    );
  });

  it('getWhereObj() should match: status=unprocessed', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ status: 'unprocessed' })
    );
  });

  describe('change status = rejected', () => {
    //{{{
    beforeEach(() => {
      filter.status = 'rejected';
    });

    it('getWhereObj() should be status=rejected', () => {
      expect(filter.getWhereObj()).toEqual(
        expect.objectContaining({ status: 'rejected' })
      );
    });

    //}}}
  });

  it('getWhereObj() should match: grower_account_id=1-grower-account', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ grower_account_id: '1-grower-account' })
    );
  });

  it('getWhereObj() should match: device_identifier=1-abcdef123456', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ device_identifier: '1-abcdef123456' })
    );
  });

  it('getWhereObj() should match: wallet=1-wallet', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ wallet: '1-wallet' })
    );
  });

  describe('set captureId = ""', () => {
    //{{{
    beforeEach(() => {
      filter.captureId = '';
    });

    it('loopback object should not match any [id]', () => {
      expect(filter.getWhereObj()).not.toHaveProperty('reference_id');
    });
    //}}}
  });

  describe('set grower_account_id = ""', () => {
    //{{{
    beforeEach(() => {
      filter.planterId = '';
    });

    it('loopback object should not match any [grower_account_id]', () => {
      // console.error('the where:', filter.getWhereObj());
      expect(filter.getWhereObj()).not.toHaveProperty('grower_account_id');
    });
    //}}}
  });

  describe('set device_identifier = ""', () => {
    //{{{
    beforeEach(() => {
      filter.deviceIdentifier = '';
    });

    it('loopback object should not match any device_identifier', () => {
      expect(filter.getWhereObj()).not.toHaveProperty('device_identifier');
    });
    //}}}
  });

  describe('set wallet = ""', () => {
    //{{{
    beforeEach(() => {
      filter.planterIdentifier = '';
    });

    it('loopback object should not match any wallet', () => {
      expect(filter.getWhereObj()).not.toHaveProperty('wallet');
    });
    //}}}
  });

  describe('remove dateStart', () => {
    //{{{
    beforeEach(() => {
      delete filter.dateStart;
    });

    it('should be less than endDate', () => {
      expect(filter.getWhereObj()).toEqual(
        expect.objectContaining({ endDate: '2019-07-30' })
      );
    });
    //}}}
  });

  describe('remove dateEnd', () => {
    //{{{
    beforeEach(() => {
      delete filter.dateEnd;
    });

    it('should be greater than startDate', () => {
      expect(filter.getWhereObj()).toEqual(
        expect.objectContaining({ startDate: '2019-07-25' })
      );
    });
    //}}}
  });

  describe('new Filter({approved:false})', () => {
    //{{{
    beforeEach(() => {
      filter = new Filter({
        approved: false,
      });
    });

    it('filter.approved should be false', () => {
      expect(filter.approved).toBe(false);
    });

    //}}}
  });

  // describe.skip('a data array', () => {
  //   //{{{
  //   let data;

  //   beforeEach(() => {
  //     data = [
  //       {
  //         id: 'a',
  //         active: true,
  //         approved: false,
  //       },
  //       {
  //         id: 'b',
  //         active: true,
  //         approved: true,
  //       },
  //       {
  //         id: 'c',
  //         active: false,
  //         approved: true,
  //       },
  //     ];
  //   });

  //   describe('new Filter({active: true, approved:false})', () => {
  //     //{{{
  //     let filter;

  //     beforeEach(() => {
  //       filter = new Filter({
  //         active: true,
  //         approved: false,
  //       });
  //     });

  //     it('filter() should get a ', () => {
  //       expect(data.filter(filter.filter)).toHaveLength(1);
  //       expect(data.filter(filter.filter)[0].id).toBe('a');
  //     });

  //     //}}}
  //   });

  //   describe('new Filter({active: false, approved:true})', () => {
  //     //{{{
  //     let filter;

  //     beforeEach(() => {
  //       filter = new Filter({
  //         active: false,
  //         approved: true,
  //       });
  //     });

  //     it('filter() should get c ', () => {
  //       expect(data.filter(filter.filter)).toHaveLength(1);
  //       expect(data.filter(filter.filter)[0].id).toBe('c');
  //     });

  //     //}}}
  //   });

  //   //}}}
  // });
});
