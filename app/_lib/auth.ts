import { db } from "@/app/_lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const providers: AuthOptions["providers"] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }),
];

// Não registra o login de demonstração fora do ambiente local.
if (process.env.NODE_ENV === "development") {
  providers.push(
    CredentialsProvider({
      id: "local",
      name: "Autenticação local",
      credentials: {},
      async authorize() {
        // Reutiliza um usuário para manter as reservas locais vinculadas ao banco.
        const user = await db.user.upsert({
          where: { email: "local@localhost" },
          update: {},
          create: { name: "Usuário Local", email: "local@localhost" },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  );
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user = { ...session.user, id: token.sub } as typeof session.user;
      }

      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
};
