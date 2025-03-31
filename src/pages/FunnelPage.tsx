
import React from 'react';
import FunnelViewer from '@/components/funnel/FunnelViewer';
import AnimatedTransition from '@/components/AnimatedTransition';

export default function FunnelPage() {
  return (
    <AnimatedTransition>
      <FunnelViewer />
    </AnimatedTransition>
  );
}
