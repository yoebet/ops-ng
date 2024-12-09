export class ResultCodes {
  // 成功
  static CODE_SUCCESS = 0;

  // 未登录
  static CODE_NOT_AUTHENTICATED = 401;

  // 无操作权限
  // static CODE_NOT_AUTHORIZED = 461;

  static GENERAL_FAILURE_MESSAGE = '操作失败';
}

export interface ApiResult {
  code: number;
  message?: string;
}

export interface ValueResult<T> extends ApiResult {
  value?: T;
}

export interface ListResult<T> extends ApiResult {
  list?: T[];
}

export interface CountListResult<T> extends ApiResult {
  countList?: CountList<T>;
}

export interface CountList<T> {
  count: number;
  list: T[],
}
