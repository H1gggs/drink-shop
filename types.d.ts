import type { DefaultUser } from "next-auth";

export interface Session {
  user?: DefaultUser & {
    id: string;
    isActive: boolean;
  };
}