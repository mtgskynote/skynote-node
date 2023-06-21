import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const links = [
  { id: 1, text: "profile", path: "profile", icon: <ImProfile /> },
  { id: 2, text: "dashboard", path: "/", icon: <IoBarChartSharp /> },
  { id: 3, text: "all lessons", path: "all-lessons", icon: <MdQueryStats /> },
];

export default links;
