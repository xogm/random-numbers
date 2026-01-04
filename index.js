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
    if (exclude === undefined || exclude === null) {
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
    if (exclude === undefined || exclude === null) {
      return true;
    }
    
    const rangeSize = max - min + 1;
    
    // Optimize for range exclusions
    if (typeof exclude === "object" && !Array.isArray(exclude)) {
      const excludeStart = Math.max(exclude.start, min);
      const excludeEnd = Math.min(exclude.end, max);
      const excludeSize = excludeStart <= excludeEnd ? excludeEnd - excludeStart + 1 : 0;
      return excludeSize < rangeSize;
    }
    
    // For array exclusions, count how many are actually in range
    if (Array.isArray(exclude)) {
      const excludedInRange = exclude.filter(num => num >= min && num <= max).length;
      return excludedInRange < rangeSize;
    }
    
    // Single number exclusion - only problematic if range size is 1
    if (typeof exclude === "number" && exclude >= min && exclude <= max) {
      return rangeSize > 1;
    }
    
    return true;
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
