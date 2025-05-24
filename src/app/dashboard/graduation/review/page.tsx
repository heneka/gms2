'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth, UserRole } from '../../../../contexts/AuthContext';
import { 
  getPendingReviewApplications, 
  reviewApplicationStep,
  GraduationApplication
} from '../../../../lib/services/graduationService';

// Re-using the interface from ApplyPage, ensure it's consistent or share it
// interface GraduationApplication { ... }

// Add a new interface for managing review form state per application
interface ApplicationReviewState extends GraduationApplication {
  reviewRemarks: string;
  isSubmittingReview: boolean;
}

const ReviewPage = () => {
  const { user, isLoading } = useAuth();
  const [applications, setApplications] = useState<ApplicationReviewState[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generalSubmitError, setGeneralSubmitError] = useState<string | null>(null);

  const authorizedRoles: UserRole[] = useMemo(() => ['ADVISOR', 'SECRETARY', 'DEAN'], []);

  const fetchApps = useCallback(async () => {
    try {
      setLoadingData(true);
      setGeneralSubmitError(null);
      const data = await getPendingReviewApplications();
      // Initialize reviewRemarks and isSubmittingReview for each application
      setApplications(data.map((app: GraduationApplication) => ({ ...app, reviewRemarks: '', isSubmittingReview: false })));
      setError(null);
    } catch (err) {
      console.error("Failed to fetch pending applications:", err);
      setError((err as Error).message || 'Failed to load applications for review.');
      setApplications([]);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (user && authorizedRoles.includes(user.role)) {
      fetchApps();
    } else if (user) {
      setLoadingData(false);
      setError('You are not authorized to view this page.');
    }
  }, [user, isLoading, fetchApps, authorizedRoles]);

  const handleReviewRemarksChange = (appId: string, remarks: string) => {
    setApplications(prevApps => 
      prevApps.map(app => app.id === appId ? { ...app, reviewRemarks: remarks } : app)
    );
  };

  const handleSubmitReview = async (applicationId: string, approved: boolean) => {
    const appIndex = applications.findIndex(app => app.id === applicationId);
    if (appIndex === -1) return;

    const remarks = applications[appIndex].reviewRemarks;

    setApplications(prevApps => 
      prevApps.map((app, index) => index === appIndex ? { ...app, isSubmittingReview: true } : app)
    );
    setGeneralSubmitError(null);

    try {
      await reviewApplicationStep(applicationId, { approved, remarks });
      alert(`Application ${approved ? 'approved' : 'rejected'} successfully!`);
      // Re-fetch applications to update the list
      await fetchApps(); 
    } catch (err) {
      console.error("Failed to submit review:", err);
      setGeneralSubmitError((err as Error).message || 'Failed to submit review for this application.');
      setApplications(prevApps => 
        prevApps.map((app, index) => index === appIndex ? { ...app, isSubmittingReview: false } : app)
      );
    }
    // No need to set isSubmittingReview to false here if fetchApps() is called and resets state
  };

  if (isLoading || (loadingData && !error)) { // Show loading if auth is loading OR data is loading (and no initial error)
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error && applications.length === 0) { // Show general error if loading failed and no apps are displayed
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!user || !authorizedRoles.includes(user.role)) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Review Graduation Applications</h1>
        <p className="text-orange-600">Access Denied. You do not have permission to review applications.</p>
        {user && <p>Your current role is: {user.role}</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Review Pending Graduation Applications</h1>
      {generalSubmitError && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">Error submitting review: {generalSubmitError}</p>}
      {error && applications.length > 0 && <p className="text-yellow-600 bg-yellow-50 p-3 rounded mb-4">Notice: There was an issue loading all data, but some applications are shown. Error: {error}</p>} 

      {applications.length === 0 && !loadingData && !error ? (
        <p>No applications are currently pending your review.</p>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className={`bg-white shadow-md rounded-lg p-6 ${app.isSubmittingReview ? 'opacity-70' : ''}`}>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Application ID: {app.id}</h2>
              {/* ... (application details rendering - unchanged) ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p><strong>Student:</strong> {app.student?.user?.firstName} {app.student?.user?.lastName} ({app.student?.user?.email})</p>
                  <p><strong>Department:</strong> {app.student?.department?.name || 'N/A'}</p>
                  <p><strong>Submitted At:</strong> {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> <span className="font-medium text-yellow-600">{app.status}</span></p>
                  <p><strong>Current Review Step:</strong> <span className="font-medium text-purple-600">{app.currentStep}</span></p>
                </div>
              </div>

              {app.studentRemarks && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Student Remarks:</h4>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded border">{app.studentRemarks}</p>
                </div>
              )}

              {app.documents && app.documents.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Submitted Documents:</h4>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {app.documents.map(doc => {
                      // Construct the file URL. Assuming API_BASE_URL is like http://localhost:3001/api
                      // We need http://localhost:3001/uploads/filePath
                      const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ? 
                                             process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api', '') : 
                                             'http://localhost:3001';
                      const fileUrl = `${backendBaseUrl}/uploads/${doc.filePath}`;
                      
                      return (
                        <li key={doc.id} className="text-sm text-gray-600">
                          <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {doc.fileName}
                          </a> 
                          ({doc.documentType.replace(/_/g, ' ')}) - <span className="italic">{doc.verificationStatus}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-md font-semibold mb-2">Your Review:</h4>
                <textarea 
                  value={app.reviewRemarks}
                  onChange={(e) => handleReviewRemarksChange(app.id, e.target.value)}
                  placeholder={`Remarks for ${app.currentStep} review...`}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded shadow-sm mb-2"
                  disabled={app.isSubmittingReview}
                />
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleSubmitReview(app.id, true)}
                    disabled={app.isSubmittingReview}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                  >
                    {app.isSubmittingReview ? 'Submitting...' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => handleSubmitReview(app.id, false)}
                    disabled={app.isSubmittingReview}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                  >
                    {app.isSubmittingReview ? 'Submitting...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewPage; 