import { useState } from 'react'
import SettingsForm from './components/SettingsForm'

export default function App() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSettings(data)
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <SettingsForm
        initialValues={settings}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </main>
  )
}
