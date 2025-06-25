import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { getOrCreateCreatorId } from '@/lib/creator';

export const useSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { toast } = useToast();

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [isPermanentlyExpired, setIsPermanentlyExpired] = useState(false);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*, contacts(*)')
        .eq('session_id', sessionId)
        .single();

      if (sessionError || !sessionData || sessionData.is_hidden) {
        toast({ title: "Session Not Found", description: "This session may be hidden or does not exist.", variant: "destructive" });
        setSession(null);
        navigate('/');
        return;
      }

      const expiryTime = new Date(sessionData.expires_at);
      const gracePeriodEnd = new Date(expiryTime.getTime() + 5 * 60 * 60 * 1000);
      const now = new Date();

      if (now > expiryTime) {
        setIsExpired(true);
      }
      if (now > gracePeriodEnd) {
        setIsPermanentlyExpired(true);
      }

      setSession(sessionData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load session data.",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, navigate, toast]);

  const updateTimeRemaining = useCallback(() => {
    if (!session) return;

    const now = new Date();
    const expiryTime = new Date(session.expires_at);
    const timeDiff = expiryTime - now;

    if (timeDiff <= 0) {
      if (!isExpired) {
        setIsExpired(true);
      }
      setTimeRemaining('Expired');
      
      const gracePeriodEnd = new Date(expiryTime.getTime() + 5 * 60 * 60 * 1000);
      if (now > gracePeriodEnd) {
        if(!isPermanentlyExpired) {
            setIsPermanentlyExpired(true);
        }
      }

    } else {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    }
  }, [session, isExpired, isPermanentlyExpired]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (isPermanentlyExpired) return;
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [updateTimeRemaining, isPermanentlyExpired]);

  const addContact = async (newContact) => {
    if (!session) return false;

    try {
      if (new Date() > new Date(session.expires_at)) {
        toast({ title: "Session Expired", description: "Cannot add new contacts.", variant: "destructive" });
        setIsExpired(true);
        return false;
      }

      const nameExists = session.contacts.some(c => c.name.toLowerCase() === newContact.name.toLowerCase());
      if (nameExists) {
        toast({ title: "Name Exists", description: "This name is already in the session. Please use a different name or add an initial.", variant: "destructive" });
        return false;
      }

      const { data, error } = await supabase
        .from('contacts')
        .insert([{ ...newContact, session_table_id: session.id }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({ title: "Contact Exists", description: "This phone number is already in the session.", variant: "destructive" });
        } else {
          throw error;
        }
        return false;
      }

      setSession(prevSession => ({
        ...prevSession,
        contacts: [...prevSession.contacts, data]
      }));

      return true;
    } catch (error) {
      console.error("Error adding contact:", error);
      toast({ title: "Error", description: "Failed to add contact.", variant: "destructive" });
      return false;
    }
  };

  const incrementDownloadCount = async () => {
    if (!session) {
      toast({ title: "Session not loaded", variant: "destructive" });
      return null;
    }

    const { data: newCount, error } = await supabase.rpc('increment_download_counter', {
        p_session_id: session.id
    });

    if (error) {
        toast({ title: "Error", description: `Could not update download count: ${error.message}`, variant: "destructive" });
        return null;
    }
    
    setSession({ ...session, download_count: newCount });
    
    return newCount;
  };

  const hideSession = async () => {
    if (!session) return;
    const creatorId = getOrCreateCreatorId();
    const { error } = await supabase.rpc('hide_session', {
      p_session_id: session.id,
      p_creator_id: creatorId
    });

    if (error) {
      toast({ title: "Error", description: "Failed to hide session.", variant: "destructive" });
    } else {
      toast({ title: "Session Hidden", description: "This session will no longer appear in your list." });
      navigate('/');
    }
  };

  return { session, isLoading, timeRemaining, isExpired, isPermanentlyExpired, addContact, incrementDownloadCount, hideSession };
};