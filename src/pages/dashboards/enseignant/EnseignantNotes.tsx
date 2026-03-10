import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { FileText, Loader2, Plus, Save, Download } from 'lucide-react';

export default function EnseignantNotes() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New grade form state
  const [isAdding, setIsAdding] = useState(false);
  const [newGradeType, setNewGradeType] = useState('Contrôle');
  const [newGradeDate, setNewGradeDate] = useState(new Date().toISOString().split('T')[0]);
  const [newGradeCoef, setNewGradeCoef] = useState(1);
  const [studentGrades, setStudentGrades] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchInitialData();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchStudentsAndGrades();

      const channel = supabase.channel('grades_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'grades' }, () => fetchStudentsAndGrades())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedClass, selectedSubject]);

  const fetchInitialData = async () => {
    try {
      // Fetch classes from schedule
      const { data: scheduleClasses } = await supabase
        .from('schedule')
        .select('class_id, classes(*)')
        .eq('teacher_id', profile!.id);
      
      const uniqueClasses = new Map();
      scheduleClasses?.forEach((sc: any) => {
        if (sc.classes) uniqueClasses.set(sc.classes.id, sc.classes);
      });

      // Also add classes where teacher is main teacher
      const { data: mainClasses } = await supabase
        .from('classes')
        .select('*')
        .eq('main_teacher_id', profile!.id);
      
      mainClasses?.forEach(c => uniqueClasses.set(c.id, c));
      
      const classesList = Array.from(uniqueClasses.values());
      setClasses(classesList);
      if (classesList.length > 0) setSelectedClass(classesList[0].id);

      // Fetch subjects
      const { data: subjectsData } = await supabase.from('subjects').select('*');
      setSubjects(subjectsData || []);
      if (subjectsData && subjectsData.length > 0) setSelectedSubject(subjectsData[0].id);

    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndGrades = async () => {
    if (!selectedClass || !selectedSubject) return;
    
    try {
      // Fetch students in class
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select('profiles(id, nom, prenom)')
        .eq('class_id', selectedClass);
      
      const studentsList = enrollments?.map((e: any) => e.profiles).filter(Boolean) || [];
      studentsList.sort((a: any, b: any) => a.nom.localeCompare(b.nom));
      setStudents(studentsList);

      // Fetch existing grades
      const { data: gradesData } = await supabase
        .from('grades')
        .select('*')
        .eq('teacher_id', profile!.id)
        .eq('subject_id', selectedSubject)
        .in('student_id', studentsList.map((s: any) => s.id));
      
      setGrades(gradesData || []);
    } catch (error) {
      console.error('Error fetching students and grades:', error);
    }
  };

  const handleSaveGrades = async () => {
    setSubmitting(true);
    try {
      const gradesToInsert = Object.entries(studentGrades)
        .filter(([_, value]) => value !== '')
        .map(([studentId, value]) => ({
          student_id: studentId,
          subject_id: selectedSubject,
          teacher_id: profile!.id,
          value: parseFloat(value),
          coefficient: newGradeCoef,
          type: newGradeType,
          date: newGradeDate,
        }));

      if (gradesToInsert.length === 0) {
        alert('Veuillez saisir au moins une note.');
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('grades').insert(gradesToInsert);
      if (error) throw error;

      alert('Notes enregistrées avec succès !');
      setIsAdding(false);
      setStudentGrades({});
      fetchStudentsAndGrades();
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Erreur lors de l\'enregistrement des notes.');
    } finally {
      setSubmitting(false);
    }
  };

  const exportToCSV = () => {
    if (students.length === 0) return;
    
    const headers = ['Nom', 'Prénom', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => {
        const studentGradesList = grades.filter(g => g.student_id === student.id).map(g => `${g.value}/20 (${g.type})`).join(' | ');
        return `"${student.nom}","${student.prenom}","${studentGradesList}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `notes_classe_${selectedClass}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <FileText className="text-brand-blue" />
          Gestion des Notes
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
            title="Exporter en CSV"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
          >
            {isAdding ? 'Annuler' : <><Plus size={20} /> Saisir des notes</>}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Matière</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {isAdding && (
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl mb-6 border border-slate-200 dark:border-slate-600">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Détails de l'évaluation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select
                  value={newGradeType}
                  onChange={(e) => setNewGradeType(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="Contrôle">Contrôle</option>
                  <option value="Devoir Maison">Devoir Maison</option>
                  <option value="Oral">Oral</option>
                  <option value="Examen">Examen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={newGradeDate}
                  onChange={(e) => setNewGradeDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Coefficient</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newGradeCoef}
                  onChange={(e) => setNewGradeCoef(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Élève</th>
                {isAdding ? (
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 w-48">Note / 20</th>
                ) : (
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Dernières notes</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Aucun élève dans cette classe.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {student.nom} {student.prenom}
                    </td>
                    <td className="px-6 py-4">
                      {isAdding ? (
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          placeholder="Ex: 15.5"
                          value={studentGrades[student.id] || ''}
                          onChange={(e) => setStudentGrades({...studentGrades, [student.id]: e.target.value})}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {grades.filter(g => g.student_id === student.id).map(grade => (
                            <div key={grade.id} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm group relative cursor-help">
                              <span className="font-bold text-slate-900 dark:text-white">{grade.value}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/20</span>
                              
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {grade.type} - {new Date(grade.date).toLocaleDateString('fr-FR')} (Coef: {grade.coefficient})
                              </div>
                            </div>
                          ))}
                          {grades.filter(g => g.student_id === student.id).length === 0 && (
                            <span className="text-sm text-slate-400 italic">Aucune note</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isAdding && students.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveGrades}
              disabled={submitting}
              className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer les notes</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
