import Link from "next/link";
import Hr from "./Hr";
import { useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";
import { User, User2 } from "lucide-react";

export default function Navigation({ isSidebarOpen, toggleSidebarOpen }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarContent = (
    <>
      <div className="flex flex-col space-y-1">
        <SidebarItem
          icon="/assets/Home.png"
          text="Home"
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarItem
          icon="/assets/Explore.png"
          text="Explore"
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarItem
          icon="/assets/Subscriptions.png"
          text="Subscriptions"
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {isSidebarOpen && <Hr />}

      <div className="flex flex-col space-y-1">
        <Link
          href="#"
          className={`${
            !isSidebarOpen && "justify-center"
          } flex items-center space-x-3 hover:bg-[#303030] px-3 rounded-lg py-2`}
        >
          {isSidebarOpen ? (
            <div className="w-15 flex justify-between">
              <p className="text-md">You</p>
              <span>&gt;</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <User2 size={20} className="text-white" />
              <p className="text-[11px] text-white mt-2">You</p>
            </div>
          )}
        </Link>

        {isSidebarOpen && (
          <SidebarItem
            icon="/assets/Library.png"
            text="Library"
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {isSidebarOpen && (
          <SidebarItem
            icon="/assets/History.png"
            text="History"
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {isSidebarOpen && (
          <SidebarItem
            icon="/assets/YourVideos.png"
            text="YourVideos"
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {isSidebarOpen && (
          <SidebarItem
            icon="/assets/WatchLater.png"
            text="Watch Later"
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {isSidebarOpen && (
          <SidebarItem
            icon="/assets/LikedVideos.png"
            text="Liked Videos"
            isSidebarOpen={isSidebarOpen}
          />
        )}
      </div>

      {isSidebarOpen && <Hr />}

      {isSidebarOpen && (
        <>
          <div className="px-4 py-2">
            <h3 className="font-medium">Subscriptions</h3>
            <ul className="mt-2 space-y-2">
              {["Joel Aliyu", "Channel 2", "Channel 3", "Channel 4"].map(
                (channel) => (
                  <li
                    key={channel}
                    className="hover:bg-[#303030] rounded-lg px-4 py-1"
                  >
                    {channel}
                  </li>
                )
              )}
            </ul>
          </div>

          {isSidebarOpen && <Hr />}

          <div className="px-4 py-2">
            <h3 className="font-medium">Explore</h3>
            <div className="grid grid-cols-1 gap-1 mt-2">
              {[
                { icon: null, text: "Trending" },
                { icon: null, text: "Music" },
                { icon: null, text: "Movies & TV" },
                { icon: null, text: "Live" },
                { icon: null, text: "Gaming" },
                { icon: null, text: "News" },
                { icon: null, text: "Sports" },
                { icon: null, text: "Learning" },
                { icon: null, text: "Fashion & Beauty" },
                { icon: null, text: "Podcast" },
                { icon: null, text: "Playables" },
              ].map((item) => (
                <SidebarItem
                  key={item.text}
                  icon={item.icon}
                  text={item.text}
                  isSidebarOpen={isSidebarOpen}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Overlay when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebarOpen}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-[#212121] z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"
          }`}
        >
          <div className="p-4 h-full overflow-y-auto">{sidebarContent}</div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`h-screen flex-shrink-0 overflow-y-auto transition-all duration-200 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-2">{sidebarContent}</div>
    </div>
  );
}

{
  /* <div
  className={`${
    isSidebarOpen ? "block" : "hidden"
  } w-50 flex flex-col space-y-4 ml-2 text-md p-0 overflow-y-auto`}
></div>; */
}
