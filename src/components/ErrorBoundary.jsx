import React from 'react';
import NotFound from './NotFound';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // We'll reuse the NotFound component for crashes since it fits the vibe
      return <NotFound onGoHome={() => { this.setState({ hasError: false }); window.location.hash = '#home'; }} />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
