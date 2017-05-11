/**
 * type defs
 */
export type HttpRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  headers?: {[string]: string },
  body?: string
};

export type HttpResponse = {
  statusCode: number,
  headers: {[string]: string },
  body: string,
};

export type Callback<T> = (Error, T) => any;
