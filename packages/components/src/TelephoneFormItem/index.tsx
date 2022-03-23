import React, { useState } from 'react';
import type { FormItemProps } from 'antd';
import { Input, Form, Col, Row } from 'antd';
import cls from 'classnames';
import type { InputProps } from 'antd/es/input/Input';

import './index.less';

export type TelephoneInputProps = InputProps & {
  value?: string;
  defaultValue?: string;
  onChange?: (e?: string) => void;
  areaCodeHelp?: string;
  phoneNoHelp?: string;
};

export type TelephoneFormItemProps = FormItemProps<string> & {
  /** Input的props */
  inputProps?: TelephoneInputProps;
};

const getAreaCodeFromStr = (str?: string): string | undefined =>
  (str || '').split('-')[0];
const getPhoneNoFromStr = (str?: string): string | undefined =>
  (str || '').split('-')[1];

export enum TelephoneRules {
  请输入区号 = '请输入区号',
  区号不超过4位 = '区号不超过4位',
  区号应为数字 = '区号应为数字',
  请输入固定电话 = '请输入固定电话',
  固定电话应不超过8位 = '固定电话应不超过8位',
  固定电话应为数字 = '固定电话应为数字',
}
/**
 * 组合区号和固定电话号码，
 * 校验样式手动控制
 */
export function TelephoneInput({
  value,
  onChange,
  areaCodeHelp,
  phoneNoHelp,
  defaultValue,
  ...restInputProps
}: TelephoneInputProps) {
  const [areaCode, setAreaCode] = useState(
    getAreaCodeFromStr(value || defaultValue),
  );
  const [phoneNo, setPhoneNo] = useState(
    getPhoneNoFromStr(value || defaultValue),
  );

  const triggerChange = (changedValue: {
    areaCode?: string;
    phoneNo?: string;
  }) => {
    const newValue = {
      areaCode,
      phoneNo,
      ...changedValue,
    };
    const str = [newValue.areaCode, newValue.phoneNo].join('-');
    onChange?.(str === '-' ? undefined : str);
  };

  const handleAreaCodeChange = (e: { target: { value: string } }) => {
    setAreaCode(e.target.value);
    triggerChange({ areaCode: e.target.value });
  };
  const handlePhoneNoChange = (e: { target: { value: string } }) => {
    setPhoneNo(e.target.value);
    triggerChange({ phoneNo: e.target.value });
  };

  return (
    <Row>
      <Col span={8}>
        <Form.Item
          // name="areaCode"
          className={!areaCodeHelp ? 'no-self-error' : undefined}
          validateStatus={areaCodeHelp ? 'error' : undefined}
          help={areaCodeHelp}
        >
          <Input
            placeholder="请输入区号"
            value={areaCode}
            onChange={handleAreaCodeChange}
            {...restInputProps}
          />
        </Form.Item>
      </Col>
      <Col span={1}>
        <Row justify="center" align="middle" style={{ height: 36 }}>
          -
        </Row>
      </Col>
      <Col span={15}>
        <Form.Item
          // name="phoneNo"
          className={!phoneNoHelp ? 'no-self-error' : undefined}
          validateStatus={phoneNoHelp ? 'error' : undefined}
          help={phoneNoHelp}
        >
          <Input
            placeholder="请输入固定电话"
            value={phoneNo}
            onChange={handlePhoneNoChange}
            {...restInputProps}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

/** 区号是不超过4位的数字，固定是电话应不超过8位的数字 */
function TelephoneFormItem(props: TelephoneFormItemProps) {
  const { className, inputProps, ...restProps } = props;
  const [areaCodeHelp, setAreaCodeHelp] = useState<string>();
  const [phoneNoHelp, setPhoneNoHelp] = useState<string>();

  const formItemCls = cls('telephone-form-item', className);

  return (
    <Form.Item
      className={formItemCls}
      name="officePhone"
      label="固定电话"
      // 校验样式由内部input控制，外部不做控制
      validateStatus={undefined}
      help={''}
      rules={[
        {
          validator: (rules, value) => {
            if (!props.required && !value) {
              // 不是必填，且没有填值的时候不做校验
              setAreaCodeHelp(undefined);
              setPhoneNoHelp(undefined);
              return Promise.resolve();
            }

            const areaCode = getAreaCodeFromStr(value) || '';
            const phoneNo = getPhoneNoFromStr(value) || '';

            let areaCodeMsg = '';
            let phoneNoMsg = '';

            if (props.required && !areaCode) {
              areaCodeMsg = TelephoneRules.请输入区号;
            }
            if (props.required && !phoneNo) {
              areaCodeMsg = TelephoneRules.请输入固定电话;
            }

            if (areaCode.length > 4) {
              areaCodeMsg = TelephoneRules.区号不超过4位;
            }
            if (!/^[0-9]+$/.test(areaCode)) {
              areaCodeMsg = TelephoneRules.区号应为数字;
            }
            if (phoneNo.length > 8) {
              phoneNoMsg = TelephoneRules.固定电话应不超过8位;
            }
            if (!/^[0-9]+$/.test(phoneNo)) {
              phoneNoMsg = TelephoneRules.固定电话应为数字;
            }
            setAreaCodeHelp(areaCodeMsg);
            setPhoneNoHelp(phoneNoMsg);
            if (areaCodeMsg || phoneNoMsg) {
              return Promise.reject();
            }
            return Promise.resolve();
          },
        },
      ]}
      {...restProps}
    >
      <TelephoneInput
        areaCodeHelp={areaCodeHelp}
        phoneNoHelp={phoneNoHelp}
        {...inputProps}
      />
    </Form.Item>
  );
}

export default TelephoneFormItem;
