import React, { useState } from 'react';
import type { FormItemProps } from 'antd';
import { Input, Form, Col, Row } from 'antd';
import cls from 'classnames';
import styles from './index.less';

const getAreaCodeFromStr = (str?: string): string | undefined =>
  (str || '').split('-')[0];
const getPhoneNoFromStr = (str?: string): string | undefined =>
  (str || '').split('-')[1];

/**
 * 组合区号和固定电话号码，
 * 校验样式手动控制
 */
export function TelephoneInput({
  value,
  onChange,
  areaCodeHelp,
  phoneNoHelp,
}: {
  value?: string;
  onChange?: (e?: string) => void;
  areaCodeHelp?: string;
  phoneNoHelp?: string;
}) {
  const [areaCode, setAreaCode] = useState(getAreaCodeFromStr(value));
  const [phoneNo, setPhoneNo] = useState(getPhoneNoFromStr(value));

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
          className={!areaCodeHelp ? styles.noSelfError : undefined}
          validateStatus={areaCodeHelp ? 'error' : undefined}
          help={areaCodeHelp}
        >
          <Input
            placeholder="请输入区号"
            value={areaCode}
            onChange={handleAreaCodeChange}
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
          className={!phoneNoHelp ? styles.noSelfError : undefined}
          validateStatus={phoneNoHelp ? 'error' : undefined}
          help={phoneNoHelp}
        >
          <Input
            placeholder="请输入固定电话"
            value={phoneNo}
            onChange={handlePhoneNoChange}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

function TelephoneFormItem(props: FormItemProps) {
  const { className, ...restProps } = props;
  const [areaCodeHelp, setAreaCodeHelp] = useState('');
  const [phoneNoHelp, setPhoneNoHelp] = useState('');

  const formItemCls = cls(styles.formItem, className);

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
            const areaCode = getAreaCodeFromStr(value) || '';
            const phoneNo = getPhoneNoFromStr(value) || '';

            let areaCodeMsg = '';
            let phoneNoMsg = '';

            if (areaCode.length > 4) {
              areaCodeMsg = '区号不超过4位';
            }
            if (!/^[0-9]+$/.test(areaCode)) {
              areaCodeMsg = '区号应为数字';
            }
            if (phoneNo.length > 8) {
              phoneNoMsg = '固定电话应不超过8位';
            }
            if (!/^[0-9]+$/.test(phoneNo)) {
              phoneNoMsg = '固定电话应为数字';
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
      <TelephoneInput areaCodeHelp={areaCodeHelp} phoneNoHelp={phoneNoHelp} />
    </Form.Item>
  );
}

export default TelephoneFormItem;
