---
title: EllipsisMiddle - 文字中间省略
order: 0
nav:
  path: /components
  title: 数据展示
group:
  path: /
---

# EllipsisMiddle

从中间省略内容的组件，适合于需要保留文本末位特征的内容。

```tsx
import React from 'react';
import { EllipsisMiddle } from '@lc-nut/components'; // 通过包名引入，而不是相对路径
export default () => {
  return (
    <EllipsisMiddle suffixCount={12}>
      {`  In the process of internal desktop applications development, many different design specs and
    implementations would be involved, which might cause designers and developers difficulties and
    duplication and reduce the efficiency of development.`}
    </EllipsisMiddle>
  );
};
```
