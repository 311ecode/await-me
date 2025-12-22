# 🛡️ await-me

**Production-ready, zero-dependency async error handling for JavaScript**

The pre-bundled, browser-friendly distribution of the excellent [**await-me-ts**](https://www.npmjs.com/package/await-me-ts) library.

Stop writing repetitive `try/catch` everywhere.  
Write clean, linear, readable code that handles errors declaratively.

### Key Features at a Glance

- Works in **Node.js ≥ 7** (CJS & ESM)  
- Works in **modern browsers** (ES2015+)  
- Supports direct `<script>` tag usage (global `WaitForMe`)  
- Tiny footprint (~1.8–2.4 kB minified + gzipped)  
- Zero runtime dependencies  
- Multiple return styles: data-or-false, Go-style, boolean, result object…  
- Smart conditional error handling (waterfall style)  
- Built-in support for logging & side-effect callbacks

### Looking for the TypeScript / modern Node source?

→ Go to [**await-me-ts** — the original TypeScript-first engine](https://www.npmjs.com/package/await-me-ts)

## Quick Start — The Most Popular Helpers

```js
// ESM
import { valueOf, isSuccess, toResult, create, STYLES } from 'await-me';

// CommonJS
const { valueOf, isSuccess, toResult, create, STYLES } = require('await-me');

// Global script tag
<script src="https://cdn.jsdelivr.net/npm/await-me/dist/index.global.js"></script>
// Then use: WaitForMe.valueOf(...)
```

### The "Big Three" Helpers

| Helper        | Returns on Success              | Returns on Failure              | Best for                                      | Safe with `false`/`0`/`null`? |
|---------------|---------------------------------|---------------------------------|-----------------------------------------------|-------------------------------|
| `valueOf`     | the value                       | `false`                         | Most data fetching                            | **No**                        |
| `isSuccess`   | `true`                          | `false`                         | Mutations, side-effects, status checks        | **Yes**                       |
| `toResult`    | `{ success: true, data: value }`| `{ success: false, error }`     | When falsy values are valid results           | **Yes**                       |

### Real-world JavaScript examples

```js
// 1. Classic data fetch (most common pattern)
const profile = await valueOf(
  fetch(`/api/users/${userId}`).then(r => r.json()),
  "Could not load user profile"
);

if (!profile) {
  showErrorMessage("Profile not available");
  return;
}

document.getElementById('name').textContent = profile.name;

// 2. Mutation / side-effect only (fire-and-forget style)
if (await isSuccess(
  fetch('/api/cart', { method: 'POST', body: JSON.stringify(items) }),
  {
    success: "Items added to cart!",
    error:   "Failed to update cart"
  }
)) {
  updateCartBadge();
}

// 3. When falsy values are meaningful
const result = await toResult(fetch('/api/feature-flags').then(r => r.json()));

if (!result.success) {
  console.warn("Feature flags unavailable", result.error);
  return;
}

const darkMode = result.data?.darkMode ?? false;
document.body.classList.toggle('dark', darkMode);

// 4. Using custom handler with conditional shielding
const safeApiCall = create({
  returnStyle: STYLES.FALSE_STYLE,
  conditionalHandlerChain: [
    {
      ifTrue: err => err?.status === 404 || err?.code === 404,
      doIt:  () => console.log("Resource not found — silent skip")
    },
    {
      ifTrue: err => err?.status === 401 || err?.code === 401,
      doIt:  () => {
        console.warn("Session expired");
        window.location.href = '/login';
      }
    },
    {
      ifTrue: err => err?.status === 429,
      doIt:  () => showToast("Rate limit hit — please wait 60s")
    }
  ],
  defaultHandler: err => {
    console.error("Critical API error:", err);
    reportErrorToSentry(err);
  }
});

const data = await safeApiCall(fetch('/api/private/stats'));
if (!data) return; // already smartly handled
```

## All Available Return Styles

```js
const customHandler = create({
  returnStyle: STYLES.FALSE_STYLE,    // ← most popular
  // or STYLES.GO_STYLE
  // or STYLES.BOOLEAN
  // or STYLES.ONLY_ERROR
  // or STYLES.ERROR_STYLE (advanced)
});
```

| Style           | Success return           | Failure return          | Typical usage feeling                     |
|-----------------|--------------------------|-------------------------|-------------------------------------------|
| `FALSE_STYLE`   | value                    | `false`                 | `if (!result) return` — very natural      |
| `GO_STYLE`      | `[null, value]`          | `[err, null]`           | Classic Go/Rust explicit error handling   |
| `BOOLEAN`       | `true`                   | `false`                 | Pure success/failure flag                 |
| `ONLY_ERROR`    | `0`                      | `1`                     | Unix-style exit codes (rare in JS)        |
| `ERROR_STYLE`   | value                    | the Error object        | Middleware + later throw (advanced)       |

## Go-style example (very popular among backend devs)

```js
const [err, user] = await create({ returnStyle: STYLES.GO_STYLE })(
  fetchUserFromApi(userId)
);

if (err) {
  if (err.code === 404) return showNotFound();
  console.error("User fetch failed", err);
  return;
}

// happy path — no try/catch needed
renderUserProfile(user);
```

## Smart Logging & Side Effects

All main helpers accept a second argument:

```js
string                          // simple log message
{ success?: string|object, error?: string|object }   // structured
```

```js
// Simple string
await valueOf(saveDraft(), "Draft save failed");

// Structured + side effects
await isSuccess(updateSettings(settings), {
  success: {
    fn: () => toast.success("Settings updated"),
    // you can also pass params: [userId, newTheme]
  },
  error: "Failed to save settings — try again"
});

// Multiple actions on error
await valueOf(fetchImportantData(), {
  error: [
    "Critical data fetch failed",
    { fn: reportToSentry, params: ["data_fetch_failed"] },
    { fn: showCriticalErrorModal }
  ]
});
```

## Installation

```bash
npm install await-me
# or
yarn add await-me
# or
pnpm add await-me
```

### CDN (quick prototyping / no build step)

```html
<script src="https://cdn.jsdelivr.net/npm/await-me@latest/dist/index.global.js"></script>

<script>
  const { valueOf, isSuccess } = WaitForMe;

  (async () => {
    const data = await valueOf(fetch('/api/data').then(r => r.json()));
    console.log(data ?? 'Failed to load');
  })();
</script>
```

## Philosophy & Trade-offs

**Love it because:**

- Removes 80–90% of `try/catch` boilerplate
- Very linear, readable code
- Excellent for expected errors (404, 403, 429, validation…)
- Tiny size, no dependencies
- Works everywhere modern JS runs

**Keep in mind:**

- `valueOf` is **not safe** if legitimate result can be `false`/`null`/`0`
- Conditional chain = **first match wins** (order matters!)
- No built-in retry/timeout (combine with your favorite tools)
- Young library — expect some evolution in 2026

Shield your awaits and enjoy cleaner code! 🛡️✨
