import { waitFor, render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Form, Input } from 'antd';

import PasswordFormItem, {
  defaultRules,
  validateCheckList,
  succeededStyle,
  failedStyle,
} from '../index';

describe('PasswordFormItem', () => {
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
});
