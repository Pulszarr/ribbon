import { expect, test } from 'claude-code/testing'

import { summary, viewOf } from '../hooks/register'

const NOW = Date.parse('2098-12-31T22:00:00Z')
const WINDOWS = [
  { kind: 'seven_day', percentUsed: 41, resetsAt: '2099-01-04T07:00:00Z' },
  { kind: 'five_hour', percentUsed: 90, resetsAt: '2099-01-01T00:10:00Z' },
]

test('the text form shows each window left, its reset, and a warm cache', () => {
  const view = viewOf({ lastAt: NOW - 19 * 60000, tokens: 200_000, window: 1_000_000, model: 'claude-opus-5-5' }, NOW)
  const text = summary(WINDOWS, view, NOW)
  expect(text).toContain('7D 59% left · resets 3d 9h')
  expect(text).toContain('5H 10% left (LOW) · resets 2h 10m')
  expect(text).toContain('Cache WARM, 41m left')
})

test('before the first reply the text form says the cache comes later', () => {
  expect(summary([], null, NOW)).toBe('Usage: no reading yet  |  Cache: shows after the first reply')
})
