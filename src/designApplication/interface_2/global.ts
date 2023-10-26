/**
 * @description: 公共接口 - 旧接口
 */
export interface ResponseDataOld {
  retState: '0' | '1';
  retMsg: string;
  status: boolean;
}

/**
 * @description: 公共接口 - 新接口
 */
export interface ResponseData<T> {
  code: 0 | 1;
  message: string | null;
  success: boolean;
  data: T;
}

/**
 * @description: 列表接口
 */
export interface ListData<T> {
  list: T[];
  total: number;
}
