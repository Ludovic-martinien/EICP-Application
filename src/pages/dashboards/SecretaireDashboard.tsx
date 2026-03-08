import React from 'react';
import { UserPlus, FileText, Users, Clock, CheckCircle, XCircle, Search, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';

function SecretaireOverview() {
  const { profile } = useAuth();

  // Mock data
  const stats = [
    { label: 'Demandes d\'inscription', value: '24', icon: UserPlus, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Dossiers en attente', value: '8', icon: Clock, color: 'bg-orange-500', textColor: 'text-orange-500' },
    { label: 'Total Élèves', value: '450', icon: Users, color: 'bg-green-500', textColor: 'text-green-500' },
  ];

  const recentRegistrations = [
    { id: 1, name: 'Alice Martin', grade: '6ème', date: '2025-03-08', status: 'pending' },
    { id: 2, name: 'Lucas Bernard', grade: '5ème', date: '2025-03-07', status: 'approved' },
    { id: 3, name: 'Emma Petit', grade: '3ème', date: '2025-03-06', status: 'rejected' },
  ];

  const pendingFiles = [
    { id: 1, student: 'Hugo Dubois', class: '4ème B', missing: 'Certificat médical' },
    { id: 2, student: 'Chloé Richard', class: '3ème A', missing: 'Photo d\'identité' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bonjour, {profile?.prenom} !</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestion administrative de l'établissement.</p>
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
          
          {/* Recent Registrations */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus size={20} className="text-brand-blue" />
                Dernières Inscriptions
              </h2>
              <Link to="inscriptions" className="text-sm text-brand-blue hover:underline">Voir tout</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentRegistrations.map((reg) => (
                <div key={reg.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-sm">
                      {reg.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{reg.name} <span className="text-xs text-slate-500 dark:text-slate-400">({reg.grade})</span></p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Demande du {new Date(reg.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reg.status === 'pending' && (
                      <>
                        <button className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Valider">
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Refuser">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reg.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      reg.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {reg.status === 'pending' ? 'En attente' : reg.status === 'approved' ? 'Validé' : 'Refusé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Files */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-orange-500" />
                Dossiers Incomplets
              </h2>
              <Link to="dossiers" className="text-sm text-brand-blue hover:underline">Relancer</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {pendingFiles.map((file) => (
                <div key={file.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{file.student} <span className="text-xs text-slate-500 dark:text-slate-400">({file.class})</span></p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">Manquant : {file.missing}</p>
                  </div>
                  <button className="text-sm text-brand-blue border border-brand-blue px-3 py-1 rounded-lg hover:bg-brand-blue hover:text-white transition-colors">
                    Contacter
                  </button>
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Actions Rapides</h2>
            </div>
            <div className="p-4 space-y-3">
              <Link to="inscriptions" className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 transition-colors group">
                <div className="flex items-center gap-3">
                  <UserPlus size={20} />
                  <span className="font-medium">Nouvelle inscription</span>
                </div>
                <Plus size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link to="dossiers" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText size={20} />
                  <span className="font-medium">Créer un dossier</span>
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

function SecretaireInscriptions() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inscriptions</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Gestion des inscriptions...</p>
      </div>
    </div>
  );
}

function SecretaireEleves() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Liste des Élèves</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Annuaire des élèves...</p>
      </div>
    </div>
  );
}

function SecretaireDossiers() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dossiers Administratifs</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Suivi des dossiers...</p>
      </div>
    </div>
  );
}

function SecretaireDocuments() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Génération de documents...</p>
      </div>
    </div>
  );
}

export default function SecretaireDashboard() {
  return (
    <Routes>
      <Route index element={<SecretaireOverview />} />
      <Route path="inscriptions" element={<SecretaireInscriptions />} />
      <Route path="eleves" element={<SecretaireEleves />} />
      <Route path="dossiers" element={<SecretaireDossiers />} />
      <Route path="documents" element={<SecretaireDocuments />} />
    </Routes>
  );
}
