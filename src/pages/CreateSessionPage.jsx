import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Link as LinkIcon, Calendar, PlusCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/lib/supabaseClient';
import { getOrCreateCreatorId } from '@/lib/creator';

const durationOptions = [
  { value: '1m', label: '1 Minute', ms: 1 * 60 * 1000 },
  { value: '5m', label: '5 Minutes', ms: 5 * 60 * 1000 },
  { value: '10m', label: '10 Minutes', ms: 10 * 60 * 1000 },
  { value: '30m', label: '30 Minutes', ms: 30 * 60 * 1000 },
  { value: '1h', label: '1 Hour', ms: 60 * 60 * 1000 },
  { value: '6h', label: '6 Hours', ms: 6 * 60 * 60 * 1000 },
  { value: '12h',label: '12 Hours', ms: 12 * 60 * 60 * 1000 },
  { value: '1d', label: '1 Day', ms: 24 * 60 * 60 * 1000 },
  { value: '3d', label: '3 Days', ms: 3 * 24 * 60 * 60 * 1000 },
  { value: '1w', label: '1 Week', ms: 7 * 24 * 60 * 60 * 1000 },
  { value: '2w', label: '2 Weeks', ms: 14 * 24 * 60 * 60 * 1000 },
  { value: '3w', label: '3 Weeks', ms: 21 * 24 * 60 * 60 * 1000 },
  { value: '4w', label: '4 Weeks', ms: 28 * 24 * 60 * 60 * 1000 },
  { value: '2m', label: '2 Months', ms: 60 * 24 * 60 * 60 * 1000 },
  { value: '3m', label: '3 Months', ms: 90 * 24 * 60 * 60 * 1000 },
];

const CreateSessionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionName, setSessionName] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [durationIndex, setDurationIndex] = useState([4]);
  const [isCreating, setIsCreating] = useState(false);

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a group name.",
        variant: "destructive"
      });
      return;
    }

    if (!whatsappLink.trim() || !whatsappLink.startsWith('https://chat.whatsapp.com/')) {
      toast({
        title: "Invalid Link",
        description: "Please provide a valid WhatsApp group link.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const creatorId = getOrCreateCreatorId();
      const sessionId = generateSessionId();
      const selectedDuration = durationOptions[durationIndex[0]];
      const expiryTime = new Date(Date.now() + selectedDuration.ms);
      
      const { data: fileIdNum, error: rpcError } = await supabase.rpc('get_next_session_file_id');

      if (rpcError) {
        throw rpcError;
      }

      const { data, error } = await supabase
        .from('sessions')
        .insert([
          {
            session_id: sessionId,
            creator_id: creatorId,
            name: sessionName.trim(),
            whatsapp_link: whatsappLink.trim(),
            expires_at: expiryTime.toISOString(),
            file_id_num: fileIdNum,
          },
        ])
        .select()
        .single();


      if (error) {
        throw error;
      }

      toast({
        title: "Session Created Successfully!",
        description: "Your contact collection session is ready.",
      });

      navigate(`/session/${data.session_id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error Creating Session",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Session & How It Works - Contact Gain VCF Generator</title>
        <meta name="description" content="Create a new contact collection session and learn how our VCF generator simplifies contact sharing for groups." />
      </Helmet>
      <div className="py-12 px-4 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card border-border/50">
              <CardHeader className="text-left pb-8">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Create <span className="gradient-text">New Contact</span> Session
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Set up a new session to collect contacts. Share the generated link with participants.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="sessionName" className="text-white font-medium flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" /> Group Name
                  </Label>
                  <Input
                    id="sessionName"
                    placeholder="e.g., Project Alpha Team, Conference 2025"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="bg-secondary border-border/50 text-white placeholder:text-gray-500 h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappLink" className="text-white font-medium flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-cyan-400" /> WhatsApp Group Link
                  </Label>
                  <Input
                    id="whatsappLink"
                    placeholder="https://chat.whatsapp.com/YourGroup"
                    value={whatsappLink}
                    onChange={(e) => setWhatsappLink(e.target.value)}
                    className="bg-secondary border-border/50 text-white placeholder:text-gray-500 h-12"
                    required
                  />
                  <p className="text-xs text-gray-500 pt-1">
                    This is required. Participants will be redirected here after submission.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-white font-medium flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" /> Session Duration: 
                    <span className="text-cyan-400 font-bold">{durationOptions[durationIndex[0]].label}</span>
                  </Label>
                  <Slider
                    defaultValue={durationIndex}
                    onValueChange={setDurationIndex}
                    max={durationOptions.length - 1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{durationOptions[0].label}</span>
                    <span>{durationOptions[durationOptions.length - 1].label}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCreateSession}
                  disabled={isCreating}
                  className="w-full gradient-bg text-white py-3 h-12 text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <PlusCircle className="w-6 h-6 mr-2" />
                      Create Session
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="bg-secondary border-border/50">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                  <Zap className="w-8 h-8 text-cyan-400" />
                  How <span className="gradient-text">It Works</span>
                </CardTitle>
                <CardDescription className="text-gray-400 text-base pt-2">
                  Streamline contact sharing in 4 easy steps. From creation to a complete, ready-to-import contact file.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">1</div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">Create Your Session</h3>
                    <p>Fill in your group name, add a WhatsApp group link for redirection, and set a duration. This creates a dedicated page for your group to add their contacts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">2</div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">Share the Magic Link</h3>
                    <p>You'll receive a unique, shareable link for your session. Post this link in your group chat or anywhere your participants can see it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">3</div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">Participants Add Their Info</h3>
                    <p>Members click the link, enter their name and phone number, and hit submit. Our system ensures numbers are valid and correctly formatted. After submitting, they're automatically sent to your WhatsApp group.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">4</div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">Download the VCF File</h3>
                    <p>Once the session expires, a VCF (Virtual Contact File) is generated. This single file can be downloaded by you and all participants. Importing it to any phone (iPhone or Android) adds everyone's contacts instantly. No more manual saving!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreateSessionPage;