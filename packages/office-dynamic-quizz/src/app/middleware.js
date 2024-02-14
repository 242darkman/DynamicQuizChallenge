"use client";

import { redirect } from 'next/navigation';
import { sessionStatus } from '@/app/_utils/session';
import { useEffect } from 'react';

export default function withAuth(WrappedComponent) {
  return function WithAuth(props) {

    useEffect(() => {
      const session = sessionStatus;
      
      if (!session) {
        redirect('/auth/signin');
      }
    }, []);

    return <WrappedComponent {...props} />
  }
};
