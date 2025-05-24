// This file will contain functions to interact with the backend graduation APIs

const API_BASE_URL = 'http://localhost:5000/api'; // Reverted back to port 5000

// Helper to get the auth token (assuming it's stored in localStorage or a similar place)
// In a real app, this would come from your auth context/state management
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// TODO: Define interfaces for API responses and request payloads
export interface GraduationApplication {
  id: string;
  studentId: string;
  status: string; // Should match GraduationStatus enum from backend
  eligibility: string;
  isVisible: boolean;
  appliedAt?: string;
  submittedAt?: string;
  currentStep?: string; // Should match UserRole enum
  studentRemarks?: string;
  advisorRemarks?: string;
  secretaryRemarks?: string;
  deaneryRemarks?: string;
  finalizedAt?: string;
  rejectionReason?: string;
  terminationFormSubmitted: boolean;
  terminationFormPath?: string;
  documents: GraduationDocument[];
  approvalSteps: ApprovalStep[];
  student?: {
    user?: { 
      firstName?: string; 
      lastName?: string; 
      email?: string 
    };
    department?: { 
      name?: string 
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface GraduationDocument {
  id: string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  verificationStatus: string;
  verificationDetails?: string;
}

export interface ApprovalStep {
  id: string;
  stepOrder: number;
  approverRole: string;
  status: string;
  remarks?: string;
  actionAt?: string;
  approvedByUser?: { firstName: string; lastName: string; role: string; };
}

/**
 * Fetches the student's current graduation application.
 */
export const getStudentGraduationApplication = async (): Promise<GraduationApplication | null> => {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication token not found.');

  const response = await fetch(`${API_BASE_URL}/graduation/request/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 404) return null; // No application found is a valid case
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch graduation application');
  }
  const result = await response.json();
  return result.data as GraduationApplication;
};

/**
 * Creates or updates a student's graduation request (saves as draft).
 */
export const submitOrUpdateGraduationRequest = async (payload: { studentRemarks?: string }): Promise<GraduationApplication> => {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication token not found.');

  const response = await fetch(`${API_BASE_URL}/graduation/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to submit/update graduation request');
  }
  const result = await response.json();
  return result.data as GraduationApplication;
};

/**
 * Uploads a document for a specific graduation application.
 */
export const uploadGraduationDocument = async (applicationId: string, documentType: string, file: File): Promise<GraduationDocument> => {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication token not found.');

  const formData = new FormData();
  formData.append('graduationApplicationId', applicationId);
  formData.append('documentType', documentType);
  formData.append('graduationDocument', file); // 'graduationDocument' must match multer field name

  const response = await fetch(`${API_BASE_URL}/graduation/request/document`, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data' is set automatically by browser when using FormData
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to upload document');
  }
  const result = await response.json();
  return result.data as GraduationDocument;
};

/**
 * Finalizes and submits a DRAFT graduation application for review.
 */
export const finalizeStudentGraduationApplication = async (applicationId: string): Promise<GraduationApplication> => {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication token not found.');

  const response = await fetch(`${API_BASE_URL}/graduation/request/${applicationId}/finalize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to finalize graduation application');
  }
  const result = await response.json();
  return result.data as GraduationApplication;
};

/**
 * Fetches pending graduation applications for the current staff member (based on their role).
 */
export const getPendingReviewApplications = async (): Promise<GraduationApplication[]> => {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication token not found.');

  const response = await fetch(`${API_BASE_URL}/graduation/requests/pending`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch pending applications');
  }
  const result = await response.json();
  return result.data as GraduationApplication[];
};

/**
 * Submits a review for a specific graduation application step.
 */
export const reviewApplicationStep = async (
  applicationId: string, 
  payload: { approved: boolean; remarks?: string }
): Promise<GraduationApplication> => {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication token not found.');

  const response = await fetch(`${API_BASE_URL}/graduation/request/${applicationId}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to submit review');
  }
  const result = await response.json();
  return result.data as GraduationApplication;
}; 