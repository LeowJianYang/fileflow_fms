
import {ConverterBar} from '../components/navbar';
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../stores/userstore.js';
import { useAppToast } from "../utils/use-toast.jsx";

export default function Converter() {
const navigate = useNavigate();
  const  toast  = useAppToast();
  const user = useUserStore((s) => s.user);
  if (!user) {
    toast.warning("Please login to access the dashboard.");
    navigate("/login", {replace: true});
  }

  return (
      <div>
          <ConverterBar />
          <h1>File Converter</h1>
        </div>
    );
}