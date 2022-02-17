import React from 'react';
import './index.less';

function TextWithSub({
  txt,
  sub,
}: {
  /** 正文 */
  txt: string;
  /** 下标 */
  sub: string;
}) {
  return (
    <span className="text-with-sub">
      <div className={'txt'}>{txt}</div>
      <div className={'sub'}>{sub}</div>
    </span>
  );
}

export default TextWithSub;
