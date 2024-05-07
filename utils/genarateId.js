const crypto = require("crypto");

const generateId = (length = 24) => {
  return crypto.randomBytes(length / 2).toString("hex");
};

module.exports = generateId;
