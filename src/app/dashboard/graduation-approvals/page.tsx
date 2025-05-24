'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Award, 
  CheckCircle, 
  AlertCircle,
  Eye,
  FileText,
  Download,
  User,
  Shield
} from 'lucide-react'

interface GraduationApproval {
  id: string
  student: {
    id: string
    studentId: string
    firstName: string
    lastName: string
    email: string
    department: string
    faculty: string
    gpa: number
    graduationDate?: string
  }
  application: {
    submittedAt: string
    advisorApproval: {
      status: 'APPROVED' | 'REJECTED' | 'PENDING'
      comments?: string
      approvedAt?: string
      advisorName: string
    }
    documents: {
      terminationForm: boolean
      transcripts: boolean
      diplomaPhoto: boolean
    }
    ceremonyRegistration: boolean
  }
  approvals: {
    secretary?: {
      status: 'APPROVED' | 'REJECTED' | 'PENDING'
      comments?: string
      approvedAt?: string
      approvedBy?: string
    }
    dean?: {
      status: 'APPROVED' | 'REJECTED' | 'PENDING'
      comments?: string
      approvedAt?: string
      approvedBy?: string
    }
  }
  status: 'PENDING_SECRETARY' | 'PENDING_DEAN' | 'APPROVED' | 'REJECTED'
  priority: 'HIGH' | 'NORMAL' | 'LOW'
}

