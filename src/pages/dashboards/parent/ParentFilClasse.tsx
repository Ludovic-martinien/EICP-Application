import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ParentFilClasse() {
  const { profile } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchChildren();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedChild) {
      fetchPosts();
      
      const channel = supabase.channel('class_posts_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'class_posts' }, () => fetchPosts())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const { data } = await supabase
        .from('parent_students')
        .select('student_id, profiles!parent_students_student_id_fkey(*)')
        .eq('parent_id', profile!.id);
      
      const childrenData = data?.map(d => d.profiles) || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Get the class of the selected child
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select('class_id')
        .eq('student_id', selectedChild.id);
      
      const classIds = enrollments?.map(e => e.class_id) || [];

      if (classIds.length > 0) {
        const { data } = await supabase
          .from('class_posts')
          .select('*, author:profiles!class_posts_teacher_id_fkey(nom, prenom)')
          .in('class_id', classIds)
          .order('created_at', { ascending: false });
        
        setPosts(data || []);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && children.length === 0) {
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
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sélectionner un enfant</label>
        <select
          value={selectedChild?.id || ''}
          onChange={(e) => setSelectedChild(children.find(c => c.id === e.target.value))}
          className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
        >
          {children.map(c => (
            <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-brand-blue" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 dark:text-slate-400">
            Aucune publication pour le moment dans la classe de cet enfant.
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
