-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'eleve', 
    'parent',
    'enseignant_maternelle', 'enseignant_primaire', 'enseignant_college', 
    'surveillant', 
    'secretaire', 
    'comptable', 
    'responsable_maternelle', 'responsable_primaire', 'responsable_college', 
    'charge_pedagogique', 
    'directrice'
  )),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLASSES
CREATE TABLE public.classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- e.g., '6ème A', 'CP B'
  level TEXT NOT NULL, -- e.g., '6ème', 'CP'
  main_teacher_id UUID REFERENCES public.profiles(id), -- Professeur principal
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBJECTS (Matières)
CREATE TABLE public.subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- e.g., 'Mathématiques', 'Français'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENT_ENROLLMENTS (Linking Students to Classes)
CREATE TABLE public.student_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL, -- e.g., '2024-2025'
  UNIQUE(student_id, academic_year)
);

-- 5. GRADES (Notes)
CREATE TABLE public.grades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  teacher_id UUID REFERENCES public.profiles(id),
  value DECIMAL(4, 2) NOT NULL, -- e.g., 15.50
  coefficient INTEGER DEFAULT 1,
  type TEXT NOT NULL, -- e.g., 'Contrôle', 'DM', 'Oral'
  date DATE DEFAULT CURRENT_DATE,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HOMEWORK (Devoirs)
CREATE TABLE public.homework (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  teacher_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ABSENCES
CREATE TABLE public.absences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  justified BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id), -- Surveillant or Teacher
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENTS (Paiements)
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  type TEXT NOT NULL, -- e.g., 'Scolarité', 'Cantine', 'Transport'
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INCIDENTS
CREATE TABLE public.incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  type TEXT NOT NULL, -- e.g., 'Bavardage', 'Violence', 'Retard'
  description TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'open', -- 'open', 'resolved'
  reported_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ANNOUNCEMENTS (Annonces)
CREATE TABLE public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_role TEXT, -- NULL for all, or specific role like 'eleve', 'parent'
  target_class_id UUID REFERENCES public.classes(id),
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DOCUMENTS
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL, -- Supabase Storage URL
  type TEXT NOT NULL, -- e.g., 'Bulletin', 'Certificat'
  student_id UUID REFERENCES public.profiles(id), -- Optional, if specific to a student
  class_id UUID REFERENCES public.classes(id), -- Optional, if specific to a class
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SCHEDULE (Emploi du temps)
CREATE TABLE public.schedule (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id),
  teacher_id UUID REFERENCES public.profiles(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1 = Monday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. STUDENT POINTS (Gamification)
CREATE TABLE public.student_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id),
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('positif', 'negatif')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MESSAGES (Internal Communication)
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  file_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CLASS POSTS (Class Feed)
CREATE TABLE public.class_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. STUDENT PORTFOLIO
CREATE TABLE public.student_portfolio (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ATTENDANCE (Présences)
CREATE TABLE public.attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id, date)
);

-- 18. NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. PARENT_STUDENTS (Linking Parents to Students)
CREATE TABLE public.parent_students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parent students viewable by relevant users" ON public.parent_students FOR SELECT TO authenticated USING (
  auth.uid() = parent_id OR auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('directrice', 'secretaire'))
);

-- RLS POLICIES (Basic examples, need refinement based on specific requirements)

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.student_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile. Admins/Staff can read all.
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Classes: Viewable by everyone (authenticated)
CREATE POLICY "Classes are viewable by authenticated users" ON public.classes FOR SELECT TO authenticated USING (true);

-- Grades: Students can see their own grades. Teachers can see/edit grades for their classes.
CREATE POLICY "Students can view own grades" ON public.grades FOR SELECT TO authenticated USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('enseignant_maternelle', 'enseignant_primaire', 'enseignant_college', 'directrice', 'responsable_maternelle', 'responsable_primaire', 'responsable_college'))
);

-- Homework: Viewable by students in the class and teachers.
CREATE POLICY "Homework viewable by authenticated users" ON public.homework FOR SELECT TO authenticated USING (true);

-- Absences: Students see their own. Surveillants/Admins see all.
CREATE POLICY "Absences viewable by relevant users" ON public.absences FOR SELECT TO authenticated USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('surveillant', 'directrice', 'secretaire'))
);

-- Payments: Students see their own. Comptable/Admin see all.
CREATE POLICY "Payments viewable by relevant users" ON public.payments FOR SELECT TO authenticated USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('comptable', 'directrice'))
);

-- Student Points: Viewable by everyone
CREATE POLICY "Student points viewable by authenticated users" ON public.student_points FOR SELECT TO authenticated USING (true);

-- Messages: Viewable by sender and receiver
CREATE POLICY "Messages viewable by sender and receiver" ON public.messages FOR SELECT TO authenticated USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- Class Posts: Viewable by everyone
CREATE POLICY "Class posts viewable by authenticated users" ON public.class_posts FOR SELECT TO authenticated USING (true);

-- Student Portfolio: Viewable by everyone
CREATE POLICY "Student portfolio viewable by authenticated users" ON public.student_portfolio FOR SELECT TO authenticated USING (true);

-- Attendance: Viewable by everyone
CREATE POLICY "Attendance viewable by authenticated users" ON public.attendance FOR SELECT TO authenticated USING (true);

-- Notifications: Viewable by user
CREATE POLICY "Notifications viewable by user" ON public.notifications FOR SELECT TO authenticated USING (
  auth.uid() = user_id
);

-- Insert some initial data (Optional)
-- INSERT INTO public.subjects (name) VALUES ('Mathématiques'), ('Français'), ('Histoire-Géographie'), ('Anglais'), ('SVT'), ('Physique-Chimie'), ('EPS'), ('Arts Plastiques'), ('Musique');
