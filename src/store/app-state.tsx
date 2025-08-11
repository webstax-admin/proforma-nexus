import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type Role = "admin" | "company" | "applicant";

export interface Credential {
  id: string;
  username: string;
  password: string;
  role: Role;
  linkedId?: string; // companyId or applicantId
}

export interface Company {
  id: string;
  name: string;
  proforma2: string;
  applicants: string[]; // applicant ids
  credentialsId: string;
}

export interface Applicant {
  id: string;
  name: string;
  companyId: string;
  proforma1: string;
  submitted: boolean;
  approved: boolean;
  documents: string[]; // names of documents in kit
  credentialsId: string;
}

interface State {
  credentials: Record<string, Credential>;
  companies: Record<string, Company>;
  applicants: Record<string, Applicant>;
  currentUserId?: string;
}

type Action =
  | { type: "LOGIN"; userId: string }
  | { type: "LOGOUT" }
  | { type: "SET_STATE"; state: State } // for init/rehydrate
  | { type: "UPSERT_COMPANY"; company: Company; credential: Credential }
  | { type: "UPSERT_APPLICANT"; applicant: Applicant; credential: Credential }
  | { type: "SAVE_PROFORMA2"; companyId: string; content: string }
  | { type: "SAVE_PROFORMA1"; applicantId: string; content: string }
  | { type: "SUBMIT_PROFORMA1"; applicantId: string }
  | { type: "APPROVE_APPLICANT"; applicantId: string }
  | { type: "SET_DOCUMENT_KIT"; applicantId: string; documents: string[] };

const STORAGE_KEY = "app_state_v1";

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomPassword() {
  return Math.random().toString(36).slice(2, 10);
}

const defaultAdminCredential: Credential = {
  id: uid(),
  username: "aarnav",
  password: "aarnav",
  role: "admin",
};

const defaultState: State = {
  credentials: { [defaultAdminCredential.id]: defaultAdminCredential },
  companies: {},
  applicants: {},
  currentUserId: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUserId: action.userId };
    case "LOGOUT":
      return { ...state, currentUserId: undefined };
    case "SET_STATE":
      return action.state;
    case "UPSERT_COMPANY": {
      return {
        ...state,
        credentials: { ...state.credentials, [action.credential.id]: action.credential },
        companies: { ...state.companies, [action.company.id]: action.company },
      };
    }
    case "UPSERT_APPLICANT": {
      return {
        ...state,
        credentials: { ...state.credentials, [action.credential.id]: action.credential },
        applicants: { ...state.applicants, [action.applicant.id]: action.applicant },
      };
    }
    case "SAVE_PROFORMA2": {
      const c = state.companies[action.companyId];
      if (!c) return state;
      return { ...state, companies: { ...state.companies, [c.id]: { ...c, proforma2: action.content } } };
    }
    case "SAVE_PROFORMA1": {
      const a = state.applicants[action.applicantId];
      if (!a) return state;
      return { ...state, applicants: { ...state.applicants, [a.id]: { ...a, proforma1: action.content } } };
    }
    case "SUBMIT_PROFORMA1": {
      const a = state.applicants[action.applicantId];
      if (!a) return state;
      return { ...state, applicants: { ...state.applicants, [a.id]: { ...a, submitted: true } } };
    }
    case "APPROVE_APPLICANT": {
      const a = state.applicants[action.applicantId];
      if (!a) return state;
      return { ...state, applicants: { ...state.applicants, [a.id]: { ...a, approved: true } } };
    }
    case "SET_DOCUMENT_KIT": {
      const a = state.applicants[action.applicantId];
      if (!a) return state;
      return { ...state, applicants: { ...state.applicants, [a.id]: { ...a, documents: action.documents } } };
    }
    default:
      return state;
  }
}

interface ContextValue {
  state: State;
  login: (username: string, password: string) => { ok: boolean; role?: Role; linkedId?: string };
  logout: () => void;
  currentUser?: Credential;
  createCompany: (name: string) => { username: string; password: string; companyId: string };
  createApplicant: (companyId: string, name: string) => { username: string; password: string; applicantId: string };
  saveProforma2: (companyId: string, content: string) => void;
  saveProforma1: (applicantId: string, content: string) => void;
  submitProforma1: (applicantId: string) => void;
  approveApplicant: (applicantId: string) => void;
  setDocumentKit: (applicantId: string, documents: string[]) => void;
  getAllCredentials: () => Credential[];
}

const AppStateContext = createContext<ContextValue | undefined>(undefined);

export const AppStateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  // Rehydrate
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as State;
        // Ensure admin user exists
        const hasAdmin = Object.values(parsed.credentials).some(
          (c) => c.role === "admin" && c.username === "aarnav"
        );
        const merged: State = hasAdmin ? parsed : {
          ...parsed,
          credentials: { ...parsed.credentials, [defaultAdminCredential.id]: defaultAdminCredential },
        };
        dispatch({ type: "SET_STATE", state: merged });
      } catch (_) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentUser = useMemo(() => (state.currentUserId ? state.credentials[state.currentUserId] : undefined), [state]);

  const login = (username: string, password: string) => {
    const user = Object.values(state.credentials).find(
      (c) => c.username === username && c.password === password
    );
    if (user) {
      dispatch({ type: "LOGIN", userId: user.id });
      return { ok: true, role: user.role, linkedId: user.linkedId };
    }
    return { ok: false };
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  const createCompany = (name: string) => {
    const id = uid();
    const credId = uid();
    const uname = `fc-${slugify(name)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const pwd = randomPassword();
    const credential: Credential = { id: credId, username: uname, password: pwd, role: "company", linkedId: id };
    const company: Company = { id, name, proforma2: "", applicants: [], credentialsId: credId };
    dispatch({ type: "UPSERT_COMPANY", company, credential });
    return { username: uname, password: pwd, companyId: id };
  };

  const createApplicant = (companyId: string, name: string) => {
    const id = uid();
    const credId = uid();
    const uname = `ap-${slugify(name)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const pwd = randomPassword();
    const credential: Credential = { id: credId, username: uname, password: pwd, role: "applicant", linkedId: id };
    const applicant: Applicant = { id, name, companyId, proforma1: "", submitted: false, approved: false, documents: [], credentialsId: credId };
    dispatch({ type: "UPSERT_APPLICANT", applicant, credential });
    // also add to company
    const company = state.companies[companyId];
    if (company) {
      const updated: Company = { ...company, applicants: [...company.applicants, id] };
      dispatch({ type: "UPSERT_COMPANY", company: updated, credential: credential });
    }
    return { username: uname, password: pwd, applicantId: id };
  };

  const saveProforma2 = (companyId: string, content: string) => dispatch({ type: "SAVE_PROFORMA2", companyId, content });
  const saveProforma1 = (applicantId: string, content: string) => dispatch({ type: "SAVE_PROFORMA1", applicantId, content });
  const submitProforma1 = (applicantId: string) => dispatch({ type: "SUBMIT_PROFORMA1", applicantId });
  const approveApplicant = (applicantId: string) => dispatch({ type: "APPROVE_APPLICANT", applicantId });
  const setDocumentKit = (applicantId: string, documents: string[]) => dispatch({ type: "SET_DOCUMENT_KIT", applicantId, documents });
  const getAllCredentials = () => Object.values(state.credentials);

  const value: ContextValue = {
    state,
    login,
    logout,
    currentUser,
    createCompany,
    createApplicant,
    saveProforma2,
    saveProforma1,
    submitProforma1,
    approveApplicant,
    setDocumentKit,
    getAllCredentials,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
