// frontend/src/pages/InfoPage.jsx
import About from "../components/About";
import VisionMission from "../components/VisionMission";
import { useParams } from "react-router-dom";

export default function InfoPage() {
  const { section } = useParams();

  if (section === "about") {
    return <About />;
  }
  if (section === "vision") {
    return <VisionMission />;
  }
  return <div>Section not found.</div>;
}