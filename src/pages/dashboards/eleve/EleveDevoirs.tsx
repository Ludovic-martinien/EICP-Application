import React from 'react';
import { BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function EleveDevoirs() {
  const homeworks = [
    { id: 1, subject: 'Mathématiques', title: 'Exercices Algèbre', description: 'Faire les exercices 1 à 5 page 42.', dueDate: '2025-03-10', status: 'pending' },
    { id: 2, subject: 'Français', title: 'Dissertation', description: 'Sujet : Le romantisme au XIXe siècle.', dueDate: '2025-03-12', status: 'pending' },
    { id: 3, subject: 'Histoire', title: 'Révision Chapitre 4', description: 'Préparer le contrôle sur la Révolution Industrielle.', dueDate: '2025-03-15', status: 'completed' },
    { id: 4, subject: 'SVT', title: 'Schéma Bilan', description: 'Compléter le schéma sur la circulation sanguine.', dueDate: '2025-03-08', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mes Devoirs</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-sm font-medium flex items-center gap-1">
            <Clock size={16} />
            2 à faire
          </span>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium flex items-center gap-1">
            <CheckCircle size={16} />
            2 terminés
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homeworks.map((hw, index) => (
          <motion.div
            key={hw.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border ${
              hw.status === 'pending' 
                ? 'border-orange-200 dark:border-orange-900/50' 
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{hw.subject}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{hw.title}</h3>
              </div>
              <div className={`p-2 rounded-full ${
                hw.status === 'pending' 
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' 
                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {hw.status === 'pending' ? <Clock size={20} /> : <CheckCircle size={20} />}
              </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 min-h-[3rem]">
              {hw.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <AlertCircle size={16} />
                <span>Pour le {new Date(hw.dueDate).toLocaleDateString('fr-FR')}</span>
              </div>
              
              {hw.status === 'pending' && (
                <button className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                  Marquer comme fait
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
