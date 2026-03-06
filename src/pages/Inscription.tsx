import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

interface InquiryForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  niveau: string;
  message: string;
}

export default function Inscription() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      setIsSuccess(true);
      reset();
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Formulaire d'Inscription</h1>
            <p className="text-blue-200">Remplissez ce formulaire pour initier la procédure d'inscription.</p>
          </div>

          <div className="p-8 md:p-12">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Demande envoyée !</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                  Nous avons bien reçu votre demande d'inscription. Notre équipe administrative vous contactera très prochainement.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Envoyer une autre demande
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nom de l'élève</label>
                    <input
                      {...register('nom', { required: 'Ce champ est requis' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Nom"
                    />
                    {errors.nom && <span className="text-red-500 text-xs mt-1 block">{errors.nom.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Prénom de l'élève</label>
                    <input
                      {...register('prenom', { required: 'Ce champ est requis' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Prénom"
                    />
                    {errors.prenom && <span className="text-red-500 text-xs mt-1 block">{errors.prenom.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email du parent</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Ce champ est requis' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="exemple@email.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      {...register('telephone', { required: 'Ce champ est requis' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="+241 ..."
                    />
                    {errors.telephone && <span className="text-red-500 text-xs mt-1 block">{errors.telephone.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Niveau souhaité</label>
                  <div className="relative">
                    <select
                      {...register('niveau', { required: 'Veuillez choisir un niveau' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                    >
                      <option value="">Sélectionner un niveau...</option>
                      <option value="Maternelle">Maternelle (TPS - GS)</option>
                      <option value="Primaire">Primaire (CP - CM2)</option>
                      <option value="College">Collège (6ème - 3ème)</option>
                      <option value="Lycee">Lycée (2nde - Terminale)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    </div>
                  </div>
                  {errors.niveau && <span className="text-red-500 text-xs mt-1 block">{errors.niveau.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message (Optionnel)</label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Questions particulières ou précisions..."
                  />
                </div>

                {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer la demande'
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
