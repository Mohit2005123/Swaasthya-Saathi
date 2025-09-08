function splitIntoChunks(text, maxLen = 400) {
  const chunks = [];
  let current = "";

  const parts = text.split(/[\n\r]|(?<=[.?!])\s+/);

  for (const sentence of parts) {
    if ((current + sentence).length > maxLen) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += " " + sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

module.exports = { splitIntoChunks };


