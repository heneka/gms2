'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  CheckCircle, 
  Calendar,
  Send,
  Download,
  Search,
  Award,
  FileText,
  User,
  Mail,
  School
} from 'lucide-react'

interface Student {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  department: string
  faculty: string
  graduationDate: string
}

interface WetSignatureAppointment {
  status: 'PENDING' | 'REQUESTED' | 'SCHEDULED' | 'COMPLETED'
  requestedDate?: string
  scheduledDate?: string
  location?: string
  forwardedTo?: 'FACULTY' | 'RECTORATE'
}

interface DiplomaRequest {
  id: string
  student: Student
  requestDate: string
  status: 'REQUESTED' | 'PROCESSING' | 'READY' | 'DELIVERED'
  signatureType: 'WET' | 'ELECTRONIC'
  wetSignatureAppointment?: WetSignatureAppointment
  deliveryDate?: string
  notes?: string
}

interface CertificateRequest {
  id: string
  student: Student
  type: 'Onur Belgesi' | 'Yüksek Onur Belgesi' | 'Berat Belgesi'
  requestDate: string
  status: 'REQUESTED' | 'PROCESSING' | 'READY' | 'DELIVERED'
  signatureType: 'ELECTRONIC'
  deliveryDate?: string
  notes?: string
}

export default function DiplomaCertificatePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [diplomaRequests, setDiplomaRequests] = useState<DiplomaRequest[]>([])
  const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('diploma')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (isLoading) return
    
    if (user?.role !== 'STUDENT_AFFAIRS') {
      router.push('/dashboard')
      return
    }
    fetchRequests()
  }, [user, router, isLoading])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      
      // Mock data - Diploma istekleri
      const mockDiplomaRequests: DiplomaRequest[] = [
        {
          id: '1',
          student: {
            id: '1',
            studentId: '190301001',
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            email: 'ahmet.yilmaz@std.iyte.edu.tr',
            department: 'Bilgisayar Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            graduationDate: '2024-06-15'
          },
          requestDate: '2024-06-20T10:30:00Z',
          status: 'DELIVERED',
          signatureType: 'WET',
          wetSignatureAppointment: {
            status: 'COMPLETED',
            requestedDate: '2024-06-25T09:00:00Z',
            scheduledDate: '2024-07-01T14:00:00Z',
            location: 'Mühendislik Fakültesi Dekanlık',
            forwardedTo: 'FACULTY'
          },
          deliveryDate: '2024-07-05T16:00:00Z',
          notes: 'Diploma başarıyla teslim edildi.'
        },
        {
          id: '2',
          student: {
            id: '2',
            studentId: '190301003',
            firstName: 'Ayşe',
            lastName: 'Demir',
            email: 'ayse.demir@std.iyte.edu.tr',
            department: 'Elektronik ve Haberleşme Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            graduationDate: '2024-06-15'
          },
          requestDate: '2024-07-02T11:15:00Z',
          status: 'READY',
          signatureType: 'WET',
          wetSignatureAppointment: {
            status: 'COMPLETED',
            requestedDate: '2024-07-03T08:30:00Z',
            scheduledDate: '2024-07-08T11:00:00Z',
            location: 'Rektörlük İmza Ofisi',
            forwardedTo: 'RECTORATE'
          },
          notes: 'İmza tamamlandı, teslim edilmeyi bekliyor.'
        },
        {
          id: '3',
          student: {
            id: '6',
            studentId: '190301006',
            firstName: 'Mehmet',
            lastName: 'Özkan',
            email: 'mehmet.ozkan@std.iyte.edu.tr',
            department: 'Mimarlık',
            faculty: 'Mimarlık Fakültesi',
            graduationDate: '2024-06-15'
          },
          requestDate: '2024-07-04T08:45:00Z',
          status: 'PROCESSING',
          signatureType: 'WET',
          wetSignatureAppointment: {
            status: 'SCHEDULED',
            requestedDate: '2024-07-04T08:45:00Z',
            scheduledDate: '2024-07-10T10:30:00Z',
            location: 'Mimarlık Fakültesi Dekanlık',
            forwardedTo: 'FACULTY'
          }
        }
      ]

      const mockCertificateRequests: CertificateRequest[] = [
        {
          id: '1',
          student: {
            id: '3',
            studentId: '190301004',
            firstName: 'Fatma',
            lastName: 'Kaya',
            email: 'fatma.kaya@std.iyte.edu.tr',
            department: 'Matematik',
            faculty: 'Fen Fakültesi',
            graduationDate: '2024-06-15'
          },
          type: 'Yüksek Onur Belgesi',
          requestDate: '2024-06-18T14:20:00Z',
          status: 'DELIVERED',
          signatureType: 'ELECTRONIC',
          deliveryDate: '2024-06-25T10:00:00Z',
          notes: 'E-imza ile tamamlandı ve öğrenciye e-posta ile gönderildi.'
        },
        {
          id: '2',
          student: {
            id: '4',
            studentId: '190301005',
            firstName: 'Can',
            lastName: 'Arslan',
            email: 'can.arslan@std.iyte.edu.tr',
            department: 'Fizik',
            faculty: 'Fen Fakültesi',
            graduationDate: '2024-06-15'
          },
          type: 'Onur Belgesi',
          requestDate: '2024-07-01T09:30:00Z',
          status: 'PROCESSING',
          signatureType: 'ELECTRONIC',
          notes: 'E-imza için hazırlanıyor.'
        }
      ]

      setDiplomaRequests(mockDiplomaRequests)
      setCertificateRequests(mockCertificateRequests)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSignature = (requestId: string) => {
    setDiplomaRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: 'READY',
          wetSignatureAppointment: request.wetSignatureAppointment ? {
            ...request.wetSignatureAppointment,
            status: 'COMPLETED'
          } : undefined
        }
      }
      return request
    }))
  }

  const handleDeliverDiploma = (requestId: string) => {
    setDiplomaRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: 'DELIVERED',
          deliveryDate: new Date().toISOString()
        }
      }
      return request
    }))
  }

  const handleDeliverCertificate = (requestId: string) => {
    setCertificateRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: 'DELIVERED',
          deliveryDate: new Date().toISOString()
        }
      }
      return request
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800'
      case 'READY': return 'bg-green-100 text-green-800'
      case 'DELIVERED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800'
      case 'REQUESTED': return 'bg-blue-100 text-blue-800'
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filterRequests = <T extends DiplomaRequest | CertificateRequest>(requests: T[]): T[] => {
    return requests.filter(request => {
      const matchesSearch = searchTerm === '' || 
        request.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.student.studentId.includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-2xl text-gray-700 mb-2">🔄</div>
          <div className="text-gray-500">Diploma ve Sertifika Sayfası Yükleniyor...</div>
        </div>
      </div>
    )
  }

  if (user?.role !== 'STUDENT_AFFAIRS') {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-2xl text-red-700 mb-2">⚠️</div>
          <div className="text-red-500">Bu sayfaya erişim yetkiniz yok. Yönlendiriliyorsunuz...</div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout currentPage="diploma-certificate">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diploma ve Sertifika Yönetimi</h1>
            <p className="text-gray-600 mt-1">Diploma ve sertifika taleplerini yönetin</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('diploma')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'diploma'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline-block mr-2" />
            Diploma İstekleri
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'certificate'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="w-4 h-4 inline-block mr-2" />
            Sertifika İstekleri
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Öğrenci adı veya numarası ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="REQUESTED">Talep Edildi</option>
            <option value="PROCESSING">İşleniyor</option>
            <option value="READY">Hazır</option>
            <option value="DELIVERED">Teslim Edildi</option>
          </select>
        </div>

        {/* Content */}
        {activeTab === 'diploma' ? (
          <div className="space-y-4">
            {filterRequests(diplomaRequests).map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.student.firstName} {request.student.lastName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status === 'REQUESTED' ? 'Talep Edildi' :
                         request.status === 'PROCESSING' ? 'İşleniyor' :
                         request.status === 'READY' ? 'Hazır' : 'Teslim Edildi'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div><User className="w-4 h-4 inline mr-1" />Öğrenci No: {request.student.studentId}</div>
                      <div><Mail className="w-4 h-4 inline mr-1" />E-posta: {request.student.email}</div>
                      <div><School className="w-4 h-4 inline mr-1" />Bölüm: {request.student.department}</div>
                      <div><Calendar className="w-4 h-4 inline mr-1" />Mezuniyet: {new Date(request.student.graduationDate).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">İmza Türü</div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {request.signatureType === 'WET' ? 'Islak İmza' : 'E-İmza'}
                    </span>
                  </div>
                </div>

                {/* Wet Signature Appointment */}
                {request.signatureType === 'WET' && request.wetSignatureAppointment && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Islak İmza Randevu Durumu</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Randevu Durumu:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(request.wetSignatureAppointment.status)}`}>
                          {request.wetSignatureAppointment.status === 'PENDING' ? 'Beklemede' :
                           request.wetSignatureAppointment.status === 'REQUESTED' ? 'Talep Edildi' :
                           request.wetSignatureAppointment.status === 'SCHEDULED' ? 'Planlandı' : 'Tamamlandı'}
                        </span>
                      </div>
                      
                      {request.wetSignatureAppointment.scheduledDate && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Randevu Tarihi:</span>
                            <div className="font-medium">
                              {new Date(request.wetSignatureAppointment.scheduledDate).toLocaleString('tr-TR')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Konum:</span>
                            <div className="font-medium">{request.wetSignatureAppointment.location}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Yönlendirildi: <span className="font-medium">
                          {request.wetSignatureAppointment.forwardedTo === 'FACULTY' ? 'Fakülte' : 'Rektörlük'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  {request.status === 'PROCESSING' && request.wetSignatureAppointment?.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleCompleteSignature(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      İmza Tamamlandı
                    </button>
                  )}
                  {request.status === 'READY' && (
                    <button
                      onClick={() => handleDeliverDiploma(request.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Send className="w-4 h-4 inline mr-1" />
                      Teslim Et
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Detaylar
                  </button>
                </div>

                {request.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>Not:</strong> {request.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filterRequests(certificateRequests).map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.student.firstName} {request.student.lastName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status === 'REQUESTED' ? 'Talep Edildi' :
                         request.status === 'PROCESSING' ? 'İşleniyor' :
                         request.status === 'READY' ? 'Hazır' : 'Teslim Edildi'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div><User className="w-4 h-4 inline mr-1" />Öğrenci No: {request.student.studentId}</div>
                      <div><Mail className="w-4 h-4 inline mr-1" />E-posta: {request.student.email}</div>
                      <div><School className="w-4 h-4 inline mr-1" />Bölüm: {request.student.department}</div>
                      <div><Calendar className="w-4 h-4 inline mr-1" />Mezuniyet: {new Date(request.student.graduationDate).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      <Award className="w-4 h-4 mr-1" />
                      {request.type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">İmza Türü</div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      E-İmza
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  {request.status === 'PROCESSING' && (
                    <button
                      onClick={() => handleDeliverCertificate(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      E-İmza ile Tamamla
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    <Download className="w-4 h-4 inline mr-1" />
                    İndir
                  </button>
                </div>

                {request.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>Not:</strong> {request.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 