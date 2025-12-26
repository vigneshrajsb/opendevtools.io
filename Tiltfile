local_resource(
    'dev-server',
    serve_cmd='pnpm dev',
    serve_dir='.',
    readiness_probe=probe(
        http_get=http_get_action(port=3000, path='/'),
        initial_delay_secs=5,
        period_secs=2,
    ),
    labels=['dev'],
)

docker_build(
    'opendevtools-e2e',
    context='.',
    dockerfile='e2e/Dockerfile',
    ignore=['.next', 'node_modules', 'playwright-report', 'test-results'],
)

# Uses host.docker.internal for macOS Docker Desktop (--network=host doesn't work on macOS)
local_resource(
    'e2e-tests',
    cmd='docker run --rm ' +
        '-v "$(pwd)/e2e:/app/e2e" ' +
        '-v "$(pwd)/playwright-report:/app/playwright-report" ' +
        '-v "$(pwd)/test-results:/app/test-results" ' +
        '-e BASE_URL=http://host.docker.internal:3000 ' +
        'opendevtools-e2e ' +
        'pnpm test:e2e',
    resource_deps=['dev-server'],
    labels=['test'],
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
)

local_resource(
    'update-snapshots',
    cmd='docker run --rm ' +
        '-v "$(pwd)/e2e:/app/e2e" ' +
        '-v "$(pwd)/playwright-report:/app/playwright-report" ' +
        '-e BASE_URL=http://host.docker.internal:3000 ' +
        'opendevtools-e2e ' +
        'pnpm exec playwright test e2e/tests/visual/snapshots.spec.ts --update-snapshots',
    resource_deps=['dev-server'],
    labels=['test'],
    auto_init=False,
    trigger_mode=TRIGGER_MODE_MANUAL,
)
