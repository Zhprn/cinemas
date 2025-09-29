const blocklistedTokens = new Set();

/**
 * @param {string} tokenId 
 */
const addTokenToBlocklist = (tokenId) => {
  blocklistedTokens.add(tokenId);
  console.log('Current blocklist:', blocklistedTokens);
};

/**
 * @param {string} tokenId 
 * @returns {boolean}
 */
const isTokenBlocklisted = (tokenId) => {
  return blocklistedTokens.has(tokenId);
};

module.exports = {
  addTokenToBlocklist,
  isTokenBlocklisted,
};