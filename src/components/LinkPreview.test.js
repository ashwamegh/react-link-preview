import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkPreview from './LinkPreview';

// Mock fetch
beforeEach(() => {
  window.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        domain: 'example.com',
        title: 'Example Domain',
        description: 'This is an example domain.',
        img: 'https://example.com/image.png'
      }),
    })
  );
});

describe('LinkPreview Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when an invalid URL is provided', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<LinkPreview url="invalid-url" />);
    expect(container.firstChild).toBeNull();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('shows loading skeleton initially', () => {
    render(<LinkPreview url="https://example.com" />);
    expect(screen.getByText('facebook.com')).toBeInTheDocument();
    expect(screen.getByText('Shashank Shekhar')).toBeInTheDocument();
  });

  it('renders the fetched link data correctly', async () => {
    render(<LinkPreview url="https://example.com" />);

    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
      expect(screen.getByText('Example Domain')).toBeInTheDocument();
      expect(screen.getByText('This is an example domain.')).toBeInTheDocument();
    });
  });

  it('renders custom render prop if provided', async () => {
    const CustomRender = ({ loading, preview }) => (
      <div data-testid="custom-render">
        {loading ? 'Loading custom...' : preview.title}
      </div>
    );

    render(<LinkPreview url="https://example.com" render={CustomRender} />);

    expect(screen.getByTestId('custom-render')).toHaveTextContent('Loading custom...');

    await waitFor(() => {
      expect(screen.getByTestId('custom-render')).toHaveTextContent('Example Domain');
    });
  });
});
