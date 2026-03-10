import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Users, Search, Loader2, Shield, Mail, Phone, GraduationCap } from 'lucide-react';
import { Profile } from '../../../types/auth';

export default function DirectriceUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUtilisateurs();

    // Real-time subscription for profiles
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUtilisateurs((prev) => [payload.new as Profile, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setUtilisateurs((prev) => prev.filter((u) => u.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setUtilisateurs((prev) => prev.map((u) => (u.id === payload.new.id ? (payload.new as Profile) : u)));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUtilisateurs(data || []);
    } catch (error) {
      console.error('Error fetching utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = utilisateurs.filter((user) => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="text-brand-blue" />
          Gestion des Utilisateurs
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
          >
            <option value="">Tous les rôles</option>
            <option value="eleve">Élèves</option>
            <option value="enseignant_maternelle">Enseignants Maternelle</option>
            <option value="enseignant_primaire">Enseignants Primaire</option>
            <option value="enseignant_college">Enseignants Collège</option>
            <option value="surveillant">Surveillants</option>
            <option value="secretaire">Secrétaires</option>
            <option value="comptable">Comptables</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-brand-blue" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Utilisateur</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Contact</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Rôle</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Informations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold">
                            {user.prenom[0]}{user.nom[0]}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{user.prenom} {user.nom}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            {user.email}
                          </div>
                          {user.telephone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-slate-400" />
                              {user.telephone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                          <Shield size={12} />
                          {user.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {user.niveau && (
                          <div className="flex items-center gap-2">
                            <GraduationCap size={14} className="text-slate-400" />
                            {user.niveau} {user.classe && `- ${user.classe}`}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
