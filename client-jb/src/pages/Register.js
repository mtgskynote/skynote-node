import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Alert } from '../components';
import { useAppContext } from '../context/appContext';

// default initial state of form
const initialState = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  instrument: 'violin',
  isMember: true,
};
// available roles to choose from when registering
const roles = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
];
// available instruments to choose from when registering
const instruments = [{ value: 'violin', label: 'Violin' }];

function Register() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  const { user, showAlert, displayAlert, setupUser } = useAppContext();

  // Function to toggle the 'isMember' state
  const toggleMember = () => {
    setFormData({
      ...formData,
      isMember: !formData.isMember,
    });
  };

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, role, password, isMember, instrument } = formData;
    if (!email || !password || (!isMember && !name && !instrument)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, role, password, instrument };

    // If the user is a member, log them in, otherwise register them
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: 'login',
        alertText: 'Login Successful! Redirecting...',
      });
    } else {
      setupUser({
        currentUser,
        endPoint: 'register',
        alertText: 'User Created! Redirecting...',
      });
    }
  };

  // useEffect hook to navigate to home page if user is logged in or registered
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 lg:w-1/3 md:w-3/4 sm:w-full">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <Logo width={175} height={75} />
        </div>
        {showAlert && <Alert />}

        {/* Form Section */}
        <form className="w-full" onSubmit={onSubmit}>
          {/* Name Field */}
          {!formData.isMember && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow-sm appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Role Dropdown */}
          {!formData.isMember && (
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-gray-700 font-bold text-sm mb-2"
              >
                I am a...
              </label>
              <select
                id="role"
                name="role"
                className="w-full py-2 px-3 border rounded leading-tight focus:outline-none focus:shadow-outline"
                value={formData.role}
                onChange={handleChange}
              >
                {roles.map((role, index) => {
                  return (
                    <option key={index} value={role.value}>
                      {role.label}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Instrument Dropdown */}
          {!formData.isMember && (
            <div className="mb-8">
              <label
                htmlFor="instrument"
                className="block text-gray-700 font-bold text-sm mb-2"
              >
                I want to practice...
              </label>
              <select
                id="instrument"
                name="instrument"
                className="w-full py-2 px-3 border rounded leading-tight focus:outline-none focus:shadow-outline"
                value={formData.instrument}
                onChange={handleChange}
              >
                {instruments.map((instrument, index) => {
                  return (
                    <option key={index} value={instrument.value}>
                      {instrument.label}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Button section - submit and sign up toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <button
              className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 outline-none border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="submit"
            >
              {formData.isMember ? 'Login' : 'Register'}
            </button>

            <p
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
              onClick={toggleMember}
            >
              {formData.isMember ? 'Not a member?' : 'Back to login'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
