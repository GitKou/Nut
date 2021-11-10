import { message, Upload } from 'antd';
import type {
  RcFile,
  UploadFile,
  UploadFileStatus,
} from 'antd/lib/upload/interface';
import { uid } from 'uid';
import type { IFileObject, AjaxData } from '@lc-nut/interfaces/src';
import type { ByteData } from './byte';
import { calcBytes, EByteSize } from './byte';

export const getFileNameFormUrlTail = (url?: string) =>
  url ? url.substr(url.lastIndexOf('/') + 1) : '';

export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

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

export const requiredUpload =
  (p?: { min: number }) => (files: UploadFile<AjaxData<string>>[]) => {
    const minNum = p?.min !== undefined ? p?.min : 1;
    if (!files || files.filter((f) => f.status === 'done').length < minNum) {
      return Promise.reject(new Error(`请至少上传${minNum}个文件`));
    }
    return Promise.resolve();
  };

export const uploadAction = (file: RcFile) =>
  `/api/common/file/upload?fileName=${encodeURIComponent(file.name)}`;
