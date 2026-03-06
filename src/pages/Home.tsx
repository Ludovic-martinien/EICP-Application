import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { GraduationCap, Globe, BookOpen, Award, ArrowRight, Users, Star } from 'lucide-react';

const heroImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Campus
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Students
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Library
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"  // Sports/Activity
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentImageIndex}
              src={heroImages[currentImageIndex]} 
              alt="School Life" 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-blue-900/50 dark:from-black/90 dark:via-black/80 dark:to-blue-900/60 z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm text-blue-200 font-medium text-sm tracking-wide uppercase">
              Excellence & Bilinguisme
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              École Internationale <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Bilingue Canadienne
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-slate-200 font-light leading-relaxed">
              Une conception innovatrice de l'éducation, du Maternelle au Lycée, préparant les leaders de demain.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link 
                to="/inscription" 
                className="group bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-2"
              >
                Inscription Ouverte
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/programme" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:border-white/50"
              >
                Découvrir le Programme
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-blue-600 dark:bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/30">
            {[
              { num: "100%", label: "Réussite au Bac" },
              { num: "2", label: "Langues (Fr/En)" },
              { num: "15+", label: "Années d'Expérience" },
              { num: "500+", label: "Élèves Heureux" }
            ].map((stat, idx) => (
              <div key={idx} className="p-2">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.num}</div>
                <div className="text-blue-200 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Pourquoi choisir EICP ?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Nous offrons bien plus qu'un enseignement académique. Nous formons des citoyens du monde, confiants et compétents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "Programme Bilingue", desc: "Immersion complète en Français et Anglais dès le plus jeune âge pour une maîtrise naturelle.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { icon: Award, title: "Double Diplôme", desc: "Baccalauréat Français et Diplôme d'Études Secondaires de l'Ontario pour une mobilité internationale.", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
              { icon: BookOpen, title: "Pédagogie Active", desc: "Approche Montessori en maternelle et méthodes canadiennes innovantes centrées sur l'élève.", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
              { icon: GraduationCap, title: "Excellence", desc: "Préparation rigoureuse aux meilleures universités mondiales avec un suivi personnalisé.", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
              >
                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-100 dark:bg-green-900/30 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl -z-10" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Students learning" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Avatar" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Rejoignez-nous !</div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Une communauté vibrante et accueillante.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6">
                <Star size={16} className="fill-current" />
                Une éducation tournée vers le monde
              </div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Préparer votre enfant <br />
                <span className="text-blue-600 dark:text-blue-400">aux défis de demain</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                L'École Internationale du Centre Pédagogique propose un Programme Franco-Canadien International Bilingue, offrant une éducation innovante et moderne, de la maternelle au lycée.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Nous encourageons nos élèves à entreprendre, à innover et à apprendre avec autonomie et responsabilité. Notre objectif est de former les leaders de demain dans un environnement bienveillant et stimulant.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Maternelle Montessori', 'Approche Bilingue', 'Collège & Lycée', 'Activités Extrascolaires'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    {item}
                  </div>
                ))}
              </div>

              <Link to="/programme" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-lg group">
                En savoir plus sur nos programmes 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 bg-fixed"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à commencer l'aventure ?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Offrez à votre enfant une éducation d'excellence dans un environnement international stimulant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/inscription" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-blue-600/30"
            >
              Inscrire mon enfant
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border-2 border-white/20 hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold text-lg transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
