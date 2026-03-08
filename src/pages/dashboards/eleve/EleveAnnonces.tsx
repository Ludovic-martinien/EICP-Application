import React from 'react';
import { Megaphone, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function EleveAnnonces() {
  const announcements = [
    { id: 1, title: 'Réunion parents-profs', date: '2025-03-01', content: 'La réunion parents-professeurs pour le 2ème trimestre aura lieu le mardi 10 mars à partir de 17h.', author: 'Direction' },
    { id: 2, title: 'Sortie scolaire', date: '2025-02-25', content: 'Une sortie au musée est prévue pour les classes de 3ème le vendredi 14 mars. N\'oubliez pas de faire signer l\'autorisation parentale.', author: 'M. Dupont' },
    { id: 3, title: 'Menu de la cantine', date: '2025-02-20', content: 'Le menu de la semaine prochaine est disponible sur le site de l\'établissement.', author: 'Intendance' },
    { id: 4, title: 'Club Théâtre', date: '2025-02-15', content: 'Les inscriptions pour le club théâtre sont ouvertes. Rendez-vous au CDI pour plus d\'informations.', author: 'Mme. Martin' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Annonces</h1>
        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-xl flex items-center gap-2">
          <Megaphone size={20} />
          <span className="font-bold text-lg">{announcements.length}</span>
          <span className="text-sm font-normal">Nouvelles annonces</span>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{announcement.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar size={14} />
                    <span>{new Date(announcement.date).toLocaleDateString('fr-FR')}</span>
                    <span className="mx-1">•</span>
                    <User size={14} />
                    <span>{announcement.author}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pl-14">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {announcement.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
