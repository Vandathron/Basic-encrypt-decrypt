export interface IBaseResponse<T>{
  status: boolean;
  errorMessage: string;
  data: T
}
