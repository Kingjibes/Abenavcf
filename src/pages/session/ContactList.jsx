import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, Phone, CheckCircle } from 'lucide-react';

const ContactList = ({ contacts }) => {
  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
          <span>Collected Contacts</span>
          <span className="text-sm font-semibold gradient-bg text-white px-3 py-1 rounded-full">
            {contacts.length}
          </span>
        </CardTitle>
        <CardDescription className="text-gray-400">Contacts added to this session will appear here.</CardDescription>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No contacts yet.</p>
            <p className="text-sm">Share the link to start collecting!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-secondary/50 rounded-lg p-4 border border-border/50 flex items-center space-x-4"
              >
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{contact.name}</h4>
                  <p className="text-gray-400 text-sm flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3" />
                    {contact.phone}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactList;