import { getOrganizationById, stringToSearchRegExp } from './';

describe('utilities tests', () => {
  it('it should convert string to regexp', () => {
    const result = stringToSearchRegExp('test');
    expect(result).toEqual(`/.*test.*/i`);
  });

  it('it should get organization by organisation id', () => {
    const organizationId = 'ae7faf5d-46e2-4944-a6f9-5e65986b2e03';
    const organizations = [
      {
        id: 1,
        stakeholder_uuid: '8b353fbe-0ad7-46a6-ad43-27e304a95757',
        name: 'test1',
        type: 'O',
      },
      {
        id: 11,
        stakeholder_uuid: 'ae7faf5d-46e2-4944-a6f9-5e65986b2e03',
        name: 'freetown',
        type: 'O',
      },
    ];
    const result = getOrganizationById(organizations, organizationId);
    expect(result).toEqual(organizations[1]);
  });
});
