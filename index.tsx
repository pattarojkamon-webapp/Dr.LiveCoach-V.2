import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          fontFamily: 'sans-serif', 
          textAlign: 'center', 
          backgroundColor: '#fee2e2', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <h1 style={{ color: '#991b1b', fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p style={{ color: '#b91c1c', maxWidth: '600px', marginBottom: '2rem' }}>
            {this.state.error?.message}
          </p>
          <div style={{ fontSize: '0.875rem', color: '#7f1d1d', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '0.5rem', textAlign: 'left' }}>
            <strong>Debugging Tip:</strong><br/>
            If you are seeing "process is not defined", it means the environment variables are not being injected correctly by your build tool or hosting provider.
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '1.5rem', 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.375rem', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);