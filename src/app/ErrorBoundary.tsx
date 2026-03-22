import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            maxWidth: 420,
            margin: '0 auto',
          }}
        >
          <h1 style={{ fontSize: 18, margin: '0 0 8px' }}>Что-то пошло не так</h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
            Обновите мини-приложение или откройте его снова из чата.
          </p>
          {import.meta.env.DEV ? (
            <pre
              style={{
                marginTop: 16,
                fontSize: 12,
                overflow: 'auto',
                padding: 12,
                background: 'rgba(255,0,0,0.08)',
                borderRadius: 8,
              }}
            >
              {this.state.error.message}
            </pre>
          ) : null}
        </div>
      )
    }
    return this.props.children
  }
}
