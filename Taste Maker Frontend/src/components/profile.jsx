import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { ImagePlus, LogOut, Trash2} from "lucide-react"; 
import imageCompression from "browser-image-compression";
import { useAuth } from "../context/AuthContext.jsx";


import bg from "../assets/rustic-vintage-cooking-background-showcasing-various-ingredients-herbs-ideal-italian-cuisine-themes-food-blogs-recipe-books-classic-design-that-captivates-culinary-imagination-ai_372197-51728.jpg"

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImg, setProfileImg] = useState(DEFAULT_AVATAR);
  const [newImage, setNewImage] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data);
        if (res.data.profilePicture) {
          setProfileImg(res.data.profilePicture);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. You may not be logged in.");
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          setTimeout(() => navigate("/auth"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.07, 
      maxWidthOrHeight: 600,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImg(base64String); 
        setNewImage(base64String); 
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Failed to compress image. Please try another file.");
    }
  };

  const handleSaveImage = async () => {
    if (!newImage) {
      alert("Please select a new image first.");
      return;
    }
    try {
      const res = await api.put("/profile", { image: newImage });
      setProfileImg(res.data.user.profilePicture);
      setNewImage(null); 
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Failed to save image:", err);
      alert("Error saving profile picture.");
    }
  };

  const handleLogout = async () => {
    await logout(); 
    navigate("/"); 
  };

  const handleDeleteAccount = async () => {
    
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      try {
        setLoading(true); 
        await api.delete("/profile"); 

        alert("Account deleted successfully.");
        await logout(); 
        navigate("/"); 
      } catch (err) {
        console.error("Failed to delete account:", err);
        alert("Failed to delete account. Please try again.");
        setLoading(false);
      }
      
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-300 bg-red-900/50 p-4 rounded max-w-md mx-auto">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-20 flex justify-center items-center min-h-screen pt-20 pb-10">
        <div className="max-w-md w-full p-6 bg-white/80 backdrop-blur-md shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Your Profile
          </h2>
          {user && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4 mb-4">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
                />

                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  <ImagePlus size={20} />
                  <span>Change Picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {newImage && (
                  <button
                    onClick={handleSaveImage}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors"
                  >
                    Save Picture
                  </button>
                )}
              </div>

              <div className="bg-gray-100/70 p-4 rounded-md shadow-inner">
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.username.toUpperCase()}
                </p>
              </div>
              <div className="bg-gray-100/70 p-4 rounded-md shadow-inner">
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-300 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                  disabled={loading} 
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                  disabled={loading} 
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;