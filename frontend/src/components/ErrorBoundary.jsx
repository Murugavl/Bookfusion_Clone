import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // You can log to error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          background: '#0D0D0D',
          color: '#FFFFFF'
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
            padding: '2rem',
            background: '#1a1a1a',
            borderRadius: '0.75rem',
            border: '1px solid #2a2a2a'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#ef4444' }}>
              ⚠️ Something went wrong
            </h2>
            <p style={{ color: '#a0a0a0', marginBottom: '1.5rem' }}>
              An unexpected error occurred. Please try reloading the page.
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: '#2a2a2a',
                borderRadius: '0.5rem',
                textAlign: 'left',
                fontSize: '0.875rem'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  overflow: 'auto',
                  color: '#ef4444',
                  fontSize: '0.75rem'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#2a2a2a',
                  color: 'white',
                  border: '1px solid #3a3a3a',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;



