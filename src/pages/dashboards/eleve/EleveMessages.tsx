import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { MessageSquare, Loader2, Send, User } from 'lucide-react';

export default function EleveMessages() {
  const { profile } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchContacts();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
      
      const channel = supabase.channel('messages_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          if (
            (payload.new.sender_id === profile!.id && payload.new.receiver_id === selectedContact.id) ||
            (payload.new.sender_id === selectedContact.id && payload.new.receiver_id === profile!.id)
          ) {
            setMessages(prev => [...prev, payload.new]);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      // Pour un élève, on récupère les enseignants de ses classes
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select('class_id')
        .eq('student_id', profile!.id);
      
      const classIds = enrollments?.map(e => e.class_id) || [];

      if (classIds.length > 0) {
        const { data: scheduleClasses } = await supabase
          .from('schedule')
          .select('teacher_id, profiles!schedule_teacher_id_fkey(*)')
          .in('class_id', classIds);
        
        const { data: mainClasses } = await supabase
          .from('classes')
          .select('main_teacher_id, profiles!classes_main_teacher_id_fkey(*)')
          .in('id', classIds);
          
        const teachersData = [
          ...(scheduleClasses?.map(sc => sc.profiles) || []),
          ...(mainClasses?.map(mc => mc.profiles) || [])
        ];
        
        // Remove duplicates
        const uniqueTeachers = new Map();
        teachersData.forEach(t => {
          if (t) uniqueTeachers.set(t.id, t);
        });
        
        setContacts(Array.from(uniqueTeachers.values()).sort((a, b) => a.nom.localeCompare(b.nom)));
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${profile!.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${profile!.id})`)
        .order('created_at', { ascending: true });
      
      setMessages(data || []);
      
      // Marquer comme lu
      const unreadMessages = data?.filter(m => m.receiver_id === profile!.id && !m.is_read) || [];
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessages.map(m => m.id));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    
    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert([{
        sender_id: profile!.id,
        receiver_id: selectedContact.id,
        message: newMessage.trim(),
      }]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="text-brand-blue" />
          Messagerie
        </h1>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white">Contacts (Enseignants)</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {contacts.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4 text-sm">Aucun contact trouvé.</p>
            ) : (
              contacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    selectedContact?.id === contact.id
                      ? 'bg-brand-blue/10 dark:bg-brand-blue/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                    {contact.prenom[0]}{contact.nom[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${selectedContact?.id === contact.id ? 'text-brand-blue dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                      {contact.prenom} {contact.nom}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{contact.role.replace(/_/g, ' ')}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/50">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                  {selectedContact.prenom[0]}{selectedContact.nom[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{selectedContact.prenom} {selectedContact.nom}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{selectedContact.role.replace(/_/g, ' ')}</p>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                    <MessageSquare size={48} className="mb-4 opacity-20" />
                    <p>Aucun message. Commencez la conversation !</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender_id === profile!.id;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isMe 
                            ? 'bg-brand-blue text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-bl-none'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-blue outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-brand-blue hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <User size={64} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Sélectionnez un contact</p>
              <p className="text-sm">Choisissez un enseignant pour démarrer une conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
