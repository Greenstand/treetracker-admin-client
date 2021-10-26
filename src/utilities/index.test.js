import { getOrganizationById, stringToSearchRegExp } from './';

describe('utilities tests', () => {
  it('it should convert string to regexp', () => {
    const result = stringToSearchRegExp('test');
    expect(result).toEqual(`/.*test.*/i`);
  });

  it('it should get organization by organisation id', () => {
    const organizationId = 11;
    const organizations = [
      {
        id: 1,
        name: 'test1',
        type: 'O',
      },
      {
        id: 11,
        name: 'freetown',
        type: 'O',
      },
    ];
    const result = getOrganizationById(organizations, organizationId);
    expect(result).toEqual(organizations[1]);
  });
});
