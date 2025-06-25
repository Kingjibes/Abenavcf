
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const ContactPage = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, from_email: email, message },
      });
      
      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. We will get back to you soon.',
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      let description = 'Could not send your message. Please try again later.';
      if (error.message.includes('Email service is not configured')) {
        description = 'The email service is not configured by the site owner.';
      }

      toast({
        title: 'Error Sending Message',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Contact Gain VCF Generator</title>
        <meta name="description" content="Get in touch with the Contact Gain team. We'd love to hear from you!" />
      </Helmet>
      <div className="py-12 px-4 container mx-auto flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-card border-border/50">
            <CardHeader className="text-center pb-8">
              <Mail className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Get In <span className="gradient-text">Touch</span>
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                Have questions or feedback? Drop us a line!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-medium flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" /> Your Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border/50 text-white placeholder:text-gray-500 h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-400" /> Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary border-border/50 text-white placeholder:text-gray-500 h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white font-medium flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" /> Your Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-secondary border-border/50 text-white placeholder:text-gray-500 min-h-[150px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full gradient-bg text-white py-3 h-12 text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  {isSending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="w-6 h-6 mr-2" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ContactPage;
