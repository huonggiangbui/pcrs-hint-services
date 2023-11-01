import * as Sentry from '@sentry/node';

describe('SentryFilter', () => {
  // init transaction

  const transaction = Sentry.startTransaction({
    op: 'test',
    name: 'My First Test Transaction',
  });

  setTimeout(() => {
    try {
      throw new Error('Test Error');
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      transaction.finish();
    }
  }, 99);
});
