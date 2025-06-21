#!/usr/bin/env node

import { readFileSync } from 'fs';
import { getParser } from '../parsers';
import { SemanticAnalyzer } from '../analyzers/semantic';
import { AnalysisResult } from '../types';

async function main() {
  // 引数チェック
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: semlint <file>');
    process.exit(1);
  }

  const filePath = args[0];

  try {
    // ファイル読み込み
    const content = readFileSync(filePath, 'utf-8');
    
    // パーサー取得と関数抽出
    const parser = getParser(filePath);
    const functions = parser.parse(content);

    if (functions.length === 0) {
      console.log(`No functions found in ${filePath}`);
      return;
    }

    console.log(`Analyzing: ${filePath}`);

    // セマンティック分析
    const analyzer = new SemanticAnalyzer();
    const results = await analyzer.analyzeFunctions(functions);

    // 結果表示
    displayResults(results);

    // サマリー表示
    displaySummary(results);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function displayResults(results: AnalysisResult[]) {
  for (const result of results) {
    const icon = getIcon(result.evaluation);
    const status = result.evaluation === 'match' ? '✓' : result.evaluation === 'unclear' ? '?' : '✗';
    
    console.log(`${status} ${result.functionName.padEnd(20)} ${icon} ${result.evaluation}`);
    if (result.reason && result.evaluation !== 'match') {
      console.log(`  └─ ${result.reason}`);
    }
  }
}

function displaySummary(results: AnalysisResult[]) {
  const counts = {
    match: results.filter(r => r.evaluation === 'match').length,
    unclear: results.filter(r => r.evaluation === 'unclear').length,
    mismatch: results.filter(r => r.evaluation === 'mismatch').length,
  };

  console.log('\nSummary:', 
    `${results.length} functions analyzed`,
    `(${counts.match} match, ${counts.unclear} unclear, ${counts.mismatch} mismatch)`
  );
}

function getIcon(evaluation: 'match' | 'unclear' | 'mismatch'): string {
  switch (evaluation) {
    case 'match': return '👍';
    case 'unclear': return '🤔';
    case 'mismatch': return '❌';
  }
}

// メイン処理実行
main().catch(console.error);