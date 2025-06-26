# semlint プロジェクト概要

## プロジェクトの目的
関数・メソッドの命名と実装の一貫性を検証するLintツール

## 主要機能
- 対象プロジェクトやディレクトリ内の関数・メソッドを解析
- 以下の観点で評価を実施：
  1. **命名と実装の一致性**: 関数/メソッド名が内部実装の内容を適切に表現しているか
  2. **コメントと実装の一致性**: 関数/メソッドのコメント（説明）が実装内容と整合しているか
  3. **命名とコメントの一致性**: 関数/メソッド名とそのコメント（説明）が一致しているか

## 設計方針

### アーキテクチャ概要
- **実装言語**: TypeScript
- **対象言語**: TypeScript/JavaScript、Python
- **コア技術**: Claude Code SDKによるセマンティック分析

### パーサー設計
- シンプルな正規表現による関数抽出
- 拡張子ベースの言語判定
- Claude Code SDKに解析の主要部分を委譲

### 言語判定戦略
1. **拡張子による判定**（第一優先）
2. **内容による推測**（拡張子が不明な場合）
   - キーワードマッチング
   - 簡易的なパターン認識

### Claude Code SDK活用方針
- 関数の意味論的理解はClaude Codeに完全に委譲
- パーサーは関数の位置と基本情報の抽出に専念
- セマンティック分析の精度向上に注力

## 実装詳細

### プロジェクト構成
```
src/
├── cli/           # CLIエントリーポイント
├── parsers/       # 言語別パーサー実装
├── analyzers/     # Claude Code SDKを使用したセマンティック分析
├── reporters/     # 結果レポート生成
└── types/         # TypeScript型定義
```

### 技術スタック
- **Node.js**: v18以上
- **TypeScript**: 5.x
- **主要依存関係**:
  - `@anthropic-ai/claude-code`: Claude Code SDK

### CLI使用方法
```bash
# 単一ファイルの解析
semlint <file>  # 例: semlint src/example.ts
```

### 出力仕様
- **評価レベル（3段階）**:
  - `match` (👍): 命名と実装が一致
  - `unclear` (🤔): 判断が曖昧、レビュー推奨
  - `mismatch` (❌): 明らかに不一致、修正推奨
- **出力形式**: 人間が読みやすいテキスト形式

### 出力例

#### 成功例（すべてmatch）
```
Analyzing: example.ts
✓ calculateSum       👍 match
✓ getUserName        👍 match
✓ formatDate         👍 match

Summary: 3 functions analyzed (3 match, 0 unclear, 0 mismatch)
```

#### 問題検出例
```
Analyzing: calculator.ts
✓ add                👍 match
? getAverage         🤔 unclear    - 関数名は平均値だが、中央値も計算している可能性
✗ multiply           ❌ mismatch  - 関数名は「掛け算」だが実装は「足し算」

Summary: 3 functions analyzed (1 match, 1 unclear, 1 mismatch)
```

### 実装範囲
1. **対象言語**: TypeScript/JavaScript、Python
2. **関数抽出パターン例**:
   ```typescript
   // TypeScript/JavaScript
   - function functionName(...) { }
   - const functionName = (...) => { }
   - class X { methodName(...) { } }
   
   // Python
   - def function_name(...):
   - class X: def method_name(self, ...):
   ```

### 開発状況
- 正規表現ベースの関数抽出器: 実装済み
- Claude Code SDKを使った分析エンジン: 実装済み
- 3段階評価（match/unclear/mismatch）の判定ロジック: 実装済み
- CLI（単一ファイル実行）: 実装済み
- テキスト形式の出力: 実装済み
