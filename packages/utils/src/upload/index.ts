import { message, Upload } from 'antd';
import type {
  RcFile,
  UploadFile,
  UploadFileStatus,
  UploadChangeParam,
} from 'antd/lib/upload/interface';
import { uid } from 'uid';
import type { IFileObject, AjaxData } from '@lc-nut/interfaces/src';
import type { ByteData } from '../byte';
import { calcBytes, EByteSize } from '../byte';

/** 从url的末尾处获取文件名 */
export const getFileNameFormUrlTail = (url?: string) =>
  url ? url.substr(url.lastIndexOf('/') + 1) : '';

/** getValueFromEvent	设置如何将 event 的值转换成字段值 */
export const normFile = (e: UploadChangeParam) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

/** 初始化表单中upload的value，一般用户编辑态的表单 */
export const initialUploadValue = (fileInfo: IFileObject[] | IFileObject) => {
  if (fileInfo === undefined) {
    return fileInfo;
  }
  const list = Array.isArray(fileInfo) ? fileInfo : [fileInfo];
  return list.map((u) => ({
    uid: uid(),
    name: u.fileName,
    url: u.fileUrl,
    response: { code: '200', data: u.fileUrl, message: '成功' },
    status: 'done' as UploadFileStatus,
  }));
};

/** 在上传之前校验文件，支持校验文件类型、大小 */
export const beforeUpload =
  ({
    fileType,
    maxSize,
  }: {
    fileType?: string | string[];
    maxSize?: number | ByteData;
  }) =>
  (file: File) => {
    if (fileType) {
      // 校验文件类型
      const fileTypeList = Array.isArray(fileType) ? fileType : [fileType];
      if (!fileTypeList?.includes(file.type)) {
        message.error(`仅支持文件格式${fileTypeList.join('\\')}`);
        return Upload.LIST_IGNORE;
      }
    }
    if (maxSize !== undefined) {
      // 校验文件大小
      if (typeof maxSize === 'number') {
        if (file.size > maxSize) {
          message.error(`文件大小不能超过${maxSize}B`);
          return Upload.LIST_IGNORE;
        }
      } else {
        const limitSize = calcBytes(maxSize);
        if (file.size > limitSize) {
          message.error(
            `文件大小不能超过${maxSize.number}${EByteSize[maxSize.unit]}`,
          );
          return Upload.LIST_IGNORE;
        }
      }
    }
    return true;
  };

/** 自定义文件必填校验，必须是上传已完成的文件 */
export const requiredUpload =
  (p?: { min: number }) => (files: UploadFile<AjaxData<string>>[]) => {
    const minNum = p?.min !== undefined ? p?.min : 1;
    if (!files || files.filter((f) => f.status === 'done').length < minNum) {
      return Promise.reject(new Error(`请至少上传${minNum}个文件`));
    }
    return Promise.resolve();
  };

/** 上传的action带上fileName参数 */
export const uploadAction = (file: RcFile) =>
  `/api/common/file/upload?fileName=${encodeURIComponent(file.name)}`;
