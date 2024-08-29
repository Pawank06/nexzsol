import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface TokenStore {
  token: string;
  setToken: (data: string) => void;
  removeToken: () => void;
}

export interface VerifyTokenStore {
  verifytoken: string;
  setVerifyToken: (data: string) => void;
  removeVerifyToken: () => void;
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

export interface BalanceStore {
  balance: number;
  setBalance: (balance: number) => void;
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

export const useVerifyTokenStore = create<VerifyTokenStore>()(
  devtools(
    persist(
      (set) => ({
        verifytoken: "",
        setVerifyToken: (data: string) => set({ verifytoken: data }),
        removeVerifyToken: () => set({ verifytoken: "" }),
      }),
      { name: "verify-token-store" }
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
      { name: "gitId-store" }
    )
  )
);

export const useBalanceStore = create<BalanceStore>()(
  devtools(
    persist(
      (set) => ({
        balance: 0,
        setBalance: (data: number) => set({ balance: data }),
      }),
      { name: "gitId-store" }
    )
  )
)
