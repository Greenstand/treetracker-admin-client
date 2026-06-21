import { z } from 'zod';

// Shared organization form shape + validation, used by both the public
// "apply for an organization" flow and the admin organization management page.
export const INITIAL_ORGANIZATION_FORM = {
  name: '',
  email: '',
  phone: '',
  website: '',
  logoUrl: '',
  mapName: '',
};

// Mirrors the admin API's phone validation: 10-20 chars of phone punctuation
// containing at least 10 digits.
const PHONE_REGEX = /^(?=(?:.*\d){10,})[+()\-.\s\d]{10,20}$/;

const trimmedString = z.string().trim();
const emptyString = z.literal('');
const requiredEmail = trimmedString
  .min(1, { error: 'Email is required' })
  .pipe(z.email({ error: 'Enter a valid email address' }));

const optionalPhone = trimmedString.pipe(
  emptyString.or(
    z.string().regex(PHONE_REGEX, { error: 'Enter a valid phone number' })
  )
);

const optionalHttpUrl = (message) =>
  trimmedString.pipe(
    emptyString.or(
      z.url({
        protocol: /^https?$/,
        error: message,
      })
    )
  );

export const organizationSchema = z.object({
  name: trimmedString.min(1, { error: 'Organization name is required' }),
  email: requiredEmail,
  phone: optionalPhone,
  website: optionalHttpUrl('Enter a valid website URL'),
  logoUrl: optionalHttpUrl('Enter a valid logo URL'),
  mapName: trimmedString,
});

export function mapOrganizationValidationErrors(error) {
  const properties = z.treeifyError(error).properties || {};

  return Object.keys(INITIAL_ORGANIZATION_FORM).reduce(
    (allErrors, fieldName) => {
      const fieldError = properties[fieldName]?.errors?.[0];

      if (!fieldError) {
        return allErrors;
      }

      return {
        ...allErrors,
        [fieldName]: fieldError,
      };
    },
    {}
  );
}

export function getOrganizationValidationErrors(values) {
  const result = organizationSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  return mapOrganizationValidationErrors(result.error);
}
