// 正しい実装の例
function add(a: number, b: number): number {
  return a + b;
}

// 間違った実装の例 - 関数名はmultiplyだが、実際は足し算をしている
function multiply(x: number, y: number): number {
  return x + y;
}

// 曖昧な例 - getAverageという名前だが、平均値と中央値の両方を計算している可能性
function getAverage(numbers: number[]): number {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const avg = sum / numbers.length;

  // 中央値も計算しているがreturnしていない
  const sorted = [...numbers].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return avg;
}

// コメント付きの例
/**
 * 2つの数値を掛け算する
 */
function subtract(a: number, b: number): number {
  return a - b; // 実際は引き算をしている
}

// アロー関数の例
const divide = (a: number, b: number): number => {
  return a / b;
};

// クラスメソッドの例
class MathUtils {
  // 最大値を取得
  getMin(values: number[]): number {
    return Math.min(...values); // 実際は最小値を返している
  }

  getMax(values: number[]): number {
    return Math.max(...values);
  }
}
