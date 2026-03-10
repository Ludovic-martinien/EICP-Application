import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { Users, Loader2, Mail, Phone } from 'lucide-react';

export default function EnseignantClasses() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchClasses();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);

      const channel = supabase.channel('students_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'student_enrollments' }, () => fetchStudents(selectedClass))
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      // Fetch classes where the teacher teaches
      const { data: scheduleClasses } = await supabase
        .from('schedule')
        .select('class_id, classes(*)')
        .eq('teacher_id', profile!.id);
      
      const uniqueClasses = new Map();
      scheduleClasses?.forEach((sc: any) => {
        if (sc.classes) uniqueClasses.set(sc.classes.id, sc.classes);
      });

      // Also add classes where the teacher is the main teacher
      const { data: mainClasses } = await supabase
        .from('classes')
        .select('*')
        .eq('main_teacher_id', profile!.id);
      
      mainClasses?.forEach(c => uniqueClasses.set(c.id, c));
      
      const classesList = Array.from(uniqueClasses.values());
      setClasses(classesList);
      
      if (classesList.length > 0) {
        setSelectedClass(classesList[0].id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_enrollments')
        .select(`
          profiles (
            id,
            nom,
            prenom,
            email,
            telephone
          )
        `)
        .eq('class_id', classId);

      if (error) throw error;
      
      const studentsList = data.map((d: any) => d.profiles).filter(Boolean);
      studentsList.sort((a: any, b: any) => a.nom.localeCompare(b.nom));
      setStudents(studentsList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="text-brand-blue" />
          Mes Classes
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar: List of classes */}
        <div className="md:col-span-1 space-y-2">
          {classes.length === 0 ? (
            <div className="text-slate-500 dark:text-slate-400 text-sm p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              Aucune classe assignée.
            </div>
          ) : (
            classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClass(c.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  selectedClass === c.id
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="font-bold">{c.name}</div>
                <div className={`text-xs ${selectedClass === c.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  Niveau: {c.level}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Main content: Students list */}
        <div className="md:col-span-3">
          {selectedClass ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Liste des élèves ({students.length})
                </h2>
                {students.length > 0 && (
                  <a
                    href={`mailto:${students.map(s => s.email).join(',')}`}
                    className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Contacter la classe
                  </a>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Nom complet</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Téléphone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                          Aucun élève inscrit dans cette classe.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {student.nom} {student.prenom}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <Mail size={14} className="text-slate-400" />
                              {student.email || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <Phone size={14} className="text-slate-400" />
                              {student.telephone || '-'}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 dark:text-slate-400">
              Sélectionnez une classe pour voir la liste des élèves.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
