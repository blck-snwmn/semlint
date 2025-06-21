import { FunctionInfo } from '../types';

export class PythonParser {
  parse(content: string): FunctionInfo[] {
    const functions: FunctionInfo[] = [];
    const lines = content.split('\n');

    // 関数定義パターン
    const functionPattern = /^\s*(?:async\s+)?def\s+(\w+)\s*\(/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(functionPattern);
      
      if (match) {
        const functionName = match[1];
        const startLine = i + 1;
        const indentLevel = line.search(/\S/); // 最初の非空白文字の位置
        
        // 関数の終了位置を探す（インデントベース）
        let endLine = startLine;
        let foundBody = false;
        
        for (let j = i + 1; j < lines.length; j++) {
          const currentLine = lines[j];
          const currentIndent = currentLine.search(/\S/);
          
          // 空行はスキップ
          if (currentLine.trim() === '') {
            continue;
          }
          
          // 関数本体が始まった
          if (!foundBody && currentIndent > indentLevel) {
            foundBody = true;
          }
          
          // 同じかより浅いインデントレベルに戻った = 関数終了
          if (foundBody && currentIndent >= 0 && currentIndent <= indentLevel) {
            endLine = j;
            break;
          }
          
          // ファイルの最後まで到達
          if (j === lines.length - 1) {
            endLine = lines.length;
          }
        }

        // docstringを探す
        let comment: string | undefined;
        const nextNonEmptyLine = i + 1;
        if (nextNonEmptyLine < lines.length) {
          const docstringLine = lines[nextNonEmptyLine].trim();
          if (docstringLine.startsWith('"""') || docstringLine.startsWith("'''")) {
            const quoteType = docstringLine.substring(0, 3);
            
            if (docstringLine.endsWith(quoteType) && docstringLine.length > 6) {
              // 単一行docstring
              comment = docstringLine.substring(3, docstringLine.length - 3).trim();
            } else {
              // 複数行docstring
              for (let k = nextNonEmptyLine + 1; k < lines.length; k++) {
                if (lines[k].includes(quoteType)) {
                  const docstringLines = lines.slice(nextNonEmptyLine, k + 1).join('\n');
                  comment = docstringLines
                    .replace(new RegExp(`^\\s*${quoteType}`), '')
                    .replace(new RegExp(`${quoteType}\\s*$`), '')
                    .trim();
                  break;
                }
              }
            }
          }
        }

        const functionContent = lines.slice(i, endLine).join('\n');
        
        functions.push({
          name: functionName,
          content: functionContent,
          startLine,
          endLine,
          comment
        });

        // 次の関数を探すため、現在の関数の終了位置まで移動
        i = endLine - 1;
      }
    }

    return functions;
  }
}