import React from 'react';
import { Users, BookOpen, FileText, Plus, Upload, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';

function EnseignantOverview() {
  const { profile } = useAuth();

  // Mock data
  const stats = [
    { label: 'Mes Classes', value: '4', icon: Users, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Total Élèves', value: '128', icon: Users, color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'Devoirs Publiés', value: '12', icon: BookOpen, color: 'bg-purple-500', textColor: 'text-purple-500' },
  ];

  const recentHomeworks = [
    { id: 1, class: '3ème A', subject: 'Mathématiques', title: 'Fonctions affines', date: '2025-03-08', status: 'published' },
    { id: 2, class: '4ème B', subject: 'Mathématiques', title: 'Théorème de Pythagore', date: '2025-03-07', status: 'draft' },
    { id: 3, class: '6ème C', subject: 'Mathématiques', title: 'Nombres décimaux', date: '2025-03-05', status: 'published' },
  ];

  const recentResults = [
    { id: 1, student: 'Thomas Martin', class: '3ème A', grade: '18/20', subject: 'Contrôle #3' },
    { id: 2, student: 'Sophie Bernard', class: '3ème A', grade: '14/20', subject: 'Contrôle #3' },
    { id: 3, student: 'Lucas Petit', class: '4ème B', grade: '12/20', subject: 'DM #2' },
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
        {stats.map((stat, index) => (
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
              {recentHomeworks.map((hw) => (
                <div key={hw.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{hw.class}</span>
                      <p className="font-medium text-slate-900 dark:text-white">{hw.title}</p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hw.subject} • Publié le {new Date(hw.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    hw.status === 'published' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {hw.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Student Results */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-green-500" />
                Derniers Résultats
              </h2>
              <Link to="notes" className="text-sm text-brand-blue hover:underline">Saisir des notes</Link>
            </div>
            <div className="p-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    <th className="pb-3 font-medium">Élève</th>
                    <th className="pb-3 font-medium">Classe</th>
                    <th className="pb-3 font-medium">Devoir</th>
                    <th className="pb-3 font-medium text-right">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {recentResults.map((result) => (
                    <tr key={result.id}>
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{result.student}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{result.class}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{result.subject}</td>
                      <td className="py-3 text-right font-bold text-slate-900 dark:text-white">{result.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                Prochains Cours
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { time: '08:00 - 09:00', class: '3ème A', room: 'Salle 204' },
                { time: '09:00 - 10:00', class: '4ème B', room: 'Salle 204' },
                { time: '10:00 - 11:00', class: '6ème C', room: 'Salle 204' },
              ].map((course, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-center min-w-[60px]">
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{course.time.split(' - ')[0]}</span>
                    <span className="block text-xs text-slate-400 dark:text-slate-500">{course.time.split(' - ')[1]}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{course.class}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{course.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function EnseignantClasses() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mes Classes</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Liste des classes...</p>
      </div>
    </div>
  );
}

function EnseignantNotes() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion des Notes</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Saisie et consultation des notes...</p>
      </div>
    </div>
  );
}

function EnseignantDevoirs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion des Devoirs</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Création et suivi des devoirs...</p>
      </div>
    </div>
  );
}

function EnseignantEmploiDuTemps() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Emploi du temps</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Planning hebdomadaire...</p>
      </div>
    </div>
  );
}

function EnseignantDocuments() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Partage de documents...</p>
      </div>
    </div>
  );
}

function EnseignantAnnonces() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Annonces</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Annonces pour les élèves et parents...</p>
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
    </Routes>
  );
}
