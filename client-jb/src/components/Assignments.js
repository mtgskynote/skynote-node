import React, { useEffect, useState } from "react";
import {useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AssignmentsCSS from './Assignments.module.css'

import {
    faFileImport,
    faUser,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const Assignments = (props) => {
    const navigate = useNavigate();

    /* FOR NOW THIS CODE DOES NOT DISPLAY ANYTHING REAL */

  
  return (
    <div> This page should show the assignments </div>
  );
};

export default Assignments;