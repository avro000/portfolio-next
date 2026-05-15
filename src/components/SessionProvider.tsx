"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextAuthSessionProvider
      // Re-check session every 10 seconds (matches JWT maxAge for testing)
      // Change to a longer interval like 60 for production
      refetchInterval={10}
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  )
}
