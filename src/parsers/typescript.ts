import { FunctionInfo } from "../types";

export class TypeScriptParser {
  parse(content: string): FunctionInfo[] {
    const functions: FunctionInfo[] = [];
    const lines = content.split("\n");

    // 関数宣言パターン
    const functionPatterns = [
      // function宣言
      /^\s*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(/,
      // アロー関数（const/let/var）
      /^\s*(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[a-zA-Z_]\w*)(?:\s*:\s*[^=]+)?\s*=>/,
      // メソッド（クラス内）
      /^\s*(?:public|private|protected)?\s*(?:static)?\s*(?:async)?\s*(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*{/,
      // メソッド（簡略記法）
      /^\s*(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*{/,
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const pattern of functionPatterns) {
        const match = line.match(pattern);
        if (match) {
          const functionName = match[1];
          const startLine = i + 1;

          // 関数の終了位置を探す（簡易版）
          // TODO: Phase 2 - 文字列内の中括弧を無視する処理を追加
          // 現在の実装では "Hello {user}" のような文字列内の括弧もカウントしてしまう
          let braceCount = 0;
          let endLine = startLine;
          let foundStart = false;

          for (let j = i; j < lines.length; j++) {
            const currentLine = lines[j];
            for (const char of currentLine) {
              if (char === "{") {
                braceCount++;
                foundStart = true;
              } else if (char === "}") {
                braceCount--;
              }
            }

            if (foundStart && braceCount === 0) {
              endLine = j + 1;
              break;
            }
          }

          // コメントを探す（関数の直前の行）
          let comment: string | undefined;
          if (i > 0) {
            const prevLine = lines[i - 1].trim();
            if (prevLine.startsWith("//")) {
              comment = prevLine.substring(2).trim();
            } else if (prevLine.endsWith("*/")) {
              // 複数行コメントの場合
              for (let k = i - 1; k >= 0; k--) {
                if (lines[k].includes("/**") || lines[k].includes("/*")) {
                  const commentLines = lines.slice(k, i).join("\n");
                  comment = commentLines
                    .replace(/\/\*\*?/, "")
                    .replace(/\*\//, "")
                    .replace(/^\s*\*\s?/gm, "")
                    .trim();
                  break;
                }
              }
            }
          }

          const functionContent = lines.slice(i, endLine).join("\n");

          functions.push({
            name: functionName,
            content: functionContent,
            startLine,
            endLine,
            comment,
          });

          // 次の関数を探すため、現在の関数の終了位置まで移動
          i = endLine - 1;
          break;
        }
      }
    }

    return functions;
  }
}
