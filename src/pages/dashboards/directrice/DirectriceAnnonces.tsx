import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { Megaphone, Plus, Trash2, Loader2 } from 'lucide-react';

interface Annonce {
  id: number;
  titre: string;
  contenu: string;
  auteur_id: string;
  role_cible: string | null;
  date_publication: string;
}

export default function DirectriceAnnonces() {
  const { profile } = useAuth();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [roleCible, setRoleCible] = useState('');

  useEffect(() => {
    fetchAnnonces();

    // Real-time subscription
    const channel = supabase
      .channel('public:annonces')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'annonces' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setAnnonces((prev) => [payload.new as Annonce, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setAnnonces((prev) => prev.filter((a) => a.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setAnnonces((prev) => prev.map((a) => (a.id === payload.new.id ? (payload.new as Annonce) : a)));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnnonces = async () => {
    try {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .order('date_publication', { ascending: false });

      if (error) throw error;
      setAnnonces(data || []);
    } catch (error) {
      console.error('Error fetching annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnonce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from('annonces').insert([
        {
          titre,
          contenu,
          auteur_id: profile.id,
          role_cible: roleCible || null,
        },
      ]);

      if (error) throw error;

      // Reset form
      setTitre('');
      setContenu('');
      setRoleCible('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding annonce:', error);
      alert('Erreur lors de l\'ajout de l\'annonce.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;

    try {
      const { error } = await supabase.from('annonces').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting annonce:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Megaphone className="text-brand-blue" />
          Gestion des Annonces
        </h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Fermer' : <><Plus size={20} /> Nouvelle Annonce</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Créer une annonce</h2>
          <form onSubmit={handleAddAnnonce} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre</label>
              <input
                type="text"
                required
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Titre de l'annonce"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contenu</label>
              <textarea
                required
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                placeholder="Contenu du message..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cible (Optionnel)</label>
              <select
                value={roleCible}
                onChange={(e) => setRoleCible(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
              >
                <option value="">Tous les utilisateurs</option>
                <option value="eleve">Élèves uniquement</option>
                <option value="enseignant_maternelle">Enseignants Maternelle</option>
                <option value="enseignant_primaire">Enseignants Primaire</option>
                <option value="enseignant_college">Enseignants Collège</option>
                <option value="surveillant">Surveillants</option>
              </select>
            </div>
            <div className="flex justify-end pt-2">
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

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="animate-spin text-brand-blue" size={32} />
          </div>
        ) : annonces.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            Aucune annonce publiée pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {annonces.map((annonce) => (
              <div key={annonce.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{annonce.titre}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                      <span>{new Date(annonce.date_publication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {annonce.role_cible && (
                        <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-md text-xs font-medium">
                          Cible: {annonce.role_cible.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(annonce.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mt-3">{annonce.contenu}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
