import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, Check, Info, CreditCard, Utensils, Bus } from 'lucide-react';

interface Fee {
  id: number;
  level: string;
  price: string;
  description: string;
  category: string;
}

interface FeeDetail {
  includes: string[];
  paymentTerms: string;
  transport: string;
  canteen: string;
  supplies: string;
}

const FEE_DETAILS: Record<string, FeeDetail> = {
  'Maternelle': {
    includes: ['Frais de scolarité', 'Assurance scolaire', 'Matériel pédagogique Montessori', 'Goûter du matin'],
    paymentTerms: 'Paiement trimestriel ou mensuel (10 échéances). Premier versement à l\'inscription.',
    transport: 'Service de ramassage scolaire disponible (zone 1 & 2). Tarif: 35.000 FCFA / mois.',
    canteen: 'Cantine incluse (déjeuner complet équilibré).',
    supplies: 'Tablier et fournitures artistiques à la charge des parents.'
  },
  'Primaire': {
    includes: ['Enseignement bilingue', 'Activités sportives', 'Accès bibliothèque', 'Soutien scolaire'],
    paymentTerms: 'Mensualité exigible le 5 de chaque mois. Remise de 5% pour paiement annuel.',
    transport: 'Service de bus matin et soir. Géolocalisation en temps réel.',
    canteen: 'Demi-pension obligatoire (repas chaud + dessert).',
    supplies: 'Manuels scolaires prêtés par l\'établissement. Cahiers d\'activités à acheter.'
  },
  'Collège': {
    includes: ['Cours magistraux et TP', 'Accès labo sciences', 'Certifications langues', 'Clubs périscolaires'],
    paymentTerms: 'Possibilité de prélèvement automatique. Frais de dossier: 15.000 FCFA.',
    transport: 'Navettes disponibles vers les principaux quartiers.',
    canteen: 'Self-service (entrée, plat, dessert). Forfait trimestriel.',
    supplies: 'Tablette numérique requise (partenariat disponible).'
  },
  'Lycée': {
    includes: ['Préparation Bac/DES', 'Orientation post-bac', 'Conférences experts', 'Accès ressources numériques'],
    paymentTerms: 'Paiement par trimestre anticipé. Bourses au mérite disponibles.',
    transport: 'Lignes directes matin/soir.',
    canteen: 'Cafétéria ouverte de 11h30 à 14h00.',
    supplies: 'Ordinateur portable personnel obligatoire.'
  }
};

export default function Tarifs() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

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

  const getDetails = (level: string) => {
    // Simple matching logic, can be improved
    if (level.includes('Maternelle')) return FEE_DETAILS['Maternelle'];
    if (level.includes('Primaire')) return FEE_DETAILS['Primaire'];
    if (level.includes('Collège')) return FEE_DETAILS['Collège'];
    if (level.includes('Lycée')) return FEE_DETAILS['Lycée'];
    return FEE_DETAILS['Primaire']; // Default
  };

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-blue dark:text-white mb-6">Frais de Scolarité 2026-2027</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">Investissez dans l'avenir de votre enfant avec transparence.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-red dark:text-red-400" size={48} />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Inscription Fees */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="bg-gradient-to-r from-brand-red to-red-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Droits d'inscription & Réinscription
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {inscriptionFees.map((fee) => (
                  <div 
                    key={fee.id} 
                    onClick={() => setSelectedFee(fee)}
                    className="p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-brand-red/5 dark:hover:bg-red-900/10 transition-colors cursor-pointer group"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xl group-hover:text-brand-red dark:group-hover:text-red-400 transition-colors">{fee.level}</h3>
                      {fee.description && <p className="text-slate-500 dark:text-slate-400 mt-1">{fee.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-brand-red dark:text-red-400">{fee.price}</div>
                      <Info size={20} className="text-slate-300 group-hover:text-brand-red transition-colors" />
                    </div>
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
              <div className="bg-gradient-to-r from-brand-blue to-blue-900 px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Frais de Scolarité (Mensualité)</h2>
                <span className="text-brand-blue bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                  10 mois (Sept - Juin)
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tuitionFees.map((fee) => (
                  <div 
                    key={fee.id} 
                    onClick={() => setSelectedFee(fee)}
                    className="p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-brand-blue/5 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xl group-hover:text-brand-blue dark:group-hover:text-blue-300 transition-colors">{fee.level}</h3>
                      {fee.description && <p className="text-slate-500 dark:text-slate-400 mt-1">{fee.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-brand-blue dark:text-blue-300 whitespace-nowrap">{fee.price}</div>
                      <Info size={20} className="text-slate-300 group-hover:text-brand-blue transition-colors" />
                    </div>
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

            {/* Additional Info Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-brand-blue dark:text-white mb-4">Horaires</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Les heures de cours sont de <strong className="text-slate-900 dark:text-white">07h50 à 15h00</strong>.
                  <br />
                  <span className="text-sm mt-2 block text-slate-500">Réception des enfants dès 7h00.</span>
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-brand-blue dark:text-white mb-4">Inclus dans la scolarité</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-3 list-disc list-inside marker:text-brand-red">
                  <li>Cantine gratuite pour les élèves de la maternelle (option 2), primaire et collège.</li>
                  <li>Ouvrages scolaires fournis (prêt).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedFee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedFee(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <h3 className="text-xl font-bold text-brand-blue dark:text-white">{selectedFee.level}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mt-1">{selectedFee.category}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedFee(null)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="text-center py-4 bg-brand-red/5 dark:bg-red-900/10 rounded-xl border border-brand-red/20 dark:border-red-900/30">
                    <span className="block text-sm text-brand-red dark:text-red-400 font-bold uppercase mb-1">Montant</span>
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{selectedFee.price}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                        <Check size={18} className="text-brand-green" />
                        Ce qui est inclus
                      </h4>
                      <ul className="space-y-2 pl-6">
                        {getDetails(selectedFee.level).includes.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 list-disc marker:text-slate-400">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-2">
                          <CreditCard size={16} className="text-slate-500" />
                          Modalités de paiement
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {getDetails(selectedFee.level).paymentTerms}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-2">
                            <Utensils size={16} className="text-slate-500" />
                            Cantine
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {getDetails(selectedFee.level).canteen}
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-2">
                            <Bus size={16} className="text-slate-500" />
                            Transport
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {getDetails(selectedFee.level).transport}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-center">
                  <p className="text-xs text-slate-500 italic">
                    Pour plus d'informations, veuillez contacter le service comptabilité.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
