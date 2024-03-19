const convertMarToEng = (data) => {
  // Function to convert Marathi numeral string to regular number
  function marathiToNumber(marathiNumeral) {
    const numeralMap = {
      "०": 0,
      "१": 1,
      "२": 2,
      "३": 3,
      "४": 4,
      "५": 5,
      "६": 6,
      "७": 7,
      "८": 8,
      "९": 9,
    };
    return parseInt(
      marathiNumeral.replace(/[०-९]/g, function (match) {
        return numeralMap[match];
      }),
      10
    );
  }

  // Sort the array of Marathi numerals
  const sortedData = data.sort(
    (a, b) => marathiToNumber(a) - marathiToNumber(b)
  );

  return sortedData;
};

module.exports = {
  convertMarToEng,
};
