import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { Star, Loader2, Plus, Minus, Search } from 'lucide-react';

export default function EnseignantPoints() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      fetchClasses();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchPointsHistory();
    }
  }, [selectedClass]);

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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select('student_id, profiles!student_enrollments_student_id_fkey(*)')
        .eq('class_id', selectedClass);
      
      const studentsData = enrollments?.map(e => e.profiles) || [];
      
      // Fetch total points for each student
      const { data: pointsData } = await supabase
        .from('student_points')
        .select('student_id, points, type');
        
      const studentsWithPoints = studentsData.map((student: any) => {
        const studentPoints = pointsData?.filter(p => p.student_id === student.id) || [];
        const totalPoints = studentPoints.reduce((acc, curr) => {
          return curr.type === 'positif' ? acc + curr.points : acc - curr.points;
        }, 0);
        return { ...student, totalPoints };
      });

      setStudents(studentsWithPoints.sort((a, b) => a.nom.localeCompare(b.nom)));
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsHistory = async () => {
    try {
      const { data } = await supabase
        .from('student_points')
        .select('*, profiles!student_points_student_id_fkey(nom, prenom)')
        .eq('teacher_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setPointsHistory(data || []);
    } catch (error) {
      console.error('Error fetching points history:', error);
    }
  };

  const handleAddPoints = async (studentId: string, points: number, type: 'positif' | 'negatif', description: string) => {
    try {
      const { error } = await supabase.from('student_points').insert([{
        student_id: studentId,
        teacher_id: profile!.id,
        points,
        type,
        description
      }]);

      if (error) throw error;
      
      fetchStudents();
      fetchPointsHistory();
    } catch (error) {
      console.error('Error adding points:', error);
      alert('Erreur lors de l\'attribution des points.');
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
          <Star className="text-yellow-500" />
          Système de Points
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sélectionner une classe</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-brand-blue" size={24} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
              <div key={student.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300 mb-3">
                  {student.prenom[0]}{student.nom[0]}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{student.prenom} {student.nom}</h3>
                
                <div className="mt-2 mb-4">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${
                    student.totalPoints > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    student.totalPoints < 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {student.totalPoints > 0 ? '+' : ''}{student.totalPoints} pts
                  </span>
                </div>

                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => {
                      const desc = prompt('Raison du point positif (ex: Participation) :');
                      if (desc) handleAddPoints(student.id, 1, 'positif', desc);
                    }}
                    className="flex-1 flex justify-center items-center gap-1 bg-green-50 hover:bg-green-100 text-green-600 dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:text-green-400 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} /> <Star size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      const desc = prompt('Raison du point négatif (ex: Bavardage) :');
                      if (desc) handleAddPoints(student.id, 1, 'negatif', desc);
                    }}
                    className="flex-1 flex justify-center items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 py-2 rounded-lg transition-colors"
                  >
                    <Minus size={16} /> <Star size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Historique récent</h2>
        {pointsHistory.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">Aucun point attribué récemment.</p>
        ) : (
          <div className="space-y-3">
            {pointsHistory.map(history => (
              <div key={history.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {history.profiles?.prenom} {history.profiles?.nom}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{history.description}</p>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${history.type === 'positif' ? 'text-green-500' : 'text-red-500'}`}>
                    {history.type === 'positif' ? '+' : '-'}{history.points}
                  </span>
                  <p className="text-xs text-slate-400">{new Date(history.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
