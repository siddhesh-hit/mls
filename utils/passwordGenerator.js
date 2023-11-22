function generatePassword(length, useUppercase, useNumbers, useSymbols) {
  let charset = "abcdefghijklmnopqrstuvwxyz";
  let password = "";

  if (useUppercase) {
    charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (useNumbers) {
    charset += "0123456789";
  }
  if (useSymbols) {
    charset += "!@#$%^&*()-_=+";
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

module.exports = generatePassword;
