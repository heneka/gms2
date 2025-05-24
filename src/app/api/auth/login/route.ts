import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email ve şifre gerekli' },
        { status: 400 }
      );
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
      return NextResponse.json(response, { status: 200 });
    } else {
      console.log('Login failed for:', email);
      return NextResponse.json(
        { success: false, message: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Login API is working! Use POST method.' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 