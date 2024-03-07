const generateOTP = () => {
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseLetters = lowercaseLetters.toUpperCase();
  const numbers = "0123456789";
  const characters = lowercaseLetters + uppercaseLetters + numbers;

  let otp = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};

module.exports = generateOTP;
