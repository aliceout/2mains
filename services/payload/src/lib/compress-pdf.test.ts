import assert from 'node:assert/strict'
import test from 'node:test'

import { compressPdf } from './compress-pdf'

// Garde-fou : sous le seuil, on rend `null` sans même appeler Ghostscript
// (donc ce test tourne partout, gs installé ou non).
test('compressPdf ignore les petits fichiers', async () => {
  assert.equal(await compressPdf(Buffer.alloc(1024)), null)
})
