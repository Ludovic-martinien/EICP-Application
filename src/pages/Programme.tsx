import { motion } from 'motion/react';
import { Baby, BookOpen, GraduationCap, School, CheckCircle2 } from 'lucide-react';

export default function Programme() {
  const levels = [
    {
      id: 'maternelle',
      title: 'Maternelle',
      age: '2 à 5 ans',
      desc: "Dans nos classes maternelles, nous accueillons les enfants dès l'âge de 2 ans et favorisons la pédagogie Montessori afin de permettre à chaque enfant de découvrir le monde à son rythme. Un environnement chaleureux et stimulant pour les tout-petits.",
      features: ['Pédagogie Montessori', 'Éveil bilingue (Français/Anglais)', 'Développement sensoriel', 'Socialisation et autonomie'],
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/10',
      borderColor: 'border-pink-200 dark:border-pink-800',
      icon: Baby,
      img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'primaire',
      title: 'Primaire',
      age: '6 à 10 ans',
      desc: "Programme International Bilingue Franco-Canadien. Cette organisation hybride permet à nos élèves d'acquérir l'ensemble des compétences de chaque cycle avec aisance, confiance et rigueur. L'accent est mis sur la curiosité et les fondamentaux.",
      features: ['Lecture et écriture bilingue', 'Mathématiques et Sciences', 'Arts et Sports quotidiens', 'Projets collaboratifs'],
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      borderColor: 'border-blue-200 dark:border-blue-800',
      icon: BookOpen,
      img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'college',
      title: 'Collège',
      age: '11 à 14 ans',
      desc: "Dès le collège, nous préparons nos élèves à poursuivre leurs études supérieures en les dotant des compétences nécessaires pour réussir à l'université. Ils présentent le Diplôme National du Brevet (DNB) avec un accompagnement personnalisé.",
      features: ['Préparation au DNB', 'Approfondissement linguistique', 'Sciences et Technologie', 'Développement personnel et citoyenneté'],
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: School,
      img: 'https://images.unsplash.com/photo-1427504746383-796ada2af52e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'lycee',
      title: 'Lycée',
      age: '15 à 18 ans',
      desc: "Au lycée, les élèves peuvent obtenir le Diplôme d'Études Secondaires (DES) canadien et/ou le Baccalauréat Français. Une préparation d'excellence pour l'enseignement supérieur international.",
      features: ['Double diplôme (DES & Bac)', 'Orientation universitaire internationale', 'Leadership et engagement', 'Excellence académique'],
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/10',
      borderColor: 'border-purple-200 dark:border-purple-800',
      icon: GraduationCap,
      img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/95"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Nos Programmes Académiques
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            Un parcours d'excellence, bilingue et innovant, conçu pour accompagner chaque élève vers sa réussite personnelle et académique.
          </motion.p>
        </div>
      </div>

      {/* Levels Sections */}
      <div className="flex flex-col">
        {levels.map((level, idx) => {
          const Icon = level.icon;
          const isEven = idx % 2 === 0;
          
          return (
            <section 
              key={level.id} 
              className={`py-24 ${isEven ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50'} transition-colors duration-300 overflow-hidden`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
                >
                  {/* Image Side */}
                  <div className="flex-1 w-full">
                    <div className="relative group">
                      <div className={`absolute inset-0 ${level.bgColor} rounded-[2rem] transform ${isEven ? 'rotate-3' : '-rotate-3'} group-hover:rotate-0 transition-transform duration-500`}></div>
                      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3]">
                        <img 
                          src={level.img} 
                          alt={level.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={24} className="text-white/90" />
                            <span className="font-bold uppercase tracking-wider text-sm">{level.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Side */}
                  <div className="flex-1 space-y-8">
                    <div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${level.bgColor} ${level.color} border ${level.borderColor} mb-6`}>
                        <Icon size={16} />
                        {level.age}
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        {level.title}
                      </h2>
                      <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        {level.desc}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                        <span className={`w-1.5 h-6 rounded-full ${level.color.replace('text-', 'bg-')}`}></span>
                        Points clés du programme
                      </h3>
                      <ul className="grid grid-cols-1 gap-4">
                        {level.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 group">
                            <CheckCircle2 size={20} className={`mt-0.5 flex-shrink-0 ${level.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                            <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <button className={`text-lg font-bold ${level.color} hover:underline flex items-center gap-2 group`}>
                        En savoir plus
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
