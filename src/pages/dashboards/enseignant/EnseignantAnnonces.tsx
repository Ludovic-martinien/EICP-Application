import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { Bell, Loader2, Plus, Trash2, Users } from 'lucide-react';

export default function EnseignantAnnonces() {
  const { profile } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    target_role: 'eleve',
    target_class_id: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchInitialData();

      const channel = supabase.channel('announcements_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => fetchAnnouncements())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const fetchInitialData = async () => {
    try {
      // Fetch classes for targeting
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

      await fetchAnnouncements();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data } = await supabase
        .from('announcements')
        .select('*, author:profiles!announcements_author_id_fkey(nom, prenom), classes(name)')
        .order('created_at', { ascending: false });
      
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('announcements').insert([{
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        target_role: newAnnouncement.target_role,
        target_class_id: newAnnouncement.target_class_id || null,
        author_id: profile!.id
      }]);

      if (error) throw error;

      alert('Annonce publiée avec succès !');
      setIsAdding(false);
      setNewAnnouncement({ ...newAnnouncement, title: '', content: '' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Erreur lors de la publication de l\'annonce.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Erreur lors de la suppression de l\'annonce.');
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
          <Bell className="text-brand-blue" />
          Annonces
        </h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Annuler' : <><Plus size={20} /> Nouvelle Annonce</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Publier une annonce</h2>
          <form onSubmit={handleAddAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre</label>
              <input
                type="text"
                required
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Titre de l'annonce"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destinataires</label>
                <select
                  value={newAnnouncement.target_role}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, target_role: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="tous">Tous les utilisateurs</option>
                  <option value="eleve">Élèves uniquement</option>
                  <option value="enseignant">Enseignants uniquement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Classe spécifique (Optionnel)</label>
                <select
                  value={newAnnouncement.target_class_id}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, target_class_id: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="">Toutes les classes</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contenu</label>
              <textarea
                required
                rows={4}
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Message de l'annonce..."
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

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 dark:text-slate-400">
            Aucune annonce pour le moment.
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{announcement.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <span>Par {announcement.author?.prenom} {announcement.author?.nom}</span>
                      <span>•</span>
                      <span>{new Date(announcement.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                {announcement.author_id === profile?.id && (
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Cible: {announcement.target_role === 'tous' ? 'Tous' : announcement.target_role === 'eleve' ? 'Élèves' : 'Enseignants'}
                </span>
                {announcement.classes && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    Classe: {announcement.classes.name}
                  </span>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <p className="whitespace-pre-wrap">{announcement.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
