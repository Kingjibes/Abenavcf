import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useSession } from '@/hooks/useSession';
import AddContactForm from '@/pages/session/AddContactForm';
import ParticipantView from '@/pages/session/ParticipantView';
import SubmissionSuccess from '@/pages/session/SubmissionSuccess';
import { useParams } from 'react-router-dom';

const JoinSessionPage = () => {
  const { sessionId } = useParams();
  const { session, isLoading, isExpired, isPermanentlyExpired, addContact, incrementDownloadCount } = useSession();
  const [view, setView] = useState('loading');

  useEffect(() => {
    if (isLoading) {
      setView('loading');
      return;
    }
    if (!session) {
      setView('not_found');
      return;
    }
    const submitted = localStorage.getItem(`submitted_session_${sessionId}`);
    if (submitted) {
      setView('submitted');
    } else {
      setView('form');
    }
  }, [sessionId, isLoading, session]);

  const handleContactAdded = () => {
    localStorage.setItem(`submitted_session_${sessionId}`, 'true');
    setView('success');
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        );
      case 'not_found':
        return (
           <div className="min-h-screen flex items-center justify-center bg-background text-white text-center p-4">
            <div>
              <h1 className="text-3xl font-bold text-red-500">Session Not Found</h1>
              <p className="text-gray-400 mt-2">This link may be invalid or the session has expired.</p>
            </div>
          </div>
        );
      case 'form':
        return (
          <AddContactForm 
            onAddContact={addContact} 
            isExpired={isExpired} 
            session={session}
            onSuccess={handleContactAdded}
          />
        );
      case 'success':
        return <SubmissionSuccess session={session} />;
      case 'submitted':
        return (
          <ParticipantView 
              session={session}
              isExpired={isExpired}
              isPermanentlyExpired={isPermanentlyExpired}
              incrementDownloadCount={incrementDownloadCount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Join {session?.name || 'Session'} - Contact Gain</title>
        <meta name="description" content={`Join the ${session?.name || '...'} contact collection session.`} />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {renderContent()}
        </motion.div>
      </div>
    </>
  );
};

export default JoinSessionPage;