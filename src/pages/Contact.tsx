import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Contactez-nous</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Nous sommes à votre écoute pour toute question ou demande d'information.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Nos Coordonnées</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Adresse</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      529 Avenue Félix HOUPHOUËT-BOIGNY<br />
                      Quartier Louis, Libreville, Gabon
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Téléphone</h3>
                    <p className="text-slate-600 dark:text-slate-400">+241 011 44 9292</p>
                    <p className="text-slate-600 dark:text-slate-400">+241 062 24 8425</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email</h3>
                    <a href="mailto:info@shopuniversities.org" className="text-blue-600 dark:text-blue-400 hover:underline">
                      info@shopuniversities.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600 dark:text-orange-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Horaires d'ouverture</h3>
                    <p className="text-slate-600 dark:text-slate-400">Lundi - Vendredi: 7h30 - 15h30</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href="https://wa.me/241062248425" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-0.5"
                >
                  <MessageCircle size={20} />
                  Discuter sur WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 h-full min-h-[400px]">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative bg-slate-200 dark:bg-slate-800"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.757476717565!2d9.4449!3d0.3956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMjMnNDQuMiJOIDnCsDI2JzQxLjYiRQ!5e0!3m2!1sen!2sga!4v1635789000000!5m2!1sen!2sga" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '500px' }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Google Maps"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
