import { IoBarChartSharp, IoBarcodeOutline } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { ImMusic } from "react-icons/im";

const links = [
  { id: 1, text: "   Profile", path: "/profile", icon: <ImProfile /> },
  { id: 2, text: "   Dashboard", path: "/", icon: <IoBarChartSharp /> },
  { id: 3, text: "   All lessons", path: "/all-lessons", icon: <MdQueryStats /> },
  { id: 4, text: "   Sound visualization", path: "/TimbreVisualization", icon: <ImMusic /> },
  { id: 5, text: "   My recordings", path: "/myrecordings", icon: <IoBarcodeOutline/>}
];

export default links;
