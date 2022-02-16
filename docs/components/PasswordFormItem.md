# PasswordFormItem

带气泡卡片的密码框，气泡卡片内实时提示校验信息
默认规则：

1. 长度为 6~20 个字符
2. 字母/数字以及标点符号至少包含 2 种
3. 不允许有空格、中文

支持自定义校验规则

## 代码示例

### 基础示例

```tsx
import React from 'react';
import { Form, Button } from 'antd';
import { PasswordFormItem } from '@lc-nut/components'; // 通过包名引入，而不是相对路径

export default () => {
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ password: 'abc' }}
    >
      <PasswordFormItem name={'password'} label="初始密码" />
      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

### 自定义校验规则

```tsx
import React from 'react';
import { Form, Button } from 'antd';
import { PasswordFormItem } from '@lc-nut/components'; // 通过包名引入，而不是相对路径
import { defaultRules } from '@lc-nut/components/src/PasswordFormItem'; // 通过包名引入，而不是相对路径

export default () => {
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ password: 'abc123' }}
    >
      <PasswordFormItem
        name={'password'}
        label="密码"
        rulesForCheckList={[
          ...defaultRules,
          {
            validator: (value) => {
              if (value.includes('gmm')) return Promise.resolve();
              return Promise.reject();
            },
            message: `包含'gmm'校验通过`,
          },
        ]}
        inputProps={{
          onChange: (e) => {
            console.log(e);
          },
        }}
        popoverProps={{
          placement: 'top',
        }}
      />
      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

<API src="../../packages/components/src/PasswordFormItem/index.tsx" ></API>
