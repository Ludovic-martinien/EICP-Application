import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { Image as ImageIcon, Loader2, Plus, Trash2, Users, Send } from 'lucide-react';

export default function EnseignantFilClasse() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    media_url: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchClasses();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedClass) {
      fetchPosts();
      
      const channel = supabase.channel('class_posts_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'class_posts', filter: `class_id=eq.${selectedClass}` }, () => fetchPosts())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const { data: scheduleClasses } = await supabase
        .from('schedule')
        .select('class_id, classes(*)')
        .eq('teacher_id', profile!.id);
      
      const uniqueClasses = new Map();
      scheduleClasses?.forEach((sc: any) => {
        if (sc.classes) uniqueClasses.set(sc.classes.id, sc.classes);
      });

      const { data: mainClasses } = await supabase
        .from('classes')
        .select('*')
        .eq('main_teacher_id', profile!.id);
      
      mainClasses?.forEach(c => uniqueClasses.set(c.id, c));
      
      const classesList = Array.from(uniqueClasses.values());
      setClasses(classesList);
      if (classesList.length > 0) {
        setSelectedClass(classesList[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('class_posts')
        .select('*, author:profiles!class_posts_teacher_id_fkey(nom, prenom)')
        .eq('class_id', selectedClass)
        .order('created_at', { ascending: false });
      
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('class_posts').insert([{
        teacher_id: profile!.id,
        class_id: selectedClass,
        content: newPost.content,
        media_url: newPost.media_url || null,
      }]);

      if (error) throw error;

      setIsAdding(false);
      setNewPost({ content: '', media_url: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Erreur lors de la publication.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) return;
    try {
      const { error } = await supabase.from('class_posts').delete().eq('id', id);
      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  if (loading && classes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="text-brand-blue" />
          Fil de Classe
        </h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Annuler' : <><Plus size={20} /> Nouvelle Publication</>}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sélectionner une classe</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Publier sur le fil de la classe</h2>
          <form onSubmit={handleAddPost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Partagez une activité, une photo..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL de l'image (Optionnel)</label>
              <input
                type="url"
                value={newPost.media_url}
                onChange={(e) => setNewPost({...newPost, media_url: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Publier</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-brand-blue" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 dark:text-slate-400">
            Aucune publication pour le moment dans cette classe.
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                    {post.author?.prenom?.[0]}{post.author?.nom?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{post.author?.prenom} {post.author?.nom}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {post.teacher_id === profile?.id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-4">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>

              {post.media_url && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={post.media_url} alt="Publication" className="w-full h-auto max-h-[500px] object-cover" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
