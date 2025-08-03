import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error,
      errorInfo
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could send error to logging service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Example: Send to error tracking service
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId
      };
      
      // Replace with your error tracking service
      // errorTrackingService.log(errorData);
      console.log('Error logged:', errorData);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert('جزئیات خطا کپی شد');
      })
      .catch(() => {
        alert('خطا در کپی کردن جزئیات');
      });
  };

  getErrorMessage = () => {
    const { error } = this.state;
    
    if (!error) return 'خطای ناشناخته';
    
    // Common error patterns
    if (error.message.includes('ChunkLoadError')) {
      return 'خطا در بارگذاری فایل‌ها. لطفاً صفحه را رفرش کنید.';
    }
    
    if (error.message.includes('Network Error')) {
      return 'خطا در اتصال به شبکه. اتصال اینترنت خود را بررسی کنید.';
    }
    
    if (error.message.includes('Permission denied')) {
      return 'دسترسی مورد نیاز وجود ندارد.';
    }
    
    return error.message || 'خطای غیرمنتظره‌ای رخ داده است';
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;
      
      // Use custom fallback if provided
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
          />
        );
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <AlertTriangle size={48} />
            </div>
            
            <div className="error-content">
              <h1 className="error-title">اوه! مشکلی پیش آمده</h1>
              <p className="error-message">{this.getErrorMessage()}</p>
              
              <div className="error-actions">
                <button 
                  className="error-btn primary"
                  onClick={this.handleRetry}
                >
                  <RefreshCw size={16} />
                  تلاش مجدد
                </button>
                
                <button 
                  className="error-btn secondary"
                  onClick={this.handleReload}
                >
                  <RefreshCw size={16} />
                  رفرش صفحه
                </button>
                
                <button 
                  className="error-btn outline"
                  onClick={this.handleGoHome}
                >
                  <Home size={16} />
                  صفحه اصلی
                </button>
              </div>
              
              {showDetails && this.state.error && (
                <details className="error-details">
                  <summary className="error-details-toggle">
                    <Bug size={16} />
                    جزئیات فنی
                  </summary>
                  <div className="error-details-content">
                    <div className="error-info">
                      <strong>شناسه خطا:</strong> {this.state.errorId}
                    </div>
                    <div className="error-info">
                      <strong>پیام خطا:</strong>
                      <pre>{this.state.error.message}</pre>
                    </div>
                    {this.state.error.stack && (
                      <div className="error-info">
                        <strong>Stack Trace:</strong>
                        <pre className="error-stack">{this.state.error.stack}</pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div className="error-info">
                        <strong>Component Stack:</strong>
                        <pre className="error-stack">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                    <button 
                      className="error-btn small"
                      onClick={this.copyErrorDetails}
                    >
                      کپی جزئیات
                    </button>
                  </div>
                </details>
              )}
              
              <div className="error-help">
                <p>اگر مشکل ادامه دارد، لطفاً با پشتیبانی تماس بگیرید:</p>
                <a 
                  href="mailto:support@pixie.com?subject=خطای برنامه&body=شناسه خطا: ${this.state.errorId}"
                  className="error-contact"
                >
                  <Mail size={16} />
                  تماس با پشتیبانی
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for functional components
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);
  
  const resetError = React.useCallback(() => {
    setError(null);
  }, []);
  
  const captureError = React.useCallback((error) => {
    setError(error);
    console.error('Error captured:', error);
  }, []);
  
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);
  
  return { captureError, resetError };
};

export default ErrorBoundary;