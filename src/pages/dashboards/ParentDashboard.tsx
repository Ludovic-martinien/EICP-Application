import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Image as ImageIcon, CheckCircle, Users, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

import ParentProgression from './parent/ParentProgression';
import ParentMessages from './parent/ParentMessages';
import ParentFilClasse from './parent/ParentFilClasse';
import ParentPresences from './parent/ParentPresences';

function ParentOverview() {
  const { profile } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchChildren();
    }
  }, [profile]);

  const fetchChildren = async () => {
    try {
      const { data } = await supabase
        .from('parent_students')
        .select('student_id, profiles!parent_students_student_id_fkey(*)')
        .eq('parent_id', profile!.id);
      
      setChildren(data?.map(d => d.profiles) || []);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Espace Parent</h1>
          <p className="text-slate-500 dark:text-slate-400">Suivez la scolarité de vos enfants.</p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 hidden sm:block">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="text-brand-blue" />
          Mes Enfants
        </h2>
        {children.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">Aucun enfant n'est lié à votre compte pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {children.map(child => (
              <div key={child.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-lg">
                  {child.prenom[0]}{child.nom[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{child.prenom} {child.nom}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Élève</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="progression" className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-blue transition-colors group">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-900/20 w-fit mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Progression</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Suivre les notes et les points</p>
        </Link>
        
        <Link to="messages" className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-blue transition-colors group">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-900/20 w-fit mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Messages</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Contacter les enseignants</p>
        </Link>

        <Link to="fil-classe" className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-blue transition-colors group">
          <div className="p-3 rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-900/20 w-fit mb-4 group-hover:scale-110 transition-transform">
            <ImageIcon size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Fil de classe</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Voir les activités en classe</p>
        </Link>

        <Link to="presences" className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-blue transition-colors group">
          <div className="p-3 rounded-xl bg-green-50 text-green-500 dark:bg-green-900/20 w-fit mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle size={24} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Présences</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Consulter les absences/retards</p>
        </Link>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  return (
    <Routes>
      <Route index element={<ParentOverview />} />
      <Route path="progression" element={<ParentProgression />} />
      <Route path="messages" element={<ParentMessages />} />
      <Route path="fil-classe" element={<ParentFilClasse />} />
      <Route path="presences" element={<ParentPresences />} />
    </Routes>
  );
}
