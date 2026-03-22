/**
 * Мок Telegram WebApp для браузера: события themeChanged/viewportChanged,
 * корректный MainButton.onClick/offClick, демо-переключение темы (см. Settings).
 */
declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebAppMock }
    __TMA_MOCK_API__?: { toggleColorScheme: () => void }
  }
}

type TelegramWebAppMock = {
  ready: () => void
  expand: () => void
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
  }
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string | undefined>
  version: string
  platform: string
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  MainButton: {
    text: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
    setText: (t: string) => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  onEvent: (event: string, cb: () => void) => void
  offEvent: (event: string, cb: () => void) => void
  sendData: (data: string) => void
  close: () => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  showAlert: (message: string, callback?: () => void) => void
}

const listeners = new Map<string, Set<() => void>>()

function emit(event: string) {
  listeners.get(event)?.forEach((cb) => cb())
}

function onEvent(event: string, cb: () => void) {
  if (!listeners.has(event)) listeners.set(event, new Set())
  listeners.get(event)!.add(cb)
}

function offEvent(event: string, cb: () => void) {
  listeners.get(event)?.delete(cb)
}

const themes = {
  dark: {
    bg_color: '#1c1c1e',
    text_color: '#ffffff',
    hint_color: '#8e8e93',
    link_color: '#0a84ff',
    button_color: '#30d158',
    button_text_color: '#000000',
    secondary_bg_color: '#2c2c2e',
  },
  light: {
    bg_color: '#f2f2f7',
    text_color: '#000000',
    hint_color: '#6d6d72',
    link_color: '#007aff',
    button_color: '#34c759',
    button_text_color: '#ffffff',
    secondary_bg_color: '#ffffff',
  },
} as const

function createMainButton(): TelegramWebAppMock['MainButton'] {
  let handler: (() => void) | null = null
  return {
    text: '',
    isVisible: false,
    isActive: true,
    show() {
      this.isVisible = true
    },
    hide() {
      this.isVisible = false
    },
    enable() {
      this.isActive = true
    },
    disable() {
      this.isActive = false
    },
    onClick(cb: () => void) {
      handler = cb
    },
    offClick(cb: () => void) {
      if (handler === cb) handler = null
    },
    setText(t: string) {
      this.text = t
    },
    showProgress() {},
    hideProgress() {},
  }
}

function createBackButton(): TelegramWebAppMock['BackButton'] {
  let handler: (() => void) | null = null
  return {
    isVisible: false,
    show() {
      this.isVisible = true
    },
    hide() {
      this.isVisible = false
    },
    onClick(cb: () => void) {
      handler = cb
    },
    offClick(cb: () => void) {
      if (handler === cb) handler = null
    },
  }
}

function createMockWebApp(): TelegramWebAppMock {
  let scheme: 'light' | 'dark' = 'dark'
  let themeParams: Record<string, string | undefined> = { ...themes.dark }

  const state: TelegramWebAppMock = {
    ready: () => {},
    expand: () => {},
    initData: '',
    initDataUnsafe: {
      user: {
        id: 1000001,
        first_name: 'Даниил',
        last_name: 'Демо',
        username: 'demo_user',
        language_code: 'ru',
      },
    },
    get colorScheme() {
      return scheme
    },
    get themeParams() {
      return themeParams
    },
    version: '8.0',
    platform: 'web',
    isExpanded: true,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 640,
    viewportStableHeight: typeof window !== 'undefined' ? window.innerHeight : 640,
    setHeaderColor: () => {},
    setBackgroundColor: () => {},
    MainButton: createMainButton(),
    BackButton: createBackButton(),
    HapticFeedback: {
      impactOccurred: () => {},
      notificationOccurred: () => {},
      selectionChanged: () => {},
    },
    onEvent,
    offEvent,
    sendData: (data) => {
      if (import.meta.env.DEV) {
        console.info('[TMA mock] sendData', data)
      }
    },
    close: () => {},
    openLink: (url) => {
      if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
    },
    showAlert: (message, cb) => {
      if (typeof window !== 'undefined') window.alert(message)
      cb?.()
    },
  }

  function toggleColorScheme() {
    scheme = scheme === 'dark' ? 'light' : 'dark'
    themeParams = { ...(scheme === 'dark' ? themes.dark : themes.light) }
    emit('themeChanged')
  }

  function syncViewport() {
    if (typeof window === 'undefined') return
    const h = window.innerHeight
    state.viewportHeight = h
    state.viewportStableHeight = h
    emit('viewportChanged')
  }

  if (typeof window !== 'undefined') {
    window.__TMA_MOCK_API__ = { toggleColorScheme }
    window.addEventListener('resize', syncViewport)
    syncViewport()
  }

  return state
}

if (typeof window !== 'undefined' && !window.Telegram?.WebApp) {
  window.Telegram = { WebApp: createMockWebApp() }
}

export {}
