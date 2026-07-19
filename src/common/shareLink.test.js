import { buildShareAppLink } from './shareLink';

const BASE = 'https://greenstand.org';

describe('buildShareAppLink', () => {
  it('builds a link with org_name and org_id', () => {
    expect(buildShareAppLink({ name: 'Acme', id: 42 })).toBe(
      `${BASE}?org_name=Acme&org_id=42`
    );
  });

  it('url-encodes the org name', () => {
    expect(buildShareAppLink({ name: 'Acme Trees', id: 7 })).toBe(
      `${BASE}?org_name=Acme+Trees&org_id=7`
    );
  });

  it('stringifies a numeric id', () => {
    expect(buildShareAppLink({ name: 'Acme', id: 100 })).toContain(
      'org_id=100'
    );
  });

  it('omits org_name when the name is empty or whitespace', () => {
    expect(buildShareAppLink({ name: '   ', id: 42 })).toBe(
      `${BASE}?org_id=42`
    );
  });

  it('omits org_id when id is missing', () => {
    expect(buildShareAppLink({ name: 'Acme', id: undefined })).toBe(
      `${BASE}?org_name=Acme`
    );
  });

  it('returns the base url when neither name nor id is provided', () => {
    expect(buildShareAppLink({ name: '', id: undefined })).toBe(BASE);
  });
});
