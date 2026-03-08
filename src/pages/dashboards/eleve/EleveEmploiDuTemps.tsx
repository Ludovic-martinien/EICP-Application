import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function EleveEmploiDuTemps() {
  const schedule = [
    { day: 'Lundi', courses: [
      { time: '08:00 - 09:00', subject: 'Mathématiques', room: 'Salle 204', teacher: 'M. Dupont' },
      { time: '09:00 - 10:00', subject: 'Français', room: 'Salle 102', teacher: 'Mme. Martin' },
      { time: '10:00 - 11:00', subject: 'Histoire-Géo', room: 'Salle 301', teacher: 'M. Leroy' },
      { time: '11:00 - 12:00', subject: 'Anglais', room: 'Salle 205', teacher: 'Mrs. Smith' },
    ]},
    { day: 'Mardi', courses: [
      { time: '08:00 - 10:00', subject: 'Physique-Chimie', room: 'Labo 2', teacher: 'M. Curie' },
      { time: '10:00 - 12:00', subject: 'SVT', room: 'Labo 1', teacher: 'Mme. Pasteur' },
    ]},
    { day: 'Mercredi', courses: [
      { time: '08:00 - 10:00', subject: 'EPS', room: 'Gymnase', teacher: 'M. Bolt' },
      { time: '10:00 - 12:00', subject: 'Arts Plastiques', room: 'Atelier', teacher: 'Mme. Picasso' },
    ]},
    { day: 'Jeudi', courses: [
      { time: '08:00 - 09:00', subject: 'Mathématiques', room: 'Salle 204', teacher: 'M. Dupont' },
      { time: '09:00 - 10:00', subject: 'Français', room: 'Salle 102', teacher: 'Mme. Martin' },
      { time: '10:00 - 12:00', subject: 'Technologie', room: 'Salle Info', teacher: 'M. Gates' },
    ]},
    { day: 'Vendredi', courses: [
      { time: '08:00 - 10:00', subject: 'Histoire-Géo', room: 'Salle 301', teacher: 'M. Leroy' },
      { time: '10:00 - 12:00', subject: 'Musique', room: 'Salle Musique', teacher: 'Mme. Mozart' },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Emploi du temps</h1>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Calendar size={20} />
          <span>Semaine A</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {schedule.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-center">{day.day}</h3>
            </div>
            <div className="p-4 space-y-4">
              {day.courses.map((course, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-brand-blue/30">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-blue"></div>
                  <div className="mb-1">
                    <span className="text-xs font-bold text-brand-blue dark:text-blue-400 block">{course.subject}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {course.time}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <MapPin size={12} />
                    {course.room}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 italic mt-1">
                    {course.teacher}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
