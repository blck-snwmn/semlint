// ヘルパー関数群
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function hashPassword(password: string): string {
  // 簡略化された疑似ハッシュ
  return Buffer.from(password).toString("base64");
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 複雑な例1: 名前と実装が一致しているが、複数の処理を含む
function createUser(email: string, password: string, name: string) {
  // メールアドレスの検証
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  // パスワードのハッシュ化
  const hashedPassword = hashPassword(password);

  // ユーザーオブジェクトの作成
  const user = {
    id: generateId(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name: name.trim(),
    createdAt: new Date(),
    isActive: true,
  };

  // ログ出力（デバッグ用）
  console.log(`User created: ${user.id}`);

  return user;
}

// 複雑な例2: 名前が曖昧で、実際の処理が複雑
function processUserData(users: any[]) {
  // 実際は統計情報の計算、フィルタリング、変換を行っている
  const activeUsers = users.filter((u) => u.isActive);
  const inactiveUsers = users.filter((u) => !u.isActive);

  const statistics = {
    total: users.length,
    active: activeUsers.length,
    inactive: inactiveUsers.length,
    averageAge: users.reduce((sum, u) => sum + (u.age || 0), 0) / users.length,
  };

  // 名前のアルファベット順でソート
  const sortedUsers = [...activeUsers].sort((a, b) => a.name.localeCompare(b.name));

  // 各ユーザーのデータを加工
  const transformedUsers = sortedUsers.map((user) => ({
    ...user,
    displayName: `${user.name} (${user.email})`,
    accountAge: Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    ),
  }));

  return {
    statistics,
    users: transformedUsers,
  };
}

// 複雑な例3: 非同期処理と外部関数呼び出し
async function validateAndSaveUser(userData: any) {
  try {
    // バリデーション（実際は保存も行っている）
    const user = createUser(userData.email, userData.password, userData.name);

    // 追加の非同期バリデーション
    await new Promise((resolve) => setTimeout(resolve, 100)); // DB確認のシミュレーション

    // 実際の保存処理（名前と矛盾）
    const savedUser = {
      ...user,
      savedAt: new Date(),
    };

    return { success: true, user: savedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 複雑な例4: 再帰的な処理
function calculateFactorial(n: number): number {
  // 名前は階乗だが、メモ化も実装している
  const memo: { [key: number]: number } = {};

  function factorial(num: number): number {
    if (num <= 1) return 1;
    if (memo[num]) return memo[num];

    const result = num * factorial(num - 1);
    memo[num] = result;
    return result;
  }

  return factorial(n);
}

// 複雑な例5: 複数の責任を持つ関数
/**
 * ユーザーのアクセス権限をチェックする
 */
function authenticateUser(token: string, resource: string) {
  // 実際は認証だけでなく、認可、ログ記録、統計更新も行っている

  // トークンの検証
  const isValidToken = token.length > 10 && token.startsWith("Bearer ");

  if (!isValidToken) {
    // ログ記録
    console.error(`Invalid token attempted: ${token.substring(0, 10)}...`);

    // 統計更新
    global.authStats = global.authStats || { failed: 0, success: 0 };
    global.authStats.failed++;

    return { authenticated: false, authorized: false };
  }

  // リソースへのアクセス権限チェック（認可）
  const hasAccess = resource.startsWith("/public") || token.includes("admin");

  // アクセスログの記録
  const accessLog = {
    timestamp: new Date(),
    token: token.substring(0, 20) + "...",
    resource,
    granted: hasAccess,
  };
  console.log("Access log:", accessLog);

  // 統計更新
  global.authStats = global.authStats || { failed: 0, success: 0 };
  global.authStats.success++;

  return {
    authenticated: true,
    authorized: hasAccess,
    stats: global.authStats,
  };
}

// 複雑な例6: ジェネリクスと高階関数
function createBatchProcessor<T>(
  processor: (item: T) => Promise<any>,
): (items: T[]) => Promise<{ success: any[]; failed: any[] }> {
  // 名前はプロセッサー作成だが、エラーハンドリングやリトライロジックも含む
  return async function processBatch(items: T[]) {
    const results = { success: [], failed: [] };

    for (const item of items) {
      try {
        // リトライロジック
        let retries = 3;
        let lastError;

        while (retries > 0) {
          try {
            const result = await processor(item);
            results.success.push({ item, result });
            break;
          } catch (error) {
            lastError = error;
            retries--;
            if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, 100 * (4 - retries)));
            }
          }
        }

        if (retries === 0) {
          results.failed.push({ item, error: lastError });
        }
      } catch (error) {
        results.failed.push({ item, error });
      }
    }

    return results;
  };
}

// 複雑な例7: 名前が誤解を招く可能性がある関数
function sortNumbers(numbers: number[]): number[] {
  // 実際はソートだけでなく、重複除去と統計計算も行っている
  const unique = [...new Set(numbers)];
  const sorted = unique.sort((a, b) => a - b);

  // 統計情報の計算（副作用）
  const stats = {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median: sorted[Math.floor(sorted.length / 2)],
    unique: sorted.length,
    duplicates: numbers.length - sorted.length,
  };

  // グローバル変数への副作用
  (global as any).lastSortStats = stats;

  return sorted;
}
