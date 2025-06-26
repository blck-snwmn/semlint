function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function hashPassword(password: string): string {
  return Buffer.from(password).toString("base64");
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

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

  console.log(`User created: ${user.id}`);

  return user;
}

function processUserData(users: any[]) {
  const activeUsers = users.filter((u) => u.isActive);
  const inactiveUsers = users.filter((u) => !u.isActive);

  const statistics = {
    total: users.length,
    active: activeUsers.length,
    inactive: inactiveUsers.length,
    averageAge: users.reduce((sum, u) => sum + (u.age || 0), 0) / users.length,
  };

  const sortedUsers = [...activeUsers].sort((a, b) => a.name.localeCompare(b.name));

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

async function validateAndSaveUser(userData: any) {
  try {
    const user = createUser(userData.email, userData.password, userData.name);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const savedUser = {
      ...user,
      savedAt: new Date(),
    };

    return { success: true, user: savedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function calculateFactorial(n: number): number {
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

/**
 * ユーザーのアクセス権限をチェックする
 */
function authenticateUser(token: string, resource: string) {
  const isValidToken = token.length > 10 && token.startsWith("Bearer ");

  if (!isValidToken) {
    console.error(`Invalid token attempted: ${token.substring(0, 10)}...`);

    global.authStats = global.authStats || { failed: 0, success: 0 };
    global.authStats.failed++;

    return { authenticated: false, authorized: false };
  }

  const hasAccess = resource.startsWith("/public") || token.includes("admin");

  const accessLog = {
    timestamp: new Date(),
    token: token.substring(0, 20) + "...",
    resource,
    granted: hasAccess,
  };
  console.log("Access log:", accessLog);

  global.authStats = global.authStats || { failed: 0, success: 0 };
  global.authStats.success++;

  return {
    authenticated: true,
    authorized: hasAccess,
    stats: global.authStats,
  };
}

function createBatchProcessor<T>(
  processor: (item: T) => Promise<any>,
): (items: T[]) => Promise<{ success: any[]; failed: any[] }> {
  return async function processBatch(items: T[]) {
    const results: { success: any[]; failed: any[] } = { success: [], failed: [] };

    for (const item of items) {
      try {
        let retries = 3;
        let lastError: any;

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

function sortNumbers(numbers: number[]): number[] {
  const unique = [...new Set(numbers)];
  const sorted = unique.sort((a, b) => a - b);

  const stats = {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median: sorted[Math.floor(sorted.length / 2)],
    unique: sorted.length,
    duplicates: numbers.length - sorted.length,
  };

  (global as any).lastSortStats = stats;

  return sorted;
}
