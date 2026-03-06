import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none">EICP</span>
                <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase">ShopUniversities</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              École Internationale Bilingue Canadienne. Une éducation d'excellence tournée vers un avenir prometteur, de la maternelle au lycée.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-l-4 border-blue-500 pl-3">Liens Rapides</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/programme" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>→</span> Programme</Link></li>
              <li><Link to="/tarifs" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>→</span> Tarifs</Link></li>
              <li><Link to="/avantages" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>→</span> Avantages</Link></li>
              <li><Link to="/inscription" className="hover:text-blue-400 transition-colors flex items-center gap-2"><span>→</span> Inscription</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-l-4 border-green-500 pl-3">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-blue-400">
                  <MapPin size={16} />
                </div>
                <span>529 Avenue Félix HOUPHOUËT-BOIGNY<br />Quartier Louis, Libreville</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-green-400">
                  <Phone size={16} />
                </div>
                <span>+241 011 44 9292 / +241 062 24 8425</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-purple-400">
                  <Mail size={16} />
                </div>
                <a href="mailto:info@shopuniversities.org" className="hover:text-white transition-colors">info@shopuniversities.org</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} EICP ShopUniversities. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
