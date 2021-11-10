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

表单项 label 的必填红星。
antd 的 form-item 的红星是通过配置 required 生成的，但是对于`upload`组件而言，校验必填的条件是自定义的。

```tsx
import React from 'react';
import { RequiredMark } from '@lc-nut/components'; // 可通过包名引入，而不是相对路径

export default () => {
  return <RequiredMark />;
};
```
