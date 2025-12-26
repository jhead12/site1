// Simple CommonJS mock for is-absolute-url used in tests
module.exports = function isAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return false
  // Very small heuristic used in tests: consider URLs starting with protocol or // as absolute
  return /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)?\/\//.test(url) || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)
}
