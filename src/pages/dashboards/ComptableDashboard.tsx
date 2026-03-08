import React from 'react';
import { DollarSign, CreditCard, FileText, TrendingUp, AlertCircle, Plus, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link } from 'react-router-dom';

function ComptableOverview() {
  const { profile } = useAuth();

  // Mock data
  const stats = [
    { label: 'Paiements Aujourd\'hui', value: '1,250 €', icon: DollarSign, color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'Total Mensuel', value: '45,000 €', icon: TrendingUp, color: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: 'Élèves Débiteurs', value: '15', icon: AlertCircle, color: 'bg-red-500', textColor: 'text-red-500' },
  ];

  const recentPayments = [
    { id: 1, student: 'Thomas Martin', class: '3ème A', amount: '450 €', date: '2025-03-08', type: 'Scolarité T2' },
    { id: 2, student: 'Sophie Bernard', class: '6ème B', amount: '120 €', date: '2025-03-08', type: 'Cantine' },
    { id: 3, student: 'Lucas Petit', class: '5ème C', amount: '50 €', date: '2025-03-07', type: 'Sortie scolaire' },
  ];

  const unpaidFees = [
    { id: 1, student: 'Hugo Dubois', class: '4ème B', amount: '450 €', due: '2025-03-01' },
    { id: 2, student: 'Chloé Richard', class: '3ème A', amount: '120 €', due: '2025-02-28' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bonjour, {profile?.prenom} !</h1>
          <p className="text-slate-500 dark:text-slate-400">Suivi financier de l'établissement.</p>
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
          
          {/* Recent Payments */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard size={20} className="text-brand-blue" />
                Derniers Paiements
              </h2>
              <Link to="paiements" className="text-sm text-brand-blue hover:underline">Voir tout</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{payment.student} <span className="text-xs text-slate-500 dark:text-slate-400">({payment.class})</span></p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{payment.type} • {new Date(payment.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{payment.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unpaid Fees */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" />
                Impayés
              </h2>
              <Link to="impayes" className="text-sm text-brand-blue hover:underline">Relancer tout</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {unpaidFees.map((fee) => (
                <div key={fee.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{fee.student} <span className="text-xs text-slate-500 dark:text-slate-400">({fee.class})</span></p>
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">Échéance : {new Date(fee.due).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 dark:text-red-400">{fee.amount}</p>
                    <button className="text-xs text-brand-blue hover:underline mt-1">Envoyer rappel</button>
                  </div>
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
              <Link to="paiements" className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 transition-colors group">
                <div className="flex items-center gap-3">
                  <DollarSign size={20} />
                  <span className="font-medium">Enregistrer un paiement</span>
                </div>
                <Plus size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link to="recus" className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <FileText size={20} />
                  <span className="font-medium">Générer un reçu</span>
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

function ComptablePaiements() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Paiements</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Historique des paiements...</p>
      </div>
    </div>
  );
}

function ComptableImpayes() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Impayés</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Suivi des impayés...</p>
      </div>
    </div>
  );
}

function ComptableRecus() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reçus et Factures</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Génération de documents financiers...</p>
      </div>
    </div>
  );
}

function ComptableSalaires() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Salaires</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Gestion des salaires...</p>
      </div>
    </div>
  );
}

function ComptableDepenses() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dépenses</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <p className="text-slate-500 dark:text-slate-400">Suivi des dépenses...</p>
      </div>
    </div>
  );
}

export default function ComptableDashboard() {
  return (
    <Routes>
      <Route index element={<ComptableOverview />} />
      <Route path="paiements" element={<ComptablePaiements />} />
      <Route path="impayes" element={<ComptableImpayes />} />
      <Route path="recus" element={<ComptableRecus />} />
      <Route path="salaires" element={<ComptableSalaires />} />
      <Route path="depenses" element={<ComptableDepenses />} />
    </Routes>
  );
}
