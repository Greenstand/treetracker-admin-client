import { formatRenewalDate, isSubscriptionActive } from './subscription';

describe('subscription helpers', () => {
  it('treats only an active subscription as active', () => {
    expect(isSubscriptionActive({ status: 'active' })).toBe(true);
    expect(isSubscriptionActive({ status: 'none' })).toBe(false);
    expect(isSubscriptionActive(undefined)).toBe(false);
  });

  it('formats the renewal date, or nothing when there is none', () => {
    expect(
      formatRenewalDate({ currentPeriodEnd: '2026-11-17T00:00:00.000Z' })
    ).toContain('2026');
    expect(formatRenewalDate({ currentPeriodEnd: null })).toBeNull();
    expect(formatRenewalDate(undefined)).toBeNull();
  });
});
