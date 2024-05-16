import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import ProfileCSS from "./Profile.module.css";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";

const Profile = () => {
  // Manage edit state, form values, and loading state
  const { getCurrentUser } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initially loading

  useEffect(() => {
    console.log(
      `In useEffect, formData has been updated to ${JSON.stringify(formData)}`
    ); // This will log the updated state
    setIsLoading(false);
  }, [formData]);

  // Fetch member data from the API
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const result = await getCurrentUser(); // fetchData is already an async function

        console.log(
          `getCurentUser() has returnd this result: ${JSON.stringify(result)}`
        );
        console.log(` now call getProfileData with ${result.id}`);
        const response = await axios.get("/api/v1/auth/getProfileData", {
          params: {
            userId: result.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          console.log(
            `setting formData with arg ${JSON.stringify(response.data.user)}`
          );
          setFormData(response.data.user);
        } else {
          // Handle error (e.g., display error message)
          console.error("Error fetching profile data:", response.statusText);
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Network error:", error);
      } finally {
        //setIsLoading(false); // Ensure loading state is updated
      }
    };

    fetchDataFromAPI();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    //-----  print the form data out just for fun. ---
    const formData = new FormData(event.target);
    let result = "";
    for (let [name, value] of formData.entries()) {
      result += `${name}: ${value}\n`;
    }
    alert(result);
    //--------------------------------------------------

    try {
      const response = await axios.post(
        "/api/v1/auth/updateProfileData",
        formData,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json", //'multipart/form-data' // 'application/x-www-form-urlencoded' //
          },
        }
      );

      if (response.status === 200) {
        // Handle successful update (e.g., display success message, update formData)
        console.log("Profile updated successfully!");
      } else {
        // Handle error (e.g., display error message)
        console.error("Error updating profile:", response.statusText);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Network error:", error);
    }
  };

  // Handle form field changes
  const handleChange = (event) => {
    console.log("handleChange");
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (formData !== null) {
      setIsLoading(false);
    }
  }, [formData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ width: "100%" }}>
      <div align="center">
        <h1>Skynote Profile</h1>
      </div>

      <div className={ProfileCSS.profilepage}>
        {isLoading ? (
          <p>Loading...</p>
        ) : formData ? (
          <form onSubmit={handleSubmit}>
            <div className={ProfileCSS.field}>
              <label htmlFor="firstName" className={ProfileCSS.profilelabel}>
                First Name:
              </label>
              <input
                className={ProfileCSS.profileinput}
                type="text"
                id="firstName"
                name="name"
                value={formData.name || "firstName"}
                onChange={handleChange}
                required
              />
            </div>

            <div className={ProfileCSS.field}>
              <label htmlFor="lastName" className={ProfileCSS.profilelabel}>
                Last Name:
              </label>
              <input
                className={ProfileCSS.profileinput}
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || "lastName"}
                onChange={handleChange}
                required
              />
            </div>

            <div className={ProfileCSS.field}>
              <label htmlFor="email" className={ProfileCSS.profilelabel}>
                Email:
              </label>
              <input
                className={ProfileCSS.profileinput}
                type="text"
                id="email"
                name="email"
                value={formData.email || "email"}
                onChange={handleChange}
                required
              />
            </div>

            <div className={ProfileCSS.field}>
              <label htmlFor="role" className={ProfileCSS.profilelabel}>
                Role:
              </label>
              <input
                className={ProfileCSS.profileinput}
                type="text"
                id="role"
                name="role"
                value={formData.role || "student"}
                onChange={handleChange}
                required
              />
            </div>

            <div className={ProfileCSS.field}>
              <label htmlFor="teacher" className={ProfileCSS.profilelabel}>
                Teacher:
              </label>
              <input
                className={ProfileCSS.profileinput}
                type="text"
                id="teacher"
                name="teacher"
                value={formData.teacher || "5d34c59c098c00453a233bf3"}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
