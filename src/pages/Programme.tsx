import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Baby, BookOpen, GraduationCap, School, CheckCircle2, X, Clock, Calendar, Users, Award } from 'lucide-react';

export default function Programme() {
  const [selectedLevel, setSelectedLevel] = useState<any>(null);

  const levels = [
    {
      id: 'maternelle',
      title: 'Maternelle',
      age: '2 à 5 ans',
      desc: "Dans nos classes maternelles, nous accueillons les enfants dès l'âge de 2 ans et favorisons la pédagogie Montessori afin de permettre à chaque enfant de découvrir le monde à son rythme. Un environnement chaleureux et stimulant pour les tout-petits.",
      features: ['Pédagogie Montessori', 'Éveil bilingue (Français/Anglais)', 'Développement sensoriel', 'Socialisation et autonomie'],
      details: {
        description: "Notre école maternelle offre un cadre bienveillant où chaque enfant est unique. La pédagogie Montessori favorise l'autonomie et la confiance en soi dès le plus jeune âge.",
        schedule: "8h30 - 16h30 (Garderie dès 7h30 et jusqu'à 18h00)",
        classSize: "Max 15 élèves par classe",
        activities: [
          "Ateliers de vie pratique et sensorielle",
          "Initiation à l'anglais par le jeu et le chant",
          "Motricité et expression corporelle",
          "Jardinage et découverte de la nature"
        ]
      },
      color: 'text-brand-red dark:text-red-400',
      bgColor: 'bg-brand-red/10 dark:bg-red-900/10',
      borderColor: 'border-brand-red/20 dark:border-red-800',
      icon: Baby,
      img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'primaire',
      title: 'Primaire',
      age: '6 à 10 ans',
      desc: "Programme International Bilingue Franco-Canadien. Cette organisation hybride permet à nos élèves d'acquérir l'ensemble des compétences de chaque cycle avec aisance, confiance et rigueur. L'accent est mis sur la curiosité et les fondamentaux.",
      features: ['Lecture et écriture bilingue', 'Mathématiques et Sciences', 'Arts et Sports quotidiens', 'Projets collaboratifs'],
      details: {
        description: "L'école primaire consolide les apprentissages fondamentaux tout en ouvrant l'esprit sur le monde. Le bilinguisme devient un outil de communication quotidien.",
        schedule: "8h30 - 16h30 (Étude surveillée jusqu'à 18h00)",
        classSize: "Max 18 élèves par classe",
        activities: [
          "Enseignement bilingue 50/50",
          "Projets scientifiques et technologiques (Coding)",
          "Arts plastiques et théâtre",
          "Sorties culturelles et classes vertes"
        ]
      },
      color: 'text-brand-blue dark:text-blue-400',
      bgColor: 'bg-brand-blue/10 dark:bg-blue-900/10',
      borderColor: 'border-brand-blue/20 dark:border-blue-800',
      icon: BookOpen,
      img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'college',
      title: 'Collège',
      age: '11 à 14 ans',
      desc: "Dès le collège, nous préparons nos élèves à poursuivre leurs études supérieures en les dotant des compétences nécessaires pour réussir à l'université. Ils présentent le Diplôme National du Brevet (DNB) avec un accompagnement personnalisé.",
      features: ['Préparation au DNB', 'Approfondissement linguistique', 'Sciences et Technologie', 'Développement personnel et citoyenneté'],
      details: {
        description: "Le collège est une étape charnière. Nous visons l'excellence académique tout en développant le sens critique et la responsabilité citoyenne de nos élèves.",
        schedule: "8h00 - 17h00 (Clubs et soutien jusqu'à 18h00)",
        classSize: "Max 20 élèves par classe",
        activities: [
          "Préparation aux certifications linguistiques (Cambridge, DELE)",
          "Laboratoire de sciences et informatique",
          "Voyages linguistiques et échanges internationaux",
          "Engagement associatif et bénévolat"
        ]
      },
      color: 'text-brand-green dark:text-green-400',
      bgColor: 'bg-brand-green/10 dark:bg-green-900/10',
      borderColor: 'border-brand-green/20 dark:border-green-800',
      icon: School,
      img: 'https://images.unsplash.com/photo-1427504746383-796ada2af52e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'lycee',
      title: 'Lycée',
      age: '15 à 18 ans',
      desc: "Au lycée, les élèves peuvent obtenir le Diplôme d'Études Secondaires (DES) canadien et/ou le Baccalauréat Français. Une préparation d'excellence pour l'enseignement supérieur international.",
      features: ['Double diplôme (DES & Bac)', 'Orientation universitaire internationale', 'Leadership et engagement', 'Excellence académique'],
      details: {
        description: "Notre lycée prépare les leaders de demain. Avec un double cursus possible, nos bacheliers accèdent aux meilleures universités mondiales.",
        schedule: "8h00 - 17h30",
        classSize: "Max 20 élèves par classe",
        activities: [
          "Coaching orientation et préparation dossiers universitaires",
          "Conférences et rencontres avec des professionnels",
          "Projets entrepreneuriaux",
          "Préparation au Grand Oral et aux épreuves finales"
        ]
      },
      color: 'text-brand-cyan dark:text-cyan-400',
      bgColor: 'bg-brand-cyan/10 dark:bg-cyan-900/10',
      borderColor: 'border-brand-cyan/20 dark:border-cyan-800',
      icon: GraduationCap,
      img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="relative py-24 bg-brand-blue text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 to-brand-blue/95"></div>
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
                      <button 
                        onClick={() => setSelectedLevel(level)}
                        className={`text-lg font-bold ${level.color} hover:underline flex items-center gap-2 group cursor-pointer`}
                      >
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

      {/* Dynamic Modal */}
      <AnimatePresence>
        {selectedLevel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLevel(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className={`relative h-48 ${selectedLevel.bgColor} overflow-hidden`}>
                <img 
                  src={selectedLevel.img} 
                  alt={selectedLevel.title} 
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button 
                  onClick={() => setSelectedLevel(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-6 left-8 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <selectedLevel.icon size={32} />
                    <h2 className="text-3xl font-bold">{selectedLevel.title}</h2>
                  </div>
                  <p className="text-white/90 font-medium">{selectedLevel.age}</p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">À propos du programme</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedLevel.details.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2 text-slate-900 dark:text-white font-bold">
                      <Clock className="text-red-600" size={20} />
                      Horaires
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {selectedLevel.details.schedule}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2 text-slate-900 dark:text-white font-bold">
                      <Users className="text-red-600" size={20} />
                      Effectifs
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {selectedLevel.details.classSize}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="text-red-600" size={24} />
                    Activités et Points Forts
                  </h3>
                  <ul className="grid grid-cols-1 gap-3">
                    {selectedLevel.details.activities.map((activity: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <CheckCircle2 size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button 
                    onClick={() => setSelectedLevel(null)}
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
