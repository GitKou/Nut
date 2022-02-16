import React, { useEffect, useRef, useState } from 'react';
import { Form, Popover, Input } from 'antd';
import type { FormItemProps, PopoverProps } from 'antd';
import type { PasswordProps } from 'antd/es/input/password';

import { CheckCircleFilled } from '@ant-design/icons';

export const defaultRules = [
  { pattern: /^.{6,20}$/, message: '长度为6~20个字符' },
  {
    validator: (value: string) => {
      const letterRegex = /[a-z]/gi; // 字母
      const digitRegex = /\d/g; // 数字
      const specialCharRegex = /([^\w\s]|_)/g; // 标点符号
      const matched =
        Number(letterRegex.test(value)) +
          Number(digitRegex.test(value)) +
          Number(specialCharRegex.test(value)) >=
        2;
      if (!matched) {
        return Promise.reject();
      }
      return Promise.resolve();
    },
    message: '字母/数字以及标点符号至少包含2种',
  },
  { pattern: /^[^\u4e00-\u9fa5\s ]+$/, message: '不允许有空格、中文' },
];

export type PasswordFormItemProps = FormItemProps<string> & {
  /** 自定义popover中的校验规则，默认值是defaultRules */
  rulesForCheckList?: typeof defaultRules;
  inputProps?: PasswordProps;
  popoverProps?: PopoverProps;
};

const validateCheckList = (
  rule: typeof defaultRules[number],
  value: string,
) => {
  if ('pattern' in rule && rule.pattern instanceof RegExp) {
    const matched = rule.pattern.test(value || '');
    if (!matched) {
      return Promise.reject(rule.message);
    }
    return Promise.resolve(rule.message);
  }
  if ('validator' in rule && typeof rule.validator === 'function') {
    return rule.validator(value || '');
  }
  return Promise.resolve(rule.message);
};

/**
 *
 * 带气泡卡片提示校验信息的密码框，
 * 支持自定义校验规则
 */
function PasswordFormItem(props: PasswordFormItemProps) {
  const {
    rulesForCheckList = defaultRules,
    inputProps = {},
    popoverProps = {},
    rules = [],
    ...restProps
  } = props;

  const inputRef = useRef<Input>();

  const ValidateMessages = () => {
    const [messageList, setMessageList] = useState<
      { message: string; matched: boolean }[]
    >([]);

    const ValidatedItem = ({
      matched,
      msg,
    }: {
      matched: boolean;
      msg: string;
    }) => {
      const succeededStyle = { color: 'rgba(59, 179, 54, 1)' };
      const failedStyle = { color: 'rgba(22, 22, 64, 0.2)' };
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleFilled
            style={{
              marginRight: 6,
              ...(matched ? succeededStyle : failedStyle),
            }}
          />
          {msg}
        </div>
      );
    };

    const promises = rulesForCheckList.map((r) =>
      validateCheckList(r, inputRef.current?.state?.value || ''),
    );

    useEffect(() => {
      Promise.allSettled(promises).then((res) => {
        setMessageList(
          res.map((o, idx) => ({
            matched: o.status === 'fulfilled',
            message: rulesForCheckList[idx].message,
          })),
        );
      });
    }, [promises]);

    return (
      <div>
        {messageList.map((item) => {
          return (
            <ValidatedItem
              matched={item.matched}
              msg={item.message}
              key={item.message}
            />
          );
        })}
      </div>
    );
  };

  console.log(inputRef.current, inputRef.current?.state?.value);

  return (
    <Popover
      content={<ValidateMessages />}
      trigger="focus"
      placement="right"
      {...popoverProps}
    >
      <Form.Item
        validateTrigger={['onBlur', 'onChange']}
        validateFirst={true}
        rules={[
          {
            validator: (_, v) => {
              const promises = rulesForCheckList.map((r) =>
                validateCheckList(r, v || ''),
              );
              return Promise.all(promises).then(
                () => {
                  return Promise.resolve();
                },
                () => {
                  return Promise.reject('不符合密码规范');
                },
              );
            },
            validateTrigger: 'onBlur',
          },
          ...rules,
        ]}
        {...restProps}
      >
        <Input.Password ref={inputRef} autoComplete="off" {...inputProps} />
      </Form.Item>
    </Popover>
  );
}

export default PasswordFormItem;
