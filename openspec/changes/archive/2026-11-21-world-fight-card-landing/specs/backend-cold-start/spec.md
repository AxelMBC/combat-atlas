## MODIFIED Requirements

### Requirement: App warms the backend on load
The app SHALL send exactly one fire-and-forget `GET /health` request through the shared API client when the app shell mounts, and its outcome SHALL never affect rendering, state, or the console beyond the network request itself.

#### Scenario: Landing on the home page
- **WHEN** a user opens the site at `/`
- **THEN** a `GET /health` request is sent before the user selects any country

#### Scenario: Deep link to a country
- **WHEN** a user opens `/:countrySlug` directly
- **THEN** a `GET /health` request is sent alongside the country data request

#### Scenario: Health check fails
- **WHEN** the `/health` request rejects or times out
- **THEN** no error UI is shown and no unhandled promise rejection occurs
