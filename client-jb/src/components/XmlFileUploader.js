import React, { useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useAppContext } from '../context/appContext';
import UploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SUPPORTED_FILE_TYPES = ['.xml', '.mxl', '.musicxml'];

const XmlFileUploader = ({ refreshData }) => {
  const [file, setFile] = useState(null);
  const [scoreTitle, setScoreTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [skill, setSkill] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef();
  const { getCurrentUser } = useAppContext();

  const isFileSupported = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return SUPPORTED_FILE_TYPES.includes(`.${fileExtension}`);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (isFileSupported(selectedFile)) {
        setFile(selectedFile);
        setScoreTitle(selectedFile.name);
        setFileName(selectedFile.name);
        setUploadError(null);
      } else {
        alert(
          'Unsupported file type. Please select an XML, MXL, or MusicXML file.'
        );
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (isFileSupported(droppedFile)) {
        setFile(droppedFile);
        setScoreTitle(droppedFile.name);
        setFileName(droppedFile.name);
        setUploadError(null);
      } else {
        alert(
          'Unsupported file type. Please drop an XML, MXL, or MusicXML file.'
        );
      }
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
        alert('Please enter a title for the score.');
        return;
      }

      if (!userId) {
        alert('User ID is missing. Please ensure you are logged in.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('scoreTitle', scoreTitle);
      formData.append('skill', skill);

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
      setScoreTitle('');
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
    setScoreTitle('');
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
          accept=".xml,.mxl,.musicxml"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {!file && (
          <div className="flex flex-col items-center">
            <p className="text-gray-600 text-center">
              Drag and drop an XML, MXL or MusicXML file here, or click to
              select one.
            </p>
            <UploadIcon className="text-gray-600 sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl" />
          </div>
        )}
        {file && (
          <div className="mt-4 text-center">
            <TextField
              fullWidth
              label="Score title"
              variant="outlined"
              value={scoreTitle}
              onChange={(e) => setScoreTitle(e.target.value)}
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
