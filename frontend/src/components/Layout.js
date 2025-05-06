import Navbar from "./Navbar";
import Navigation from "./Navigation";
import { useState } from "react";
import Videos from "./Videos";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebarOpen = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="">
      <Navbar
        toggleSidebarOpen={toggleSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
      <main className="flex">
        <Navigation
          isSidebarOpen={isSidebarOpen}
          toggleSidebarOpen={toggleSidebarOpen}
        />
        <Videos isSidebarOpen={isSidebarOpen} />
      </main>
    </div>
  );
}
