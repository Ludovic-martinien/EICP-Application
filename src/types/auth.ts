export type UserRole = 
  | 'eleve'
  | 'enseignant_maternelle'
  | 'enseignant_primaire'
  | 'enseignant_college'
  | 'surveillant'
  | 'secretaire'
  | 'comptable'
  | 'responsable_maternelle'
  | 'responsable_primaire'
  | 'responsable_college'
  | 'charge_pedagogique'
  | 'directrice';

export interface Profile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  niveau: string;
  classe: string;
  specialite: string;
  created_at: string;
}
