import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

// Mock the react-link-preview module (changed from @ashwamegh/react-link-preview)
jest.mock('react-link-preview', () => {
  return {
    __esModule: true,
    default: ({ url, customDomain }) => (
      <div data-testid="link-preview" data-url={url} data-domain={customDomain}>
        Mock LinkPreview
      </div>
    ),
  }
})

// Mock the CSS import
jest.mock('react-link-preview/dist/index.css', () => {})

describe('App component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('renders LinkPreview from react-link-preview package', () => {
    render(<App />)
    expect(screen.getByTestId('link-preview')).toBeInTheDocument()
  })

  it('passes the correct url to LinkPreview', () => {
    render(<App />)
    const linkPreview = screen.getByTestId('link-preview')
    expect(linkPreview).toHaveAttribute('data-url', 'https://reactjs.org')
  })

  it('passes the correct customDomain to LinkPreview', () => {
    render(<App />)
    const linkPreview = screen.getByTestId('link-preview')
    expect(linkPreview).toHaveAttribute(
      'data-domain',
      'https://lpdg-server.azurewebsites.net/parse/link'
    )
  })
})

describe('CustomComponent', () => {
  // CustomComponent is defined in App.js but not exported, test it indirectly
  // by checking the App component does not use it by default (App uses LinkPreview directly)
  it('App renders without CustomComponent by default', () => {
    render(<App />)
    // The default render shows LinkPreview directly, not the custom component
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.queryByText(/Domain:/)).not.toBeInTheDocument()
  })
})
