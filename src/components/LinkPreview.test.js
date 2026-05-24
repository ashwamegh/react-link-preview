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

  it('renders an img element when preview.img is provided', async () => {
    render(<LinkPreview url="https://example.com" />);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.png');
      expect(img).toHaveAttribute('alt', 'This is an example domain.');
    });
  });

  it('does not render an img element when preview.img is absent', async () => {
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          domain: 'example.com',
          title: 'Example Domain',
          description: 'This is an example domain.',
          // no img field
        }),
      })
    );

    render(<LinkPreview url="https://example.com" />);

    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('calls onClick handler when preview section is clicked', async () => {
    const handleClick = jest.fn();
    render(<LinkPreview url="https://example.com" onClick={handleClick} />);

    await waitFor(() => {
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    screen.getByText('example.com').closest('div[class]').click();
    expect(handleClick).toHaveBeenCalled();
  });

  it('uses the provided customDomain when fetching data', async () => {
    const customDomain = 'https://my-custom-server.example.com/parse/link';
    render(<LinkPreview url="https://example.com" customDomain={customDomain} />);

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(
        customDomain,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ url: 'https://example.com' }),
        })
      );
    });
  });

  it('sends POST request with the correct URL in the body', async () => {
    render(<LinkPreview url="https://example.com" />);

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ url: 'https://example.com' }),
          headers: expect.objectContaining({
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  it('renders null and logs error when no url is provided', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<LinkPreview url="" />);
    expect(container.firstChild).toBeNull();
    expect(consoleError).toHaveBeenCalledWith(
      'LinkPreview Error: You need to provide url in props to render the component'
    );
    consoleError.mockRestore();
  });

  it('shows loading skeleton placeholder text while loading', () => {
    render(<LinkPreview url="https://example.com" />);
    expect(screen.getByText('This is some description')).toBeInTheDocument();
  });
});
