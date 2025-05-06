import { Cast, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar({ toggleSidebarOpen, isSidebarOpen }) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/publish-video");
  };
  return (
    <div className={`${isSidebarOpen ? "" : "px-3"}`}>
      <div className="flex justify-between items-center px-2 md:hidden">
        <div className="flex items-center">
          <img src="/assets/Logo.png" alt="Youtube Logo" />
        </div>
        <div className="flex items-center space-x-6">
          <Cast size={24} className="text-white" />
          <div className="relative">
            <img src="/assets/Notifications.png" />
          </div>
          <Search size={24} className="text-white" />
        </div>
      </div>

      <div className="hidden md:flex justify-between items-center px-2">
        <div className="flex items-center">
          <img
            className="hover:rounded-full hover:bg-[#303030] cursor-pointer"
            src="/assets/Nav.png"
            alt="Navigation Icon"
            onClick={toggleSidebarOpen}
          />
          <img
            src="/assets/Logo.png"
            alt="Youtube Logo"
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-center w-1/2 p-2 space-x-5">
          <div className="flex justify-between border-1 border-[#303030] w-full h-10 rounded-full">
            <input
              type="text"
              placeholder="Search"
              className="px-2 w-6/7 outline-0"
            />
            <div className="bg-[#303030] w-1/10 h-full flex justify-center items-center rounded-r-full">
              {" "}
              <button className="cursor-pointer">
                <Search size={20} className="text-white w-full" />
              </button>
            </div>
          </div>
          <img
            src="/assets/Icon.png"
            alt="mic"
            className="border-0 outline-0 text-[#303030]"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-2 bg-[#303030] rounded-full px-4 py-2 cursor-pointer"
            onClick={handleClick}
          >
            <Plus size={24} className="text-white" />
            <button>Create</button>
          </div>
          <div className="cursor-pointer">
            <img src="/assets/Notifications.png" />
          </div>
          <div className="flex justify-center items-center h-8 w-8 rounded-full bg-amber-600">
            <p>J</p>
            {/* <img src="" alt="profile picture" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
