import { useEffect, useRef, useState } from 'react';
import { Form, Popover, Input } from 'antd';
import type { FormItemProps, PopoverProps } from 'antd';
import type { PasswordProps } from 'antd/es/input/password';

import { CheckCircleFilled } from '@ant-design/icons';

export const defaultRules = [
  { pattern: /^.{6,20}$/, message: '长度为6~20个字符' },
  {
    validator: (_, value: string) => {
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

export const succeededStyle = { color: 'rgb(59, 179, 54)' };
export const failedStyle = { color: 'rgba(22, 22, 64, 0.2)' };

export type PasswordFormItemProps = FormItemProps<string> & {
  /** 自定义popover中的校验规则，默认值是defaultRules */
  rulesForCheckList?: typeof defaultRules;
  /** Input.password的props */
  inputProps?: PasswordProps;
  /** 气泡卡片的props，默认：
    trigger="focus"
    placement="right"
   */
  popoverProps?: PopoverProps;
};

export const validateCheckList = (
  rule: typeof defaultRules[number],
  value: string,
) => {
  if ('pattern' in rule && rule.pattern instanceof RegExp) {
    const matched = rule.pattern.test(value || '');
    if (!matched) {
      return Promise.reject();
    }
    return Promise.resolve();
  }
  if ('validator' in rule && typeof rule.validator === 'function') {
    return rule.validator(null, value || '');
  }
  return Promise.resolve();
};

/**
 *
 * 带气泡卡片提示校验信息的密码框，
 * 支持自定义校验规则
  });
 */
function PasswordFormItem(props: PasswordFormItemProps) {
  const {
    rulesForCheckList = defaultRules,
    inputProps = {},
    popoverProps = {},
    rules = [],
    ...restProps
  } = props;

  const { onChange, ...restInputProps } = inputProps;
  const inputRef = useRef<Input>();
  const [inputValue, setInputValue] = useState<string>();
  const handleChange: PasswordProps['onChange'] = (e) => {
    onChange?.(e);
    setInputValue(e.target.value);
  };

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
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleFilled
            className="check-circle"
            style={{
              marginRight: 6,
              ...(matched ? succeededStyle : failedStyle),
            }}
          />
          {msg}
        </div>
      );
    };

    useEffect(() => {
      const promises = rulesForCheckList.map(
        (r) =>
          validateCheckList(r, inputValue || inputRef?.current?.state?.value), // defaultValue
      );

      Promise.allSettled(promises).then((res) => {
        setMessageList(
          res.map((o, idx) => ({
            matched: o.status === 'fulfilled',
            message: rulesForCheckList[idx].message,
          })),
        );
      });
    }, []);

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
                  return Promise.reject();
                },
              );
            },
            message: '不符合密码规范',
            validateTrigger: 'onBlur',
          },
          ...rules,
        ]}
        {...restProps}
      >
        <Input.Password
          ref={inputRef}
          autoComplete="off"
          onChange={handleChange}
          {...restInputProps}
        />
      </Form.Item>
    </Popover>
  );
}

export default PasswordFormItem;
