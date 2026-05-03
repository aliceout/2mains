// Wrapper server-component pour exposer LoginView en tant que custom view
// Payload (admin.components.views.login).
import React from 'react';

import LoginViewClient from './LoginView.client';

export default function LoginView(): React.ReactElement {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#fafafa' }}>
      <LoginViewClient />
    </div>
  );
}
