// Custom view Payload : `/cms/admin/invitation/[token]`.
// Le path est branché via admin.components.routes (cf payload.config).
import React from 'react';

import InvitationAcceptViewClient from './InvitationAcceptView.client';

type Props = {
  params?: { segments?: string[] };
  searchParams?: Record<string, string | string[]>;
};

export default function InvitationAcceptView({ params }: Props): React.ReactElement {
  // segments contient ['invitation', '<token>']
  const segments = params?.segments ?? [];
  const token = segments[1] ?? '';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#fafafa' }}>
      <InvitationAcceptViewClient token={token} />
    </div>
  );
}
