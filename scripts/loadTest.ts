
import { supabase, isSupabaseConfigured } from '../services/supabase';

/**
 * 🚀 Operation "Iron Forge" - Pre-Flight Load Test
 * Purpose: Stress test the Gemini Edge Function and Supabase connectivity
 * Scenario: 50 Concurrent Policy Updates representing a peak consultant rush.
 */

const DUMMY_PROFILES: any[] = [
    { companyName: "EcoTech Solutions", industry: "Professional Services", workModel: "Remote" },
    { companyName: "Apex Logistics", industry: "Transport", overtimePayment: "Paid" },
    { companyName: "Cape Creative", industry: "Media", socialMediaRestrictions: "Yes" },
    { companyName: "Jozi Foundry", industry: "Manufacturing", drugTestingPolicy: "Random" }
];

const DUMMY_POLICY_CONTENT = `
# Standard Disciplinary Code
This document outlines the rules for the workplace.
1. Be on time.
2. No theft.
3. No fighting.
Employees have 15 days of leave per year.
`;

async function runForgeTest() {
    console.log("🏛️ CHIEF OF STAFF: INITIALIZING IRON FORGE LOAD TEST...");
    console.log(`- Supabase Configured: ${isSupabaseConfigured}`);
    // @ts-ignore
    console.log(`- Supabase URL: ${supabase.functions.url}`);
    console.log("------------------------------------------------------");

    const CONCURRENCY = 50;
    const results = {
        success: 0,
        fail: 0,
        latencies: [] as number[],
    };

    const startTime = Date.now();

    const tasks = Array.from({ length: CONCURRENCY }).map(async (_, i) => {
        const profile = DUMMY_PROFILES[i % DUMMY_PROFILES.length];
        const taskStart = Date.now();

        try {
            const { data, error } = await supabase.functions.invoke('generate-content', {
                body: {
                    prompt: `Align this with current SA laws for a ${profile.industry} business:\n${DUMMY_POLICY_CONTENT}`,
                    model: 'gemini-1.5-flash',
                    config: { responseMimeType: "application/json" }
                }
            });

            if (error) {
                // @ts-ignore
                const status = error.status || 'No Status';
                const body = await error.context?.response?.text() || 'No Body';
                throw new Error(`[${status}] ${error.message} - ${body}`);
            }

            const taskEnd = Date.now();
            results.success++;
            results.latencies.push(taskEnd - taskStart);
            console.log(`[PASS] Task ${i + 1}: ${taskEnd - taskStart}ms`);
        } catch (err: any) {
            results.fail++;
            console.error(`[FAIL] Task ${i + 1}: ${err.message}`);
        }
    });

    await Promise.all(tasks);

    const totalTime = Date.now() - startTime;
    const avgLatency = results.latencies.length > 0 ? results.latencies.reduce((a, b) => a + b, 0) / results.latencies.length : 0;
    const p99Latency = results.latencies.length > 0 ? results.latencies.sort((a, b) => a - b)[Math.floor(results.latencies.length * 0.99)] : 0;

    console.log("\n------------------------------------------------------");
    console.log("📊 LOAD TEST COMPLETE: FINAL METRICS");
    console.log(`- Request Concurrency: ${CONCURRENCY}`);
    console.log(`- Success Rate: ${(results.success / CONCURRENCY * 100).toFixed(1)}%`);
    console.log(`- Total Duration: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`- Average Latency: ${avgLatency.toFixed(0)}ms`);
    console.log(`- P99 Latency: ${p99Latency.toFixed(0)}ms`);
    console.log("------------------------------------------------------");

    if (results.fail > 0) {
        console.log("🔴 STATUS: DEGRADED. Edge Function infrastructure errors detected.");
    } else if (results.success > 0) {
        console.log("✅ STATUS: OPTIMAL. System hardened for production.");
    } else {
        console.log("⚪ STATUS: INCONCLUSIVE. No successful requests.");
    }
}

if (typeof process !== 'undefined') {
    runForgeTest().catch(console.error);
}
