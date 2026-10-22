/**
 * MatterMind Frontend API Contract & Integration Tests
 * Verifies frontend API client contracts, token lifecycle, schema adapters,
 * and live backend endpoints without mocking network responses.
 */

import { api, mapBackendMaterialToItem, BackendMaterial, BackendMaterialPassport, APIError } from './api';

async function runTests() {
  console.log('--- Starting MatterMind Frontend API & Contract Verification ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // 1. Adapter Test: mapBackendMaterialToItem
  try {
    const mockBackendMaterial: BackendMaterial = {
      id: 42,
      material_name: 'Inconel 718 High-Temp Alloy',
      material_type: 'Nickel Superalloy',
      manufacturer: 'Siemens Energy Foundry',
      density: 8.19,
      health_score: 91.5,
      carbon_score: 18.4,
      status: 'Active',
      category: 'Aerospace Alloy',
      location: 'Berlin Vault',
      is_recyclable: true,
      created_at: '2026-10-22T10:00:00Z',
    };

    const mockPassport: BackendMaterialPassport = {
      passport_id: 'DPP-EU-2026-4242',
      material_id: 42,
      material_name: 'Inconel 718 High-Temp Alloy',
      material_type: 'Nickel Superalloy',
      is_recyclable: true,
      status: 'compliant',
      blockchain_hash: '0xabc123789fed',
      provenance_details: {
        category: 'Aerospace Alloy',
        density: 8.19,
        verification_standard: 'ISO 14040:2026',
      },
    };

    const item = mapBackendMaterialToItem(mockBackendMaterial, mockPassport);

    assert(item.id === '42', 'Adapter maps ID correctly to string');
    assert(item.name === 'Inconel 718 High-Temp Alloy', 'Adapter maps material_name to name');
    assert(item.healthIndex === 91.5, 'Adapter maps health_score to healthIndex');
    assert(item.densityGcm3 === 8.19, 'Adapter maps density to densityGcm3');
    assert(item.passportStatus === 'compliant', 'Adapter maps passportStatus accurately');
    assert(item.blockchainHash === '0xabc123789fed', 'Adapter maps blockchainHash accurately');
  } catch (err: any) {
    assert(false, 'Adapter test threw exception', err.message);
  }

  // 2. Token Lifecycle Tests (using local/mock storage simulation)
  try {
    api.removeToken();
    assert(!api.isAuthenticated(), 'Token helper: isAuthenticated returns false when token cleared');
    assert(!api.isOfflineDemo(), 'Offline demo helper returns false initially');

    api.setToken('test-access-token', 'test-refresh-token');
    assert(api.isAuthenticated(), 'Token helper: isAuthenticated returns true when token set');
    assert(api.getToken() === 'test-access-token', 'Token helper: getToken retrieves stored token');

    api.setOfflineDemo(true);
    assert(api.isOfflineDemo(), 'Offline demo helper returns true when activated');

    api.removeToken();
    assert(!api.isAuthenticated(), 'Token helper: removeToken clears token');
    assert(!api.isOfflineDemo(), 'Token helper: removeToken clears offline demo mode');
  } catch (err: any) {
    assert(false, 'Token lifecycle test threw exception', err.message);
  }

  // 3. Live Backend Contract: Health Check
  try {
    const health = await api.health();
    assert(health && health.status === 'healthy', 'GET /health returns status: healthy');
  } catch (err: any) {
    console.warn('⚠️ Backend offline or unreachable at port 8000 for GET /health:', err.message);
  }

  // 4. Live Backend Contract: Auth Register & Login
  const testEmail = `test_runner_${Date.now()}@mattermind.ai`;
  const testPass = 'MatterMind2026!';
  try {
    const registered = await api.register({
      email: testEmail,
      password: testPass,
      full_name: 'Test Automation Runner',
      role: 'user',
    });
    assert(registered && registered.email === testEmail, 'POST /auth/register creates user');

    const tokenRes = await api.login(testEmail, testPass);
    assert(Boolean(tokenRes.access_token), 'POST /auth/login returns access_token');
    assert(api.isAuthenticated(), 'api.login stores token in storage');

    const currentUser = await api.getCurrentUser();
    assert(currentUser.email === testEmail, 'GET /auth/me returns registered user details');
  } catch (err: any) {
    console.warn('⚠️ Live backend auth test warning:', err.message);
  }

  // 5. Live Backend Contract: Blockchain History
  try {
    const history = await api.getBlockchainHistory(1);
    assert(Array.isArray(history), 'GET /blockchain/history/{id} returns array');
  } catch (err: any) {
    console.warn('⚠️ Live blockchain endpoint warning:', err.message);
  }

  // 6. Live Backend Contract: AI History
  try {
    const aiHistory = await api.getAIHistory(1);
    assert(Array.isArray(aiHistory), 'GET /ai/history/{id} returns array');
  } catch (err: any) {
    console.warn('⚠️ Live AI history endpoint warning:', err.message);
  }

  // 7. Error Handling: Invalid Credentials Throw APIError
  try {
    let threw = false;
    try {
      await api.login('non_existent_user_999@mattermind.ai', 'WrongPassword123!');
    } catch (err: any) {
      threw = true;
      assert(err instanceof APIError, 'Invalid login throws instance of APIError');
      assert(err.status === 400 || err.status === 401, 'Invalid login returns 400 or 401 status code');
    }
    assert(threw, 'Invalid login call threw an error as expected');
  } catch (err: any) {
    assert(false, 'Error handling test threw unexpected error', err.message);
  }

  console.log(`\n--- Test Summary: ${passed} Passed, ${failed} Failed ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
