/**
 * Performance regression tests for readAll in src/util/stream.ts
 *
 * These tests ensure that performance is maintained and detect any
 * regressions that might be introduced by future changes.
 *
 * Run with:
 *   npx jest test/stream-performance.test.ts --verbose
 *
 * The baselines serve as "snapshots" of expected performance. If tests fail:
 * 1. A regression was introduced (fix the code), OR
 * 2. Hardware/environment is significantly different (adjust baselines)
 */
import { Readable } from 'node:stream';
import { readAll } from '../../src/util/stream';

/**
 * Performance baselines - these serve as "snapshots" of expected performance.
 *
 * These values are intentionally generous to account for CI variability.
 */
const PERFORMANCE_BASELINES = {
  // Maximum time allowed for readAll to process data (ms per MB)
  maxMsPerMB: {
    small: 10, // 1-5MB: allow 10ms per MB
    medium: 5, // 5-50MB: allow 5ms per MB
    large: 3, // 50MB+: allow 3ms per MB
  } as Record<string, number>,

  // Maximum scaling factor when data size increases 4x (5MB → 20MB)
  // O(n) should be ~4x, O(n²) would be ~16x
  // We use 8x as threshold to catch quadratic regressions
  maxScalingFactor: 8,
};

/**
 * Creates a readable stream that delivers data in chunks (simulates network).
 */
function createChunkedStream(
  data: Buffer,
  chunkSize: number = 64 * 1024,
): Readable {
  let offset = 0;

  return new Readable({
    read() {
      setImmediate(() => {
        if (offset >= data.length) {
          this.push(null);
          return;
        }

        const end = Math.min(offset + chunkSize, data.length);
        const chunk = data.subarray(offset, end);
        offset = end;
        this.push(chunk);
      });
    },
  });
}

/**
 * Measures time to process data through readAll.
 */
async function measureReadAll(
  sizeMB: number,
): Promise<{ timeMs: number; resultLength: number }> {
  const data = Buffer.alloc(sizeMB * 1024 * 1024, 'x');
  const stream = createChunkedStream(data);

  const startTime = performance.now();
  const result = await readAll(stream);
  const endTime = performance.now();

  return {
    timeMs: endTime - startTime,
    resultLength: result.length,
  };
}

// Collect metrics for summary output
const collectedMetrics: {
  sizeMB: number;
  timeMs: number;
  msPerMB: number;
}[] = [];

describe('readAll performance regression tests', () => {
  // Test 1: Absolute performance thresholds
  describe('should meet performance baselines', () => {
    const testCases: { sizeMB: number; category: string }[] = [
      { sizeMB: 1, category: 'small' },
      { sizeMB: 5, category: 'medium' },
      { sizeMB: 20, category: 'medium' },
    ];

    for (const { sizeMB, category } of testCases) {
      const maxMsPerMB = PERFORMANCE_BASELINES.maxMsPerMB[category];

      it(`should process ${sizeMB}MB within ${maxMsPerMB}ms/MB`, async () => {
        const { timeMs, resultLength } = await measureReadAll(sizeMB);
        const msPerMB = timeMs / sizeMB;

        // Verify data integrity
        expect(resultLength).toBe(sizeMB * 1024 * 1024);

        // Log metrics
        console.log(
          `  ${sizeMB}MB: ${timeMs.toFixed(0)}ms (${msPerMB.toFixed(1)}ms/MB)`,
        );
        collectedMetrics.push({ sizeMB, timeMs, msPerMB });

        // Performance assertion
        expect(msPerMB).toBeLessThanOrEqual(maxMsPerMB);
      });
    }
  });

  // Test 2: Scaling characteristics - detects O(n²) regressions
  describe('should scale linearly (O(n))', () => {
    it('should have scaling factor < 8x when data increases 4x (5MB → 20MB)', async () => {
      const result5MB = await measureReadAll(5);
      const result20MB = await measureReadAll(20);

      // For O(n): 20MB should take ~4x as long as 5MB
      // For O(n²): 20MB would take ~16x as long as 5MB
      const scalingFactor = result20MB.timeMs / result5MB.timeMs;

      console.log(
        `  5MB: ${result5MB.timeMs.toFixed(0)}ms, ` +
          `20MB: ${result20MB.timeMs.toFixed(0)}ms, ` +
          `Scaling factor: ${scalingFactor.toFixed(1)}x`,
      );

      // Should be closer to 4x than 16x - this catches O(n²) regressions
      expect(scalingFactor).toBeLessThan(
        PERFORMANCE_BASELINES.maxScalingFactor,
      );
    });
  });

  // Output summary after all tests
  afterAll(() => {
    console.log('\n=== Performance Metrics Summary ===');
    console.log(JSON.stringify(collectedMetrics, null, 2));
    console.log('===================================\n');
  });
});
