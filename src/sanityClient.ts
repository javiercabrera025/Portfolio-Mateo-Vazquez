import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '471979z9',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-01-22'
});
