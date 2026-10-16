## ADDED Requirements

### Requirement: App warms the backend on load
The app SHALL send exactly one fire-and-forget `GET /health` request through the shared API client when the app shell mounts, and its outcome SHALL never affect rendering, state, or the console beyond the network request itself.

#### Scenario: Landing on the world map
- **WHEN** a user opens the site at `/`
- **THEN** a `GET /health` request is sent before the user selects any country

#### Scenario: Deep link to a country
- **WHEN** a user opens `/:countrySlug` directly
- **THEN** a `GET /health` request is sent alongside the country data request

#### Scenario: Health check fails
- **WHEN** the `/health` request rejects or times out
- **THEN** no error UI is shown and no unhandled promise rejection occurs

### Requirement: Slow country loads explain the cold start
A `Spinner` rendered with `slowHint` SHALL, once it has been mounted for 4 seconds, show a localized message explaining that the server is waking up, that this is a hobby project, that the first load can take up to a minute, and that later loads are fast; the message SHALL be exposed to assistive technology through the spinner's status region. Spinners rendered without `slowHint` SHALL never show it.

#### Scenario: Cold backend
- **WHEN** a country page has been showing its loading spinner for 4 seconds
- **THEN** the cold-start message replaces the rotating taglines, in the active language

#### Scenario: Warm backend or cached data
- **WHEN** country data arrives in under 4 seconds
- **THEN** the cold-start message never appears

#### Scenario: Language switch while waiting
- **WHEN** the cold-start message is visible and the user toggles the language
- **THEN** the message switches to the other language

#### Scenario: Non-data spinners
- **WHEN** the route-chunk Suspense fallback or the video-buffering spinner stays visible for more than 4 seconds
- **THEN** no cold-start message is shown

### Requirement: Requests allow for a cold start
The shared API client SHALL allow each request up to 90 seconds before timing out, SHALL NOT retry a request that failed by timing out, and SHALL keep retrying network errors without a response and 5xx responses as before.

#### Scenario: Backend boots in 70 seconds
- **WHEN** the first country request is sent to a cold backend that responds after 70 seconds
- **THEN** the country page renders the data and no error screen appears

#### Scenario: Backend never responds
- **WHEN** a request receives no response within 90 seconds
- **THEN** it rejects without further attempts and the page shows its localized error with retry

#### Scenario: Transient 5xx
- **WHEN** a request fails with a 5xx status
- **THEN** it is retried with the existing backoff, up to 3 times
