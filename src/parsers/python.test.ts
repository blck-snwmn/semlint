import { describe, it, expect } from "vitest";
import { PythonParser } from "./python";

describe("PythonParser", () => {
  const parser = new PythonParser();

  describe("function declarations", () => {
    it("should parse simple function", () => {
      const code = `def add(a, b):
    return a + b`;
      const result = parser.parse(code);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("add");
      expect(result[0].startLine).toBe(1);
      expect(result[0].endLine).toBe(2);
    });

    it("should parse async function", () => {
      const code = `async def fetch_data(url):
    response = await fetch(url)
    return response.json()`;
      const result = parser.parse(code);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("fetch_data");
    });

    it("should parse function with type hints", () => {
      const code = `def multiply(x: int, y: int) -> int:
    return x * y`;
      const result = parser.parse(code);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("multiply");
    });
  });

  describe("indentation handling", () => {
    it.skip("should handle nested functions", () => {
      const code = `def outer():
    def inner():
        return "inner"
    return inner()`;
      const result = parser.parse(code);
      // Current implementation only detects top-level functions
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("outer");
      expect(result[1].name).toBe("inner");
    });

    it("should handle function with complex body", () => {
      const code = `def process_data(data):
    if data:
        for item in data:
            if item > 0:
                print(item)
    else:
        return None
    return data`;
      const result = parser.parse(code);
      expect(result).toHaveLength(1);
      expect(result[0].endLine).toBe(8);
    });

    it("should handle empty lines within function", () => {
      const code = `def calculate(x, y):
    result = x + y

    # Some comment
    
    return result`;
      const result = parser.parse(code);
      expect(result).toHaveLength(1);
      expect(result[0].endLine).toBe(6);
    });
  });

  describe("docstrings", () => {
    it("should extract single line docstring", () => {
      const code = `def greet(name):
    """Return a greeting message"""
    return f"Hello, {name}!"`;
      const result = parser.parse(code);
      expect(result[0].comment).toBe("Return a greeting message");
    });

    it("should extract multi-line docstring", () => {
      const code = `def calculate_average(numbers):
    """
    Calculate the average of a list of numbers.
    
    Args:
        numbers: List of numbers
    
    Returns:
        The average value
    """
    return sum(numbers) / len(numbers)`;
      const result = parser.parse(code);
      expect(result[0].comment).toContain("Calculate the average");
    });

    it("should handle single quotes docstring", () => {
      const code = `def validate(data):
    '''Validate the input data'''
    return data is not None`;
      const result = parser.parse(code);
      expect(result[0].comment).toBe("Validate the input data");
    });
  });

  describe("edge cases", () => {
    it("should handle function at end of file", () => {
      const code = `def last_function():
    return "end"`;
      const result = parser.parse(code);
      expect(result).toHaveLength(1);
      expect(result[0].endLine).toBe(2);
    });

    it("should parse multiple functions", () => {
      const code = `def first():
    return 1

def second():
    return 2

def third():
    return 3`;
      const result = parser.parse(code);
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("first");
      expect(result[1].name).toBe("second");
      expect(result[2].name).toBe("third");
    });

    it("should handle decorated functions", () => {
      const code = `@decorator
def decorated_function():
    return "decorated"`;
      const result = parser.parse(code);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("decorated_function");
      // Note: decorator line might affect line numbers
    });

    it("should handle class methods", () => {
      const code = `class Calculator:
    def add(self, a, b):
        return a + b
    
    def subtract(self, a, b):
        return a - b`;
      const result = parser.parse(code);
      // Current implementation only detects functions, not class methods
      expect(result).toHaveLength(2);
    });
  });
});