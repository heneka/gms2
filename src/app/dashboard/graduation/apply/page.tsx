'use client';

import React, { useEffect, useState } from 'react';
import {
  getStudentGraduationApplication,
  submitOrUpdateGraduationRequest,
  uploadGraduationDocument,
  finalizeStudentGraduationApplication,
  GraduationDocument,
  ApprovalStep
} from '../../../../lib/services/graduationService'; // Adjusted import path
import { useAuth } from '../../../../contexts/AuthContext'; // Import useAuth

interface GraduationApplication {
  id: string;
  studentId: string;
  status: string;
  studentRemarks?: string;
  // ... other fields as defined in your backend Prisma schema
  documents?: GraduationDocument[]; // Use specific type
  approvalSteps?: ApprovalStep[]; // Use specific type
  currentStep?: string;
  createdAt: string;
  updatedAt: string;
}

const ApplyPage = () => {
  const { user, isLoading } = useAuth(); // Use the auth context
  const [application, setApplication] = useState<GraduationApplication | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [studentRemarks, setStudentRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // New state for document type selection
  const [documentType, setDocumentType] = useState('SUPPORTING_DOCUMENT'); 
  const availableDocumentTypes = ['SUPPORTING_DOCUMENT', 'TRANSCRIPT', 'IDENTIFICATION']; // Removed unused setter

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    if (user && user.role === 'STUDENT') {
      const fetchApplication = async () => {
        try {
          setLoadingData(true);
          const data = await getStudentGraduationApplication();
          if (data) {
            setApplication(data);
            setStudentRemarks(data.studentRemarks || '');
          } else {
            setApplication(null); // No application found, student can create one
          }
          setError(null);
        } catch (err) {
          console.error("Failed to fetch application:", err);
          setError((err as Error).message || 'Failed to load application status.');
          setApplication(null);
        }
        setLoadingData(false);
      };
      fetchApplication();
    } else if (user) { // User exists but is not a student
      setLoadingData(false);
      setError(null); // Clear previous errors
      setApplication(null); // Clear previous application data
    }
  }, [user, isLoading]);

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStudentRemarks(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(e.target.value);
  };

  const handleSubmitOrUpdate = async () => {
    if (!user || user.role !== 'STUDENT') return;
    try {
      setError(null);
      const result = await submitOrUpdateGraduationRequest({ studentRemarks });
      setApplication(result);
      alert('Application submitted/updated successfully!');
    } catch (err) {
      setError((err as Error).message || 'Failed to submit/update application.');
    }
  };

  const handleUploadDocument = async () => {
    if (!user || user.role !== 'STUDENT' || !selectedFile || !application) return;
    try {
      setError(null);
      const result = await uploadGraduationDocument(application.id, documentType, selectedFile!); 
      alert('Document uploaded successfully! New document ID: ' + result.id);
      // Optionally, refresh application data to show the new document
      const updatedApp = await getStudentGraduationApplication();
      if (updatedApp) setApplication(updatedApp);
      setSelectedFile(null); // Clear file input
      // Reset document type to default or based on logic
      setDocumentType('SUPPORTING_DOCUMENT'); 
    } catch (err) {
      setError((err as Error).message || 'Failed to upload document.');
    }
  };

  const handleFinalizeApplication = async () => {
    if (!user || user.role !== 'STUDENT' || !application) return;
    try {
      setError(null);
      const result = await finalizeStudentGraduationApplication(application.id);
      setApplication(result);
      alert('Application finalized successfully!');
    } catch (err) {
      setError((err as Error).message || 'Failed to finalize application.');
    }
  };

  if (isLoading || (loadingData && user?.role === 'STUDENT')) {
    return <div className="container mx-auto p-4">Loading authentication status or application data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Graduation Application</h1>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">Error: {error}</p>}

      {!user || user.role !== 'STUDENT' ? (
        <div>
          <p className="text-xl text-orange-600">Access Denied.</p>
          <p>This page is for students to manage their graduation applications.</p>
          {user && <p>Your current role is: {user.role}.</p>}
          {!user && <p>Please log in to access this feature.</p>}
        </div>
      ) : (
        // Student View
        <div>
          {application ? (
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Application Status</h2>
              <p>Status: <span className={`font-semibold ${application.status === 'DRAFT' ? 'text-yellow-600' : 'text-green-600'}`}>{application.status}</span></p>
              <p>Current Step: {application.currentStep || 'N/A'}</p>
              <p className="mb-4">Last Updated: {new Date(application.updatedAt).toLocaleString()}</p>
              
              <div className="mb-4">
                <label htmlFor="studentRemarks" className="block text-sm font-medium text-gray-700 mb-1">Your Remarks/Notes:</label>
                <textarea 
                  id="studentRemarks" 
                  value={studentRemarks}
                  onChange={handleRemarksChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded shadow-sm"
                  placeholder="Add any notes or remarks for your application..."
                  disabled={application.status !== 'DRAFT'}
                />
              </div>

              {application.status === 'DRAFT' && (
                <button 
                  onClick={handleSubmitOrUpdate}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
                >
                  {application.id ? 'Update Draft Application' : 'Save Draft Application'}
                </button>
              )}

              <div className="my-6 p-4 border rounded">
                <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                <div className="mb-2">
                  <label htmlFor="documentTypeSelect" className="block text-sm font-medium text-gray-700 mb-1">Document Type:</label>
                  <select 
                    id="documentTypeSelect" 
                    value={documentType}
                    onChange={handleDocumentTypeChange}
                    className="w-full p-2 border border-gray-300 rounded shadow-sm"
                    disabled={application.status !== 'DRAFT'}
                  >
                    {availableDocumentTypes.map(docType => (
                      <option key={docType} value={docType}>{docType.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="mb-2" 
                  disabled={application.status !== 'DRAFT'}
                />
                <button 
                  onClick={handleUploadDocument}
                  disabled={!selectedFile || !application || application.status !== 'DRAFT'}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
                >
                  Upload Selected Document
                </button>
                {application.documents && application.documents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Uploaded Documents:</h4>
                    <ul>
                      {application.documents.map((doc: GraduationDocument) => (
                        <li key={doc.id} className="text-sm">{doc.fileName} ({doc.documentType.replace(/_/g, ' ')}) - {doc.verificationStatus}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {application.status === 'DRAFT' && application.id && (
                 <button 
                  onClick={handleFinalizeApplication}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2"
                >
                  Finalize and Submit Application
                </button>
              )}

            </div>
          ) : (
            <div>
              <p className="mb-4">You have not started a graduation application yet.</p>
              <div className="mb-4">
                <label htmlFor="newStudentRemarks" className="block text-sm font-medium text-gray-700 mb-1">Your Remarks/Notes (Optional):</label>
                <textarea 
                  id="newStudentRemarks" 
                  value={studentRemarks}
                  onChange={handleRemarksChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded shadow-sm"
                  placeholder="Add any notes or remarks for your new application..."
                />
              </div>
              <button 
                onClick={handleSubmitOrUpdate} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Start New Graduation Application
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplyPage; 