---
title: RequiredMark - 必填红星星
order: 1
nav:
  path: /components
  title: 数据展示
group:
  path: /
---

# RequiredMark

在 antd 中，表单项 label 上的必填红星`*`，可通过配置 required 自动生成。

但是对于`upload`等组件而言，用自带的 required，它只会校验文件存不存在，并不会去管上传的状态。
所以通常需要我们自定义校验器，同时这个时候也需要自己去写 label 上必填的样式，遂抽取该红星样式组件。

```tsx
import React, { useMemo } from 'react';
import { RequiredMark } from '@lc-nut/components'; // 可通过包名引入，而不是相对路径
import { AjaxData } from '@lc-nut/interfaces'; //
import { Form, Button } from 'antd';
import {
  normFile,
  requiredUpload,
  uploadAction,
  EByteSize,
  beforeUpload,
} from '@lc-nut/utils';
import type { UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ProForm from '@ant-design/pro-form';

export default () => {
  const uploadProps: UploadProps = useMemo(
    () => ({
      name: 'file',
      action: uploadAction,
      headers: {
        authorization: 'authorization-text',
      },
      accept: '.png,.jpg',
      beforeUpload: beforeUpload({
        maxSize: { number: 10, unit: EByteSize.MB },
        fileType: ['png', 'jpg'],
      }),
    }),
    [],
  );

  return (
    <ProForm
      onFinish={async (values) => {
        console.log(values);
      }}
    >
      <Form.Item
        name="upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra={'仅支持小于10M的 pdg、png...'}
        label={
          <>
            <RequiredMark />
            文件
          </>
        }
        rules={[
          {
            validator: (_: any, files: UploadFile<AjaxData<string>>[]) =>
              requiredUpload()(files),
          },
        ]}
      >
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
      </Form.Item>
    </ProForm>
  );
};
```
