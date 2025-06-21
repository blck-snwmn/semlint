import { TypeScriptParser } from './typescript';
import { PythonParser } from './python';
import { FunctionInfo } from '../types';

export interface Parser {
  parse(content: string): FunctionInfo[];
}

export function getParser(filePath: string): Parser {
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return new TypeScriptParser();
    case 'py':
      return new PythonParser();
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}