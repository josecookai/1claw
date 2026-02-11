/**
 * Benchmark: route() average latency < 1ms (local run).
 * Run: node benchmark.cjs
 */

const { ClawRouter, stubCheap, stubStrong, stubSmart } = require('./dist/index.js');

const router = new ClawRouter({
  providers: [stubStrong, stubSmart, stubCheap],
});

const WARMUP = 1000;
const ITERATIONS = 10000;

function run() {
  for (let i = 0; i < WARMUP; i++) {
    router.route({
      prompt: 'Hello, world!',
      policy: 'AUTO',
      userPlan: 'pro',
    });
  }

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    router.route({
      prompt: 'Hello, world!',
      policy: ['AUTO', 'SAVE', 'MAX', 'CN_OK'][i % 4],
      userPlan: i % 2 === 0 ? 'pro' : 'starter',
    });
  }
  const elapsed = performance.now() - start;
  const avgMs = elapsed / ITERATIONS;

  console.log(`route() x${ITERATIONS}: ${elapsed.toFixed(2)}ms total, ${avgMs.toFixed(4)}ms avg`);
  if (avgMs < 1) {
    console.log('✓ PASS: avg < 1ms');
  } else {
    console.log('✗ FAIL: avg >= 1ms');
    process.exit(1);
  }
}

run();
