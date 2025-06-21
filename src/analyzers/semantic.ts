import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import { FunctionInfo, AnalysisResult } from "../types";

export class SemanticAnalyzer {
  async analyzeFunctions(functions: FunctionInfo[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];

    for (const func of functions) {
      const result = await this.analyzeFunction(func);
      results.push(result);
    }

    return results;
  }

  private async analyzeFunction(func: FunctionInfo): Promise<AnalysisResult> {
    const prompt = this.createAnalysisPrompt(func);

    try {
      const messages: SDKMessage[] = [];
      const abortController = new AbortController();

      for await (const message of query({
        prompt,
        abortController,
        options: {
          maxTurns: 1,
          allowedTools: [], // 分析のみでツール使用は不要
        },
      })) {
        messages.push(message);
      }

      // Claude Codeからの応答を解析
      const analysisResult = this.parseResponse(messages, func.name);
      return analysisResult;
    } catch (error) {
      console.error(`Error analyzing function ${func.name}:`, error);
      return {
        functionName: func.name,
        evaluation: "unclear",
        reason: "Analysis failed due to an error",
      };
    }
  }

  private createAnalysisPrompt(func: FunctionInfo): string {
    return `
You are an expert in evaluating the consistency between function naming and implementation.
Please analyze the following function from three perspectives:

1. **Naming-Implementation Consistency**: Does the function name appropriately express what the implementation does?
2. **Comment-Implementation Consistency**: Does the function comment/documentation align with the actual implementation?
3. **Naming-Comment Consistency**: Does the function name match its comment/documentation?

Function name: ${func.name}
${func.comment ? `Comment: ${func.comment}` : "Comment: None"}

Implementation:
\`\`\`
${func.content}
\`\`\`

Please provide your evaluation using one of the following three levels:
- match: The naming and implementation are consistent
- unclear: The judgment is ambiguous, review recommended
- mismatch: Clear inconsistency, modification recommended

Please respond in the following format:
EVALUATION: [match/unclear/mismatch]
REASON: [Explain the reason for your evaluation in 1-2 sentences]
`;
  }

  private parseResponse(messages: SDKMessage[], functionName: string): AnalysisResult {
    // Claude Codeの応答から評価結果を抽出
    for (const msg of messages) {
      if (msg.type === "assistant" && msg.message.content) {
        const content = Array.isArray(msg.message.content)
          ? msg.message.content
              .map((c: any) => (typeof c === "string" ? c : c.type === "text" ? c.text : ""))
              .join("")
          : msg.message.content;

        // 評価結果を抽出
        const evaluationMatch = content.match(/EVALUATION:\s*(match|unclear|mismatch)/i);
        const reasonMatch = content.match(/REASON:\s*(.+?)(?:\n|$)/i);

        if (evaluationMatch) {
          return {
            functionName,
            evaluation: evaluationMatch[1].toLowerCase() as "match" | "unclear" | "mismatch",
            reason: reasonMatch ? reasonMatch[1].trim() : undefined,
          };
        }
      }
    }

    // パースできない場合はunclearとして扱う
    return {
      functionName,
      evaluation: "unclear",
      reason: "Could not parse analysis result",
    };
  }
}
