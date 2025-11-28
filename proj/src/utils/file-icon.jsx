import { FileText, FileChartPie, Clapperboard, FileChartLine, Folder,
  File,
  FileAudio,
  FileVideo,
  FileImage,
  FileCode } from "lucide-react";

// 每个类型存 { component, defaultColor }
const fileIcons = { docx: <FileText color="#22c55e" size={50} />, pptx: <FileChartPie color="#f7c81b" size={50} />, xlsx: <FileChartLine color="#21a366" size={50} />, mp4: <Clapperboard color="#f97316" size={50} />, folder: <Folder color="#2b8cee" size={50} /> };

export const mimeIconMap = {
  
  "text/plain": { component: FileText, color: "#22c55e" },
  "application/msword": { component: FileText, color: "#22c55e" },
  "application/pdf": { component: FileText, color: "#f87171" },
  "application/json": { component: FileCode, color: "#facc15" },
  "application/javascript": { component: FileCode, color: "#facc15" },
  "text/html": { component: FileCode, color: "#facc15" },
  "text/css": { component: FileCode, color: "#3b82f6" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { component: FileChartPie, color: "#f7c81b" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { component: FileChartLine, color: "#21a366" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { component: FileText, color: "#22c55e" },
  "image/jpeg": { component: FileImage, color: "#a855f7" },
  "image/png": { component: FileImage, color: "#a855f7" },
  "image/gif": { component: FileImage, color: "#a855f7" },

  
  "audio/mpeg": { component: FileAudio, color: "#f97316" },
  "audio/wav": { component: FileAudio, color: "#f97316" },

 
  "video/mp4": { component: FileVideo, color: "#10b981" },
  "video/webm": { component: FileVideo, color: "#10b981" },
};


export const defaultIcon = { component: File, color: "#9ca3af" };

export function GetIconByFileType({ filetype, size = 20, className, color }) {
  const { component: IconComponent, color: defaultColor } = mimeIconMap[filetype] || defaultIcon;
  
  return <IconComponent size={size} color={color || defaultColor} className={className} />;
}
export default mimeIconMap;