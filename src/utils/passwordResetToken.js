const crypto = require('crypto');

exports.generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  return {
    rawToken,
    hashedToken,
    expiresAt: Date.now() + 15 * 60 * 1000 // ⏱ 15 minutes
  };
};
