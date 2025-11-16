// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import { useSession } from "@clerk/nextjs";
// type SupabaseContext = {
//   supabase: SupabaseClient | null;
//   isLoaded: boolean;
// };
// const Context = createContext<SupabaseContext>({
//   supabase: null,
//   isLoaded: false,
// });

// export default function SupabaseProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { session } = useSession();
//   const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
//   const [isLoaded, setIsLoaded] = useState<boolean>(false);
//   useEffect(() => {
//     if (!session) return;
//     const client = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         accessToken: async () => session?.getToken() ?? null,
//       }
//     );

//     setSupabase(client);
//     setIsLoaded(true);
//   }, [session]);

//   return (
//     <Context.Provider value={{ supabase, isLoaded }}>
//       {!isLoaded ? <div>Loading...</div> : children}
//     </Context.Provider>
//   );
// }

// export const useSupabase = () => {
//   const context = useContext(Context)
//   if (context === undefined) {
//     throw new Error("useSupabase needs to be inside the provider")
//   }

//   return context
// }


"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

type SupabaseContext = {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
};

const Context = createContext<SupabaseContext>({
  supabase: null,
  isLoaded: false,
});

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoaded: isClerkLoaded } = useSession();

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // لو Clerk لسه محمّلش → استنى
    if (!isClerkLoaded) return;

    // لو مفيش session → يبقى اليوزر مش مسجّل دخول
    if (!session) {
      setSupabase(null);
      setIsLoaded(true);  // لازم تبقى true علشان Loading يختفي
      return;
    }

    // لو في session → اعمل Supabase client
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        accessToken: async () => session?.getToken() ?? null,
      }
    );

    setSupabase(client);
    setIsLoaded(true);
  }, [session, isClerkLoaded]);

  return (
    <Context.Provider value={{ supabase, isLoaded }}>
      {!isLoaded ? <div>Loading...</div> : children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be inside SupabaseProvider");
  }
  return context;
};
