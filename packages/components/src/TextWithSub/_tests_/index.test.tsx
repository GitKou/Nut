import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import TextWithSub from '../';

describe('TextWithSub', () => {
  it('Renders correctly', () => {
    render(<TextWithSub txt="John" sub="age 16" />);
    expect(screen.queryByText(/John/i)).toBeInTheDocument();
    expect(screen.queryByText(/age 16/i)).toBeInTheDocument();
  });
});
