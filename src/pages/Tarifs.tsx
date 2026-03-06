import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface Fee {
  id: number;
  level: string;
  price: string;
  description: string;
  category: string;
}

export default function Tarifs() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fees')
      .then(res => res.json())
      .then(data => {
        setFees(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const inscriptionFees = fees.filter(f => f.category === 'inscription' || f.category === 'reinscription');
  const tuitionFees = fees.filter(f => f.category === 'scolarite');

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Frais de Scolarité 2026-2027</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">Investissez dans l'avenir de votre enfant avec transparence.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={48} />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Inscription Fees */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Droits d'inscription & Réinscription
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {inscriptionFees.map((fee) => (
                  <div key={fee.id} className="p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xl">{fee.level}</h3>
                      {fee.description && <p className="text-slate-500 dark:text-slate-400 mt-1">{fee.description}</p>}
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{fee.price}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tuition Fees */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Frais de Scolarité (Mensualité)</h2>
                <span className="text-green-900 bg-green-200/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                  10 mois (Sept - Juin)
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tuitionFees.map((fee) => (
                  <div key={fee.id} className="p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xl">{fee.level}</h3>
                      {fee.description && <p className="text-slate-500 dark:text-slate-400 mt-1">{fee.description}</p>}
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 whitespace-nowrap">{fee.price}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                  Les frais d'examen DNB et Baccalauréat Français ne sont pas inclus dans les tarifs ci-dessus.
                </p>
              </div>
            </motion.div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Horaires</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Les heures de cours sont de <strong className="text-slate-900 dark:text-white">07h50 à 15h00</strong>.
                  <br />
                  <span className="text-sm mt-2 block text-slate-500">Réception des enfants dès 7h00.</span>
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Inclus dans la scolarité</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-3 list-disc list-inside marker:text-blue-500">
                  <li>Cantine gratuite pour les élèves de la maternelle (option 2), primaire et collège.</li>
                  <li>Ouvrages scolaires fournis (prêt).</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
