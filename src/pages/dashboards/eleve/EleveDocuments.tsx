import React from 'react';
import { File, Download, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function EleveDocuments() {
  const documents = [
    { id: 1, title: 'Bulletin Trimestre 1', type: 'Bulletin', date: '2025-01-15', size: '1.2 MB' },
    { id: 2, title: 'Certificat de Scolarité', type: 'Administratif', date: '2024-09-01', size: '0.5 MB' },
    { id: 3, title: 'Règlement Intérieur', type: 'Administratif', date: '2024-09-01', size: '0.8 MB' },
    { id: 4, title: 'Liste des Fournitures', type: 'Administratif', date: '2024-07-15', size: '0.3 MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un document..." 
            className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-brand-blue dark:text-blue-400">
                <File size={24} />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                {doc.type}
              </span>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate" title={doc.title}>{doc.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ajouté le {new Date(doc.date).toLocaleDateString('fr-FR')}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 dark:text-slate-500">{doc.size}</span>
              <button className="flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-blue-600 transition-colors">
                <Download size={16} />
                Télécharger
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
