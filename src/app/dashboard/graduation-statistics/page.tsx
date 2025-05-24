'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  GraduationCap,
  Award,
  FileText,
  Download,
  Filter,
  Building2,
  School
} from 'lucide-react'

interface FacultyStats {
  name: string
  code: string
  totalStudents: number
  graduates: number
  pending: number
  completed: number
  departments: DepartmentStats[]
}

interface DepartmentStats {
  name: string
  code: string
  faculty: string
  totalStudents: number
  graduates: number
  pending: number
  completed: number
}

interface MonthlyStats {
  month: string
  graduates: number
  applications: number
}

export default function GraduationStatisticsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [facultyStats, setFacultyStats] = useState<FacultyStats[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFaculty, setSelectedFaculty] = useState('all')
  const [timeRange, setTimeRange] = useState('current_year')

  useEffect(() => {
    // Authentication yüklenene kadar bekle
    if (isLoading) return
    
    if (user?.role !== 'STUDENT_AFFAIRS') {
      router.push('/dashboard')
      return
    }
    fetchStatistics()
  }, [user, router, selectedFaculty, timeRange, isLoading])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      
      // Mock data - İstatistikler
      const mockFacultyStats: FacultyStats[] = [
        {
          name: 'Mühendislik Fakültesi',
          code: 'ENG',
          totalStudents: 850,
          graduates: 120,
          pending: 45,
          completed: 75,
          departments: [
            {
              name: 'Bilgisayar Mühendisliği',
              code: 'CENG',
              faculty: 'Mühendislik Fakültesi',
              totalStudents: 280,
              graduates: 42,
              pending: 15,
              completed: 27
            },
            {
              name: 'Elektronik ve Haberleşme Mühendisliği',
              code: 'EE',
              faculty: 'Mühendislik Fakültesi',
              totalStudents: 250,
              graduates: 38,
              pending: 12,
              completed: 26
            },
            {
              name: 'Makine Mühendisliği',
              code: 'ME',
              faculty: 'Mühendislik Fakültesi',
              totalStudents: 200,
              graduates: 25,
              pending: 10,
              completed: 15
            },
            {
              name: 'Kimya Mühendisliği',
              code: 'CHE',
              faculty: 'Mühendislik Fakültesi',
              totalStudents: 120,
              graduates: 15,
              pending: 8,
              completed: 7
            }
          ]
        },
        {
          name: 'Fen Fakültesi',
          code: 'SCI',
          totalStudents: 420,
          graduates: 95,
          pending: 35,
          completed: 60,
          departments: [
            {
              name: 'Matematik',
              code: 'MATH',
              faculty: 'Fen Fakültesi',
              totalStudents: 150,
              graduates: 30,
              pending: 12,
              completed: 18
            },
            {
              name: 'Fizik',
              code: 'PHYS',
              faculty: 'Fen Fakültesi',
              totalStudents: 140,
              graduates: 30,
              pending: 10,
              completed: 20
            },
            {
              name: 'Kimya',
              code: 'CHEM',
              faculty: 'Fen Fakültesi',
              totalStudents: 130,
              graduates: 35,
              pending: 13,
              completed: 22
            }
          ]
        },
        {
          name: 'Mimarlık Fakültesi',
          code: 'ARCH',
          totalStudents: 280,
          graduates: 85,
          pending: 20,
          completed: 65,
          departments: [
            {
              name: 'Mimarlık',
              code: 'ARCH',
              faculty: 'Mimarlık Fakültesi',
              totalStudents: 180,
              graduates: 50,
              pending: 12,
              completed: 38
            },
            {
              name: 'Şehir ve Bölge Planlama',
              code: 'CRP',
              faculty: 'Mimarlık Fakültesi',
              totalStudents: 100,
              graduates: 35,
              pending: 8,
              completed: 27
            }
          ]
        }
      ]

      const mockMonthlyStats: MonthlyStats[] = [
        { month: 'Ocak', graduates: 45, applications: 120 },
        { month: 'Şubat', graduates: 38, applications: 95 },
        { month: 'Mart', graduates: 52, applications: 110 },
        { month: 'Nisan', graduates: 41, applications: 85 },
        { month: 'Mayıs', graduates: 67, applications: 150 },
        { month: 'Haziran', graduates: 125, applications: 200 },
        { month: 'Temmuz', graduates: 15, applications: 25 },
        { month: 'Ağustos', graduates: 8, applications: 18 },
        { month: 'Eylül', graduates: 22, applications: 45 },
        { month: 'Ekim', graduates: 18, applications: 35 },
        { month: 'Kasım', graduates: 12, applications: 28 },
        { month: 'Aralık', graduates: 9, applications: 20 }
      ]
      
      setFacultyStats(mockFacultyStats)
      setMonthlyStats(mockMonthlyStats)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalStats = () => {
    const totals = facultyStats.reduce((acc, faculty) => ({
      totalStudents: acc.totalStudents + faculty.totalStudents,
      graduates: acc.graduates + faculty.graduates,
      pending: acc.pending + faculty.pending,
      completed: acc.completed + faculty.completed
    }), { totalStudents: 0, graduates: 0, pending: 0, completed: 0 })

    return totals
  }

  const filteredFacultyStats = selectedFaculty === 'all' 
    ? facultyStats 
    : facultyStats.filter(f => f.code === selectedFaculty)

  const totalStats = getTotalStats()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <DashboardLayout currentPage="graduation-statistics">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-red-600" />
                Mezuniyet İstatistikleri
              </h1>
              <p className="text-gray-600 mt-1">
                Üniversite geneli mezuniyet verilerini inceleyin
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Rapor İndir
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-red-600" />
            Filtreler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fakülte
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tüm Fakülteler</option>
                {facultyStats.map((faculty) => (
                  <option key={faculty.code} value={faculty.code}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zaman Aralığı
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="current_year">Bu Yıl</option>
                <option value="last_year">Geçen Yıl</option>
                <option value="last_3_years">Son 3 Yıl</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Toplam Öğrenci</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Mezun Olan</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.graduates}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Bekleyen Başvuru</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-red-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Tamamlanan</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Statistics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-red-600" />
              Fakülte Bazında İstatistikler
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fakülte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Öğrenci
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mezun
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bekleyen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamamlanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başarı Oranı
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacultyStats.map((faculty) => (
                  <tr key={faculty.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <School className="h-5 w-5 text-red-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {faculty.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {faculty.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {faculty.totalStudents.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {faculty.graduates}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {faculty.pending}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {faculty.completed}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {Math.round((faculty.completed / faculty.graduates) * 100)}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.round((faculty.completed / faculty.graduates) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            Aylık Mezuniyet Trendi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">Mezun Sayıları</h3>
              <div className="space-y-2">
                {monthlyStats.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <span className="text-sm font-medium text-gray-900">{month.graduates}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">Başvuru Sayıları</h3>
              <div className="space-y-2">
                {monthlyStats.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <span className="text-sm font-medium text-gray-900">{month.applications}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 