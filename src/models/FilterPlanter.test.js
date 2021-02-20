import FilterPlanter from './FilterPlanter'

describe('Filter', () => {
  let filterPlanter

  beforeEach(() => {
    filterPlanter = new FilterPlanter({
      personId: 1,
      firstName: "fn",
      lastName: "ln",
      id: 1,
    })
  })

  it('getBackloopString() should be: ', () => {
    expect(filterPlanter.getBackloopString()).toEqual(expect.stringContaining("&filter[where][personId]=1"));
    expect(filterPlanter.getBackloopString()).toEqual(expect.stringContaining("&filter[where][firstName]=fn"));
    expect(filterPlanter.getBackloopString()).toEqual(expect.stringContaining("&filter[where][lastName]=ln"));
    expect(filterPlanter.getBackloopString()).toEqual(expect.stringContaining("&filter[where][id]=1"));
  })

  it('getBackloopString(false) should be: ', () => {
    expect(filterPlanter.getBackloopString(false)).toEqual(expect.stringContaining("&where[personId]=1"));
    expect(filterPlanter.getBackloopString(false)).toEqual(expect.stringContaining("&where[firstName]=fn"));
    expect(filterPlanter.getBackloopString(false)).toEqual(expect.stringContaining("&where[lastName]=ln"));
    expect(filterPlanter.getBackloopString(false)).toEqual(expect.stringContaining("&where[id]=1"));
  })
})
