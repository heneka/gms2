'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Users,
  Award,
  UserCheck
} from 'lucide-react'

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatsForRole = () => {
    switch (user.role) {
      case 'STUDENT':
        return [
          { name: 'Mezuniyet Durumu', value: 'Devam Ediyor', change: 'info', icon: Clock },
          { name: 'Bekleyen İşlemler', value: '2', change: 'warning', icon: AlertCircle },
          { name: 'Toplam Başvuru', value: '1', change: 'success', icon: CheckCircle },
        ]
      case 'ADVISOR':
        return [
          { name: 'Danışmanlık Sayısı', value: '8', change: 'info', icon: Users },
          { name: 'Öğrenci Başvuruları', value: '3', change: 'warning', icon: UserCheck },
          { name: 'Mezuniyet Onayı', value: '2', change: 'success', icon: CheckCircle },
        ]
      case 'SECRETARY':
        return [
          { name: `${user.department} Başvuruları`, value: '15', change: 'warning', icon: UserCheck },
          { name: 'İşlenen Başvuru', value: '45', change: 'success', icon: CheckCircle },
          { name: 'Bu Ay Mezun', value: '12', change: 'info', icon: Award },
        ]
      case 'DEAN':
        return [
          { name: `${user.faculty || 'Fakülte'} Öğrencileri`, value: '156', change: 'info', icon: Users },
          { name: 'Bekleyen Onay', value: '8', change: 'warning', icon: AlertCircle },
          { name: 'Bu Dönem Mezun', value: '23', change: 'success', icon: Award },
        ]
      case 'STUDENT_AFFAIRS':
        return [
          { name: 'Toplam Öğrenci', value: '1,250', change: 'info', icon: Users },
          { name: 'Aktif Başvuru', value: '45', change: 'warning', icon: UserCheck },
          { name: 'Bu Yıl Mezun', value: '320', change: 'success', icon: Award },
        ]
      default:
        return []
    }
  }

  const getActivitiesForRole = () => {
    switch (user.role) {
      case 'STUDENT':
        return [
          { action: 'Mezuniyet başvurusu güncellendi', date: '2 gün önce', type: 'update' },
          { action: 'Danışman atandı', date: '1 hafta önce', type: 'assignment' },
          { action: 'Hesap oluşturuldu', date: '2 hafta önce', type: 'create' },
        ]
      case 'ADVISOR':
        return [
          { action: 'Yeni öğrenci ataması: Zeynep Kaya', date: '1 gün önce', type: 'assignment' },
          { action: 'Mezuniyet başvurusu onaylandı: Mehmet Ali', date: '3 gün önce', type: 'approval' },
          { action: 'Öğrenci danışmanlığı başladı', date: '5 gün önce', type: 'complete' },
        ]
      case 'SECRETARY':
        return [
          { action: `${user.department} başvuruları işlendi`, date: '2 saat önce', type: 'process' },
          { action: 'Yeni dönem kayıtları başladı', date: '1 gün önce', type: 'info' },
          { action: 'Belge talebi onaylandı', date: '2 gün önce', type: 'approval' },
        ]
      case 'DEAN':
        return [
          { action: `${user.faculty || 'Fakülte'} aylık rapor hazırlandı`, date: '1 gün önce', type: 'report' },
          { action: '3 mezuniyet onayı imzalandı', date: '2 gün önce', type: 'approval' },
          { action: 'Yeni akademik yıl planlaması', date: '1 hafta önce', type: 'planning' },
        ]
      case 'STUDENT_AFFAIRS':
        return [
          { action: 'Üniversite mezuniyet raporu hazırlandı', date: '1 gün önce', type: 'report' },
          { action: '15 fakülte başvurusu onaylandı', date: '6 saat önce', type: 'approval' },
          { action: 'Diploma töreni planlaması başladı', date: '3 gün önce', type: 'planning' },
        ]
      default:
        return []
    }
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    let greeting = 'Merhaba'
    
    if (hour < 12) greeting = 'Günaydın'
    else if (hour < 18) greeting = 'İyi günler'
    else greeting = 'İyi akşamlar'
    
    const roleMessages = {
      STUDENT: 'Mezuniyet sürecinizi takip edebilirsiniz.',
      ADVISOR: 'Öğrenci danışmanlık işlemlerinizi yönetebilirsiniz.',
      SECRETARY: 'Öğrenci başvurularını işleyebilirsiniz.',
      DEAN: 'Fakülte işlemlerini yönetebilirsiniz.',
      STUDENT_AFFAIRS: 'Üniversite mezuniyet süreçlerini koordine edebilirsiniz.'
    }
    
    return `${greeting} ${user.name.split(' ')[0]}, ${roleMessages[user.role]}`
  }

  const stats = getStatsForRole()
  const activities = getActivitiesForRole()

  return (
    <DashboardLayout currentPage="dashboard">
      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          {getWelcomeMessage()}
        </h2>
        <p className="text-sm text-gray-600">
          Bugün {new Date().toLocaleDateString('tr-TR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Son Aktiviteler</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role-specific Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Hızlı Erişim</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.role === 'STUDENT' && (
              <>
                <a href="/dashboard/student-graduation" className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-red-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Mezuniyet Başvurusu</span>
                  </div>
                </a>
              </>
            )}
            {user.role === 'ADVISOR' && (
              <>
                <a href="/dashboard/student-applications" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center">
                    <UserCheck className="h-6 w-6 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Öğrenci Başvuruları</span>
                  </div>
                </a>
              </>
            )}
            {(user.role === 'SECRETARY' || user.role === 'DEAN') && (
              <>
                <a href="/dashboard/graduation-approvals" className="block p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <div className="flex items-center">
                    <Award className="h-6 w-6 text-yellow-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Mezuniyet Onayları</span>
                  </div>
                </a>
                <a href="/dashboard/student-applications" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center">
                    <UserCheck className="h-6 w-6 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Öğrenci Başvuruları</span>
                  </div>
                </a>
              </>
            )}
            {user.role === 'STUDENT_AFFAIRS' && (
              <>
                <a href="/dashboard/graduation-statistics" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Mezuniyet İstatistikleri</span>
                  </div>
                </a>
                <a href="/dashboard/student-applications" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center">
                    <UserCheck className="h-6 w-6 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Tüm Başvurular</span>
                  </div>
                </a>
                <a href="/dashboard/graduation-approvals" className="block p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <div className="flex items-center">
                    <Award className="h-6 w-6 text-yellow-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Final Onaylar</span>
                  </div>
                </a>
                <a href="/dashboard/diploma-certificate" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Diploma ve Sertifika</span>
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 