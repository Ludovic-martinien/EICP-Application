import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { Star, Loader2 } from 'lucide-react';

export default function ElevePoints() {
  const { profile } = useAuth();
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchPoints();
      
      const channel = supabase.channel('student_points_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'student_points', filter: `student_id=eq.${profile.id}` }, () => fetchPoints())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const fetchPoints = async () => {
    try {
      const { data } = await supabase
        .from('student_points')
        .select('*, teacher:profiles!student_points_teacher_id_fkey(nom, prenom)')
        .eq('student_id', profile!.id)
        .order('created_at', { ascending: false });
      
      setPointsHistory(data || []);
      
      const total = (data || []).reduce((acc, curr) => {
        return curr.type === 'positif' ? acc + curr.points : acc - curr.points;
      }, 0);
      setTotalPoints(total);
    } catch (error) {
      console.error('Error fetching points:', error);
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="text-yellow-500" />
          Mes Points
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-slate-100 dark:border-slate-700 relative">
          <Star size={64} className="text-yellow-400 absolute opacity-20" />
          <span className={`text-5xl font-black relative z-10 ${totalPoints > 0 ? 'text-green-500' : totalPoints < 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
            {totalPoints > 0 ? '+' : ''}{totalPoints}
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Total des points</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Continuez vos efforts pour gagner plus de points !</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Historique</h2>
        {pointsHistory.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">Aucun point n'a encore été attribué.</p>
        ) : (
          <div className="space-y-3">
            {pointsHistory.map(history => (
              <div key={history.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${history.type === 'positif' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    <Star size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{history.description}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Par {history.teacher?.prenom} {history.teacher?.nom} • {new Date(history.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-bold ${history.type === 'positif' ? 'text-green-500' : 'text-red-500'}`}>
                    {history.type === 'positif' ? '+' : '-'}{history.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
