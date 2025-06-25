import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Download, Share2, Clock, Link as LinkIcon, Copy, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Countdown from 'react-countdown';

const SessionHeader = ({ session, isExpired, isPermanentlyExpired, incrementDownloadCount, hideSession }) => {
  const { toast } = useToast();

  const fileId = `Abenapro${String(session.file_id_num || 1).padStart(3, '0')}`;
  const joinLink = `${window.location.origin}/join/${session.session_id}`;

  const generateVCF = (contacts) => {
    return contacts.map(contact => {
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name}\nTEL;TYPE=CELL:${contact.phone}\nEND:VCARD`;
    }).join('\n\n');
  };

  const handleDownloadVCF = async () => {
    if (isPermanentlyExpired) {
        toast({ title: "Session Permanently Expired", description: "The 5-hour download grace period has ended. Contacts are no longer available.", variant: "destructive" });
        return;
    }

    if (!session || session.contacts.length === 0) {
      toast({ title: "No Contacts", description: "There are no contacts to download yet.", variant: "destructive" });
      return;
    }

    await incrementDownloadCount();

    const vcfContent = generateVCF(session.contacts);
    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `${fileId}.vcf`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast({ title: "Download Started", description: `Your VCF file ${filename} is being downloaded.` });
  };
  
  const handleShareContacts = async () => {
    if (isPermanentlyExpired) {
        toast({ title: "Session Permanently Expired", description: "Cannot share contacts from an expired session.", variant: "destructive" });
        return;
    }
    if (!session || session.contacts.length === 0) {
        toast({ title: "No Contacts", description: "There are no contacts to share yet.", variant: "destructive" });
        return;
    }
    
    await incrementDownloadCount();
    
    const vcfContent = generateVCF(session.contacts);
    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
    const filename = `${fileId}.vcf`;
    const file = new File([blob], filename, { type: blob.type });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: `${session.name} Contacts`,
                text: `Contacts from the "${session.name}" session.`,
            });
            toast({ title: "Shared!", description: "Contacts shared successfully." });
        } catch (error) {
            if (error.name !== 'AbortError') {
                toast({
                    title: "Share Failed",
                    description: "Your browser might not support sharing this file directly. Please try downloading it first, then share it from your device.",
                    variant: "destructive",
                    duration: 9000,
                });
            }
        }
    } else {
        toast({ title: "Web Share Not Supported", description: "Your browser can't share files directly. Try downloading it first." });
    }
};

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinLink);
      toast({ title: "Link Copied!", description: "Participant join link copied to clipboard." });
    } catch (error) {
      toast({ title: "Copy Failed", description: "Could not copy link. Please copy it manually.", variant: "destructive" });
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">
          {session.name}
        </CardTitle>
        <div className="text-xs text-gray-400 flex flex-wrap gap-x-2">
            <span>Short Link ID: <span className="font-mono text-cyan-400">{session.session_id}</span> |</span>
            <span>Created: <span className="font-mono">{new Date(session.created_at).toLocaleString()}</span> |</span>
            <span>File ID: <span className="font-mono text-cyan-400">{fileId}</span></span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isExpired && !isPermanentlyExpired && (
            <CardDescription className="p-3 bg-yellow-900/50 border border-yellow-700/50 text-yellow-300 rounded-lg flex items-center gap-2 text-sm">
                <AlertTriangle className="w-5 h-5"/>
                <div>
                  Session has ended. Download window closes in:{' '}
                  <span className="font-bold">
                    <Countdown
                        date={new Date(new Date(session.expires_at).getTime() + 5 * 60 * 60 * 1000)}
                        renderer={({ hours, minutes, seconds, completed }) => {
                            if (completed) return '00:00:00';
                            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                        }}
                    />
                  </span>
                </div>
            </CardDescription>
        )}
         {isPermanentlyExpired && (
            <CardDescription className="p-3 bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg flex items-center gap-2 text-sm">
                <AlertTriangle className="w-5 h-5"/>
                <div>Session permanently expired. Contacts are deleted.</div>
            </CardDescription>
        )}
        <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 text-gray-300">
                <Clock className={`w-4 h-4 ${isExpired ? 'text-red-400' : 'text-green-400'}`} /> 
                Submissions {isExpired ? 'closed on' : 'close'}: <span className="font-semibold text-white">{new Date(session.expires_at).toLocaleString()}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-300">
                <Users className="w-4 h-4 text-cyan-400" /> 
                Contacts: <span className="font-semibold text-white">{session.contacts.length}</span> | Downloads: <span className="font-semibold text-white">{session.download_count}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-300">
                <LinkIcon className="w-4 h-4 text-cyan-400" /> 
                Link: <a href={joinLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-400 hover:underline truncate">{joinLink}</a>
            </p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={handleCopyLink} variant="outline" className="w-full bg-secondary border-border/50 hover:bg-border"><Copy className="w-4 h-4 mr-2" /> Copy Link</Button>
            <Button onClick={handleDownloadVCF} className="w-full gradient-bg text-white hover:opacity-90" disabled={isPermanentlyExpired}><Download className="w-4 h-4 mr-2" /> Download VCF</Button>
            <Button onClick={handleShareContacts} variant="outline" className="w-full bg-secondary border-border/50 hover:bg-border"><Share2 className="w-4 h-4 mr-2" /> Share Contacts</Button>
            <Button onClick={hideSession} variant="destructive" className="w-full"><EyeOff className="w-4 h-4 mr-2" /> Hide Session</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionHeader;