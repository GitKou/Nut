import request from 'umi-request';
import type { RequestOptionsWithResponse } from 'umi-request';
import { message } from 'antd';
import store from 'store';
import { requestConfig } from '@lc-nut/utils';

/**
 * 【表单形式提交下载】
 * */
export const download = (
  action: string,
  params: Record<string, any> = {},
  method: 'GET' | 'POST' = 'GET',
) => {
  const token = store.get(requestConfig.tokenName);

  const form = document.createElement('form');
  form.action = action;
  form.method = method;
  form.target = '_blank';
  if (token) {
    // 处理token
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = requestConfig.tokenName;
    tokenInput.value = token;
    form.appendChild(tokenInput);
  }
  // 处理其他参数
  Object.keys(params).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = params[key];
    if (input.value !== undefined) {
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

type BlobDownloadOptions = Omit<
  RequestOptionsWithResponse & { skipErrorHandler?: boolean | undefined },
  'getResponse'
>;

/**
 * 【Blob形式下载】
 * 可能会因为文件过大导致内存消耗过多
 * @param url
 * @param options
 * @returns
 */
export const downloadByBlob = (url: string, options: BlobDownloadOptions) => {
  const hideLoadingMsg = message.loading('下载中...', 0);
  try {
    return request<Blob>(url, {
      ...options,
      responseType: 'blob',
      getResponse: true,
      skipErrorHandler: true,
    }).then(
      (res) => {
        hideLoadingMsg();
        const { response, data } = res;

        const fileName = decodeURI(
          escape(
            response.headers
              .get('content-disposition')
              ?.replace(/.+filename=/, '') || 'file',
          ),
        );
        const URL = window.URL.createObjectURL(
          new Blob([data], {
            type: data.type,
          }),
        );
        const link = document.createElement('a');
        link.href = URL;
        link.style.display = 'none';
        link.setAttribute('download', fileName || 'download');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(link.href), 7000);
        message.success('下载成功');
      },
      () => {
        hideLoadingMsg();
        message.error('下载失败');
      },
    );
  } catch (e) {
    message.error('下载失败');
    return Promise.reject(e);
  }
};
