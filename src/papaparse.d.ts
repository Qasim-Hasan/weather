declare module 'papaparse' {
  interface ParseResult<T> {
    data: T[];
    errors: any[];
    meta: {
      delimiter: string | null;
      linebreak: string;
      aborted: boolean;
      truncated: boolean;
      fields: string[];
    };
  }

  export function parse<T>(
    input: string | File,
    options?: {
      header?: boolean;
      dynamicTyping?: boolean;
      complete?: (results: ParseResult<T>) => void;
      error?: (error: any) => void;
    }
  ): void;

  // You can add other functions or types if needed
}
