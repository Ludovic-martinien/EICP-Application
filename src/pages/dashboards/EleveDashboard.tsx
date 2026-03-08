import React from 'react';
import { BookOpen, FileText, Megaphone, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';
import EleveNotes from './eleve/EleveNotes';
import EleveDevoirs from './eleve/EleveDevoirs';
import EleveEmploiDuTemps from './eleve/EleveEmploiDuTemps';
import EleveDocuments from './eleve/EleveDocuments';
import EleveAnnonces from './eleve/EleveAnnonces';

function EleveOverview() {
  const { profile } = useAuth();

  // Mock data
  const stats = [
    { label: 'Moyenne Générale', value: '14.5/20', icon: FileText, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Devoirs à faire', value: '3', icon: BookOpen, color: 'bg-orange-500', textColor: 'text-orange-500' },
    { label: 'Annonces non lues', value: '2', icon: Megaphone, color: 'bg-purple-500', textColor: 'text-purple-500' },
  ];

  const recentHomework = [
    { id: 1, subject: 'Mathématiques', title: 'Exercices Algèbre', dueDate: '2025-03-10', status: 'pending' },
    { id: 2, subject: 'Français', title: 'Dissertation', dueDate: '2025-03-12', status: 'pending' },
    { id: 3, subject: 'Histoire', title: 'Révision Chapitre 4', dueDate: '2025-03-15', status: 'completed' },
    { id: 4, subject: 'SVT', title: 'Schéma Bilan', dueDate: '2025-03-08', status: 'completed' },
  ];

  const recentGrades = [
    { id: 1, subject: 'Physique', value: '16/20', date: '2025-03-05' },
    { id: 2, subject: 'Anglais', value: '13/20', date: '2025-03-03' },
    { id: 3, subject: 'SVT', value: '15/20', date: '2025-02-28' },
  ];

  const announcements = [
    { id: 1, title: 'Réunion parents-profs', date: '2025-03-01', content: 'La réunion aura lieu le...' },
    { id: 2, title: 'Sortie scolaire', date: '2025-02-25', content: 'N\'oubliez pas de signer...' },
    { id: 3, title: 'Menu de la cantine', date: '2025-02-20', content: 'Le menu de la semaine prochaine...' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bonjour, {profile?.prenom} !</h1>
          <p className="text-slate-500 dark:text-slate-400">Voici un aperçu de votre activité scolaire.</p>
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
          
          {/* Recent Homework */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-brand-blue" />
                Devoirs à faire
              </h2>
              <Link to="devoirs" className="text-sm text-brand-blue hover:underline">Tout voir</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentHomework.map((hw) => (
                <div key={hw.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${hw.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{hw.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{hw.subject} • Pour le {new Date(hw.dueDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    hw.status === 'pending' 
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {hw.status === 'pending' ? 'À faire' : 'Fait'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-green-500" />
                Dernières notes
              </h2>
              <Link to="notes" className="text-sm text-brand-blue hover:underline">Toutes les notes</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{grade.subject}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{grade.value}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(grade.date).toLocaleDateString('fr-FR')}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Announcements */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone size={20} className="text-purple-500" />
                Annonces
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{announcement.title}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(announcement.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{announcement.content}</p>
                </div>
              ))}
              <Link to="annonces" className="block w-full py-2 text-sm text-center text-slate-500 hover:text-brand-blue transition-colors">
                Voir toutes les annonces
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Actions Rapides</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <Link to="documents" className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-brand-blue/10 hover:text-brand-blue transition-colors gap-2">
                <Download size={24} />
                <span className="text-xs font-medium">Documents</span>
              </Link>
              <Link to="emploi-du-temps" className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-brand-blue/10 hover:text-brand-blue transition-colors gap-2">
                <Clock size={24} />
                <span className="text-xs font-medium">Emploi du temps</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function EleveDashboard() {
  return (
    <Routes>
      <Route index element={<EleveOverview />} />
      <Route path="notes" element={<EleveNotes />} />
      <Route path="devoirs" element={<EleveDevoirs />} />
      <Route path="emploi-du-temps" element={<EleveEmploiDuTemps />} />
      <Route path="documents" element={<EleveDocuments />} />
      <Route path="annonces" element={<EleveAnnonces />} />
    </Routes>
  );
}
