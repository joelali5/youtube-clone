"use client";
import { Upload } from "lucide-react";

export default function PublishVideo() {
  return (
    <div className="bg-[#282828] flex flex-col h-screen justify-center items-center ">
      <div className="p-4 rounded-full bg-[#1f1f1f] mb-4">
        <Upload size={100} className="text-[#909090]" />
      </div>
      <p className="text-white text-md">Drag and drop video files to upload</p>
      <p className="text-[#A3A3A3] text-sm mb-4">
        Your videos will be private till you publish them
      </p>
      <div>
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-block bg-gray-200 text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-400 transition"
        >
          Select files
        </label>
        <input id="file-upload" type="file" className="hidden" />
      </div>
    </div>
  );
}
