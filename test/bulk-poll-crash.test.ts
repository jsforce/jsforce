import { Job, Batch } from '../src/api/bulk';

/**
 * Regression test for a bug where Batch#poll() calls this.retrieve() without
 * awaiting or catching it. retrieve()'s own catch block both emits an 'error'
 * event (correctly notifying listeners) AND rethrows -- and since poll() never
 * awaits or catches that call, the rethrow becomes an unhandled promise
 * rejection that crashes the whole Node process, independently of whatever the
 * caller's own error handling already did with the emitted 'error' event.
 *
 * This doesn't require a live org connection: check() and retrieve() are
 * stubbed directly, since the bug is in how poll() calls them, not in what they
 * do over the wire.
 */
describe('Batch#poll()', () => {
  function createBatch() {
    const fakeBulk: any = {};
    const job = new Job(fakeBulk, 'Account', 'query', {}, 'fakeJobId');
    return new Batch(job, 'fakeBatchId');
  }

  it('does not produce an unhandled rejection when retrieve() fails after a completed poll', (done) => {
    const batch = createBatch();
    const simulatedError = new Error('simulated server-side failure');

    jest
      .spyOn(batch, 'check')
      .mockResolvedValue({ state: 'Completed' } as any);
    // mockRejectedValue would bypass retrieve()'s real body entirely (including its
    // own `this.emit('error', err)` call) -- replicate the actual emit-then-throw
    // behavior instead, since that's specifically what this test needs to exercise.
    jest.spyOn(batch, 'retrieve').mockImplementation(() => {
      batch.emit('error', simulatedError);
      return Promise.reject(simulatedError);
    });

    const unhandledRejectionHandler = (reason: unknown) => {
      cleanup();
      done(
        new Error(
          `poll() caused an unhandled promise rejection: ${String(reason)}`,
        ),
      );
    };
    process.on('unhandledRejection', unhandledRejectionHandler);

    function cleanup() {
      process.removeListener(
        'unhandledRejection',
        unhandledRejectionHandler,
      );
    }

    batch.on('error', (err) => {
      expect(err).toBe(simulatedError);
      // Give any pending (buggy) unhandled rejection a chance to surface
      // before declaring the test passed.
      setTimeout(() => {
        cleanup();
        done();
      }, 100);
    });

    batch.poll(10, 1000);
  }, 5000);

  it('does not produce an unhandled rejection when retrieve() fails after a failed-with-records poll', (done) => {
    const batch = createBatch();
    const simulatedError = new Error('simulated server-side failure');

    jest.spyOn(batch, 'check').mockResolvedValue({
      state: 'Failed',
      numberRecordsProcessed: '5',
    } as any);
    jest.spyOn(batch, 'retrieve').mockImplementation(() => {
      batch.emit('error', simulatedError);
      return Promise.reject(simulatedError);
    });

    const unhandledRejectionHandler = (reason: unknown) => {
      cleanup();
      done(
        new Error(
          `poll() caused an unhandled promise rejection: ${String(reason)}`,
        ),
      );
    };
    process.on('unhandledRejection', unhandledRejectionHandler);

    function cleanup() {
      process.removeListener(
        'unhandledRejection',
        unhandledRejectionHandler,
      );
    }

    batch.on('error', (err) => {
      expect(err).toBe(simulatedError);
      setTimeout(() => {
        cleanup();
        done();
      }, 100);
    });

    batch.poll(10, 1000);
  }, 5000);
});
