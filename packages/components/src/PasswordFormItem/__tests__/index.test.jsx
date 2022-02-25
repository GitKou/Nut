import { waitFor, render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Form, Input } from 'antd';
import renderer from 'react-test-renderer';

import PasswordFormItem, {
  defaultRules,
  validateCheckList,
  succeededStyle,
  failedStyle,
} from '../index';

// ruleIdxs 满足的规则下标
const func = async (element, ruleIdxs) => {
  await act(() => {
    element.focus();
    let promises = defaultRules.map((r) => validateCheckList(r, element.value));
    return Promise.allSettled(promises).then(async (res) => {
      await waitFor(() => {
        res.forEach((o, idx) => {
          const circle = screen.getByText(defaultRules[idx].message).firstChild;
          if (ruleIdxs.indexOf(idx) !== -1) {
            expect(o.status === 'fulfilled');
            expect(circle.style.color).toBe(succeededStyle.color);
          } else {
            expect(o.status === 'rejected');
            expect(circle.style.color).toBe(failedStyle.color);
          }
        });
      });
    });
  });
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

  it('popover content validated the defaultValue when first focus on input', async () => {
    render(
      <PasswordFormItem
        label="密码"
        inputProps={{
          defaultValue: 'abc123',
          'data-testid': 'nut-password-form-item',
        }}
      />,
    );
    let input = screen.getByTestId('nut-password-form-item');
    await act(() => {
      input.focus();
      const promises = defaultRules.map(
        (r) => validateCheckList(r, input.value), // defaultValue
      );
      return Promise.allSettled(promises).then(async (res) => {
        await waitFor(() => {
          res.forEach((o, idx) => {
            const circle = screen.getByText(
              defaultRules[idx].message,
            ).firstChild;
            if (o.status === 'fulfilled') {
              expect(circle.style.color).toBe(succeededStyle.color);
            } else {
              expect(circle.style.color).toBe(failedStyle.color);
            }
          });
        });
      });
    });
  });

  it('validation messages updated whenever input.value changed', async () => {
    render(
      <PasswordFormItem
        label="密码"
        inputProps={{
          defaultValue: 'abc',
          'data-testid': 'nut-password-form-item',
        }}
      />,
    );
    let input = screen.getByTestId('nut-password-form-item');
    input.focus();
    await userEvent.type(input, '123', { delay: 1 });
    const promises = defaultRules.map(
      (r) => validateCheckList(r, input.value), // abc123
    );
    Promise.allSettled(promises).then(async (res) => {
      res.forEach((o, idx) => {
        const circle = screen.getByText(defaultRules[idx].message).firstChild;
        if (o.status === 'fulfilled') {
          expect(circle.style.color).toBe(succeededStyle.color);
        } else {
          expect(circle.style.color).toBe(failedStyle.color);
        }
      });
    });
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
    let input = screen.getByTestId('testId');

    input.focus();
    await userEvent.type(input, '123', { delay: 1 });
    input.blur();

    const promises = defaultRules.map(
      (r) => validateCheckList(r, input.value), // abc123
    );

    let finalResult = true;
    await waitFor(async () => {
      await Promise.allSettled(promises).then(async (res) => {
        res.some((o, idx) => {
          finalResult = finalResult && o.status === 'fulfilled';
          return !finalResult;
        });
      });
      setTimeout(() => {
        if (finalResult) {
          screen.getByText('不符合密码规范').not.toBeInTheDocument();
        } else {
          expect(screen.getByText('不符合密码规范').toBeInTheDocument());
        }
      }, 1000);
    });
  });

  it('warn when input.value does not pass specific validation rules.', async () => {
    render(
      <PasswordFormItem
        label="密码"
        inputProps={{
          defaultValue: 'abc',
          'data-testid': 'nut-password-form-item',
        }}
      />,
    );
    let input = screen.getByTestId('nut-password-form-item');

    // 初始密码仅满足第三条规则，其他两条置灰
    await func(input, [2]);

    // 模拟用户输入满足第一、三条规则
    await userEvent.type(input, 'def');
    await func(input, [0, 2]);

    // 用户输入，直到满足全部规则
    await userEvent.type(input, '11');
    await func(input, [0, 1, 2]);
  });
});
