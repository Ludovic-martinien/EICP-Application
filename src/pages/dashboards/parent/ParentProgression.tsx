import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { TrendingUp, Loader2, Star, FileText } from 'lucide-react';

export default function ParentProgression() {
  const { profile } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [points, setPoints] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchChildren();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedChild) {
      fetchData();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const { data } = await supabase
        .from('parent_students')
        .select('student_id, profiles!parent_students_student_id_fkey(*)')
        .eq('parent_id', profile!.id);
      
      const childrenData = data?.map(d => d.profiles) || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: pointsData } = await supabase
        .from('student_points')
        .select('*, teacher:profiles!student_points_teacher_id_fkey(nom, prenom)')
        .eq('student_id', selectedChild.id)
        .order('created_at', { ascending: false });
      
      setPoints(pointsData || []);

      const { data: gradesData } = await supabase
        .from('grades')
        .select('*, subjects(name), teacher:profiles!grades_teacher_id_fkey(nom, prenom)')
        .eq('student_id', selectedChild.id)
        .order('date', { ascending: false });
      
      setGrades(gradesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && children.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  const totalPoints = points.reduce((acc, curr) => {
    return curr.type === 'positif' ? acc + curr.points : acc - curr.points;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="text-brand-blue" />
          Progression
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sélectionner un enfant</label>
        <select
          value={selectedChild?.id || ''}
          onChange={(e) => setSelectedChild(children.find(c => c.id === e.target.value))}
          className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
        >
          {children.map(c => (
            <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
          ))}
        </select>
      </div>

      {selectedChild && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Points */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="text-yellow-500" />
                Points Comportement
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${totalPoints > 0 ? 'bg-green-100 text-green-700' : totalPoints < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                Total: {totalPoints > 0 ? '+' : ''}{totalPoints}
              </span>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {points.length === 0 ? (
                <p className="text-center text-slate-500 py-4">Aucun point attribué.</p>
              ) : (
                points.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{p.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(p.created_at).toLocaleDateString('fr-FR')} • Par {p.teacher?.prenom} {p.teacher?.nom}
                      </p>
                    </div>
                    <span className={`font-bold ${p.type === 'positif' ? 'text-green-500' : 'text-red-500'}`}>
                      {p.type === 'positif' ? '+' : '-'}{p.points}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Grades */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="text-brand-blue" />
                Dernières Notes
              </h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {grades.length === 0 ? (
                <p className="text-center text-slate-500 py-4">Aucune note enregistrée.</p>
              ) : (
                grades.map(g => (
                  <div key={g.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{g.subjects?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(g.date).toLocaleDateString('fr-FR')} • {g.type}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">
                      {g.value}/20
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
