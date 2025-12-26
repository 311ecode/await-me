import { WaitForMe } from './dist/index.js';

// --- Mock Utilities ---
const mockFetch = (shouldSucceed, data, errorCode) => 
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldSucceed) {
                resolve(data);
            } else {
                const error = new Error("Request Failed");
                error.code = errorCode || 500;
                reject(error);
            }
        }, 50);
    });

    

async function runAdHocTest() {
    console.log("🚀 Starting Ad-Hoc Test for await-me Bundle\n");

    // 1. Test the Barrel Class Constants
    console.log(`Checking STYLES: ${Object.keys(WaitForMe.STYLES).join(', ')}`);

    // 2. Test the "Safe" Handler (FALSE_STYLE)
    const safeFetcher = WaitForMe.create({
        returnStyle: WaitForMe.STYLES.FALSE_STYLE,
        defaultHandler: (e) => console.log(`[Shield] Caught expected error: ${e.message}`)
    });

    console.log("\nScenario A: Successful Data Fetch");
    const data = await safeFetcher(mockFetch(true, { id: 42, name: "Gemini" }));
    console.log(`Result: ${JSON.stringify(data)} (Success expected)`);

    console.log("\nScenario B: Shielded Error (500)");
    const failedResult = await safeFetcher(mockFetch(false));
    console.log(`Result: ${failedResult} (Boolean 'false' expected)`);

    // 3. Test the Derivative 'valueOf'
    console.log("\nScenario C: Using valueOf Derivative");
    const value = await WaitForMe.valueOf(mockFetch(true, "Direct Value"));
    console.log(`Value: ${value}`);

    // 4. Test Go-Style handling via Barrel
    const goHandler = WaitForMe.create({ returnStyle: WaitForMe.STYLES.GO_STYLE });
    const [err, result] = await goHandler(mockFetch(false, null, 401));
    
    if (err) {
        console.log(`\nScenario D: Go-Style Error Check`);
        console.log(`Error Code: ${err.code} - Handled successfully without try/catch.`);
    }

    console.log("\n✅ Ad-Hoc Test Completed.");
}

runAdHocTest().catch(console.error);