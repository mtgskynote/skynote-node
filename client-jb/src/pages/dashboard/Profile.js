import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import axios from 'axios'
import LoadingScreen from '../../components/LoadingScreen'
import Error from '../../components/Error'
import AlertNew from '../../components/AlertNew'

const Profile = () => {
  const { getCurrentUser } = useAppContext()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)
  const [initialFormData, setInitialFormData] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [changePassword, setChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [alertText, setAlertText] = useState('')
  const [alertType, setAlertType] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const errorMessages = {
    profileDataError: 'No data available.',
  }

  useEffect(() => {
    setIsLoading(false)
  }, [formData])

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const result = await getCurrentUser()
        const response = await axios.get('/api/v1/auth/getProfileData', {
          params: {
            userId: result.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (response.status === 200) {
          setFormData(response.data.user)
          setInitialFormData(response.data.user)
        } else {
          console.error('Error fetching profile data:', response.statusText)
          showAlertMessage('Error fetching profile data', 'error')
        }
      } catch (error) {
        console.error('Network error:', error)
        showAlertMessage('Network error', 'error')
        setFormData(initialFormData)
      }
    }

    fetchDataFromAPI()
  }, [])

  // Function to show the alert
  const showAlertMessage = (text, type) => {
    setAlertText(text)
    setAlertType(type)
    setShowAlert(true)

    // After 2 seconds, hide the alert
    setTimeout(() => {
      setShowAlert(false)
      setAlertText('')
    }, 2000)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const currentUser = initialFormData
    const updatedFormData = {
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      instrument: initialFormData.instrument,
    }

    const updateProfileData = async () => {
      try {
        const profileResponse = await axios.post(
          '/api/v1/profile/updateProfileData',
          updatedFormData,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (profileResponse.status === 200) {
          setIsEditing(false)
          console.log('Profile updated successfully!', profileResponse.data)
          showAlertMessage('Profile updated successfully!', 'success')
        } else {
          console.error('Error updating profile:', profileResponse.statusText)
          showAlertMessage('Error updating profile', 'error')
          setFormData(initialFormData)
        }
      } catch (error) {
        console.error('Network error:', error)
        showAlertMessage('Network error', 'error')
        setFormData(initialFormData)
      }
    }

    const updatePassword = async () => {
      if (newPassword !== confirmPassword) {
        console.log('not the same')
        showAlertMessage('New passwords do not match', 'error')
        setIsEditing(true)
        return
      }

      try {
        console.log('trying to update password')
        const passwordResponse = await axios.post(
          '/api/v1/profile/changePassword',
          { newPassword: newPassword },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (passwordResponse.status === 200) {
          setIsEditing(false)
          console.log('Password updated successfully!')
          showAlertMessage('Password updated successfully!', 'success')
        } else {
          console.error('Error updating password:', passwordResponse.statusText)
          showAlertMessage('Error updating password', 'error')
          setFormData(initialFormData)
        }
      } catch (error) {
        console.error('Network error:', error)
        showAlertMessage('Network error', 'error')
        setFormData(initialFormData)
      }
    }

    // Check if profile information has changed
    const isProfileDataChanged =
      formData.name !== currentUser.name ||
      formData.lastName !== currentUser.lastName ||
      formData.email !== currentUser.email

    // Update profile data if changed
    if (isProfileDataChanged) {
      await updateProfileData()
    }

    // Update password if changePassword is true
    if (changePassword && newPassword && confirmPassword) {
      await updatePassword()
    }
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  useEffect(() => {
    if (formData !== null) {
      setIsPageLoading(false)
    }
  }, [formData])

  if (isPageLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex flex-col items-center justify-start mt-20 h-screen">
      <div className="text-left text-2xl font-bold mb-2">
        <h1>My Profile</h1>
      </div>
      {showAlert && <AlertNew severity={alertType} alertText={alertText} />}
      {isLoading ? (
        <p>Loading...</p>
      ) : formData ? (
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="flex space-x-6">
            <div className="mb-3 flex-1">
              <label
                htmlFor="firstName"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="name"
                value={formData.name === 'firstName' ? '' : formData.name || ''}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                disabled={!isEditing}
              />
            </div>
            <div className="mb-2 flex-1">
              <label
                htmlFor="lastName"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={
                  formData.lastName === 'lastName'
                    ? ''
                    : formData.lastName || ''
                }
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="3">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="bg-gray-50 mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              disabled={!isEditing}
            />
          </div>
          {isEditing ? (
            <>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="flex space-x-4 items-center">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={'*********'}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    disabled
                  />
                  <button
                    type="button"
                    className={`ml-4 ${
                      changePassword
                        ? 'bg-red-200 hover:bg-red-300 text-red-700'
                        : 'bg-blue-300 hover:bg-blue-400 text-blue-700'
                    } text-sm border-none font-small rounded-lg px-2 py-1.5`}
                    onClick={() => {
                      setChangePassword(!changePassword)
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                  >
                    {changePassword ? 'Cancel' : 'Change'}
                  </button>
                </div>
              </div>
              {changePassword && (
                <div className="mb-3">
                  <label
                    htmlFor="newPassword"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
              )}
            </>
          ) : null}
          <div className="mb-3">
            <label
              htmlFor="My Instruments"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              My Instruments
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div
                  className={`h-4 w-4 rounded-full ${
                    formData.instrument === 'violin'
                      ? 'bg-green-300'
                      : 'bg-gray-300'
                  }`}
                ></div>
                <span className="ml-2 font-small text-sm">Violin</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`h-4 w-4 rounded-full ${
                    formData.instrument === 'voice'
                      ? 'bg-green-300'
                      : 'bg-gray-300'
                  }`}
                ></div>
                <span className="ml-2 font-small text-sm">Voice</span>
              </div>
            </div>
          </div>
          {isEditing ? (
            <>
              <button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-600 border-none font-large rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="ml-4 bg-red-200 hover:bg-red-300 text-red-700 text-sm border-none font-small rounded-lg px-2 py-1.5"
                onClick={() => {
                  setIsEditing(false)
                  setChangePassword(false) // Hide password fields when cancel is clicked
                  setNewPassword('')
                  setConfirmPassword('')
                  setFormData(initialFormData)
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true)
              }}
              className="text-white bg-blue-500 hover:bg-blue-600 border-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2"
            >
              Edit Profile
            </button>
          )}
        </form>
      ) : (
        <Error message={errorMessages.profileDataError} />
      )}
    </div>
  )
}

export default Profile
