const generateOtpCode = (length = 4) => {
  let result = "";
  const digits = "145689876543";
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * 10));
  }
  return result;
};

module.exports = generateOtpCode;
