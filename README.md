# 🛡️ await-me

The high-performance, pre-bundled distribution of [`await-me-ts`](https://www.npmjs.com/package/await-me-ts). Declarative async error handling for pure JavaScript and production environments.

**Compatibility:** - **Node.js:** 7.0.0+ (CJS & ESM)
- **Browsers:** ES2015+ (IIFE via CDN or `<script>` tags)
- **Bundlers:** Webpack, Rollup, Vite, etc.

---

## 🏗️ The "Big Three" Derivatives
For 90% of use cases, these pre-configured utilities provide the cleanest syntax.

### 1. `valueOf`
Returns the data or `false` on failure.
* **Best for:** Standard data fetching where `false` isn't a valid piece of data.

```javascript
const user = await valueOf(fetchUser(1), "User not found");
if (!user) return; 
console.log(user.name);

```

### 2. `isSuccess`

Returns a simple `boolean`.

* **Best for:** Fire-and-forget actions or simple validation.

```javascript
if (await isSuccess(db.users.delete(id), { success: "Deleted!" })) {
    notify("User removed");
}

```

### 3. `toResult`

Returns an object: `{ success: boolean; data: any | null; error: any | null }`.

* **Best for:** APIs that might return `false` or `0` as valid successful data.

---

## 🚦 Understanding `STYLES`

The `returnStyle` determines the shape of the output when using `createAsyncHandler`.

| Style | Success Output | Failure Output | Use Case |
| --- | --- | --- | --- |
| `STYLES.GO_STYLE` | `[null, T]` | `[Error, null]` | Classic Go-lang pattern. |
| `STYLES.FALSE_STYLE` | `T` | `false` | Data-or-False (Shielding logic). |
| `STYLES.BOOLEAN` | `true` | `false` | Pure status checks. |
| `STYLES.ONLY_ERROR` | `0` | `1` | Unix-style exit codes. |

---

## ⚙️ Advanced Control: `createAsyncHandler`

### 🌊 The Waterfall: `conditionalHandlerChain`

The `conditionalHandlerChain` follows a **"First Match Wins"** logic. It iterates through your array of handlers and stops as soon as one `ifTrue` returns `true`.

**Key Behaviors to Remember:**

1. **Stop on Match:** Once a condition is met, no subsequent handlers in the chain are checked.
2. **Shielding the Default:** If a handler matches, the `defaultHandler` is **not** executed. This is perfect for silencing "expected" errors (like 404s).
3. **Fallthrough:** If no conditions match, the `defaultHandler` runs (if defined).

### Example: Multi-Stage Handling

```javascript
const { createAsyncHandler, STYLES } = require('await-me');

const safeFetch = createAsyncHandler({
    returnStyle: STYLES.FALSE_STYLE,
    conditionalHandlerChain: [
        {
            ifTrue: (err) => err.code === 404,
            doIt: () => console.warn("Resource missing.")
        }
    ],
    defaultHandler: (err) => reportToSentry(err)
});

```

## 🛠️ Performance & Environment

* **Target:** ES2015 (minified and bundled).
* **Bundle Size:** Ultra-lightweight with zero external runtime dependencies (core logic is inlined).
