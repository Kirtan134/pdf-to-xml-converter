import { compare } from "bcrypt";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { User, connectDB } from "./db";

// Extended JWT type
interface ExtendedJWT extends JWT {
  id?: string;
  role?: string;
}

// Extended user type
interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
    signOut: "/",
  },
  session: {
    strategy: "jwt", // Use JWT strategy for sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    // JWT customization
    maxAge: 30 * 24 * 60 * 60, // 30 days (to match session)
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          // Connect to MongoDB
          await connectDB();
          
          const user = await User.findOne({
            email: credentials.email,
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Customize the data included in the session
    session: ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            role: token.role,
          },
        };
      }
      return session;
    },
    // Customize JWT token
    jwt: ({ token, user }) => {
      if (user) {
        const extendedUser = user as ExtendedUser;
        return {
          ...token,
          id: extendedUser.id,
          role: extendedUser.role,
        };
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV !== "production",
}; 