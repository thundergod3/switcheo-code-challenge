const sum_to_n_a = (n) => {
  let total = 0;

  for (let i = 1; i <= n; i++) {
    total += i;
  }

  return total;
};

const sum_to_n_b = (n) => {
  const total = (n * (n + 1)) / 2;

  return total;
};

const sum_to_n_c = (n) => {
  const sumRange = (min, max) => {
    if (min !== max) {
      return sumRange(min, max - 1) + max;
    } else {
      return 0;
    }
  };

  return sumRange(0, n);
};

console.log("Sum to n A option", sum_to_n_a(5));
console.log("Sum to n B option", sum_to_n_b(5));
console.log("Sum to n C option", sum_to_n_c(5));
