import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePicture: "",
    jobRole: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "",
        jobRole: user.jobRole || "",
      });
    }
  }, [user]);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (image) formData.append("profilePicture", image);
    formData.append("name", userData.name);
    formData.append("jobRole", userData.jobRole);

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("⚠️ No token found! Please log in again.");
        alert("Session expired. Please log in again.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await axios.put("https://userbridge-2.onrender.com/api/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, 
      });
      


        // const response = await axios.put("http://localhost:4000/api/user/update-profile", formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //         Authorization: `Bearer ${token}`,
        //     },
        //     withCredentials: true, 
        // });

        const updatedUser = response.data.user;
        setUser(updatedUser);
        setUserData((prev) => ({ ...prev, profilePicture: updatedUser.profilePicture }));
        setPreview(null);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
        console.error("❌ Error updating profile:", error?.response?.data?.message || "Update failed");
        if (error.response?.status === 401) {
            alert("Unauthorized. Please log in again.");
        }
    } finally {
        setIsLoading(false);
    }
};


  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Update Profile</h1>

      {/* Profile Picture */}
      <div className="mb-4 text-center">
        <div className="w-32 h-32 mx-auto rounded-full border border-gray-300 overflow-hidden">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : userData.profilePicture ? (
            <img
              src={
                userData.profilePicture.startsWith("http")
                  ? userData.profilePicture
                  : `http://localhost:4000/uploads/${userData.profilePicture}`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center bg-gray-200 text-xl font-bold">
              {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>
        <input type="file" onChange={handleImageChange} className="mt-2 block w-full" />
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Name</label>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Job Role */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Job Role</label>
        <input
          type="text"
          value={userData.jobRole}
          onChange={(e) => setUserData({ ...userData, jobRole: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        onClick={handleProfileUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default ProfilePage;
