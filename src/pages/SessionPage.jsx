import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useSession } from '@/hooks/useSession';
import SessionHeader from '@/pages/session/SessionHeader';
import ContactList from '@/pages/session/ContactList';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SessionPage = () => {
  const { session, isLoading, timeRemaining, isExpired, isPermanentlyExpired, incrementDownloadCount, hideSession } = useSession();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-center p-4">
        <div>
          <h1 className="text-3xl font-bold text-red-500">Session Not Found</h1>
          <p className="text-gray-400 mt-2">This link may be invalid or the session has expired.</p>
          <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{session.name} - Contact Gain Session</title>
        <meta name="description" content={`Admin view for the ${session.name} contact collection session.`} />
      </Helmet>
      <div className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <SessionHeader 
            session={session} 
            timeRemaining={timeRemaining} 
            isExpired={isExpired} 
            isPermanentlyExpired={isPermanentlyExpired}
            incrementDownloadCount={incrementDownloadCount} 
            hideSession={hideSession}
          />
          <ContactList contacts={session.contacts} />
        </motion.div>
      </div>
    </>
  );
};

export default SessionPage;