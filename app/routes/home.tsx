import type { Route } from "./+types/home";
import { WorkingImageCrop } from "../components/WorkingImageCrop";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "圖片裁切工具" },
    { name: "description", content: "上傳圖片並裁切為512x512大小的工具" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            圖片裁切工具
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            這是一個可上傳圖片然後裁切後下載的網頁
          </p>
          <p className="text-sm text-gray-500">
            支援1024x1024或更大的圖片，可裁切為512x512大小
          </p>
        </div>
        
        <WorkingImageCrop />
      </div>
    </div>
  );
}
