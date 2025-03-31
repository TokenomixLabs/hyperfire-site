
import React from 'react';
import { CalendarClock, AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MembershipBadge } from '@/components/membership/MembershipBadge';
import { useMembership } from '@/context/MembershipContext';
import { User } from '@/types/user';
import { format } from 'date-fns';

interface UserMembershipInfoProps {
  user: User;
  showActions?: boolean;
  className?: string;
}

export const UserMembershipInfo: React.FC<UserMembershipInfoProps> = ({
  user,
  showActions = true,
  className = '',
}) => {
  const { tiers, updateUserTier } = useMembership();
  
  const userTier = user.subscription?.tier || 'free';
  const tierInfo = tiers[userTier];
  const expiresAt = user.subscription?.expiresAt;
  const isInTrial = !!user.subscription?.isInTrial;
  const trialEndsAt = user.subscription?.trialEndsAt;
  
  if (!tierInfo) return null;
  
  const handleChangeTier = async (newTier: string) => {
    if (updateUserTier) {
      await updateUserTier(user.id, newTier as any);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          Membership Status
          <MembershipBadge tier={userTier} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Current Tier */}
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            <span className="font-medium">{tierInfo.name} Tier</span>
            <span className="text-muted-foreground"> - {tierInfo.description}</span>
          </span>
        </div>
        
        {/* Trial Status */}
        {isInTrial && trialEndsAt && (
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 text-amber-500" />
            <span className="text-amber-500 font-medium">
              Trial ends {format(new Date(trialEndsAt), 'MMM d, yyyy')}
            </span>
          </div>
        )}
        
        {/* Expiration */}
        {expiresAt && (
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {new Date(expiresAt) < new Date() ? (
                <span className="text-red-500 font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" /> Expired on {format(new Date(expiresAt), 'MMM d, yyyy')}
                </span>
              ) : (
                <span>
                  Renews on {format(new Date(expiresAt), 'MMM d, yyyy')}
                </span>
              )}
            </span>
          </div>
        )}
        
        {/* Admin Actions */}
        {showActions && updateUserTier && (
          <div className="pt-3 space-y-3">
            <div className="text-xs font-medium text-muted-foreground">Admin Actions</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(tiers)
                .filter(([id]) => id !== userTier)
                .map(([id, tier]) => (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    className={`border-dashed ${id === 'free' ? 'border-red-300 hover:border-red-400' : ''}`}
                    onClick={() => handleChangeTier(id)}
                  >
                    {id === 'free' ? 'Downgrade to ' : 'Change to '}
                    {tier.name}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
