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

export type Record = { Id: string };

export type UnsavedRecord = {};

export type SaveError = {
  errorCode: string,
  message: string,
  fields?: string[],
};

export type SaveResult = {
  id: string,
  sucess: boolean,
  errors: SaveError[],
};

export type DescribeSObjectResult = {

};

export type DescribeGlobalResult = {

};

export type DescribeLayoutResult = {

};

export type DescribeCompactLayoutsResult = {

};

export type DescribeApprovalLayoutsResult = {

};
