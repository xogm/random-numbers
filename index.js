function randomNumbers(min, max, options = {}) {
  if (max === undefined || typeof max === "object") {
    options = typeof max === "object" ? max : {};
    max = min;
    min = 0;
  }

  if (min > max) {
    [min, max] = [max, min];
  }

  const { exclude } = options;

  const isExcluded = (num) => {
    if (exclude === undefined) {
      return false;
    }

    if (Array.isArray(exclude)) {
      return exclude.includes(num);
    } else if (typeof exclude === "object") {
      return num >= exclude.start && num <= exclude.end;
    } else {
      return num === exclude;
    }
  };

  // Check if any valid numbers exist
  const hasValidNumber = () => {
    for (let i = min; i <= max; i++) {
      if (!isExcluded(i)) {
        return true;
      }
    }
    return false;
  };

  // Return null if no valid numbers exist
  if (!hasValidNumber()) {
    return null;
  }

  let randomNumber;

  do {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (isExcluded(randomNumber));

  return randomNumber;
}

module.exports = randomNumbers;
