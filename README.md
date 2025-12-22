# 🛡️ await-me

**Production-ready, zero-dependency async error handling for JavaScript**  
The pre-bundled, browser & legacy-Node friendly distribution of [**await-me-ts**](https://www.npmjs.com/package/await-me-ts).

Stop writing repetitive `try/catch`.  
Write clean, linear code that handles errors declaratively — works everywhere modern JavaScript runs.

### For TypeScript developers — important note

This package (`await-me`) is the transpiled, bundled version optimized for broad compatibility (Node ≥7, browsers, etc.).

If you're using **modern TypeScript** (especially Node.js 22+ with `--experimental-strip-types` or a proper build setup), prefer the original source package:

→ [**await-me-ts** — full type safety & generics](https://www.npmjs.com/package/await-me-ts)

**Why prefer await-me-ts in TypeScript?**

- Proper generics: `valueOf<User>() → User | false`
- Better inference & autocompletion
- No `any`/`unknown` surprises

In `await-me` (this package), types are looser — still fully functional, just less strict.

### Quick TypeScript vs JavaScript comparison

```ts
// With await-me-ts (recommended for TS)
const user = await valueOf<User>(
  fetchUser(id),
  "User not found"
); // → User | false

if (!user) return;
// user: User (narrowed)

// With await-me (this package)
const user = await valueOf(
  fetchUser(id),
  "User not found"
); // → any | false

if (!user) return;
// user: any
```

### Quick Start — The Most Popular Helpers

```js
// ESM
import { valueOf, isSuccess, toResult, create, STYLES } from 'await-me';

// CommonJS
const { valueOf, isSuccess, toResult, create, STYLES } = require('await-me');

// Browser global
<script src="https://cdn.jsdelivr.net/npm/await-me/dist/index.global.js"></script>
// Then: const { valueOf } = WaitForMe;
```

### The "Big Three" Helpers — with TS hints

| Helper       | Success return (JS)              | Success return (TS with await-me-ts) | Failure return         | Best for                             |
|--------------|----------------------------------|--------------------------------------|------------------------|--------------------------------------|
| `valueOf`    | value                            | `T`                                  | `false`                | Most data fetching                   |
| `isSuccess`  | `true`                           | `true`                               | `false`                | Mutations, status checks             |
| `toResult`   | `{ success: true, data: value }` | `{ success: true, data: T }`         | `{ success: false, ... }` | Falsy-success cases               |

### Real-world examples (JS + more TS snippets)

**1. Data fetch — most common pattern**

```js
// JavaScript
const profile = await valueOf(
  fetch(`/api/users/${userId}`).then(r => r.json()),
  "Could not load profile"
);

if (!profile) {
  showError("Profile not available");
  return;
}
```

```ts
// TypeScript (with await-me-ts)
interface UserProfile { id: number; name: string; email: string }

const profile = await valueOf<UserProfile>(
  fetch(`/api/users/${userId}`).then(r => r.json()),
  "Could not load profile"
);

if (!profile) return showError("Profile not available");
// profile: UserProfile (type safe)
```

**2. Mutation with feedback**

```js
// JavaScript
if (await isSuccess(
  fetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify(cartItems)
  }),
  { success: "Added to cart!", error: "Update failed" }
)) {
  updateCartCount();
}
```

```ts
// TypeScript (with await-me-ts)
const success = await isSuccess(
  updateCart(cartItems),
  { success: "Added to cart!" }
);

if (success) {
  // TypeScript knows this branch only runs on success
  updateCartCount();
}
```

**3. Safe handling of falsy values**

```js
// JavaScript
const result = await toResult(fetch('/api/flags').then(r => r.json()));

if (!result.success) {
  console.warn("Flags unavailable", result.error);
  return;
}

const darkMode = result.data?.darkMode ?? false;
```

```ts
// TypeScript (with await-me-ts)
interface Flags { darkMode: boolean; betaFeatures: boolean }

const result = await toResult<Flags>(fetch('/api/flags').then(r => r.json()));

if (!result.success) return;

const darkMode: boolean = result.data.darkMode ?? false;
// Full type safety on data
```

**4. Custom handler with conditional shielding**

```ts
// TypeScript (with await-me-ts)
const safeApi = createAsyncHandler({
  returnStyle: RETURN_STYLES.FALSE_STYLE,
  conditionalHandlerChain: [
    {
      ifTrue: (e: { status?: number }) => e.status === 404,
      doIt: () => console.log("Not found — silent")
    }
  ]
});

// JavaScript version (this package)
const safeApi = create({
  returnStyle: STYLES.FALSE_STYLE,
  conditionalHandlerChain: [
    { ifTrue: e => e?.status === 404, doIt: () => {} }
  ]
});
```

### Go-style example (popular among backend developers)

```ts
// TypeScript (await-me-ts)
const [err, user] = await createAsyncHandler({ returnStyle: RETURN_STYLES.GO_STYLE })(
  fetchUser(userId)
); // → [Error | null, User | null]

if (err) {
  if (err.code === 404) return showNotFound();
  // err: Error (type safe)
}
```

```js
// JavaScript (this package)
const [err, user] = await create({ returnStyle: STYLES.GO_STYLE })(fetchUser(userId));

if (err) {
  // err is any
  if (err?.code === 404) return showNotFound();
}
```

### Installation

```bash
npm install await-me
```

CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/await-me@latest/dist/index.global.js"></script>
```

### Final note for TypeScript users

If you want the **best possible developer experience** with full generics, inference, and zero `any` surprises — install `await-me-ts` instead:

```bash
npm install await-me-ts
```

Happy error shielding in both JS and TS! 🛡️✨
