# TelephoneFormItem

固定电话表单项。

TelephoneInput 接收的 value 是格式如'0041-8323222'的字符串。
TelephoneFormItem 自带校验规则，区号位微 4 位数以内的数字字符串，号码为 8 位数以内的数字字符串。

## 代码示例

```tsx
import React from 'react';
import { Form, Button } from 'antd';
import { TelephoneFormItem } from '@lc-nut/components'; // 通过包名引入，而不是相对路径
export default () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      initialValues={{ phone: 'gmm-123123' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <TelephoneFormItem name="phone" label="座机☎️" value />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

<API src="../../packages/components/src/TelephoneFormItem/index.tsx" ></API>
