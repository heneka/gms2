import { NextApiRequest, NextApiResponse } from 'next';

interface DemoUser {
  email: string;
  password: string;
  role: string;
  name: string;
  department: string;
  faculty: string;
  studentId?: string;
}

const demoUsers: DemoUser[] = [
  { 
    email: 'student@iyte.edu.tr', 
    password: '123456', 
    role: 'STUDENT', 
    name: 'Ahmet Yılmaz', 
    department: 'Bilgisayar Mühendisliği', 
    faculty: 'Mühendislik Fakültesi',
    studentId: '190201001' 
  },
  { 
    email: 'advisor@iyte.edu.tr', 
    password: '123456', 
    role: 'ADVISOR', 
    name: 'Prof. Dr. Mehmet Kaya', 
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi'
  },
  { 
    email: 'secretary@iyte.edu.tr', 
    password: '123456', 
    role: 'SECRETARY', 
    name: 'Ayşe Demir', 
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi'
  },
  { 
    email: 'dean@iyte.edu.tr', 
    password: '123456', 
    role: 'DEAN', 
    name: 'Prof. Dr. Ali Özkan', 
    department: 'Mühendislik Fakültesi', 
    faculty: 'Mühendislik Fakültesi' 
  },
  { 
    email: 'studentaffairs@iyte.edu.tr', 
    password: '123456', 
    role: 'STUDENT_AFFAIRS', 
    name: 'Fatma Şahin', 
    department: 'Öğrenci İşleri Daire Başkanlığı',
    faculty: 'Rektörlük (Yönetim Birimi)'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ 
      success: false, 
      message: 'Email ve şifre gerekli' 
    });
    return;
  }

  const user = demoUsers.find(u => u.email === email && u.password === password);

  if (user) {
    const token = 'demo-jwt-token-' + Date.now();
    const response = {
      success: true,
      token,
      user: {
        id: Date.now(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        faculty: user.faculty,
        studentId: user.studentId || null
      }
    };
    
    console.log('Login successful:', response);
    res.status(200).json(response);
  } else {
    console.log('Login failed for:', email);
    res.status(401).json({
      success: false,
      message: 'Geçersiz email veya şifre'
    });
  }
} 