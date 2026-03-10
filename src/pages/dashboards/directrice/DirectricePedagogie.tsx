import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { BookOpen, Plus, Loader2, Users, GraduationCap, Trash2 } from 'lucide-react';
import { Profile } from '../../../types/auth';

interface Classe {
  id: number;
  nom: string;
  niveau: string;
  professeur_principal_id: string | null;
  professeur?: Profile;
}

export default function DirectricePedagogie() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [enseignants, setEnseignants] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [nom, setNom] = useState('');
  const [niveau, setNiveau] = useState('');
  const [professeurId, setProfesseurId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch enseignants
      const { data: profsData, error: profsError } = await supabase
        .from('profiles')
        .select('*')
        .like('role', 'enseignant_%');
      
      if (profsError) throw profsError;
      setEnseignants(profsData || []);

      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select(`
          *,
          professeur:profiles!professeur_principal_id(*)
        `)
        .order('niveau', { ascending: true })
        .order('nom', { ascending: true });

      if (classesError) throw classesError;
      setClasses(classesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('classes').insert([
        {
          nom,
          niveau,
          professeur_principal_id: professeurId || null,
        },
      ]);

      if (error) throw error;

      // Reset form and refresh
      setNom('');
      setNiveau('');
      setProfesseurId('');
      setIsAdding(false);
      fetchData();
    } catch (error) {
      console.error('Error adding classe:', error);
      alert('Erreur lors de l\'ajout de la classe.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette classe ?')) return;

    try {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting classe:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-brand-blue" />
          Gestion Pédagogique
        </h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Fermer' : <><Plus size={20} /> Nouvelle Classe</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Créer une classe</h2>
          <form onSubmit={handleAddClasse} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Niveau</label>
              <select
                required
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
              >
                <option value="">Sélectionner...</option>
                <option value="Maternelle">Maternelle</option>
                <option value="Primaire">Primaire</option>
                <option value="Collège">Collège</option>
                <option value="Lycée">Lycée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom de la classe</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Ex: 6ème A, CP B..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Professeur Principal</label>
              <select
                value={professeurId}
                onChange={(e) => setProfesseurId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
              >
                <option value="">Aucun (Optionnel)</option>
                {enseignants.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.prenom} {prof.nom} ({prof.specialite || 'Général'})
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Enregistrer la classe'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Classes de l'établissement</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gérez les classes et assignez les professeurs principaux.</p>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-brand-blue" size={32} />
          </div>
        ) : classes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            Aucune classe n'a encore été créée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Niveau</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Classe</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Professeur Principal</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {classes.map((classe) => (
                  <tr key={classe.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-brand-blue/10 text-brand-blue">
                        <GraduationCap size={14} />
                        {classe.niveau}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {classe.nom}
                    </td>
                    <td className="px-6 py-4">
                      {classe.professeur ? (
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <Users size={16} className="text-slate-400" />
                          {classe.professeur.prenom} {classe.professeur.nom}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(classe.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2"
                        title="Supprimer la classe"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
