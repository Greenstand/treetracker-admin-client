import Filter from './Filter';
import log from 'loglevel';

describe('Filter, with initial values about this filter object', () => {
  let filter;

  beforeEach(() => {
    filter = new Filter();
    filter.uuid = '11942400-6617-4c6c-bf5e';
    filter.captureId = '10';
    filter.startDate = '2019-07-25';
    filter.endDate = '2019-07-30';
    filter.status = 'unprocessed';
    filter.grower_id = '1';
    filter.device_identifier = '1';
    filter.wallet = '1';
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

  it('getWhereObj() should match: timeCreated between', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({
        startDate: '2019-07-25',
        endDate: '2019-07-30',
      })
    );
  });

  it('getWhereObj() should match: status=unprocessed', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ status: 'unprocessed' })
    );
  });

  // it('getWhereObj() should match: active=true', () => {
  //   expect(filter.getWhereObj()).toEqual(
  //     expect.objectContaining({ active: true })
  //   );
  // });

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


  it('getWhereObj() should match: grower_account_id=abc1', () => {
    filter.grower_id = 'abc1';

    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ grower_account_id: 'abc1' })
    );
  });

  it('getWhereObj() should match: grower_reference_id=1', () => {
    filter.grower_id = '1';

    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ grower_reference_id: '1' })
    );
  });

  it('getWhereObj() should match: device_identifier=1', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ device_identifier: '1' })
    );
  });

  it('getWhereObj() should match: wallet=1', () => {
    expect(filter.getWhereObj()).toEqual(
      expect.objectContaining({ wallet: '1' })
    );
  });

  describe('set captureId = ""', () => {
    //{{{
    beforeEach(() => {
      filter.captureId = '';
    });

    it('should not match any [id]', () => {
      expect(filter.getWhereObj()).not.toHaveProperty('reference_id');
    });
    //}}}
  });

  describe('set grower_id = ""', () => {
    //{{{
    beforeEach(() => {
      filter.grower_id = '';
    });

    it('should not match any [grower_account_id]', () => {
      // console.error('the where:', filter.getWhereObj());
      expect(filter.getWhereObj()).not.toHaveProperty('grower_account_id');
    });

    it('should not match any [grower_reference_id]', () => {
      // console.error('the where:', filter.getWhereObj());
      expect(filter.getWhereObj()).not.toHaveProperty('grower_reference_id');
    });
    //}}}
  });

  describe('set device_identifier = ""', () => {
    //{{{
    beforeEach(() => {
      filter.device_identifier = '';
    });

    it('should not match any device_identifier', () => {
      expect(filter.getWhereObj()).not.toHaveProperty('device_identifier');
    });
    //}}}
  });

  describe('set wallet = ""', () => {
    //{{{
    beforeEach(() => {
      filter.wallet = '';
    });

    it('should not match any wallet', () => {
      expect(filter.getWhereObj()).not.toHaveProperty('wallet');
    });
    //}}}
  });

  describe('remove startDate', () => {
    //{{{
    beforeEach(() => {
      delete filter.startDate;
    });

    it('should be lte', () => {
      expect(filter.getWhereObj()).toEqual(
        expect.objectContaining({ endDate: '2019-07-30' })
      );
    });
    //}}}
  });

  describe('remove endDate', () => {
    //{{{
    beforeEach(() => {
      delete filter.endDate;
    });

    it('should be gte', () => {
      expect(filter.getWhereObj()).toEqual(
        expect.objectContaining({ startDate: '2019-07-25' })
      );
    });
    //}}}
  });

  describe('new Filter({status:rejected})', () => {
    //{{{
    beforeEach(() => {
      filter = new Filter({
        status: 'rejected',
      });
    });

    it('filter.status should be rejected', () => {
      expect(filter.status).toBe('rejected');
    });

    //}}}
  });

  describe('a data array', () => {
    //{{{
    let data;

    beforeEach(() => {
      data = [
        {
          id: 'a',
          status: 'unprocessed',
        },
        {
          id: 'b',
          status: 'approved',
        },
        {
          id: 'c',
          status: 'rejected',
        },
      ];
    });

    describe('new Filter({status: unprocessed})', () => {
      //{{{
      let filter;

      beforeEach(() => {
        filter = new Filter({
          status: 'unprocessed',
        });
      });

      it('filter() should get a ', () => {
        expect(data.filter(filter.filter)).toHaveLength(1);
        expect(data.filter(filter.filter)[0].id).toBe('a');
      });

      //}}}
    });

    describe('new Filter({status: rejected})', () => {
      //{{{
      let filter;

      beforeEach(() => {
        filter = new Filter({
          status: 'rejected',
        });
      });

      it('filter() should get c ', () => {
        expect(data.filter(filter.filter)).toHaveLength(1);
        expect(data.filter(filter.filter)[0].id).toBe('c');
      });

      //}}}
    });

    //}}}
  });
});
