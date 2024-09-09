import React, { useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useAppContext } from '../context/appContext';
import UploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const XmlFileUploader = ({ refreshData }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); // State for file name
  const [skill, setSkill] = useState(''); // State for skill (optional)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef();
  const { getCurrentUser } = useAppContext();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Set fileName to the name of the uploaded file
      setUploadError(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name); // Set fileName to the name of the dropped file
      setUploadError(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    if (!file) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    try {
      const result = await getCurrentUser();
      const userId = result.id;

      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      if (!fileName) {
        alert('Please enter a file name.');
        return;
      }

      if (!userId) {
        alert('User ID is missing. Please ensure you are logged in.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('skill', skill);
      formData.append('skillLevel', 0); // Skill level is always 0

      setUploadError(null);
      const response = await axios.post(
        `/api/v1/profile/uploadXML/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      console.log('File uploaded successfully:', response.data);
      alert('File uploaded successfully!');

      setFile(null);
      setFileName('');
      setSkill('');
      setUploadProgress(0);
      if (refreshData) refreshData();
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file.');
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    // Reset the state to its initial values
    setFile(null);
    setFileName('');
    setSkill('');
    setUploadProgress(0);
    setUploadError(null);
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <div
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 flex items-center justify-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <input
          type="file"
          accept=".xml,.musicxml,.mxl"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {!file && (
          <div className="flex flex-col items-center">
            <p className="text-gray-600 text-center">
              Drag and drop an XML, MusicXML, or MXL file here, or click to
              select one.
            </p>
            <UploadIcon className="text-gray-600 sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl" />
          </div>
        )}
        {file && (
          <div className="mt-4 text-center">
            <TextField
              fullWidth
              label="File Name"
              variant="outlined"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Skill (optional)"
              variant="outlined"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="mb-4"
            />
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <p
                  className="text-blue-500 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change file
                </p>
                <p
                  className="text-red-500 cursor-pointer"
                  onClick={handleCancel}
                >
                  Cancel upload
                </p>
              </div>
              <Button
                variant="contained"
                color="success"
                onClick={handleUpload}
                className="ml-auto"
              >
                Upload
              </Button>
            </div>

            {uploadProgress > 0 && !uploadError && (
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
              </div>
            )}
            {uploadError && <p className="text-red-500 mt-4">{uploadError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

XmlFileUploader.propTypes = {
  refreshData: PropTypes.func,
};

export default XmlFileUploader;
