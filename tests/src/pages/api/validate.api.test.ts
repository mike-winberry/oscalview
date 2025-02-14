import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('API Route /api/validate', () => {
  const baseUrl = 'http://localhost:3000'; // Ensure your server is running on this URL

  test('should return error for empty input', async ({ request }) => {
    const response = await request.post(`${baseUrl}/api/validate`, {
      form: {
        data: '',
        path: 'test.json',
        extension: 'json',
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('invalid document type ensure the document contains oscal-version or lula-version');
  });

  test('should return 400 for empty form data', async ({ request }) => {
    const response = await request.post(`${baseUrl}/api/validate`, {
      form: {},
    });

    expect(response.status()).toBe(400);
  });

  test('should validate correct OSCAL JSON', async ({ request }) => {
    const validOscalJson = fs.readFileSync(path.join(__dirname, '../../../../test-data/oscal/catalog.json'), 'utf8');
    const response = await request.post(`${baseUrl}/api/validate`, {
      form: {
        data: validOscalJson,
        path: 'test.json',
        extension: 'json',
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.valid).toBe(true);
  });

  test('should return validation errors for invalid OSCAL YAML', async ({ request }) => {
    const invalidOscalYaml = fs.readFileSync(
      path.join(__dirname, '../../../../test-data/oscal/invalid-catalog.yaml'),
      'utf8'
    );
    const response = await request.post(`${baseUrl}/api/validate`, {
      form: {
        data: invalidOscalYaml,
        path: 'test.yaml',
        extension: 'yaml',
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.valid).toBe(false);
  });
});
