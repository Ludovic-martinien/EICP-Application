import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { Calendar as CalendarIcon, Loader2, Clock, MapPin, Printer } from 'lucide-react';

export default function EnseignantEmploiDuTemps() {
  const { profile } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = [
    { id: 1, name: 'Lundi' },
    { id: 2, name: 'Mardi' },
    { id: 3, name: 'Mercredi' },
    { id: 4, name: 'Jeudi' },
    { id: 5, name: 'Vendredi' },
    { id: 6, name: 'Samedi' },
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    if (profile) {
      fetchSchedule();

      const channel = supabase.channel('schedule_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule' }, () => fetchSchedule())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const fetchSchedule = async () => {
    try {
      const { data } = await supabase
        .from('schedule')
        .select('*, classes(name), subjects(name)')
        .eq('teacher_id', profile!.id);
      
      setSchedule(data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSlotData = (dayId: number, time: string) => {
    return schedule.find(s => {
      const startHour = s.start_time.substring(0, 5);
      return s.day_of_week === dayId && startHour === time;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="text-brand-blue" />
          Mon Emploi du Temps
        </h1>
        <button
          onClick={handlePrint}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors print:hidden"
        >
          <Printer size={20} />
          <span className="hidden sm:inline">Imprimer</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="w-20 border-b border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4"></th>
                {daysOfWeek.map(day => (
                  <th key={day.id} className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-center font-bold text-slate-700 dark:text-slate-300 w-1/6">
                    {day.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, index) => {
                // Skip 12:00 for lunch break visually if empty, but let's just render all slots
                return (
                  <tr key={time}>
                    <td className="border-r border-b border-slate-200 dark:border-slate-700 p-2 text-center text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                      {time}
                    </td>
                    {daysOfWeek.map(day => {
                      const slot = getSlotData(day.id, time);
                      return (
                        <td key={`${day.id}-${time}`} className="border-b border-r last:border-r-0 border-slate-200 dark:border-slate-700 p-2 h-24 align-top">
                          {slot ? (
                            <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-2 h-full flex flex-col justify-between">
                              <div>
                                <div className="font-bold text-brand-blue text-sm">{slot.classes?.name}</div>
                                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">{slot.subjects?.name}</div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
                                <MapPin size={12} />
                                <span className="truncate">{slot.room || 'À définir'}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
