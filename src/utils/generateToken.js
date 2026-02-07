const crypto = require('crypto');

exports.generateEmailToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  return { rawToken, hashedToken,expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)  }; // 24 hours
};
