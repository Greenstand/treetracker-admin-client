export function isSubscriptionActive(subscription) {
  return subscription?.status === 'active';
}

export function formatRenewalDate(subscription) {
  if (!subscription?.currentPeriodEnd) return null;
  return new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
