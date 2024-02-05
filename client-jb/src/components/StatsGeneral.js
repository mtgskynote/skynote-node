import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import {
    faStar,
} from "@fortawesome/free-solid-svg-icons";
import StatsGeneralCSS from './StatsGeneral.module.css'


const StatsGeneral = (props) => {
  const [num, setNum] = useState(null);

  useEffect(()=>{
    if(props.numberRecordings!==null){
      const recNames=props.numberRecordings
      setNum(recNames.length)
    }
  },[props])
  

  return (
    <div >
      <h4>
        General Information 
      </h4>
      <div>
        <ul className={StatsGeneralCSS.list}>
          <li className={StatsGeneralCSS.entry}>Pending tasks to submit: 0</li>
          <li className={StatsGeneralCSS.entry}>Tasks submitted: 0</li>
          <li className={StatsGeneralCSS.entry}>Total number of recordings: {num}</li>
        </ul>
      </div>
    </div>
  );
};

export default StatsGeneral;
    