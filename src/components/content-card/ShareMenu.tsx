
import React from 'react';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useReferral, ReferralPlatform } from '@/context/ReferralContext';
import { getPlatformName } from './utils';
import { ContentItem } from './types';

interface ShareMenuProps {
  item: ContentItem;
  variant?: 'default' | 'list' | 'featured';
  onShareClick: (e: React.MouseEvent) => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ 
  item, 
  variant = 'default',
  onShareClick
}) => {
  const { toast } = useToast();
  const { generateReferralLink, trackClick, referralLinks } = useReferral();

  const handleShareWithPlatform = (e: React.MouseEvent, platform: ReferralPlatform) => {
    e.stopPropagation();
    
    // Generate platform-specific referral link
    const referralUrl = generateReferralLink(item.url, platform);
    
    // Check if platform link is set
    const platformLink = referralLinks.find(link => link.platform === platform);
    if (platform !== 'insiderlife' && (!platformLink || !platformLink.isSet)) {
      toast({
        title: "Platform link not set",
        description: `Please set your ${getPlatformName(platform)} referral link in the dashboard first.`,
        variant: "destructive"
      });
      return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(referralUrl);
    
    // Track the sharing event
    trackClick(item.id, platform);
    
    toast({
      title: "Link copied",
      description: `${getPlatformName(platform)} referral link copied to clipboard!`,
    });
  };

  const handleSharePlatform = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Generate the default (InsiderLife) referral link
    const referralUrl = generateReferralLink(item.url);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(`Check out: ${item.title}`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(item.title)}`;
        break;
      default:
        // Copy to clipboard if platform not recognized
        navigator.clipboard.writeText(referralUrl);
        toast({
          title: "Link copied",
          description: "Referral link copied to clipboard!",
        });
        return;
    }
    
    // Track the sharing event
    trackClick(item.id);
    
    // Open share window
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    toast({
      title: "Sharing content",
      description: `Sharing "${item.title}" via ${platform}`,
    });
  };

  // Different button styles based on variant
  const buttonClasses = 
    variant === 'list' 
      ? "text-gray-400 hover:text-primary transition-colors"
      : "bg-black/30 text-white hover:bg-black/50 transition-colors";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={buttonClasses}
          onClick={onShareClick}
        >
          <Share2 size={variant === 'list' ? 18 : 16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => handleShareWithPlatform(e, 'insiderlife')}>
          Copy InsiderLife link
        </DropdownMenuItem>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Copy for other platforms</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={(e) => handleShareWithPlatform(e, 'insiderdao')}>
                InsiderDAO link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleShareWithPlatform(e, 'societi')}>
                Societi link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleShareWithPlatform(e, 'aifc')}>
                AI Freedom Code link
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={(e) => handleSharePlatform('twitter', e)}>
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleSharePlatform('facebook', e)}>
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleSharePlatform('linkedin', e)}>
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleSharePlatform('telegram', e)}>
          Share on Telegram
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMenu;
