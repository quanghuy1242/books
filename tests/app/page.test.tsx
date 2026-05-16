import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders hello world', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: 'hello world' })).toBeInTheDocument();
  });
});
