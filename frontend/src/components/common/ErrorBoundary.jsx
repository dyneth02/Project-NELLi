import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-status-error/10 border-2 border-status-error rounded-xl">
          <h2 className="text-xl font-bold text-status-error mb-4">Something went wrong</h2>
          <pre className="text-sm bg-black/10 p-4 rounded overflow-auto max-h-60">
            {this.state.error?.toString()}
          </pre>
          {this.state.errorInfo?.componentStack && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-[var(--text-secondary)]">Component Stack</summary>
              <pre className="text-xs bg-black/10 p-4 rounded overflow-auto max-h-60 mt-2">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
