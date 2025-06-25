import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { getOrCreateCreatorId } from '@/lib/creator';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Clock, ChevronRight } from 'lucide-react';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const creatorId = getOrCreateCreatorId();
      if (creatorId) {
        try {
          const { data, error } = await supabase
            .from('sessions')
            .select('session_id, name, expires_at, created_at, contacts(count)')
            .eq('creator_id', creatorId)
            .eq('is_hidden', false)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setSessions(data);
        } catch (error) {
          console.error("Error fetching sessions:", error);
        }
      }
      setIsLoading(false);
    };
    fetchSessions();
  }, []);

  const getStatus = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    if (now > expiry) {
      return { text: "Ended", color: "text-red-400" };
    }
    return { text: "Active", color: "text-green-400" };
  };

  if (isLoading) {
    return (
      <div className="text-center text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
        <p className="mt-4">Loading your sessions...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <h2 className="text-2xl font-bold text-white mb-2">My Sessions</h2>
        <p>You haven't created any sessions yet.</p>
        <p>Click "Create a New Session" to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto text-left">
      <h2 className="text-2xl font-bold text-white mb-4">My Sessions</h2>
      <div className="space-y-4">
        {sessions.map((session, index) => {
          const status = getStatus(session.expires_at);
          return (
            <motion.div
              key={session.session_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/session/${session.session_id}`}>
                <Card className="bg-card border-border/50 hover:border-cyan-400/50 transition-all duration-300">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white">{session.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" /> {session.contacts[0]?.count || 0} Contacts
                        </span>
                        <span className={`flex items-center gap-1.5 font-semibold ${status.color}`}>
                          <Clock className="w-4 h-4" /> {status.text}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-500" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MySessions;