import Link from "next/link";

export default function SidebarItem({ icon, text, isSidebarOpen }) {
  return (
    <Link
      href="#"
      className={`flex ${
        isSidebarOpen ? "space-x-6 items-center" : "flex-col mb-3 items-center"
      } hover:bg-[#303030] rounded-lg p-2`}
    >
      <img src={icon} alt={`${text} Icon`} className="w-6 h-6" />
      <span className={`${!isSidebarOpen && "text-[11px]"} mt-2 text-white`}>
        {text}
      </span>
    </Link>
  );
}
