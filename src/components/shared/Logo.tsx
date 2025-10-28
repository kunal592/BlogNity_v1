import { PenSquare } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-2 text-primary">
      <PenSquare className="h-8 w-8" />
      <span className="text-xl font-bold font-headline">BlogNity</span>
    </Link>
  );
}
