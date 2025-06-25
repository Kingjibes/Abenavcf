import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, Clock, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Countdown from 'react-countdown';

const ParticipantView = ({ session, isExpired, isPermanentlyExpired, incrementDownloadCount }) => {
  const { toast } = useToast();

  const generateVCF = (contacts) => {
    return contacts.map(contact => {
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name}\nTEL;TYPE=CELL:${contact.phone}\nEND:VCARD`;
    }).join('\n\n');
  };

  const handleDownloadVCF = async () => {
    if (!isExpired) {
        toast({ title: "Session Still Active", description: "You can download the VCF file once the session has ended.", variant: "default" });
        return;
    }

    if (isPermanentlyExpired) {
        toast({ title: "Session Permanently Expired", description: "The download window has closed.", variant: "destructive" });
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
    const filename = `Abenapro${String(session.file_id_num || 1).padStart(3, '0')}.vcf`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast({ title: "Download Started", description: `Your VCF file ${filename} is being downloaded.` });
  };
  
  return (
    <Card className="bg-card border-border/50 text-center">
      <CardHeader>
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full mx-auto flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">You're in!</CardTitle>
        <CardDescription className="text-gray-400">
          You've successfully joined the <span className="font-bold text-cyan-400">{session.name}</span> session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isExpired && (
            <div className="p-4 bg-secondary rounded-lg text-center">
                <Clock className="w-8 h-8 mx-auto text-cyan-400 mb-2" />
                <h3 className="font-semibold text-white">Session is Active</h3>
                <p className="text-gray-400 text-sm">You can download the contacts VCF file after the session ends on:</p>
                <p className="font-bold text-white mt-1">{new Date(session.expires_at).toLocaleString()}</p>
            </div>
        )}
        {isExpired && !isPermanentlyExpired && (
            <div className="p-4 bg-yellow-900/50 border border-yellow-700/50 rounded-lg text-center">
                <AlertTriangle className="w-8 h-8 mx-auto text-yellow-300 mb-2" />
                <h3 className="font-semibold text-white">Session has Ended</h3>
                <p className="text-yellow-300 text-sm">The VCF file is now available. Download window closes in:</p>
                <Countdown
                  date={new Date(new Date(session.expires_at).getTime() + 5 * 60 * 60 * 1000)}
                  renderer={({ hours, minutes, seconds, completed }) => {
                      if (completed) return <span className="text-lg font-bold text-white">00:00:00</span>;
                      return <span className="text-lg font-bold text-white">{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>;
                  }}
                />
            </div>
        )}
        {isPermanentlyExpired && (
            <div className="p-4 bg-red-900/50 border border-red-700/50 rounded-lg text-center">
                <AlertTriangle className="w-8 h-8 mx-auto text-red-300 mb-2" />
                <h3 className="font-semibold text-white">Session Closed</h3>
                <p className="text-red-300 text-sm">The 5-hour download grace period has ended. Contacts are no longer available.</p>
            </div>
        )}
        
        <Button 
            onClick={handleDownloadVCF}
            disabled={!isExpired || isPermanentlyExpired}
            className="w-full gradient-bg text-white h-12 text-lg font-semibold hover:opacity-90 disabled:bg-gray-500 disabled:opacity-50"
        >
            <Download className="w-5 h-5 mr-2" />
            Download VCF
        </Button>
        <a
            href={session.whatsapp_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors pt-2"
        >
            Go to WhatsApp Group <ExternalLink className="w-4 h-4 ml-2" />
        </a>

        <Card className="mt-6 bg-secondary border-border/50 text-left">
            <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
                <HelpCircle className="w-6 h-6 text-cyan-400"/>
                <CardTitle className="text-lg text-white">How to Install VCF File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-300 p-4 pt-0">
                <div>
                    <h4 className="font-semibold text-cyan-400 mb-1">For iPhone (iOS):</h4>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                        <li>After downloading, open the 'Files' app and find the VCF file (e.g., in your Downloads folder).</li>
                        <li>Tap on the file. A contact screen will appear.</li>
                        <li>Tap 'Add all # Contacts' at the bottom.</li>
                    </ol>
                </div>
                <div>
                    <h4 className="font-semibold text-cyan-400 mb-1">For Android:</h4>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                        <li>After downloading, open your phone's 'Contacts' app.</li>
                        <li>Find the settings menu (often a gear icon or three dots) and look for 'Import' or 'Fix & manage' > 'Import from file'.</li>
                        <li>Select the account to save contacts to (e.g., Google).</li>
                        <li>Choose the downloaded VCF file to import the contacts.</li>
                    </ol>
                </div>
            </CardContent>
        </Card>

      </CardContent>
    </Card>
  )
}

export default ParticipantView;