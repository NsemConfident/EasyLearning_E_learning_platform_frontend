import React, { createContext, useContext, useState, useCallback } from 'react';

type SidebarContextValue = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);
  const toggleSidebar = useCallback(() => setOpen(prev => !prev), []);

  return (
    <SidebarContext.Provider value={{ open, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

const noop = () => {};
const defaultValue: SidebarContextValue = { open: false, openSidebar: noop, closeSidebar: noop, toggleSidebar: noop };

export const useSidebar = (): SidebarContextValue => {
  const ctx = useContext(SidebarContext);
  return ctx ?? defaultValue;
};
