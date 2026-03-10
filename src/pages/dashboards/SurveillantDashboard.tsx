import React from 'react';
import { ClipboardList, Clock, Shield, UserX, AlertTriangle, Plus, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';
import SurveillantAbsences from './surveillant/SurveillantAbsences';
import SurveillantRetards from './surveillant/SurveillantRetards';
import SurveillantIncidents from './surveillant/SurveillantIncidents';
import SurveillantCantine from './surveillant/SurveillantCantine';

function SurveillantOverview() {
  const { profile } = useAuth();

  // Mock data
  const stats = [
    { label: 'Absences Aujourd\'hui', value: '12', icon: UserX, color: 'bg-red-500', textColor: 'text-red-500' },
    { label: 'Retards', value: '8', icon: Clock, color: 'bg-orange-500', textColor: 'text-orange-500' },
    { label: 'Incidents Signalés', value: '2', icon: Shield, color: 'bg-slate-700', textColor: 'text-slate-700 dark:text-slate-300' },
  ];

  const recentAbsences = [
    { id: 1, student: 'Léa Dubois', class: '3ème A', time: '08:00 - 12:00', reason: 'Maladie' },
    { id: 2, student: 'Paul Martin', class: '4ème B', time: '08:00 - 09:00', reason: 'Non justifié' },
    { id: 3, student: 'Emma Petit', class: '6ème C', time: '10:00 - 11:00', reason: 'Rendez-vous médical' },
  ];

  const incidents = [
    { id: 1, student: 'Hugo Bernard', class: '5ème A', type: 'Bavardage', date: '2025-03-08', status: 'En cours' },
    { id: 2, student: 'Chloé Richard', class: '3ème B', type: 'Retard répété', date: '2025-03-07', status: 'Traité' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bonjour, {profile?.prenom} !</h1>
          <p className="text-slate-500 dark:text-slate-400">Suivi de la vie scolaire.</p>
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
          
          {/* Recent Absences */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList size={20} className="text-brand-blue" />
                Dernières Absences
              </h2>
              <Link to="absences" className="text-sm text-brand-blue hover:underline">Voir tout</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentAbsences.map((absence) => (
                <div key={absence.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-sm">
                      {absence.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{absence.student} <span className="text-xs text-slate-500 dark:text-slate-400">({absence.class})</span></p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{absence.time} • {absence.reason}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-brand-blue p-2">
                    <AlertTriangle size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Incidents */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={20} className="text-red-500" />
                Incidents Récents
              </h2>
              <Link to="incidents" className="text-sm text-brand-blue hover:underline">Voir tout</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{incident.type}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{incident.student} ({incident.class}) • {new Date(incident.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    incident.status === 'En cours' 
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {incident.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saisie Rapide</h2>
            </div>
            <div className="p-4 space-y-3">
              <Link to="absences" className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 transition-colors group">
                <div className="flex items-center gap-3">
                  <UserX size={20} />
                  <span className="font-medium">Signaler une absence</span>
                </div>
                <Plus size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link to="retards" className="w-full flex items-center justify-between p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-400 transition-colors group">
                <div className="flex items-center gap-3">
                  <Clock size={20} />
                  <span className="font-medium">Signaler un retard</span>
                </div>
                <Plus size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link to="incidents" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <Shield size={20} />
                  <span className="font-medium">Rapport disciplinaire</span>
                </div>
                <Plus size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Student Search */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search size={20} className="text-blue-500" />
                Recherche Élève
              </h2>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Nom, prénom ou classe..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



export default function SurveillantDashboard() {
  return (
    <Routes>
      <Route index element={<SurveillantOverview />} />
      <Route path="absences" element={<SurveillantAbsences />} />
      <Route path="retards" element={<SurveillantRetards />} />
      <Route path="incidents" element={<SurveillantIncidents />} />
      <Route path="cantine" element={<SurveillantCantine />} />
    </Routes>
  );
}
