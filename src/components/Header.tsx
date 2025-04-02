"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isAuthenticated = status === 'authenticated';

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-black">
                PDF to XML
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:border-gray-300 hover:text-black"
              >
                Home
              </Link>
              <Link
                href="/convert"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:border-gray-300 hover:text-black"
              >
                Convert
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:border-gray-300 hover:text-black"
              >
                Dashboard
              </Link>
            </nav>
          </div>
          
          {/* Authentication Links */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-black hover:bg-gray-100 mr-2"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-black hover:bg-gray-100 mr-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-black hover:bg-gray-100"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:bg-gray-50 hover:border-gray-300"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/convert"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:bg-gray-50 hover:border-gray-300"
            onClick={toggleMenu}
          >
            Convert
          </Link>
          <Link
            href="/dashboard"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:bg-gray-50 hover:border-gray-300"
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          
          {/* Mobile Authentication Links */}
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:bg-gray-50 hover:border-gray-300"
                onClick={toggleMenu}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  toggleMenu();
                }}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:bg-gray-50 hover:border-gray-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:bg-gray-50 hover:border-gray-300"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-black hover:bg-gray-50 hover:border-gray-300"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 