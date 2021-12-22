import type {
  RequestOptionsInit,
  RequestMethod,
  RequestOptionsWithoutResponse,
  RequestOptionsWithResponse,
  RequestResponse,
} from 'umi-request';
import type {
  FormattedAjaxData,
  FormattedAjaxDataWithPage,
} from '@lc-nut/interfaces';
import { ErrorHandlerError } from './error-type';

export type NutRequestOptionsInit = Omit<RequestOptionsInit, 'errorHandler'> & {
  errorHandler?: (error: ErrorHandlerError) => void;
};

export interface FormattedRequestMethod<WithPage extends boolean = false>
  extends RequestMethod<false> {
  <T = any>(url: string, options?: NutRequestOptionsInit): Promise<
    WithPage extends false ? FormattedAjaxData<T> : FormattedAjaxDataWithPage<T>
  >;
  <T = any>(url: string, options: RequestOptionsWithResponse): Promise<
    RequestResponse<
      WithPage extends false
        ? FormattedAjaxData<T>
        : FormattedAjaxDataWithPage<T>
    >
  >;
  <T = any>(url: string, options: RequestOptionsWithoutResponse): Promise<
    WithPage extends false ? FormattedAjaxData<T> : FormattedAjaxDataWithPage<T>
  >;
  get: FormattedRequestMethod<WithPage>;
  post: FormattedRequestMethod<WithPage>;
  delete: FormattedRequestMethod<WithPage>;
  put: FormattedRequestMethod<WithPage>;
  patch: FormattedRequestMethod<WithPage>;
  head: FormattedRequestMethod<WithPage>;
  options: FormattedRequestMethod<WithPage>;
  rpc: FormattedRequestMethod<WithPage>;
}
