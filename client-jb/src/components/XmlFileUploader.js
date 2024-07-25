// src/XmlFileUploader.js
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/appContext';

const XmlFileUploader = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef();
  const { getCurrentUser } = useAppContext();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      readFileContent(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      readFileContent(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    const result = await getCurrentUser();
    const userId = result.id;

    if (file && userId) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('skill', ''); // Append skill if provided

      try {
        const response = await axios.post(`/upload/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        });

        // Handle success
        console.log('File uploaded successfully:', response.data);
        alert('File uploaded successfully!');

        // Reset states
        setFile(null);
        setUploadProgress(0);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file.');
      }
    } else {
      alert('Please select a file and provide a user ID.');
    }
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <div
        className="w-full max-w-3xl border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
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
          <p className="text-gray-600">
            Drag and drop an XML, MusicXML, or MXL file here, or click to select
            one.
          </p>
        )}
        {file && (
          <div className="mt-4">
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload {file.name}
            </button>
            {uploadProgress > 0 && (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default XmlFileUploader;
