import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Bell, 
  Settings,
  Menu,
  X,
  Shield,
  DollarSign,
  Users,
  ClipboardList,
  Calendar,
  File,
  Megaphone,
  TrendingUp,
  Briefcase,
  CreditCard,
  PieChart,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../types/auth';
import clsx from 'clsx';

const roleMenus: Record<UserRole, { label: string; icon: any; path: string }[]> = {
  eleve: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/eleve' },
    { label: 'Mes Notes', icon: FileText, path: '/dashboard/eleve/notes' },
    { label: 'Mes Devoirs', icon: BookOpen, path: '/dashboard/eleve/devoirs' },
    { label: 'Emploi du temps', icon: Calendar, path: '/dashboard/eleve/emploi-du-temps' },
    { label: 'Documents', icon: File, path: '/dashboard/eleve/documents' },
    { label: 'Annonces', icon: Megaphone, path: '/dashboard/eleve/annonces' },
  ],
  enseignant_maternelle: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/enseignant' },
    { label: 'Mes Classes', icon: Users, path: '/dashboard/enseignant/classes' },
    { label: 'Notes', icon: FileText, path: '/dashboard/enseignant/notes' },
    { label: 'Devoirs', icon: BookOpen, path: '/dashboard/enseignant/devoirs' },
    { label: 'Emploi du temps', icon: Calendar, path: '/dashboard/enseignant/emploi-du-temps' },
    { label: 'Documents', icon: File, path: '/dashboard/enseignant/documents' },
    { label: 'Annonces', icon: Megaphone, path: '/dashboard/enseignant/annonces' },
  ],
  enseignant_primaire: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/enseignant' },
    { label: 'Mes Classes', icon: Users, path: '/dashboard/enseignant/classes' },
    { label: 'Notes', icon: FileText, path: '/dashboard/enseignant/notes' },
    { label: 'Devoirs', icon: BookOpen, path: '/dashboard/enseignant/devoirs' },
    { label: 'Emploi du temps', icon: Calendar, path: '/dashboard/enseignant/emploi-du-temps' },
    { label: 'Documents', icon: File, path: '/dashboard/enseignant/documents' },
    { label: 'Annonces', icon: Megaphone, path: '/dashboard/enseignant/annonces' },
  ],
  enseignant_college: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/enseignant' },
    { label: 'Mes Classes', icon: Users, path: '/dashboard/enseignant/classes' },
    { label: 'Notes', icon: FileText, path: '/dashboard/enseignant/notes' },
    { label: 'Devoirs', icon: BookOpen, path: '/dashboard/enseignant/devoirs' },
    { label: 'Emploi du temps', icon: Calendar, path: '/dashboard/enseignant/emploi-du-temps' },
    { label: 'Documents', icon: File, path: '/dashboard/enseignant/documents' },
    { label: 'Annonces', icon: Megaphone, path: '/dashboard/enseignant/annonces' },
  ],
  surveillant: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/surveillant' },
    { label: 'Absences', icon: ClipboardList, path: '/dashboard/surveillant/absences' },
    { label: 'Retards', icon: Calendar, path: '/dashboard/surveillant/retards' },
    { label: 'Incidents', icon: Shield, path: '/dashboard/surveillant/incidents' },
    { label: 'Cantine', icon: Users, path: '/dashboard/surveillant/cantine' },
  ],
  secretaire: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/secretaire' },
    { label: 'Inscriptions', icon: UserPlus, path: '/dashboard/secretaire/inscriptions' },
    { label: 'Élèves', icon: Users, path: '/dashboard/secretaire/eleves' },
    { label: 'Dossiers', icon: FileText, path: '/dashboard/secretaire/dossiers' },
    { label: 'Documents', icon: File, path: '/dashboard/secretaire/documents' },
  ],
  comptable: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/comptable' },
    { label: 'Paiements', icon: DollarSign, path: '/dashboard/comptable/paiements' },
    { label: 'Impayés', icon: AlertCircle, path: '/dashboard/comptable/impayes' },
    { label: 'Reçus', icon: FileText, path: '/dashboard/comptable/recus' },
    { label: 'Salaires', icon: DollarSign, path: '/dashboard/comptable/salaires' },
    { label: 'Dépenses', icon: CreditCard, path: '/dashboard/comptable/depenses' },
  ],
  responsable_maternelle: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/responsable' },
    { label: 'Classes', icon: Users, path: '/dashboard/responsable/classes' },
    { label: 'Enseignants', icon: Briefcase, path: '/dashboard/responsable/enseignants' },
    { label: 'Conseils', icon: Calendar, path: '/dashboard/responsable/conseils' },
    { label: 'Statistiques', icon: TrendingUp, path: '/dashboard/responsable/statistiques' },
  ],
  responsable_primaire: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/responsable' },
    { label: 'Classes', icon: Users, path: '/dashboard/responsable/classes' },
    { label: 'Enseignants', icon: Briefcase, path: '/dashboard/responsable/enseignants' },
    { label: 'Conseils', icon: Calendar, path: '/dashboard/responsable/conseils' },
    { label: 'Statistiques', icon: TrendingUp, path: '/dashboard/responsable/statistiques' },
  ],
  responsable_college: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/responsable' },
    { label: 'Classes', icon: Users, path: '/dashboard/responsable/classes' },
    { label: 'Enseignants', icon: Briefcase, path: '/dashboard/responsable/enseignants' },
    { label: 'Conseils', icon: Calendar, path: '/dashboard/responsable/conseils' },
    { label: 'Statistiques', icon: TrendingUp, path: '/dashboard/responsable/statistiques' },
  ],
  charge_pedagogique: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/pedagogique' },
    { label: 'Programmes', icon: BookOpen, path: '/dashboard/pedagogique/programmes' },
    { label: 'Statistiques', icon: PieChart, path: '/dashboard/pedagogique/statistiques' },
    { label: 'Rapports', icon: FileText, path: '/dashboard/pedagogique/rapports' },
    { label: 'Enseignants', icon: Users, path: '/dashboard/pedagogique/enseignants' },
  ],
  directrice: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard/directrice' },
    { label: 'Finances', icon: DollarSign, path: '/dashboard/directrice/finances' },
    { label: 'Utilisateurs', icon: Users, path: '/dashboard/directrice/utilisateurs' },
    { label: 'Pédagogie', icon: BookOpen, path: '/dashboard/directrice/pedagogie' },
    { label: 'Paramètres', icon: Settings, path: '/dashboard/directrice/parametres' },
  ],
};

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!profile) return null;

  const menuItems = roleMenus[profile.role] || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xl font-bold text-brand-blue dark:text-white">EICP Portal</span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold">
                {profile.prenom[0]}{profile.nom[0]}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-slate-900 dark:text-white truncate">{profile.prenom} {profile.nom}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">{profile.role.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    isActive 
                      ? "bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-300 font-medium" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 lg:px-8">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-slate-400 hover:text-brand-blue transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-brand-blue transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
