import { render, waitFor } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { Button, Form } from 'antd';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import TelephoneFormItem, { TelephoneRules } from '../index';

const rulesValues = Object.values(TelephoneRules);
// rulesIdxs 期待不满足的规则下标
const msgsExpectToBeDisplayed = async (rulesIdxs) => {
  for (let i = 0; i < rulesValues.length; i++) {
    if (rulesIdxs.includes(rulesValues[i])) {
      // 当前输入满足条件idx
      await waitFor(() =>
        expect(
          screen.getByText(new RegExp(rulesValues[i])),
        ).toBeInTheDocument(),
      );
    } else {
      await waitFor(() =>
        expect(
          screen.getByText(new RegExp(rulesValues[i])),
        ).not.toBeInTheDocument(),
      );
    }
  }
};

describe('TelephoneFormItem', () => {
  it('renders correctly when there are multiple items in a Form', () => {
    const ele = renderer
      .create(
        <Form>
          <TelephoneFormItem label="tel1" name="tel1" />
          <TelephoneFormItem label="tel2" name="tel2" />
        </Form>,
      )
      .toJSON();
    expect(ele).toMatchSnapshot();
  });

  it('initialValue works in a Form', async () => {
    render(
      <Form initialValues={{ phone: 'gmm-123123' }}>
        <TelephoneFormItem label="固定电话" name="phone" />,
      </Form>,
    );
    const input1 = screen.getByPlaceholderText<HTMLInputElement>('请输入区号');
    const input2 =
      screen.getByPlaceholderText<HTMLInputElement>('请输入固定电话');

    expect(input1.value).toBe('gmm');
    expect(input2.value).toBe('123123');
  });

  it('shows no error when formItem is not required and the value is undefined or empty string', () => {
    render(
      <Form initialValues={{ phone2: '' }}>
        <TelephoneFormItem label="固定电话" name="phone" />
        <TelephoneFormItem label="固定电话" name="phone2" />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>,
    );
    const submitter = screen.getByRole('button', {
      name: /submit/i,
    });

    fireEvent.click(submitter);

    msgsExpectToBeDisplayed([]);
  });

  it('shows required error messages when formItem is required and the value is undefined ', () => {
    render(
      <Form>
        <TelephoneFormItem label="固定电话" name="phone" required />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>,
    );
    const submitter = screen.getByRole('button', {
      name: /submit/i,
    });

    fireEvent.click(submitter);

    msgsExpectToBeDisplayed([
      TelephoneRules.请输入区号,
      TelephoneRules.请输入固定电话,
    ]);
  });

  it('onchange callbacks correctly', () => {
    const onChange = jest.fn();
    render(
      <Form>
        <TelephoneFormItem
          label="固定电话"
          name="phone"
          required
          inputProps={{
            onChange,
          }}
        />
      </Form>,
    );
    const input1 = screen.getByPlaceholderText<HTMLInputElement>(/请输入区号/);
    const input2 =
      screen.getByPlaceholderText<HTMLInputElement>(/请输入固定电话/);
    fireEvent.change(input1, { target: { value: '12345' } });
    fireEvent.change(input2, { target: { value: 'gmm' } });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('warns when input.value does not pass specific validation rules.', async () => {
    render(
      <Form initialValues={{ phone: 'gmm-1231234444' }}>
        <TelephoneFormItem label="固定电话" name="phone" />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>,
    );
    const input1 = screen.getByPlaceholderText<HTMLInputElement>(/请输入区号/);
    const input2 =
      screen.getByPlaceholderText<HTMLInputElement>(/请输入固定电话/);
    const submitter = screen.getByRole('button', {
      name: /submit/i,
    });

    fireEvent.click(submitter);
    // gmm-1231234444
    msgsExpectToBeDisplayed([
      TelephoneRules.区号应为数字,
      TelephoneRules.固定电话应不超过8位,
    ]);

    fireEvent.change(input1, { target: { value: '12345' } });
    fireEvent.change(input2, { target: { value: 'gmm' } });
    fireEvent.click(submitter);

    // 12345-gmm
    msgsExpectToBeDisplayed([
      TelephoneRules.区号不超过4位,
      TelephoneRules.固定电话应为数字,
    ]);

    fireEvent.change(input1, { target: { value: '0571' } });
    fireEvent.change(input2, { target: { value: '8322222' } });
    fireEvent.click(submitter);

    // 0571-8322222
    msgsExpectToBeDisplayed([]);
  });
});
