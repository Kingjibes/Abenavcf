import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AddContactForm = ({ onAddContact, isExpired, session, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Invalid Name", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    if (!validatePhone(phone.trim())) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid international phone number, e.g., +14155552671.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const success = await onAddContact({
      name: name.trim(),
      phone: phone.trim(),
    });

    if (success) {
      toast({ title: "Success!", description: "Your contact has been added." });
      onSuccess();
    }
    setIsSubmitting(false);
  };

  if (isExpired) {
    return (
      <Card className="bg-card border-border/50 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-500">Session Expired</CardTitle>
          <CardDescription className="text-gray-400">
            This contact collection session has ended.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-white">Join <span className="gradient-text">{session.name}</span></CardTitle>
        <CardDescription className="text-gray-400">Add your contact to be included in the group VCF file.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" /> Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-border/50 text-white placeholder:text-gray-500 h-12"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" /> Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-secondary border-border/50 text-white placeholder:text-gray-500 h-12"
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full gradient-bg text-white h-12 text-lg font-semibold hover:opacity-90">
            {isSubmitting ? 'Adding...' : <><PlusCircle className="w-5 h-5 mr-2" /> Add My Contact</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddContactForm;