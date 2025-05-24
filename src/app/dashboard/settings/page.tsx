'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Calendar, 
  Users,
  FileText,
  Bell,
  Database,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react'

interface SystemSettings {
  graduationPeriods: {
    applicationStart: string
    applicationEnd: string
    ceremonyDate: string
    diplomaDeliveryStart: string
  }
  requirements: {
    minimumGPA: number
    maxDaysBeforeGraduation: number
    requiredDocuments: string[]
  }
  notifications: {
    emailEnabled: boolean
    smsEnabled: boolean
    autoReminders: boolean
  }
  system: {
    maintenanceMode: boolean
    backupFrequency: string
    dataRetentionDays: number
  }
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('graduation')

  useEffect(() => {
    // Authentication yüklenene kadar bekle
    if (isLoading) return
    
    if (user?.role !== 'STUDENT_AFFAIRS') {
      router.push('/dashboard')
      return
    }
    fetchSettings()
  }, [user, router, isLoading])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      
      // Mock data - sistem ayarları
      const mockSettings: SystemSettings = {
        graduationPeriods: {
          applicationStart: '2024-01-15',
          applicationEnd: '2024-02-15',
          ceremonyDate: '2024-06-15',
          diplomaDeliveryStart: '2024-06-20'
        },
        requirements: {
          minimumGPA: 2.0,
          maxDaysBeforeGraduation: 90,
          requiredDocuments: [
            'Okuldan İlişik Kesme Formu',
            'Transkript',
            'Diploma Fotoğrafı'
          ]
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          autoReminders: true
        },
        system: {
          maintenanceMode: false,
          backupFrequency: 'daily',
          dataRetentionDays: 2555 // 7 yıl
        }
      }
      
      setSettings(mockSettings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      
      // Mock API call
      console.log('Saving settings:', settings)
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert('Ayarlar başarıyla kaydedildi')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Ayarlar kaydedilirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleBackup = async () => {
    try {
      console.log('Creating backup...')
      alert('Yedekleme başlatıldı. Tamamlandığında e-posta ile bilgilendirileceksiniz.')
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('Yedekleme sırasında hata oluştu')
    }
  }

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      console.log('Restoring from file:', file.name)
      alert('Geri yükleme işlemi başlatıldı. Bu işlem birkaç dakika sürebilir.')
    } catch (error) {
      console.error('Error restoring backup:', error)
      alert('Geri yükleme sırasında hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center text-red-600">
        Ayarlar yüklenemedi
      </div>
    )
  }

  const tabs = [
    { id: 'graduation', name: 'Mezuniyet Ayarları', icon: Calendar },
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'system', name: 'Sistem', icon: Database }
  ]

  return (
    <DashboardLayout currentPage="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <SettingsIcon className="h-6 w-6 text-red-600" />
                Sistem Ayarları
              </h1>
              <p className="text-gray-600 mt-1">
                Mezuniyet yönetim sistemi ayarlarını yapılandırın
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Graduation Settings Tab */}
            {activeTab === 'graduation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mezuniyet Dönemleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başvuru Başlangıç Tarihi
                      </label>
                      <input
                        type="date"
                        value={settings.graduationPeriods.applicationStart}
                        onChange={(e) => setSettings({
                          ...settings,
                          graduationPeriods: {
                            ...settings.graduationPeriods,
                            applicationStart: e.target.value
                          }
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başvuru Bitiş Tarihi
                      </label>
                      <input
                        type="date"
                        value={settings.graduationPeriods.applicationEnd}
                        onChange={(e) => setSettings({
                          ...settings,
                          graduationPeriods: {
                            ...settings.graduationPeriods,
                            applicationEnd: e.target.value
                          }
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mezuniyet Töreni Tarihi
                      </label>
                      <input
                        type="date"
                        value={settings.graduationPeriods.ceremonyDate}
                        onChange={(e) => setSettings({
                          ...settings,
                          graduationPeriods: {
                            ...settings.graduationPeriods,
                            ceremonyDate: e.target.value
                          }
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diploma Teslim Başlangıç
                      </label>
                      <input
                        type="date"
                        value={settings.graduationPeriods.diplomaDeliveryStart}
                        onChange={(e) => setSettings({
                          ...settings,
                          graduationPeriods: {
                            ...settings.graduationPeriods,
                            diplomaDeliveryStart: e.target.value
                          }
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mezuniyet Gereksinimleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum GPA
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="4"
                        value={settings.requirements.minimumGPA}
                        onChange={(e) => setSettings({
                          ...settings,
                          requirements: {
                            ...settings.requirements,
                            minimumGPA: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mezuniyetten Önceki Maksimum Gün
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.requirements.maxDaysBeforeGraduation}
                        onChange={(e) => setSettings({
                          ...settings,
                          requirements: {
                            ...settings.requirements,
                            maxDaysBeforeGraduation: parseInt(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Gerekli Belgeler</h3>
                  <div className="space-y-2">
                    {settings.requirements.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{doc}</span>
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirim Ayarları</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h4>
                        <p className="text-sm text-gray-500">Öğrencilere e-posta ile bildirim gönder</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              emailEnabled: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">SMS Bildirimleri</h4>
                        <p className="text-sm text-gray-500">Öğrencilere SMS ile bildirim gönder</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              smsEnabled: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Otomatik Hatırlatmalar</h4>
                        <p className="text-sm text-gray-500">Tarih yaklaştığında otomatik hatırlatma gönder</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.autoReminders}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              autoReminders: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Yönetimi</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          Bakım Modu
                        </h4>
                        <p className="text-sm text-gray-500">Sistem bakım modunda ise sadece yöneticiler erişebilir</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.maintenanceMode}
                          onChange={(e) => setSettings({
                            ...settings,
                            system: {
                              ...settings.system,
                              maintenanceMode: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yedekleme Sıklığı
                        </label>
                        <select
                          value={settings.system.backupFrequency}
                          onChange={(e) => setSettings({
                            ...settings,
                            system: {
                              ...settings.system,
                              backupFrequency: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="daily">Günlük</option>
                          <option value="weekly">Haftalık</option>
                          <option value="monthly">Aylık</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Veri Saklama Süresi (Gün)
                        </label>
                        <input
                          type="number"
                          min="365"
                          value={settings.system.dataRetentionDays}
                          onChange={(e) => setSettings({
                            ...settings,
                            system: {
                              ...settings.system,
                              dataRetentionDays: parseInt(e.target.value)
                            }
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Yedekleme ve Geri Yükleme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Sistem Yedeği Oluştur</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Tüm sistem verilerinin yedeğini oluşturun
                      </p>
                      <button
                        onClick={handleBackup}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Yedek Oluştur
                      </button>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="text-sm font-medium text-green-900 mb-2">Yedekten Geri Yükle</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Önceki bir yedekten sistemi geri yükleyin
                      </p>
                      <input
                        type="file"
                        id="backup-restore"
                        accept=".backup,.sql,.zip"
                        onChange={handleRestore}
                        className="hidden"
                      />
                      <label
                        htmlFor="backup-restore"
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Yedek Seç ve Geri Yükle
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 