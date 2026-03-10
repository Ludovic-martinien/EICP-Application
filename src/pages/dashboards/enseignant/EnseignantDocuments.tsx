import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { FileText, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';

export default function EnseignantDocuments() {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    file_url: '',
    class_id: '',
    subject_id: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchInitialData();

      const channel = supabase.channel('documents_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => fetchDocuments())
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

      if (classesList.length > 0) setNewDoc(prev => ({ ...prev, class_id: classesList[0].id }));
      if (subjectsData && subjectsData.length > 0) setNewDoc(prev => ({ ...prev, subject_id: subjectsData[0].id }));

      await fetchDocuments();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data } = await supabase
        .from('documents')
        .select('*, classes(name), subjects(name)')
        .eq('uploaded_by', profile!.id)
        .order('created_at', { ascending: false });
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('documents').insert([{
        ...newDoc,
        uploaded_by: profile!.id
      }]);

      if (error) throw error;

      alert('Document partagé avec succès !');
      setIsAdding(false);
      setNewDoc({ ...newDoc, title: '', description: '', file_url: '' });
      fetchDocuments();
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Erreur lors du partage du document.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Erreur lors de la suppression du document.');
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
          <FileText className="text-brand-blue" />
          Documents Partagés
        </h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Annuler' : <><Plus size={20} /> Nouveau Document</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Partager un document (Lien)</h2>
          <form onSubmit={handleAddDocument} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Ex: Support de cours - Chapitre 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lien URL (Google Drive, OneDrive, etc.)</label>
                <input
                  type="url"
                  required
                  value={newDoc.file_url}
                  onChange={(e) => setNewDoc({...newDoc, file_url: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Classe (Optionnel)</label>
                <select
                  value={newDoc.class_id}
                  onChange={(e) => setNewDoc({...newDoc, class_id: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="">Toutes les classes</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Matière (Optionnel)</label>
                <select
                  value={newDoc.subject_id}
                  onChange={(e) => setNewDoc({...newDoc, subject_id: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="">Général</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (optionnel)</label>
              <textarea
                rows={2}
                value={newDoc.description}
                onChange={(e) => setNewDoc({...newDoc, description: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Brève description du document..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Partager'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Document</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Cible</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    Aucun document partagé.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{doc.title}</p>
                          {doc.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 w-max">
                          {doc.classes?.name || 'Toutes les classes'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {doc.subjects?.name || 'Général'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                          title="Ouvrir le lien"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
