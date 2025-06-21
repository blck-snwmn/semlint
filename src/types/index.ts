export interface FunctionInfo {
  name: string;
  content: string;
  startLine: number;
  endLine: number;
  comment?: string;
}

export interface AnalysisResult {
  functionName: string;
  evaluation: 'match' | 'unclear' | 'mismatch';
  reason?: string;
}

export interface FileAnalysisResult {
  filePath: string;
  functions: FunctionInfo[];
  results: AnalysisResult[];
}