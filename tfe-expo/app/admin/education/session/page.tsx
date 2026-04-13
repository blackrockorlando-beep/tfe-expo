import { Suspense } from 'react';
import SessionContent from './SessionContent';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Suspense><SessionContent /></Suspense>;
}