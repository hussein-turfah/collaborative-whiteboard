'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/canvases" className="text-2xl font-bold text-indigo-600">
          🎨 Whiteboard
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-gray-700">{user.username}</span>
              <button onClick={() => { logout(); router.push('/login'); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
