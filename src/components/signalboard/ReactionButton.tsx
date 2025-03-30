
import React from 'react';
import { Button } from '@/components/ui/button';
import { ReactionType } from '@/types/signalboard';
import { 
  Flame, 
  Heart, 
  ThumbsUp, 
  Lightbulb, 
  Laugh,
  Star
} from 'lucide-react';

const reactionIcons = {
  fire: Flame,
  heart: Heart,
  thanks: ThumbsUp,
  lightbulb: Lightbulb,
  laugh: Laugh,
  wow: Star
};

const reactionLabels = {
  fire: 'Fire',
  heart: 'Heart',
  thanks: 'Thanks',
  lightbulb: 'Insight',
  laugh: 'Haha',
  wow: 'Wow'
};

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  isActive?: boolean;
  onClick: () => void;
  small?: boolean;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  type,
  count,
  isActive = false,
  onClick,
  small = false
}) => {
  const Icon = reactionIcons[type];
  
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size={small ? "sm" : "default"}
      className={`gap-1 rounded-full px-3 ${small ? 'h-7 text-xs' : ''} ${isActive ? 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20' : ''}`}
      onClick={onClick}
    >
      <Icon className={`${small ? 'h-3 w-3' : 'h-4 w-4'} ${isActive ? 'fill-current' : ''}`} />
      <span>{count > 0 ? count : reactionLabels[type]}</span>
    </Button>
  );
};

export default ReactionButton;