export default function GraduationApprovalsPage() {
  const { user } = useAuth()
  const [approvals, setApprovals] = useState<GraduationApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    department: 'all'
  })
  const [selectedApproval, setSelectedApproval] = useState<GraduationApproval | null>(null)
  const [comment, setComment] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [bulkSelected, setBulkSelected] = useState<string[]>([])

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true)
      
      // Mock data - mezuniyet onayları
      const mockApprovals: GraduationApproval[] = [
        {
          id: '1',
          student: {
            id: '1',
            studentId: '190201001',
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            email: 'ahmet.yilmaz@std.iyte.edu.tr',
            department: 'Bilgisayar Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            gpa: 3.45,
            graduationDate: '2024-06-15'
          },
          application: {
            submittedAt: '2024-01-15T10:30:00Z',
            advisorApproval: {
              status: 'APPROVED',
              comments: 'Mezuniyete uygun. Tüm gereksinimler karşılanmış.',
              approvedAt: '2024-01-16T14:20:00Z',
              advisorName: 'Prof. Dr. Mehmet Kaya'
            },
            documents: {
              terminationForm: true,
              transcripts: true,
              diplomaPhoto: true
            },
            ceremonyRegistration: true
          },
          approvals: {
            secretary: {
              status: 'APPROVED',
              comments: 'Belgeler eksiksiz. Sekreterlik onayı verildi.',
              approvedAt: '2024-01-17T09:15:00Z',
              approvedBy: 'Ayşe Demir'
            }
          },
          status: 'PENDING_DEAN',
          priority: 'NORMAL'
        },
        {
          id: '2',
          student: {
            id: '2',
            studentId: '190201002',
            firstName: 'Zeynep',
            lastName: 'Kaya',
            email: 'zeynep.kaya@std.iyte.edu.tr',
            department: 'Elektrik Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            gpa: 3.78,
            graduationDate: '2024-06-15'
          },
          application: {
            submittedAt: '2024-01-10T09:15:00Z',
            advisorApproval: {
              status: 'APPROVED',
              comments: 'Başarılı öğrenci. Onaylanmıştır.',
              approvedAt: '2024-01-11T16:45:00Z',
              advisorName: 'Prof. Dr. Ali Şahin'
            },
            documents: {
              terminationForm: true,
              transcripts: true,
              diplomaPhoto: false
            },
            ceremonyRegistration: false
          },
          approvals: {},
          status: 'PENDING_SECRETARY',
          priority: 'HIGH'
        },
        {
          id: '3',
          student: {
            id: '3',
            studentId: '190201003',
            firstName: 'Mehmet',
            lastName: 'Demir',
            email: 'mehmet.demir@std.iyte.edu.tr',
            department: 'Makine Mühendisliği',
            faculty: 'Mühendislik Fakültesi',
            gpa: 2.85
          },
          application: {
            submittedAt: '2024-01-20T11:00:00Z',
            advisorApproval: {
              status: 'APPROVED',
              comments: 'Düzensiz mezuniyet. Koşullu onay.',
              approvedAt: '2024-01-21T10:30:00Z',
              advisorName: 'Dr. Fatma Özkan'
            },
            documents: {
              terminationForm: false,
              transcripts: true,
              diplomaPhoto: true
            },
            ceremonyRegistration: true
          },
          approvals: {},
          status: 'PENDING_SECRETARY',
          priority: 'LOW'
        }
      ]
      
      setApprovals(mockApprovals)
    } catch (error) {
      console.error('Error fetching approvals:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApprovals()
  }, [fetchApprovals])

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING_SECRETARY: 'bg-yellow-100 text-yellow-800',
      PENDING_DEAN: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    }
    
    const labels = {
      PENDING_SECRETARY: 'Sekreterlik Bekliyor',
      PENDING_DEAN: 'Dekanlık Bekliyor',
      APPROVED: 'Onaylandı',
      REJECTED: 'Reddedildi'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      HIGH: 'bg-red-100 text-red-800',
      NORMAL: 'bg-gray-100 text-gray-800',
      LOW: 'bg-blue-100 text-blue-800'
    }
    
    const labels = {
      HIGH: 'Yüksek',
      NORMAL: 'Normal',
      LOW: 'Düşük'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    )
  }

  const canApprove = (approval: GraduationApproval) => {
    if (user?.role === 'SECRETARY') {
      return approval.status === 'PENDING_SECRETARY'
    }
    if (user?.role === 'DEAN') {
      return approval.status === 'PENDING_DEAN'
    }
    return false
  }

  const handleReviewApproval = (approval: GraduationApproval) => {
    setSelectedApproval(approval)
    setComment('')
    setShowModal(true)
  }

  const handleSaveApproval = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!selectedApproval) return

    try {
      console.log('Saving approval:', {
        approvalId: selectedApproval.id,
        decision,
        comment,
        role: user?.role
      })

      const newStatus = decision === 'APPROVED' 
        ? (user?.role === 'SECRETARY' ? 'PENDING_DEAN' : 'APPROVED')
        : 'REJECTED'

      setApprovals(prev => prev.map(app => 
        app.id === selectedApproval.id 
          ? {
              ...app,
              status: newStatus,
              approvals: {
                ...app.approvals,
                ...(user?.role?.toLowerCase() === 'secretary' 
                  ? { secretary: {
                      status: decision,
                      comments: comment,
                      approvedAt: new Date().toISOString(),
                      approvedBy: user?.name
                    }}
                  : { dean: {
                      status: decision,
                      comments: comment,
                      approvedAt: new Date().toISOString(),
                      approvedBy: user?.name
                    }}
                )
              }
            }
          : app
      ))

      setShowModal(false)
      setSelectedApproval(null)
      setComment('')
      
      alert(`${decision === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}`)
    } catch (error) {
      console.error('Error saving approval:', error)
      alert('Onay kaydedilirken hata oluştu')
    }
  }

  const handleBulkApproval = async (decision: 'APPROVED' | 'REJECTED') => {
    if (bulkSelected.length === 0) return

    try {
      console.log('Bulk approval:', { ids: bulkSelected, decision, role: user?.role })

      setApprovals(prev => prev.map(app => 
        bulkSelected.includes(app.id) && canApprove(app)
          ? {
              ...app,
              status: decision === 'APPROVED' 
                ? (user?.role === 'SECRETARY' ? 'PENDING_DEAN' : 'APPROVED')
                : 'REJECTED',
              approvals: {
                ...app.approvals,
                ...(user?.role?.toLowerCase() === 'secretary' 
                  ? { secretary: {
                      status: decision,
                      comments: `Toplu ${decision === 'APPROVED' ? 'onay' : 'ret'}`,
                      approvedAt: new Date().toISOString(),
                      approvedBy: user?.name
                    }}
                  : { dean: {
                      status: decision,
                      comments: `Toplu ${decision === 'APPROVED' ? 'onay' : 'ret'}`,
                      approvedAt: new Date().toISOString(),
                      approvedBy: user?.name
                    }}
                )
              }
            }
          : app
      ))

      setBulkSelected([])
      alert(`${bulkSelected.length} başvuru ${decision === 'APPROVED' ? 'onaylandı' : 'reddedildi'}`)
    } catch (error) {
      console.error('Error bulk approval:', error)
      alert('Toplu onay sırasında hata oluştu')
    }
  }

  const filteredApprovals = approvals.filter(app => {
    if (filter.status !== 'all' && app.status !== filter.status) return false
    if (filter.priority !== 'all' && app.priority !== filter.priority) return false
    if (filter.department !== 'all' && app.student.department !== filter.department) return false
    return true
  })

  const stats = {
    total: approvals.length,
    pendingSecretary: approvals.filter(app => app.status === 'PENDING_SECRETARY').length,
    pendingDean: approvals.filter(app => app.status === 'PENDING_DEAN').length,
    approved: approvals.filter(app => app.status === 'APPROVED').length
  }

  return (
    <DashboardLayout currentPage="graduation-approvals">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="h-6 w-6 text-red-600" />
                Mezuniyet Onayları
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'SECRETARY' ? 'Bölüm' : 'Fakülte'} seviyesinde mezuniyet başvurularını onaylayın
              </p>
            </div>
            <div className="flex gap-3">
              {bulkSelected.length > 0 && (
                <>
                  <button
                    onClick={() => handleBulkApproval('APPROVED')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Toplu Onayla ({bulkSelected.length})
                  </button>
                  <button
                    onClick={() => handleBulkApproval('REJECTED')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Toplu Reddet
                  </button>
                </>
              )}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Rapor İndir
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-gray-400" />
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
                <FileText className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Sekreterlik Bekliyor</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingSecretary}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Dekanlık Bekliyor</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingDean}</p>
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
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onay Durumu
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tümü</option>
                <option value="PENDING_SECRETARY">Sekreterlik Bekliyor</option>
                <option value="PENDING_DEAN">Dekanlık Bekliyor</option>
                <option value="APPROVED">Onaylanan</option>
                <option value="REJECTED">Reddedilen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Öncelik
              </label>
              <select
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tümü</option>
                <option value="HIGH">Yüksek</option>
                <option value="NORMAL">Normal</option>
                <option value="LOW">Düşük</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölüm
              </label>
              <select
                value={filter.department}
                onChange={(e) => setFilter({ ...filter, department: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tüm Bölümler</option>
                <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
                <option value="Elektrik Mühendisliği">Elektrik Mühendisliği</option>
                <option value="Makine Mühendisliği">Makine Mühendisliği</option>
              </select>
            </div>
          </div>
        </div>

        {/* Approvals List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Onay Listesi ({filteredApprovals.length})
              </h2>
              {filteredApprovals.length > 0 && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bulkSelected.length === filteredApprovals.filter(app => canApprove(app)).length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBulkSelected(filteredApprovals.filter(app => canApprove(app)).map(app => app.id))
                      } else {
                        setBulkSelected([])
                      }
                    }}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mr-2"
                  />
                  <span className="text-sm text-gray-700">Tümünü Seç</span>
                </label>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="sr-only">Seç</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Belgeler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danışman Onayı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filteredApprovals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Onay bekleyen başvuru bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredApprovals.map((approval) => (
                    <tr key={approval.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canApprove(approval) && (
                          <input
                            type="checkbox"
                            checked={bulkSelected.includes(approval.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkSelected([...bulkSelected, approval.id])
                              } else {
                                setBulkSelected(bulkSelected.filter(id => id !== approval.id))
                              }
                            }}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-red-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {approval.student.firstName} {approval.student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {approval.student.studentId} • {approval.student.department}
                            </div>
                            <div className="text-sm text-gray-500">
                              GPA: {approval.student.gpa}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(approval.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(approval.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            approval.application.documents.terminationForm 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {approval.application.documents.terminationForm ? '✓' : '✗'} İlişik Kesme
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            approval.application.documents.transcripts 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {approval.application.documents.transcripts ? '✓' : '✗'} Transkript
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            approval.application.advisorApproval.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {approval.application.advisorApproval.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {approval.application.advisorApproval.advisorName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleReviewApproval(approval)}
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
      {showModal && selectedApproval && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mezuniyet Onayı Değerlendirmesi
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Öğrenci Bilgileri</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <p><strong>Ad Soyad:</strong> {selectedApproval.student.firstName} {selectedApproval.student.lastName}</p>
                    <p><strong>Öğrenci No:</strong> {selectedApproval.student.studentId}</p>
                    <p><strong>Bölüm:</strong> {selectedApproval.student.department}</p>
                    <p><strong>GPA:</strong> {selectedApproval.student.gpa}</p>
                    {selectedApproval.student.graduationDate && (
                      <p><strong>Mezuniyet Tarihi:</strong> {new Date(selectedApproval.student.graduationDate).toLocaleDateString('tr-TR')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Belgeler ve Onaylar</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>İlişik Kesme Formu:</span>
                      <span className={selectedApproval.application.documents.terminationForm ? 'text-green-600' : 'text-red-600'}>
                        {selectedApproval.application.documents.terminationForm ? '✓ Var' : '✗ Yok'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transkript:</span>
                      <span className={selectedApproval.application.documents.transcripts ? 'text-green-600' : 'text-red-600'}>
                        {selectedApproval.application.documents.transcripts ? '✓ Var' : '✗ Yok'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diploma Fotoğrafı:</span>
                      <span className={selectedApproval.application.documents.diplomaPhoto ? 'text-green-600' : 'text-red-600'}>
                        {selectedApproval.application.documents.diplomaPhoto ? '✓ Var' : '✗ Yok'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Danışman Görüşü</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{selectedApproval.application.advisorApproval.advisorName}:</strong> {' '}
                    {selectedApproval.application.advisorApproval.comments}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {user?.role === 'SECRETARY' ? 'Sekreterlik' : 'Dekanlık'} Görüşü
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Mezuniyet başvurusu hakkındaki görüşünüzü yazın..."
                />
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
                onClick={() => handleSaveApproval('REJECTED')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reddet
              </button>
              <button
                onClick={() => handleSaveApproval('APPROVED')}
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