import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { FolderOpen, Loader2, Plus, Trash2, Upload, File as FileIcon, Image as ImageIcon } from 'lucide-react';

export default function ElevePortfolio() {
  const { profile } = useAuth();
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    file_url: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchPortfolio();
      
      const channel = supabase.channel('student_portfolio_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'student_portfolio', filter: `student_id=eq.${profile.id}` }, () => fetchPortfolio())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('student_portfolio')
        .select('*')
        .eq('student_id', profile!.id)
        .order('created_at', { ascending: false });
      
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('student_portfolio').insert([{
        student_id: profile!.id,
        title: newItem.title,
        description: newItem.description,
        file_url: newItem.file_url || null,
      }]);

      if (error) throw error;

      setIsAdding(false);
      setNewItem({ title: '', description: '', file_url: '' });
      fetchPortfolio();
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      alert('Erreur lors de l\'ajout au portfolio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    try {
      const { error } = await supabase.from('student_portfolio').delete().eq('id', id);
      if (error) throw error;
      fetchPortfolio();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Erreur lors de la suppression.');
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
          <FolderOpen className="text-brand-blue" />
          Mon Portfolio
        </h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Annuler' : <><Plus size={20} /> Ajouter un travail</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Ajouter au portfolio</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre</label>
              <input
                type="text"
                required
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Titre de votre travail"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Décrivez votre travail..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lien du fichier ou de l'image (Optionnel)</label>
              <input
                type="url"
                value={newItem.file_url}
                onChange={(e) => setNewItem({...newItem, file_url: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Upload size={18} /> Ajouter</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 dark:text-slate-400">
            Votre portfolio est vide. Ajoutez vos meilleurs travaux !
          </div>
        ) : (
          portfolioItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
              {item.file_url && (
                <div className="h-48 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  {item.file_url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                    <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileIcon size={48} className="text-slate-400" />
                  )}
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.title}</h3>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">{item.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                  {item.file_url && (
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue hover:underline">
                      Voir le fichier
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
