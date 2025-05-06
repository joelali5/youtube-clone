import { createContext, useContext, useState } from "react";

const sidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebarExpanded = () => {
    setIsSidebarExpanded((prev) => !prev);
  };
  return (
    <sidebarContext.Provider value={(isSidebarExpanded, toggleSidebarExpanded)}>
      {children}
    </sidebarContext.Provider>
  );
}

export default function useSidebar() {
  if (!sidebarContext) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return useContext(sidebarContext);
}
