function add(a: number, b: number): number {
  return a + b;
}

function multiply(x: number, y: number): number {
  return x + y;
}

function getAverage(numbers: number[]): number {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const avg = sum / numbers.length;

  // 中央値も計算しているがreturnしていない
  const sorted = [...numbers].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return avg;
}

/**
 * 2つの数値を掛け算する
 */
function subtract(a: number, b: number): number {
  return a - b;
}

const divide = (a: number, b: number): number => {
  return a / b;
};

class MathUtils {
  // 最大値を取得
  getMin(values: number[]): number {
    return Math.min(...values);
  }

  getMax(values: number[]): number {
    return Math.max(...values);
  }
}
