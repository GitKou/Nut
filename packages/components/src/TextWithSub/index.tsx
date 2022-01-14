import React from 'react';
import styles from './index.less';

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
    <>
      <div className={styles.txt}>{txt}</div>
      <div className={styles.sub}>{sub}</div>
    </>
  );
}

export default TextWithSub;
