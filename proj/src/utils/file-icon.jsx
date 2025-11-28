import { FileText, FileChartPie, Clapperboard, FileChartLine, Folder } from "lucide-react";
const fileIcons = {
  docx: <FileText color="#22c55e" size={50} />,
  pptx: <FileChartPie color="#f7c81b" size={50} />,
  xlsx: <FileChartLine color="#21a366" size={50} />,
  mp4: <Clapperboard color="#f97316" size={50} />,
  folder: <Folder color="#2b8cee" size={50} />
};

export default fileIcons;