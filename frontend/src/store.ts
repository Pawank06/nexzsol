import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface TokenStore {
  token: string;
  setToken: (data: string) => void;
  removeToken: () => void;
}

export interface RoleStore {
  role: string;
  setRole: (role: string) => void;
  removeRole: () => void;
}

export interface GitIdStore {
  gitId: string;
  setGitId: (role: string) => void;
  removeGitId: () => void;
}

export const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set) => ({
        token: "",
        setToken: (data: string) => set({ token: data }),
        removeToken: () => set({ token: "" }),
      }),
      { name: "token-store" }
    )
  )
);

export const useRoleStore = create<RoleStore>()(
  devtools(
    persist(
      (set) => ({
        role: "",
        setRole: (role: string) => set({ role }),
        removeRole: () => set({ role: "" }),
      }),
      { name: "role-store" }
    )
  )
);

export const useGitIdStore = create<GitIdStore>()(
  devtools(
    persist(
      (set) => ({
        gitId: "",
        setGitId: (data: string) => set({ gitId: data }),
        removeGitId: () => set({ gitId: "" }),
      }),
      { name: "role-store" }
    )
  )
);