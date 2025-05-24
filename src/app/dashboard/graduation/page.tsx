'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Award, 
  FileText, 
  Eye, 
  EyeOff,
  CheckCircle
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  department: {
    name: string
    code: string
  }
  graduationApplication: {
    eligibility: string
    isVisible: boolean
    terminationFormSubmitted: boolean
  }
}

interface ApplicationPeriod {
  id: string
  name: string
  type: string
  status: string
  startDate: string | null
  endDate: string | null
}

export default function GraduationPage() {
  const [eligibleStudents, setEligibleStudents] = useState<Student[]>([])
  const [applicationPeriods, setApplicationPeriods] = useState<ApplicationPeriod[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [filter, setFilter] = useState({
    department: '',
    eligibility: 'all',
    visibility: 'all'
  })

  const fetchEligibleStudents = useCallback(async () => {
    try {
      setLoading(true)
      
      // Mock data instead of API call
      const mockStudents: Student[] = [
        {
          id: '1',
          studentId: '190201001',
          user: {
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            email: 'ahmet.yilmaz@std.iyte.edu.tr'
          },
          department: {
            name: 'Bilgisayar Mühendisliği',
            code: 'CENG'
          },
          graduationApplication: {
            eligibility: 'ELIGIBLE',
            isVisible: true,
            terminationFormSubmitted: true
          }
        },
        {
          id: '2',
          studentId: '190201002',
          user: {
            firstName: 'Zeynep',
            lastName: 'Kaya',
            email: 'zeynep.kaya@std.iyte.edu.tr'
          },
          department: {
            name: 'Elektrik Mühendisliği',
            code: 'EE'
          },
          graduationApplication: {
            eligibility: 'IRREGULAR_ELIGIBLE',
            isVisible: false,
            terminationFormSubmitted: false
          }
        }
      ]
      
      setEligibleStudents(mockStudents)
    } catch (error) {
      console.error('Error fetching eligible students:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchApplicationPeriods = useCallback(async () => {
    try {
      // This would be implemented in a separate endpoint
      setApplicationPeriods([
        {
          id: '1',
          name: 'Mezuniyet Töreni Başvuruları',
          type: 'ceremony',
          status: 'CLOSED',
          startDate: null,
          endDate: null
        },
        {
          id: '2',
          name: 'Okuldan İlişik Kesme Formu',
          type: 'termination',
          status: 'CLOSED',
          startDate: null,
          endDate: null
        }
      ])
    } catch (error) {
      console.error('Error fetching application periods:', error)
    }
  }, [])

  useEffect(() => {
    fetchEligibleStudents()
    fetchApplicationPeriods()
  }, [fetchEligibleStudents, fetchApplicationPeriods])

  const handleToggleVisibility = async (studentIds: string[], isVisible: boolean) => {
    try {
      // Mock response
      console.log(`Toggling visibility for students: ${studentIds}, visible: ${isVisible}`)
      
      // Simulate success
      fetchEligibleStudents()
      setSelectedStudents([])
      alert(`${studentIds.length} öğrencinin görünürlük durumu güncellendi`)
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const handleIssueCertificates = async () => {
    try {
      // Mock response
      console.log('Issuing certificates...')
      
      // Simulate success
      const processedCount = eligibleStudents.filter(s => s.graduationApplication.isVisible).length
      alert(`${processedCount} öğrenci için diploma ve sertifikalar düzenlendi`)
    } catch (error) {
      console.error('Error issuing certificates:', error)
    }
  }

  const handleManageApplicationPeriod = async (type: string, status: string) => {
    try {
      // Mock response
      console.log(`Managing application period: ${type}, status: ${status}`)
      
      // Update mock data
      setApplicationPeriods(prev => prev.map(period => 
        period.type === type 
          ? {
              ...period,
              status,
              startDate: status === 'OPEN' ? new Date().toISOString() : null,
              endDate: status === 'OPEN' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
            }
          : period
      ))
      
      if (status === 'OPEN') {
        alert(`${type === 'ceremony' ? 'Mezuniyet töreni başvuruları' : 'Okuldan ilişik kesme formu gönderimi'} açıldı ve öğrencilere bildirim gönderildi`)
      }
    } catch (error) {
      console.error('Error managing application period:', error)
    }
  }

  const getEligibilityBadge = (eligibility: string) => {
    const colors = {
      ELIGIBLE: 'bg-green-100 text-green-800',
      IRREGULAR_ELIGIBLE: 'bg-yellow-100 text-yellow-800',
      NOT_ELIGIBLE: 'bg-red-100 text-red-800'
    }
    
    const labels = {
      ELIGIBLE: 'Uygun',
      IRREGULAR_ELIGIBLE: 'Düzensiz Uygun',
      NOT_ELIGIBLE: 'Uygun Değil'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[eligibility as keyof typeof colors]}`}>
        {labels[eligibility as keyof typeof labels]}
      </span>
    )
  }

  return (
    <DashboardLayout currentPage="graduation">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-red-600" />
                Mezuniyet Yönetimi
              </h1>
              <p className="text-gray-600 mt-1">
                Mezuniyete uygun öğrencileri yönetin ve diploma süreçlerini takip edin
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleIssueCertificates}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                Diploma Düzenle
              </button>
            </div>
          </div>
        </div>

        {/* Application Periods Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-red-600" />
            Başvuru Dönemleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applicationPeriods.map((period) => (
              <div key={period.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{period.name}</h3>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                      period.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {period.status === 'OPEN' ? 'Açık' : 'Kapalı'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleManageApplicationPeriod(
                      period.type, 
                      period.status === 'OPEN' ? 'CLOSED' : 'OPEN'
                    )}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      period.status === 'OPEN' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {period.status === 'OPEN' ? 'Kapat' : 'Aç'}
                  </button>
                </div>
                {period.status === 'OPEN' && (
                  <div className="text-sm text-gray-600">
                    <p>Başlangıç: {period.startDate ? new Date(period.startDate).toLocaleDateString('tr-TR') : '-'}</p>
                    <p>Bitiş: {period.endDate ? new Date(period.endDate).toLocaleDateString('tr-TR') : '-'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölüm
              </label>
              <select
                value={filter.department}
                onChange={(e) => setFilter({ ...filter, department: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tüm Bölümler</option>
                <option value="computer-engineering">Bilgisayar Mühendisliği</option>
                <option value="electrical-engineering">Elektrik Mühendisliği</option>
                <option value="mechanical-engineering">Makine Mühendisliği</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uygunluk Durumu
              </label>
              <select
                value={filter.eligibility}
                onChange={(e) => setFilter({ ...filter, eligibility: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tümü</option>
                <option value="regular">Normal Uygun</option>
                <option value="irregular">Düzensiz Dahil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görünürlük
              </label>
              <select
                value={filter.visibility}
                onChange={(e) => setFilter({ ...filter, visibility: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tümü</option>
                <option value="visible">Görünür</option>
                <option value="hidden">Gizli</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                Mezuniyete Uygun Öğrenciler ({eligibleStudents.length})
              </h2>
              {selectedStudents.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleVisibility(selectedStudents, true)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Görünür Yap
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(selectedStudents, false)}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 flex items-center gap-1"
                  >
                    <EyeOff className="h-4 w-4" />
                    Gizle
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === eligibleStudents.length && eligibleStudents.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(eligibleStudents.map(s => s.id))
                        } else {
                          setSelectedStudents([])
                        }
                      }}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bölüm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uygunluk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Görünürlük
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İlişik Kesme Formu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Yükleniyor...
                    </td>
                  </tr>
                ) : eligibleStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Mezuniyete uygun öğrenci bulunamadı
                    </td>
                  </tr>
                ) : (
                  eligibleStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id])
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                            }
                          }}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.user.firstName} {student.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.studentId}</div>
                          <div className="text-sm text-gray-500">{student.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.department.name}</div>
                        <div className="text-sm text-gray-500">{student.department.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEligibilityBadge(student.graduationApplication.eligibility)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.graduationApplication.isVisible ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <Eye className="h-4 w-4" />
                            Görünür
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-500">
                            <EyeOff className="h-4 w-4" />
                            Gizli
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.graduationApplication.terminationFormSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Gönderildi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-500">
                            <FileText className="h-4 w-4" />
                            Bekleniyor
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 