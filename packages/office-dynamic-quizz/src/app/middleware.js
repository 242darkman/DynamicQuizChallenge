"use client";

import { redirect } from 'next/navigation';
import { sessionStatus } from '@/app/_utils/session';
import { useEffect } from 'react';


export default function withAuth(WrappedComponent) {
  return function WithAuth(props) {
    const session = sessionStatus;
    useEffect(() => {
      if (!session) {
        redirect('/auth/signin');
      }
    }, [session]);

    if (!session) {
      return null;
    }

    return <WrappedComponent {...props} />
  }
};
