import React from 'react';
import { FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function EleveNotes() {
  const grades = [
    { id: 1, subject: 'Mathématiques', value: 16, coefficient: 2, type: 'Contrôle', date: '2025-03-05', comment: 'Très bon travail' },
    { id: 2, subject: 'Français', value: 13, coefficient: 1, type: 'DM', date: '2025-03-03', comment: 'Attention à l\'orthographe' },
    { id: 3, subject: 'Histoire-Géo', value: 15, coefficient: 2, type: 'Contrôle', date: '2025-02-28', comment: 'Bonne analyse' },
    { id: 4, subject: 'Anglais', value: 14, coefficient: 1, type: 'Oral', date: '2025-02-25', comment: 'Participation active' },
    { id: 5, subject: 'Physique-Chimie', value: 12, coefficient: 2, type: 'TP', date: '2025-02-20', comment: 'Résultats corrects' },
  ];

  const average = grades.reduce((acc, curr) => acc + curr.value * curr.coefficient, 0) / grades.reduce((acc, curr) => acc + curr.coefficient, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mes Notes</h1>
        <div className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-xl flex items-center gap-2">
          <TrendingUp size={20} />
          <span className="font-bold text-lg">{average.toFixed(2)}/20</span>
          <span className="text-sm font-normal">Moyenne Générale</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText size={20} className="text-brand-blue" />
            Détail des notes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Matière</th>
                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Type</th>
                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-center">Coeff.</th>
                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-right">Note</th>
                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Appréciation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {grades.map((grade) => (
                <motion.tr 
                  key={grade.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{grade.subject}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                      {grade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(grade.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-center">{grade.coefficient}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${
                      grade.value >= 15 ? 'text-green-500' :
                      grade.value >= 10 ? 'text-brand-blue' :
                      'text-red-500'
                    }`}>
                      {grade.value}/20
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 italic text-xs">{grade.comment}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" />
            Points à améliorer
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>
              Physique-Chimie : Revoir les formules de base.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>
              Français : Attention aux accords du participe passé.
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-500" />
            Points forts
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></span>
              Mathématiques : Excellente compréhension des concepts.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></span>
              Histoire-Géo : Très bonne capacité d'analyse.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
