---
title: upload
order: 1
nav:
  path: /utils
  # title: 上传
group:
  path: /
---

# upload

在 antd 中，表单项 label 上的必填红星`*`，可通过配置 required 自动生成。

但是对于`upload`组件而言，它的 value 是数组，数组里面是个对象，[required 的规则](https://github.com/yiminghe/async-validator/blob/057b0b047f88fac65457bae691d6cb7c6fe48ce1/src/util.ts#L96)（可参考后文代码）识别不到，用自带的 required，它只会校验数组是不是空，并不会去管文件上传的状态。
所以通常需要我们自定义校验器。

## 代码示例

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