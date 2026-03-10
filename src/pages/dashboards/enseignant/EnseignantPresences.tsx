import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { CheckCircle, Loader2, Calendar as CalendarIcon, XCircle, Clock } from 'lucide-react';

export default function EnseignantPresences() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchClasses();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchStudentsAndAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const { data: scheduleClasses } = await supabase
        .from('schedule')
        .select('class_id, classes(*)')
        .eq('teacher_id', profile!.id);
      
      const uniqueClasses = new Map();
      scheduleClasses?.forEach((sc: any) => {
        if (sc.classes) uniqueClasses.set(sc.classes.id, sc.classes);
      });

      const { data: mainClasses } = await supabase
        .from('classes')
        .select('*')
        .eq('main_teacher_id', profile!.id);
      
      mainClasses?.forEach(c => uniqueClasses.set(c.id, c));
      
      const classesList = Array.from(uniqueClasses.values());
      setClasses(classesList);
      if (classesList.length > 0) {
        setSelectedClass(classesList[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select('student_id, profiles!student_enrollments_student_id_fkey(*)')
        .eq('class_id', selectedClass);
      
      const studentsData = enrollments?.map(e => e.profiles) || [];
      setStudents(studentsData.sort((a, b) => a.nom.localeCompare(b.nom)));

      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('*')
        .eq('class_id', selectedClass)
        .eq('date', selectedDate);
        
      setAttendance(attendanceData || []);
    } catch (error) {
      console.error('Error fetching students and attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    try {
      const existingRecord = attendance.find(a => a.student_id === studentId);

      if (existingRecord) {
        const { error } = await supabase
          .from('attendance')
          .update({ status, teacher_id: profile!.id })
          .eq('id', existingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert([{
            student_id: studentId,
            class_id: selectedClass,
            teacher_id: profile!.id,
            status,
            date: selectedDate
          }]);
        if (error) throw error;
      }

      fetchStudentsAndAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Erreur lors de l\'enregistrement de la présence.');
    }
  };

  if (loading && classes.length === 0) {
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
          <CheckCircle className="text-green-500" />
          Présences
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-brand-blue" size={24} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Élève</th>
                  <th className="pb-3 font-medium text-center">Statut</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {students.map(student => {
                  const record = attendance.find(a => a.student_id === student.id);
                  const status = record?.status;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 font-medium text-slate-900 dark:text-white">
                        {student.nom} {student.prenom}
                      </td>
                      <td className="py-4 text-center">
                        {status === 'present' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Présent</span>}
                        {status === 'absent' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Absent</span>}
                        {status === 'late' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Retard</span>}
                        {!status && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">Non renseigné</span>}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleMarkAttendance(student.id, 'present')}
                            className={`p-2 rounded-lg transition-colors ${status === 'present' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40'}`}
                            title="Présent"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(student.id, 'absent')}
                            className={`p-2 rounded-lg transition-colors ${status === 'absent' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'}`}
                            title="Absent"
                          >
                            <XCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(student.id, 'late')}
                            className={`p-2 rounded-lg transition-colors ${status === 'late' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/40'}`}
                            title="Retard"
                          >
                            <Clock size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
