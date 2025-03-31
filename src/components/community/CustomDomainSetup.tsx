
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Globe, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DomainStatus {
  status: "unchecked" | "checking" | "invalid" | "pending" | "active";
  message?: string;
}

const CustomDomainSetup = () => {
  const [domain, setDomain] = useState("");
  const [domainStatus, setDomainStatus] = useState<DomainStatus>({ status: "unchecked" });
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "DNS record has been copied to your clipboard."
    });
  };

  const handleVerifyDomain = () => {
    if (!domain) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name to verify.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setDomainStatus({ status: "checking" });

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      
      // Simulate a pending status for this example
      setDomainStatus({ 
        status: "pending", 
        message: "DNS record found but still propagating. This can take up to 24 hours." 
      });
      
      toast({
        title: "Domain verification in progress",
        description: "Your domain is being verified. This may take up to 24 hours."
      });
    }, 2000);
  };

  const handleCheckStatus = () => {
    setIsVerifying(true);
    
    // Simulate checking domain status
    setTimeout(() => {
      setIsVerifying(false);
      
      // For demonstration - would come from backend in a real app
      const newStatus: DomainStatus = { 
        status: "active", 
        message: "Your domain is now active and correctly pointing to your community." 
      };
      
      setDomainStatus(newStatus);
      
      if (newStatus.status === "active") {
        toast({
          title: "Domain verified successfully",
          description: `${domain} is now connected to your community.`
        });
      } else {
        toast({
          title: "Domain not ready yet",
          description: "Your domain is still being verified. This may take up to 24 hours.",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  const renderDomainStatus = () => {
    if (domainStatus.status === "unchecked") {
      return null;
    }

    if (domainStatus.status === "checking") {
      return (
        <div className="flex items-center gap-2 text-sm mt-4">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Checking domain status...</span>
        </div>
      );
    }

    const statusConfig = {
      invalid: {
        icon: AlertCircle,
        color: "text-red-500",
        bgColor: "bg-red-100"
      },
      pending: {
        icon: RefreshCw,
        color: "text-amber-500",
        bgColor: "bg-amber-100"
      },
      active: {
        icon: Check,
        color: "text-green-500",
        bgColor: "bg-green-100"
      }
    };

    const config = statusConfig[domainStatus.status] || statusConfig.invalid;
    const StatusIcon = config.icon;

    return (
      <div className="mt-4 p-4 rounded-lg border bg-muted/20">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${config.bgColor} ${config.color}`}>
            <StatusIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className={`font-medium ${config.color}`}>
              {domainStatus.status === "invalid" ? "Domain verification failed" : 
               domainStatus.status === "pending" ? "Domain verification in progress" : 
               "Domain verified successfully"}
            </h4>
            <p className="text-sm mt-1">{domainStatus.message}</p>
            
            {domainStatus.status === "pending" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleCheckStatus}
                disabled={isVerifying}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isVerifying ? 'animate-spin' : ''}`} />
                Check Status
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Domain Setup</CardTitle>
        <CardDescription>
          Connect your own domain to your SignalFire community
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="domain-input">Enter your domain</Label>
          <div className="flex gap-2">
            <Input 
              id="domain-input" 
              placeholder="yourdomain.com" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <Button 
              onClick={handleVerifyDomain}
              disabled={isVerifying || !domain}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the domain you want to use for your community, without "http://" or "www".
          </p>
        </div>

        {renderDomainStatus()}

        <div className="rounded-lg border p-4 space-y-4 mt-6">
          <h3 className="font-medium">DNS Configuration</h3>
          <p className="text-sm">
            Add the following DNS records at your domain registrar:
          </p>
          
          <div className="space-y-3">
            <div className="rounded border bg-muted/20 p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">CNAME Record</p>
                  <code className="text-xs">www</code>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs">communities.signalfire.app</code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleCopyToClipboard("communities.signalfire.app")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded border bg-muted/20 p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">A Record</p>
                  <code className="text-xs">@</code>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs">34.102.136.180</code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleCopyToClipboard("34.102.136.180")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            DNS changes can take up to 24 hours to propagate across the internet.
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex flex-col items-start">
        <h4 className="font-medium text-sm mb-2">Need help?</h4>
        <p className="text-sm text-muted-foreground">
          If you're experiencing issues with your domain setup, please check our 
          <Button variant="link" className="h-auto p-0 ml-1">
            documentation
          </Button> or 
          <Button variant="link" className="h-auto p-0 ml-1">
            contact support
          </Button>.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CustomDomainSetup;
