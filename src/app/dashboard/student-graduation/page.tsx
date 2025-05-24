'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  Upload,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface ApplicationPeriod {
  id: string
  name: string
  type: string
  status: string
  startDate: string | null
  endDate: string | null
}

interface StudentGraduationData {
  graduationApplication?: {
    eligibility: string
    status: string
    terminationFormSubmitted: boolean
  }
  ceremonyApplication?: {
    isApplied: boolean
    appliedAt: string | null
  }
}

export default function StudentGraduationPage() {
  const [applicationPeriods, setApplicationPeriods] = useState<ApplicationPeriod[]>([])
  const [studentData, setStudentData] = useState<StudentGraduationData>({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchApplicationPeriods()
    fetchStudentGraduationData()
  }, [])

  const fetchApplicationPeriods = async () => {
    try {
      // Mock data - in real app, this would be an API call
      setApplicationPeriods([
        {
          id: '1',
          name: 'Mezuniyet Töreni Başvuruları',
          type: 'ceremony',
          status: 'OPEN',
          startDate: '2024-01-15',
          endDate: '2024-02-15'
        },
        {
          id: '2',
          name: 'Okuldan İlişik Kesme Formu',
          type: 'termination',
          status: 'OPEN',
          startDate: '2024-01-10',
          endDate: '2024-02-20'
        }
      ])
    } catch (error) {
      console.error('Error fetching application periods:', error)
    }
  }

  const fetchStudentGraduationData = async () => {
    try {
      setLoading(true)
      // Mock data - in real app, this would be an API call to get student's graduation data
      setStudentData({
        graduationApplication: {
          eligibility: 'ELIGIBLE',
          status: 'IN_PROGRESS',
          terminationFormSubmitted: false
        },
        ceremonyApplication: {
          isApplied: false,
          appliedAt: null
        }
      })
    } catch (error) {
      console.error('Error fetching student graduation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCeremonyApplication = async () => {
    try {
      // Mock response
      console.log('Applying for ceremony...')
      
      // Simulate success
      setStudentData(prev => ({
        ...prev,
        ceremonyApplication: {
          isApplied: true,
          appliedAt: new Date().toISOString()
        }
      }))
      
      setShowSuccessMessage('Mezuniyet töreni başvurunuz başarıyla alındı!')
      setTimeout(() => setShowSuccessMessage(null), 5000)
    } catch (error) {
      console.error('Error applying for ceremony:', error)
      alert('Başvuru yapılırken hata oluştu')
    }
  }

  const handleTerminationFormUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      
      // Mock upload
      console.log(`Uploading termination form: ${file.name}`)
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate success
      setStudentData(prev => ({
        ...prev,
        graduationApplication: {
          ...prev.graduationApplication!,
          terminationFormSubmitted: true
        }
      }))
      
      setShowSuccessMessage('Okuldan ilişik kesme formu başarıyla gönderildi!')
      setTimeout(() => setShowSuccessMessage(null), 5000)
    } catch (error) {
      console.error('Error uploading termination form:', error)
      alert('Form gönderilirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const getEligibilityStatus = () => {
    if (!studentData.graduationApplication) return null

    const { eligibility } = studentData.graduationApplication
    
    switch (eligibility) {
      case 'ELIGIBLE':
        return {
          text: 'Mezuniyete Uygunsunuz',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CheckCircle
        }
      case 'IRREGULAR_ELIGIBLE':
        return {
          text: 'Düzensiz Mezuniyete Uygunsunuz',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: AlertCircle
        }
      case 'NOT_ELIGIBLE':
        return {
          text: 'Henüz Mezuniyete Uygun Değilsiniz',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: AlertCircle
        }
      default:
        return {
          text: 'Durum Belirleniyor',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: Clock
        }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  const eligibilityStatus = getEligibilityStatus()
  const ceremonyPeriod = applicationPeriods.find(p => p.type === 'ceremony')
  const terminationPeriod = applicationPeriods.find(p => p.type === 'termination')

  return (
    <DashboardLayout currentPage="student-graduation">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mezuniyet İşlemleri</h1>
              <p className="text-gray-600">Mezuniyet başvurunuzu tamamlayın ve gerekli belgeleri yükleyin</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <p className="text-green-800 font-medium">{showSuccessMessage}</p>
            </div>
          </div>
        )}

        {/* Eligibility Status */}
        {eligibilityStatus && (
          <div className={`${eligibilityStatus.bgColor} rounded-lg p-6`}>
            <div className="flex items-center gap-3">
              <eligibilityStatus.icon className={`h-6 w-6 ${eligibilityStatus.color}`} />
              <div>
                <h2 className={`text-lg font-semibold ${eligibilityStatus.color}`}>
                  {eligibilityStatus.text}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Mezuniyet durumunuz sistem tarafından değerlendirilmiştir.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Application Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-red-600" />
            Başvuru Durumu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Mezuniyet Uygunluğu</span>
                {eligibilityStatus && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${eligibilityStatus.bgColor} ${eligibilityStatus.color}`}>
                    {eligibilityStatus.text.includes('Uygunsunuz') ? 'Uygun' : 'Beklemede'}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tören Başvurusu</span>
                {studentData.ceremonyApplication?.isApplied ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Tamamlandı
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Yapılmadı
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">İlişik Kesme Formu</span>
                {studentData.graduationApplication?.terminationFormSubmitted ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Gönderildi
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Bekleniyor
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Genel Durum</span>
                {studentData.ceremonyApplication?.isApplied && studentData.graduationApplication?.terminationFormSubmitted ? (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Başvuru Tamamlandı
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Eksik Belgeler Var
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Başvuru İlerlemesi</span>
              <span className="text-sm text-gray-500">
                {(() => {
                  const completed = [
                    studentData.graduationApplication?.terminationFormSubmitted,
                    studentData.ceremonyApplication?.isApplied
                  ].filter(Boolean).length
                  return `${completed}/2 tamamlandı`
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${(() => {
                    const completed = [
                      studentData.graduationApplication?.terminationFormSubmitted,
                      studentData.ceremonyApplication?.isApplied
                    ].filter(Boolean).length
                    return (completed / 2) * 100
                  })()}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Ceremony Application */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-red-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Mezuniyet Töreni Başvurusu</h2>
                <p className="text-sm text-gray-600">
                  Mezuniyet törenine katılmak için başvuru yapın
                </p>
              </div>
            </div>
            <div className="text-right">
              {ceremonyPeriod?.status === 'OPEN' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Başvurular Açık
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Başvurular Kapalı
                </span>
              )}
            </div>
          </div>

          {ceremonyPeriod?.status === 'OPEN' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">
                <strong>Başvuru Tarihleri:</strong> {' '}
                {ceremonyPeriod.startDate && new Date(ceremonyPeriod.startDate).toLocaleDateString('tr-TR')} - {' '}
                {ceremonyPeriod.endDate && new Date(ceremonyPeriod.endDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {studentData.ceremonyApplication?.isApplied ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    Başvuru Tamamlandı
                  </span>
                  <span className="text-sm text-gray-500">
                    ({studentData.ceremonyApplication.appliedAt && 
                      new Date(studentData.ceremonyApplication.appliedAt).toLocaleDateString('tr-TR')})
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Başvuru Yapılmadı</span>
                </>
              )}
            </div>

            {!studentData.ceremonyApplication?.isApplied && ceremonyPeriod?.status === 'OPEN' && (
              <button
                onClick={handleCeremonyApplication}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Başvuru Yap
              </button>
            )}
          </div>
        </div>

        {/* Termination Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-red-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Okuldan İlişik Kesme Formu</h2>
                <p className="text-sm text-gray-600">
                  Mezuniyet için gerekli ilişik kesme formunu yükleyin
                </p>
              </div>
            </div>
            <div className="text-right">
              {terminationPeriod?.status === 'OPEN' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Gönderim Açık
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Gönderim Kapalı
                </span>
              )}
            </div>
          </div>

          {terminationPeriod?.status === 'OPEN' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">
                <strong>Gönderim Tarihleri:</strong> {' '}
                {terminationPeriod.startDate && new Date(terminationPeriod.startDate).toLocaleDateString('tr-TR')} - {' '}
                {terminationPeriod.endDate && new Date(terminationPeriod.endDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {studentData.graduationApplication?.terminationFormSubmitted ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    Form Gönderildi
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Form Gönderilmedi</span>
                </>
              )}
            </div>

            {!studentData.graduationApplication?.terminationFormSubmitted && terminationPeriod?.status === 'OPEN' && (
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="termination-form"
                  accept=".pdf,.doc,.docx"
                  onChange={handleTerminationFormUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="termination-form"
                  className={`${
                    uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                  } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2`}
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Yükleniyor...' : 'Form Yükle'}
                </label>
              </div>
            )}
          </div>

          {terminationPeriod?.status === 'OPEN' && !studentData.graduationApplication?.terminationFormSubmitted && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Not:</strong> Lütfen okuldan ilişik kesme formunuzu PDF, DOC veya DOCX formatında yükleyiniz.
                Form şablonunu bölüm sekreterliğinden temin edebilirsiniz.
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Yardım ve Bilgilendirme</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Mezuniyet için tüm dersleri başarıyla tamamlamış olmanız gerekmektedir.</p>
            <p>• Mezuniyet töreni başvurusu isteğe bağlıdır, ancak törene katılmak istiyorsanız mutlaka başvuru yapmalısınız.</p>
            <p>• Okuldan ilişik kesme formu mezuniyet için zorunlu bir belgedir.</p>
            <p>• Herhangi bir sorunuz için bölüm sekreterliği ile iletişime geçebilirsiniz.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 