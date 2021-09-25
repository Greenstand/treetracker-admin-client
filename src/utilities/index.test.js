import { stringToSearchRegExp } from './';

describe('converts string to regexp', () => {
  it('it should convert string to regexp', () => {
    const result = stringToSearchRegExp('test');
    expect(result).toEqual(`/.*test.*/i`);
  });
});
