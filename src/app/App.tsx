import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProviders } from '@/app/providers/AppProviders'
import { RootLayout } from '@/app/layouts/RootLayout'
import { CabinetPage } from '@/features/cabinet/ui/CabinetPage'
import { SettingsPage } from '@/features/settings/ui/SettingsPage'

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<CabinetPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
