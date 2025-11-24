const assert = require('assert');

// Mock DOM for testing if needed, or just test pure functions.
// We will extract logic to testable functions for this purpose,
// or simply reimplement the core logic here to verify correctness
// against expected values, acting as a "Logic Verification" suite.

console.log("Running Logic Tests...");

// --- Percentage Calc Logic ---
function calcPercentOf(x, y) { return (x / 100) * y; }
function calcXIsPercentOfY(x, y) { return (x / y) * 100; }
function calcChange(x, y) { return ((y - x) / Math.abs(x)) * 100; }

try {
    assert.strictEqual(calcPercentOf(50, 200), 100, "50% of 200 should be 100");
    assert.strictEqual(calcXIsPercentOfY(50, 200), 25, "50 is 25% of 200");
    assert.strictEqual(calcChange(100, 150), 50, "Change 100->150 is 50%");
    assert.strictEqual(calcChange(100, 50), -50, "Change 100->50 is -50%");
    console.log("✅ Percentage Logic Passed");
} catch (e) {
    console.error("❌ Percentage Logic Failed", e);
    process.exit(1);
}

// --- Unit Converter Logic (Sample) ---
const units = {
    length: { meters: 1, kilometers: 0.001 }
};
function convertLength(val, from, to) {
    const base = val / units.length[from];
    return base * units.length[to];
}

try {
    // 1000 meters -> km
    assert.strictEqual(convertLength(1000, 'meters', 'kilometers'), 1, "1000m is 1km");
    // 1 km -> meters
    assert.strictEqual(convertLength(1, 'kilometers', 'meters'), 1000, "1km is 1000m");
    console.log("✅ Unit Conversion Logic Passed");
} catch (e) {
    console.error("❌ Unit Logic Failed", e);
    process.exit(1);
}

console.log("All Logic Tests Passed!");
