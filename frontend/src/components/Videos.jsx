import { useVideos } from "@/hooks/useVideos";
import { MoreVertical, SidebarOpen } from "lucide-react";
import Link from "next/link";

export default function Videos({ isSidebarOpen }) {
  const { videos, loading, error } = useVideos();
  return (
    <div
      className={`${
        isSidebarOpen ? "w-6/7" : "w-10/11"
      } px-3 grid sm:grid-cols-2 md:grid-cols-3 gap-y-0 sm:gap-4 h-screen`}
    >
      {videos.map((video) => (
        <Link href="#" className="w-full h-[300px] space-y-4" key={video._id}>
          <div className="h-[200px] relative">
            <img
              src={video.owner.avatar}
              alt="Video thumbnail"
              className="w-full h-full object-cover rounded-t-lg"
            />
            <p className="absolute right-1 bottom-0.5 text-xs font-semibold bg-[#303030] px-1 rounded-sm">
              23:10
            </p>
          </div>
          <div className="flex space-x-2">
            <img
              src="/photo.jpg"
              alt=""
              className="w-1/10 h-1/10 rounded-full border-2 border-gray-200"
            />
            <div className="w-8/10 text-[10px] lg:text-sm text-[#F1F1F1] font-semibold">
              <p>{video.title}</p>
              <p>AcapellaTV</p>
              <div className="flex space-x-1 text-[#AAAAAA] mt-2">
                <p>114K views</p>
                <span>.</span>
                <p>2 weeks ago</p>
              </div>
            </div>
            <MoreVertical
              strokeWidth={1.0}
              size={12}
              className="w-1/10 h-1/5 rounded-full hover:bg-[#303030]"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
