# JSforce AI Coding Instructions

## Project Architecture

JSforce is an isomorphic JavaScript library for Salesforce APIs that works in both Node.js and browser environments. The codebase follows a modular architecture with key components:

### Core Components
- **Connection (`src/connection.ts`)**: Main API client with authentication, CRUD operations, and session management
- **JSforce (`src/jsforce.ts`)**: Main entry point that extends EventEmitter and provides module registration
- **Transport (`src/transport.ts`)**: HTTP abstraction layer supporting different environments (Node.js, browser, proxy)
- **Registry (`src/registry/`)**: Connection configuration management (file-based, SFDX, or empty)

### API Modules
Each Salesforce API has its own module in `src/api/`:
- `analytics.ts`, `apex.ts`, `bulk.ts`, `bulk2.ts`, `chatter.ts`, `metadata.ts`, `soap.ts`, `streaming.ts`, `tooling.ts`
- Modules register themselves using `registerModule()` pattern from `jsforce.ts`
- API classes receive a `Connection` instance and extend it with specialized methods

### Build System
- **Dual Distribution**: Node.js CJS (`lib/`) and Browser ESM (`browser/`) builds
- **Webpack Bundles**: Browser-compatible bundles in `dist/` with polyfills for Node.js APIs
- **Wireit Tasks**: Build orchestration in `package.json` with dependency management

## Key Patterns

### Module Registration
```typescript
// Pattern used in all API modules
registerModule('analytics', (conn) => new Analytics(conn));
```

### Connection Lifecycle
```typescript
// Connections emit events when created
jsforce.emit('connection:new', conn);
// Properties are lazily initialized using Object.defineProperty
```

### Type Safety
- Generic `Schema` type allows type-safe SObject operations
- `SObjectNames<S>` and `SObjectFieldNames<S, N>` provide compile-time validation
- Record types: `Record`, `SavedRecord`, `SObjectInputRecord`, `SObjectUpdateRecord`

### Testing Strategy
- **E2E Tests**: Located in `test/`, run against real Salesforce orgs
- **Cross-Platform**: Tests run in both Node.js (Jest) and browser (Karma + Jasmine)
- **Scratch Org Setup**: Use `npx zx scripts/org-setup.mjs` to create test org
- **Environment Variables**: `SF_LOGIN_URL`, `SF_USERNAME`, `SF_PASSWORD` for test auth

## Development Workflow

### Building
```bash
npm run build              # Full build (Node + Browser + Bundles)
npm run build:node:cjs     # Node.js CommonJS only
npm run build:browser      # Browser ESM only
```

### Testing
```bash
# Node.js tests
npm run test:node [-- path/to/test.ts]

# Browser tests (requires proxy for CORS)
SF_AJAX_PROXY_URL="http://localhost:3123/proxy" npm run test:browser-ci

# Set up scratch org for testing
npx zx scripts/org-setup.mjs
```

### Code Quality
```bash
npm run typecheck  # TypeScript validation
npm run lint       # ESLint
```

## Browser vs Node.js Considerations

### Browser Limitations
- **CORS**: Requires proxy server for Salesforce API calls (`jsforce-ajax-proxy`)
- **Polyfills**: Webpack config includes polyfills for `crypto`, `stream`, `timers`, `util`
- **Transport**: Uses `XdProxyTransport` or `HttpProxyTransport` instead of direct HTTP

### Node.js Specific
- **CLI Interface**: `src/cli/` provides REPL and command-line tools
- **File Registry**: Can read/write connection configs from filesystem
- **SFDX Integration**: Can use Salesforce CLI for authentication

## Common Implementation Patterns

### Adding New API Module
1. Create class in `src/api/newmodule.ts`
2. Import and register in `src/index.ts`
3. Add types to `src/api/newmodule/types.ts`
4. Create tests in `test/newmodule.test.ts`

### Error Handling
- Use `SaveError` type for DML operation errors
- Transport errors bubble up through Promise rejections
- Session refresh handled automatically via `SessionRefreshDelegate`

### Authentication Flows
- **Username/Password**: `conn.login(username, password)`
- **OAuth2**: Use `OAuth2` class with various flows
- **Session ID**: Direct assignment to `conn.sessionId`
- **Signed Request**: Canvas app authentication

## File Structure Conventions
- `src/` - TypeScript source
- `lib/` - Node.js CommonJS build output
- `browser/` - Browser ESM build output
- `dist/` - Webpack bundles
- `test/` - Cross-platform test files
- `api/` - Individual API package.json files for submodule exports
