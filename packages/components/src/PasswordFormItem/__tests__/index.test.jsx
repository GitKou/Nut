import { waitFor, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import PasswordFormItem, {
  defaultRules,
  validateCheckList,
  succeededStyle,
  failedStyle,
} from '../index';

it('popover content validated  defaultValue when first focus on input', async () => {
  let input;

  render(
    <PasswordFormItem
      label="密码"
      inputProps={{
        defaultValue: 'abc',
        'data-testid': 'nut-password-form-item',
      }}
    />,
  );

  input = screen.getByTestId('nut-password-form-item');
  const promises = defaultRules.map(
    (r) => validateCheckList(r, input.value), // defaultValue
  );

  return Promise.allSettled(promises).then(async (res) => {
    input.focus();
    await waitFor(() => {
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
});

// it('validation messages updated whenever input.value changed', () => {});

// it('the  validation results for formItem are based on rules in popover by default', () => {});
