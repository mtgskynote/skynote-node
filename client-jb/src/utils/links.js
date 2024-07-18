import {
  IoBarChartSharp,
  IoBarcodeOutline,
  IoChatboxOutline,
} from 'react-icons/io5'
import { MdQueryStats } from 'react-icons/md'
import { FaWpforms } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'
import { ImMusic } from 'react-icons/im'

const links = [
  { id: 1, text: '   Profile', path: '/profile', icon: <ImProfile /> },
  { id: 2, text: '   Dashboard', path: '/', icon: <IoBarChartSharp /> },
  {
    id: 3,
    text: '   Assignments',
    path: '/assignments',
    icon: <IoChatboxOutline />,
  },
  {
    id: 4,
    text: '   All lessons',
    path: '/all-lessons',
    icon: <MdQueryStats />,
  },
  {
    id: 5,
    text: '   Sound visualization',
    path: '/TimbreVisualization',
    icon: <ImMusic />,
  },
  {
    id: 6,
    text: '   My recordings',
    path: '/myrecordings',
    icon: <IoBarcodeOutline />,
  },
  { id: 7, text: '   API testing', path: '/apitesting', icon: <FaWpforms /> },
]

export default links
