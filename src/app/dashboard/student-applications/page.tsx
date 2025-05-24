'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  User
} from 'lucide-react'

interface StudentApplication {
  id: string
  student: {
    id: string
    studentId: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    department: string
    faculty: string
    gpa?: number
  }
  graduationApplication: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_REVIEW'
    submittedAt: string
    eligibility: 'ELIGIBLE' | 'IRREGULAR_ELIGIBLE' | 'NOT_ELIGIBLE'
    terminationFormSubmitted: boolean
    ceremonyApplicationSubmitted: boolean
    lastUpdated: string
  }
  advisor?: {
    comments?: string
    recommendationStatus?: 'APPROVED' | 'REJECTED' | 'PENDING'
    reviewedAt?: string
  }
}

export default function StudentApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    status: 'all',
    eligibility: 'all'
  })
  const [selectedApplication, setSelectedApplication] = useState<StudentApplication | null>(null)
  const [advisorComment, setAdvisorComment] = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      
      // Mock data - öğrenci başvuruları
      const mockApplications: StudentApplication[] = [
        {
          id: '1',
          student: {
            id: '1',
            studentId: '190201001',
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            email: 'ahmet.yilmaz@std.iyte.edu.tr',
            phone: '+90 532 123 4567',
            department: 'Bilgisayar Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            gpa: 3.45
          },
          graduationApplication: {
            status: 'PENDING',
            submittedAt: '2024-01-15T10:30:00Z',
            eligibility: 'ELIGIBLE',
            terminationFormSubmitted: true,
            ceremonyApplicationSubmitted: true,
            lastUpdated: '2024-01-16T14:20:00Z'
          },
          advisor: {
            recommendationStatus: 'PENDING'
          }
        },
        {
          id: '2',
          student: {
            id: '2',
            studentId: '190201002',
            firstName: 'Zeynep',
            lastName: 'Kaya',
            email: 'zeynep.kaya@std.iyte.edu.tr',
            phone: '+90 535 987 6543',
            department: 'Bilgisayar Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            gpa: 3.78
          },
          graduationApplication: {
            status: 'IN_REVIEW',
            submittedAt: '2024-01-10T09:15:00Z',
            eligibility: 'ELIGIBLE',
            terminationFormSubmitted: true,
            ceremonyApplicationSubmitted: false,
            lastUpdated: '2024-01-14T16:45:00Z'
          },
          advisor: {
            comments: 'Tüm gereksinimler tamamlanmış. Mezuniyete uygun.',
            recommendationStatus: 'APPROVED',
            reviewedAt: '2024-01-14T16:45:00Z'
          }
        },
        {
          id: '3',
          student: {
            id: '3',
            studentId: '190201003',
            firstName: 'Emre',
            lastName: 'Öztürk',
            email: 'emre.ozturk@std.iyte.edu.tr',
            phone: '+90 533 456 7890',
            department: 'Bilgisayar Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            gpa: 2.95
          },
          graduationApplication: {
            status: 'PENDING',
            submittedAt: '2024-01-20T11:00:00Z',
            eligibility: 'IRREGULAR_ELIGIBLE',
            terminationFormSubmitted: false,
            ceremonyApplicationSubmitted: false,
            lastUpdated: '2024-01-20T11:00:00Z'
          },
          advisor: {
            recommendationStatus: 'PENDING'
          }
        },
        {
          id: '4',
          student: {
            id: '4',
            studentId: '190201004',
            firstName: 'Selin',
            lastName: 'Demir',
            email: 'selin.demir@std.iyte.edu.tr',
            phone: '+90 534 567 8901',
            department: 'Bilgisayar Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            gpa: 3.62
          },
          graduationApplication: {
            status: 'APPROVED',
            submittedAt: '2024-01-08T14:30:00Z',
            eligibility: 'ELIGIBLE',
            terminationFormSubmitted: true,
            ceremonyApplicationSubmitted: true,
            lastUpdated: '2024-01-12T09:20:00Z'
          },
          advisor: {
            comments: 'Başarılı öğrenci, mezuniyete hazır.',
            recommendationStatus: 'APPROVED',
            reviewedAt: '2024-01-10T11:15:00Z'
          }
        },
        {
          id: '5',
          student: {
            id: '5',
            studentId: '190201005',
            firstName: 'Burak',
            lastName: 'Yıldırım',
            email: 'burak.yildirim@std.iyte.edu.tr',
            phone: '+90 535 678 9012',
            department: 'Bilgisayar Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            gpa: 3.25
          },
          graduationApplication: {
            status: 'PENDING',
            submittedAt: '2024-01-18T16:45:00Z',
            eligibility: 'ELIGIBLE',
            terminationFormSubmitted: true,
            ceremonyApplicationSubmitted: false,
            lastUpdated: '2024-01-19T10:30:00Z'
          },
          advisor: {
            recommendationStatus: 'PENDING'
          }
        }
      ]
      
      // Role-based filtering
      let filteredByRole = mockApplications
      
      if (user?.role === 'ADVISOR') {
        // Danışmanlar sadece kendi öğrencilerini görür
        filteredByRole = mockApplications.filter(app => 
          app.student.department === user.department
        )
      } else if (user?.role === 'SECRETARY') {
        // Sekreterler sadece kendi bölümlerinin öğrencilerini görür
        filteredByRole = mockApplications.filter(app => 
          app.student.department === user.department
        )
      } else if (user?.role === 'DEAN') {
        // Dekanlar sadece kendi fakültelerinin öğrencilerini görür
        filteredByRole = mockApplications.filter(app => 
          app.student.faculty === user.faculty
        )
      }
      // STUDENT_AFFAIRS tüm öğrencileri görür (filtreleme yok)
      
      setApplications(filteredByRole)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      IN_REVIEW: 'bg-blue-100 text-blue-800'
    }
    
    const labels = {
      PENDING: 'Beklemede',
      APPROVED: 'Onaylandı',
      REJECTED: 'Reddedildi',
      IN_REVIEW: 'İncelemede'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
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

  const handleReviewApplication = (application: StudentApplication) => {
    setSelectedApplication(application)
    setAdvisorComment(application.advisor?.comments || '')
    setShowModal(true)
  }

  const handleSaveReview = async (recommendationStatus: 'APPROVED' | 'REJECTED') => {
    if (!selectedApplication) return

    try {
      // Mock API call
      console.log('Saving review:', {
        applicationId: selectedApplication.id,
        recommendationStatus,
        comments: advisorComment
      })

      // Update application in state
      setApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? {
              ...app,
              advisor: {
                ...app.advisor,
                comments: advisorComment,
                recommendationStatus,
                reviewedAt: new Date().toISOString()
              },
              graduationApplication: {
                ...app.graduationApplication,
                status: recommendationStatus === 'APPROVED' ? 'APPROVED' : 'REJECTED',
                lastUpdated: new Date().toISOString()
              }
            }
          : app
      ))

      setShowModal(false)
      setSelectedApplication(null)
      setAdvisorComment('')
      
      alert(`Başvuru ${recommendationStatus === 'APPROVED' ? 'onaylandı' : 'reddedildi'}`)
    } catch (error) {
      console.error('Error saving review:', error)
      alert('Değerlendirme kaydedilirken hata oluştu')
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter.status !== 'all' && app.graduationApplication.status !== filter.status) return false
    if (filter.eligibility !== 'all' && app.graduationApplication.eligibility !== filter.eligibility) return false
    return true
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.graduationApplication.status === 'PENDING').length,
    approved: applications.filter(app => app.graduationApplication.status === 'APPROVED').length,
    rejected: applications.filter(app => app.graduationApplication.status === 'REJECTED').length
  }

  return (
    <DashboardLayout currentPage="student-applications">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-red-600" />
                Öğrenci Başvuruları
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'ADVISOR' ? 'Danışmanlığınızdaki' : 'Bölümünüzdeki'} öğrencilerin mezuniyet başvurularını inceleyin
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Toplam Başvuru</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Beklemede</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Onaylanan</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Reddedilen</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başvuru Durumu
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tümü</option>
                <option value="PENDING">Beklemede</option>
                <option value="IN_REVIEW">İncelemede</option>
                <option value="APPROVED">Onaylanan</option>
                <option value="REJECTED">Reddedilen</option>
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
                <option value="ELIGIBLE">Uygun</option>
                <option value="IRREGULAR_ELIGIBLE">Düzensiz Uygun</option>
                <option value="NOT_ELIGIBLE">Uygun Değil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Başvuru Listesi ({filteredApplications.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uygunluk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Belgeler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başvuru Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
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
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Başvuru bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-red-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.student.firstName} {application.student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.student.studentId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.student.email}
                            </div>
                            {application.student.gpa && (
                              <div className="text-sm text-gray-500">
                                GPA: {application.student.gpa}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEligibilityBadge(application.graduationApplication.eligibility)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.graduationApplication.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {application.graduationApplication.terminationFormSubmitted ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              İlişik Kesme
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              <Clock className="h-3 w-3 mr-1" />
                              İlişik Kesme
                            </span>
                          )}
                          {application.graduationApplication.ceremonyApplicationSubmitted ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Tören
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Tören
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.graduationApplication.submittedAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleReviewApplication(application)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          İncele
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Başvuru Değerlendirmesi
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Öğrenci Bilgileri</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>Ad Soyad:</strong> {selectedApplication.student.firstName} {selectedApplication.student.lastName}</p>
                    <p><strong>Öğrenci No:</strong> {selectedApplication.student.studentId}</p>
                    <p><strong>E-posta:</strong> {selectedApplication.student.email}</p>
                    {selectedApplication.student.gpa && (
                      <p><strong>GPA:</strong> {selectedApplication.student.gpa}</p>
                    )}
                    <p><strong>Uygunluk:</strong> {getEligibilityBadge(selectedApplication.graduationApplication.eligibility)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danışman Görüşü
                  </label>
                  <textarea
                    value={advisorComment}
                    onChange={(e) => setAdvisorComment(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Öğrencinin mezuniyet başvurusu hakkındaki görüşünüzü yazın..."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={() => handleSaveReview('REJECTED')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reddet
              </button>
              <button
                onClick={() => handleSaveReview('APPROVED')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 