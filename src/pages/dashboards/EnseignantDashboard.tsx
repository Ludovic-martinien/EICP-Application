import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, Plus, Upload, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import EnseignantClasses from './enseignant/EnseignantClasses';
import EnseignantNotes from './enseignant/EnseignantNotes';
import EnseignantDevoirs from './enseignant/EnseignantDevoirs';
import EnseignantEmploiDuTemps from './enseignant/EnseignantEmploiDuTemps';
import EnseignantDocuments from './enseignant/EnseignantDocuments';
import EnseignantAnnonces from './enseignant/EnseignantAnnonces';
import EnseignantPoints from './enseignant/EnseignantPoints';
import EnseignantPresences from './enseignant/EnseignantPresences';
import EnseignantFilClasse from './enseignant/EnseignantFilClasse';
import EnseignantMessages from './enseignant/EnseignantMessages';

function EnseignantOverview() {
  const { profile } = useAuth();
  
  const [stats, setStats] = useState({
    classesCount: 0,
    studentsCount: 0,
    homeworkCount: 0,
  });
  
  const [recentHomeworks, setRecentHomeworks] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      fetchDashboardData();

      const channel = supabase.channel('dashboard_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'homework' }, () => fetchDashboardData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'grades' }, () => fetchDashboardData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule' }, () => fetchDashboardData())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch classes count
      const { data: scheduleClasses } = await supabase
        .from('schedule')
        .select('class_id')
        .eq('teacher_id', profile!.id);
      
      const { data: mainClasses } = await supabase
        .from('classes')
        .select('id')
        .eq('main_teacher_id', profile!.id);
        
      const uniqueClassIds = new Set([
        ...(scheduleClasses?.map(sc => sc.class_id) || []),
        ...(mainClasses?.map(mc => mc.id) || [])
      ]);
      
      // 2. Fetch students count
      let studentsCount = 0;
      if (uniqueClassIds.size > 0) {
        const { count } = await supabase
          .from('student_enrollments')
          .select('*', { count: 'exact', head: true })
          .in('class_id', Array.from(uniqueClassIds));
        studentsCount = count || 0;
      }

      // 3. Fetch homework count & recent homeworks
      const { data: homeworkData } = await supabase
        .from('homework')
        .select('*, classes(name), subjects(name)')
        .eq('teacher_id', profile!.id)
        .order('created_at', { ascending: false });
        
      // 4. Fetch recent grades
      const { data: gradesData } = await supabase
        .from('grades')
        .select('*, profiles!grades_student_id_fkey(nom, prenom), subjects(name)')
        .eq('teacher_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // 5. Fetch upcoming schedule (today)
      const todayDayOfWeek = new Date().getDay() || 7; // 1-7, where 1 is Monday
      const { data: scheduleData } = await supabase
        .from('schedule')
        .select('*, classes(name)')
        .eq('teacher_id', profile!.id)
        .eq('day_of_week', todayDayOfWeek)
        .order('start_time', { ascending: true });

      setStats({
        classesCount: uniqueClassIds.size,
        studentsCount,
        homeworkCount: homeworkData?.length || 0,
      });
      
      setRecentHomeworks(homeworkData?.slice(0, 3) || []);
      setRecentResults(gradesData || []);
      setUpcomingClasses(scheduleData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    { label: 'Mes Classes', value: stats.classesCount.toString(), icon: Users, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Total Élèves', value: stats.studentsCount.toString(), icon: Users, color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'Devoirs Publiés', value: stats.homeworkCount.toString(), icon: BookOpen, color: 'bg-purple-500', textColor: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bonjour, {profile?.prenom} !</h1>
          <p className="text-slate-500 dark:text-slate-400">Gérez vos classes et vos cours.</p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 hidden sm:block">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.color} bg-opacity-10 ${stat.textColor}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Homeworks */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-brand-blue" />
                Devoirs Récents
              </h2>
              <Link to="devoirs" className="text-sm text-brand-blue hover:underline">Voir tout</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentHomeworks.length === 0 ? (
                <div className="p-6 text-center text-slate-500">Aucun devoir publié.</div>
              ) : (
                recentHomeworks.map((hw) => {
                  const isPast = new Date(hw.due_date) < new Date(new Date().setHours(0,0,0,0));
                  return (
                    <div key={hw.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{hw.classes?.name}</span>
                          <p className="font-medium text-slate-900 dark:text-white">{hw.title}</p>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hw.subjects?.name} • Pour le {new Date(hw.due_date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isPast 
                          ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      }`}>
                        {isPast ? 'Terminé' : 'En cours'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Student Results */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-green-500" />
                Dernières Notes Saisies
              </h2>
              <Link to="notes" className="text-sm text-brand-blue hover:underline">Saisir des notes</Link>
            </div>
            <div className="p-4">
              {recentResults.length === 0 ? (
                <div className="text-center text-slate-500 py-4">Aucune note saisie.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                      <th className="pb-3 font-medium">Élève</th>
                      <th className="pb-3 font-medium">Matière</th>
                      <th className="pb-3 font-medium">Évaluation</th>
                      <th className="pb-3 font-medium text-right">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {recentResults.map((result) => (
                      <tr key={result.id}>
                        <td className="py-3 font-medium text-slate-900 dark:text-white">{result.profiles?.nom} {result.profiles?.prenom}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{result.subjects?.name}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{result.type}</td>
                        <td className="py-3 text-right font-bold text-slate-900 dark:text-white">{result.value}/20</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Actions Rapides</h2>
            </div>
            <div className="p-4 grid grid-cols-1 gap-3">
              <Link to="notes" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-brand-blue/10 hover:text-brand-blue transition-colors w-full text-left">
                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-brand-blue dark:text-blue-300">
                  <Plus size={20} />
                </div>
                <span className="font-medium text-sm">Ajouter une note</span>
              </Link>
              <Link to="devoirs" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-brand-blue/10 hover:text-brand-blue transition-colors w-full text-left">
                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-purple-500 dark:text-purple-300">
                  <BookOpen size={20} />
                </div>
                <span className="font-medium text-sm">Publier un devoir</span>
              </Link>
              <Link to="documents" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-brand-blue/10 hover:text-brand-blue transition-colors w-full text-left">
                <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-orange-500 dark:text-orange-300">
                  <Upload size={20} />
                </div>
                <span className="font-medium text-sm">Partager un document</span>
              </Link>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-blue-500" />
                Cours d'aujourd'hui
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {upcomingClasses.length === 0 ? (
                <div className="text-center text-slate-500 py-4">Aucun cours prévu aujourd'hui.</div>
              ) : (
                upcomingClasses.map((course, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="text-center min-w-[60px]">
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{course.start_time.substring(0, 5)}</span>
                      <span className="block text-xs text-slate-400 dark:text-slate-500">{course.end_time.substring(0, 5)}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{course.classes?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{course.room || 'Salle non définie'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function EnseignantDashboard() {
  return (
    <Routes>
      <Route index element={<EnseignantOverview />} />
      <Route path="classes" element={<EnseignantClasses />} />
      <Route path="notes" element={<EnseignantNotes />} />
      <Route path="devoirs" element={<EnseignantDevoirs />} />
      <Route path="emploi-du-temps" element={<EnseignantEmploiDuTemps />} />
      <Route path="documents" element={<EnseignantDocuments />} />
      <Route path="annonces" element={<EnseignantAnnonces />} />
      <Route path="points" element={<EnseignantPoints />} />
      <Route path="presences" element={<EnseignantPresences />} />
      <Route path="fil-classe" element={<EnseignantFilClasse />} />
      <Route path="messages" element={<EnseignantMessages />} />
    </Routes>
  );
}
