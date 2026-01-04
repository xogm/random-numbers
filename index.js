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

  // Helper to check if exclude is a valid range object
  const isValidRangeObject = (obj) => {
    return typeof obj === "object" && 
           obj !== null && 
           !Array.isArray(obj) && 
           typeof obj.start === "number" && 
           typeof obj.end === "number" &&
           Number.isFinite(obj.start) &&
           Number.isFinite(obj.end) &&
           obj.start <= obj.end;
  };

  const isExcluded = (num) => {
    if (exclude === undefined || exclude === null) {
      return false;
    }

    if (Array.isArray(exclude)) {
      return exclude.includes(num);
    } else if (isValidRangeObject(exclude)) {
      return num >= exclude.start && num <= exclude.end;
    } else if (typeof exclude === 'number') {
      return Number.isFinite(exclude) && num === exclude;
    } else {
      return false;
    }
  };

  // Check if any valid numbers exist
  const hasValidNumber = () => {
    if (exclude === undefined || exclude === null) {
      return true;
    }
    
    const rangeSize = max - min + 1;
    
    // Optimize for range exclusions
    if (isValidRangeObject(exclude)) {
      const excludeStart = Math.max(exclude.start, min);
      const excludeEnd = Math.min(exclude.end, max);
      const excludeSize = excludeStart <= excludeEnd ? excludeEnd - excludeStart + 1 : 0;
      return excludeSize < rangeSize;
    }
    
    // For array exclusions, count how many are actually in range
    if (Array.isArray(exclude)) {
      const excludedInRange = exclude.reduce((count, num) => {
        return count + (typeof num === 'number' && Number.isFinite(num) && num >= min && num <= max ? 1 : 0);
      }, 0);
      return excludedInRange < rangeSize;
    }
    
    // Single number exclusion - only problematic if range size is 1
    if (typeof exclude === "number" && Number.isFinite(exclude) && exclude >= min && exclude <= max) {
      return rangeSize > 1;
    }
    
    return true; // Invalid exclusion types are treated as no exclusion
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
