import { waitFor, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import PasswordFormItem, {
  defaultRules,
  succeededStyle,
  failedStyle,
} from '../index';

// rulesIdxs 期待满足的规则下标
const rulesExpectToBeTruthy = async (rulesIdxs) => {
  for (const [idx, rule] of defaultRules.entries()) {
    const circle = await waitFor(
      () => screen.getByText(rule.message).firstChild as HTMLElement | null,
    );
    if (rulesIdxs.includes(idx)) {
      // 当前输入满足条件idx
      expect(circle?.style?.color).toBe(succeededStyle.color);
    } else {
      expect(circle?.style?.color).toBe(failedStyle.color);
    }
  }
};

describe('PasswordFormItem', () => {
  it('renders correctly when there is a single PasswordFormItem', () => {
    const ele = renderer.create(<PasswordFormItem />).toJSON();
    expect(ele).toMatchSnapshot();
  });

  it('renders correctly when there are multiple items in a Form', () => {
    const ele = renderer
      .create(
        <Form>
          <PasswordFormItem label="password" name="password" />
          <PasswordFormItem label="password2" name="newPassword" />
          <PasswordFormItem />
        </Form>,
      )
      .toJSON();
    expect(ele).toMatchSnapshot();
  });

  it('warns when input.value does not pass specific validation rules.', async () => {
    render(
      <PasswordFormItem
        label="密码"
        inputProps={{
          defaultValue: 'abc',
          'data-testid': 'nut-password-form-item',
        }}
      />,
    );
    const input = screen.getByTestId('nut-password-form-item');

    input.focus();

    // abc, 初始密码仅满足第三条规则，其他两条置灰
    await rulesExpectToBeTruthy([2]);

    // abcdef, 模拟用户输入满足第一、三条规则
    userEvent.type(input, 'def');
    await rulesExpectToBeTruthy([0, 2]);

    // abcdef11,用户输入，直到满足全部规则
    userEvent.type(input, '11');
    await rulesExpectToBeTruthy([0, 1, 2]);

    // abcdef, 模拟用户输入满足第一、三条规则
    userEvent.type(input, '{backspace}{backspace}');
    await rulesExpectToBeTruthy([0, 2]);
  });

  it('the FormItem validation rules is the combination of rules in popover by default', async () => {
    render(
      <Form
        initialValues={{
          password: 'abc',
        }}
      >
        <PasswordFormItem
          name={'password'}
          label="密码"
          inputProps={{
            'data-testid': 'testId',
          }}
        />
      </Form>,
    );
    const input = screen.getByTestId('testId');

    input.focus();
    userEvent.type(input, 'qwe');
    input.blur();

    // abcqwe, 校验不通过
    await waitFor(() =>
      expect(screen.queryByText(/不符合密码规范/i)).toBeInTheDocument(),
    );

    input.focus();
    userEvent.type(input, '123');
    input.blur();

    // abcqwe123, 校验通过
    await waitFor(() =>
      expect(screen.queryByText(/不符合密码规范/i)).not.toBeInTheDocument(),
    );
  });
});
