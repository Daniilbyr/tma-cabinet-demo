/**
 * В браузере без Telegram `window.Telegram` отсутствует, а @twa-dev/sdk
 * читает WebApp напрямую — подставляем минимальный мок для локальной разработки и демо.
 */
declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebAppMock }
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
  onEvent: (event: string, cb: () => void) => void
  offEvent: (event: string, cb: () => void) => void
  sendData: (data: string) => void
  close: () => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  showAlert: (message: string, callback?: () => void) => void
}

const noop = () => {}

function createMockWebApp(): TelegramWebAppMock {
  const dark = {
    bg_color: '#1c1c1e',
    text_color: '#ffffff',
    hint_color: '#8e8e93',
    link_color: '#0a84ff',
    button_color: '#30d158',
    button_text_color: '#000000',
    secondary_bg_color: '#2c2c2e',
  }

  return {
    ready: noop,
    expand: noop,
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
    colorScheme: 'dark',
    themeParams: dark,
    version: '8.0',
    platform: 'web',
    isExpanded: true,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 640,
    viewportStableHeight: typeof window !== 'undefined' ? window.innerHeight : 640,
    setHeaderColor: noop,
    setBackgroundColor: noop,
    MainButton: {
      text: '',
      isVisible: false,
      isActive: true,
      show: noop,
      hide: noop,
      enable: noop,
      disable: noop,
      onClick: noop,
      offClick: noop,
      setText: noop,
      showProgress: noop,
      hideProgress: noop,
    },
    BackButton: {
      isVisible: false,
      show: noop,
      hide: noop,
      onClick: noop,
      offClick: noop,
    },
    onEvent: noop,
    offEvent: noop,
    sendData: noop,
    close: noop,
    openLink: (url) => {
      if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
    },
    showAlert: (message, cb) => {
      if (typeof window !== 'undefined') window.alert(message)
      cb?.()
    },
  }
}

if (typeof window !== 'undefined' && !window.Telegram?.WebApp) {
  window.Telegram = { WebApp: createMockWebApp() }
}

export {}
