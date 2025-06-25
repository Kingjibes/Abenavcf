import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ExternalLink, Info, Loader2 } from 'lucide-react';

const SubmissionSuccess = ({ session }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!session?.whatsapp_link) {
      return;
    }

    if (countdown <= 0) {
      window.location.href = session.whatsapp_link;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, session]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card border-border/50 text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Contact Added!</CardTitle>
          <CardDescription className="text-gray-400">
            Thank you for submitting your contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-secondary rounded-lg">
            {countdown > 0 ? (
              <>
                <p className="text-gray-400">Redirecting to the WhatsApp group in...</p>
                <div className="text-4xl font-bold text-cyan-400 my-2">{countdown}</div>
              </>
            ) : (
              <>
                <p className="text-gray-400">Redirecting now...</p>
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-cyan-400 my-2" />
              </>
            )}
          </div>
          <div className="p-3 bg-blue-900/50 border border-blue-700/50 text-blue-300 rounded-lg text-left text-sm flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 shrink-0"/>
              <div>
                <span className="font-bold">Important:</span> Please stay in the WhatsApp group. The VCF file containing all contacts will be shared there by the group admin after the session ends.
              </div>
          </div>
          <a
            href={session.whatsapp_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Click here if you are not redirected <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubmissionSuccess;