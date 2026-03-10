import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { BookOpen, Loader2, Plus, Trash2 } from 'lucide-react';

export default function EnseignantDevoirs() {
  const { profile } = useAuth();
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    class_id: '',
    subject_id: '',
    due_date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchInitialData();

      const channel = supabase.channel('homework_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'homework' }, () => fetchHomework())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const fetchInitialData = async () => {
    try {
      // Fetch classes
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

      // Fetch subjects
      const { data: subjectsData } = await supabase.from('subjects').select('*');
      setSubjects(subjectsData || []);

      if (classesList.length > 0) setNewHomework(prev => ({ ...prev, class_id: classesList[0].id }));
      if (subjectsData && subjectsData.length > 0) setNewHomework(prev => ({ ...prev, subject_id: subjectsData[0].id }));

      await fetchHomework();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomework = async () => {
    try {
      const { data } = await supabase
        .from('homework')
        .select('*, classes(name), subjects(name)')
        .eq('teacher_id', profile!.id)
        .order('due_date', { ascending: true });
      
      setHomeworks(data || []);
    } catch (error) {
      console.error('Error fetching homework:', error);
    }
  };

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('homework').insert([{
        ...newHomework,
        teacher_id: profile!.id
      }]);

      if (error) throw error;

      alert('Devoir publié avec succès !');
      setIsAdding(false);
      setNewHomework({ ...newHomework, title: '', description: '' });
      fetchHomework();
    } catch (error) {
      console.error('Error adding homework:', error);
      alert('Erreur lors de la publication du devoir.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHomework = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) return;
    try {
      const { error } = await supabase.from('homework').delete().eq('id', id);
      if (error) throw error;
      fetchHomework();
    } catch (error) {
      console.error('Error deleting homework:', error);
      alert('Erreur lors de la suppression du devoir.');
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
          <BookOpen className="text-brand-blue" />
          Gestion des Devoirs
        </h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Annuler' : <><Plus size={20} /> Nouveau Devoir</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Publier un nouveau devoir</h2>
          <form onSubmit={handleAddHomework} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={newHomework.title}
                  onChange={(e) => setNewHomework({...newHomework, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Ex: Exercices 1 à 5 page 42"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date limite</label>
                <input
                  type="date"
                  required
                  value={newHomework.due_date}
                  onChange={(e) => setNewHomework({...newHomework, due_date: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Classe</label>
                <select
                  required
                  value={newHomework.class_id}
                  onChange={(e) => setNewHomework({...newHomework, class_id: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Matière</label>
                <select
                  required
                  value={newHomework.subject_id}
                  onChange={(e) => setNewHomework({...newHomework, subject_id: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (optionnel)</label>
              <textarea
                rows={3}
                value={newHomework.description}
                onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Détails supplémentaires..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Publier'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworks.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 dark:text-slate-400">
            Aucun devoir publié.
          </div>
        ) : (
          homeworks.map((hw) => {
            const isPast = new Date(hw.due_date) < new Date(new Date().setHours(0,0,0,0));
            return (
              <div key={hw.id} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border ${isPast ? 'border-slate-200 dark:border-slate-700 opacity-75' : 'border-brand-blue/30 dark:border-brand-blue/30'} p-6 flex flex-col`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded mb-2">
                      {hw.classes?.name}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{hw.title}</h3>
                    <p className="text-sm text-brand-blue mt-1">{hw.subjects?.name}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteHomework(hw.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {hw.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow line-clamp-3">
                    {hw.description}
                  </p>
                )}
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Pour le {new Date(hw.due_date).toLocaleDateString('fr-FR')}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    isPast 
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {isPast ? 'Terminé' : 'En cours'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
