import { CheckCircle, Globe, Award, Zap, Users, BookOpen, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function Avantages() {
  const benefits = [
    {
      icon: Globe,
      title: "Programme Bilingue",
      desc: "Un enseignement immersif en français et anglais permettant une maîtrise parfaite des deux langues officielles du Canada."
    },
    {
      icon: Award,
      title: "Crédits Scolaires Canadiens",
      desc: "Accès direct à des crédits reconnus par le système éducatif de l'Ontario, ouvrant les portes des universités nord-américaines."
    },
    {
      icon: BookOpen,
      title: "Double Diplomation",
      desc: "Possibilité d'obtenir simultanément le Baccalauréat Français et le Diplôme d'Études Secondaires (DES) de l'Ontario."
    },
    {
      icon: Zap,
      title: "Approche Moderne",
      desc: "Utilisation des technologies, développement de la pensée critique, et pédagogie par projet."
    },
    {
      icon: Users,
      title: "Environnement International",
      desc: "Une ouverture sur le monde avec des élèves et des enseignants de diverses nationalités."
    },
    {
      icon: Heart,
      title: "Suivi Personnalisé",
      desc: "Des effectifs réduits permettant un accompagnement individuel de chaque élève pour maximiser sa réussite."
    }
  ];

  return (
    <div className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Avantages pour l'Élève</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Choisir EICP, c'est offrir à votre enfant les clés d'un avenir international réussi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="text-brand-red dark:text-red-400 w-8 h-8 group-hover:text-brand-blue transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors">{benefit.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 bg-gradient-to-br from-brand-blue to-blue-900 rounded-[2.5rem] p-12 md:p-16 text-white text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-red rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à rejoindre l'excellence ?</h2>
            <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-xl">
              Les inscriptions sont ouvertes pour l'année scolaire 2026-2027. Places limitées.
            </p>
            <a 
              href="/inscription" 
              className="inline-block bg-white hover:bg-slate-100 text-brand-blue font-bold py-4 px-12 rounded-full transition-all hover:scale-105 shadow-lg"
            >
              Inscrire mon enfant
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
