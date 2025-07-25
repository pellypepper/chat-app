import { useState, useEffect, useRef } from "react";
import { useProfileStore } from "@/store/profileStore";
import { useRouter } from "next/navigation";
import { useFriendsStore } from "@/store/friendStore";
import { useChatStore } from "@/store/messageStore";
import { Camera } from "lucide-react";
import Image from "next/image";



const ProfileDetails = () => {
  const { getProfile, user,  updateProfile, uploadProfilePicture,  isLoading} = useProfileStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [picture, setPicture] = useState<string | null>(null);
const {friends} = useFriendsStore();
  const router = useRouter();
  const { chats } = useChatStore();
useEffect(() => {
  const fetchUser = async () => {
    await getProfile();
  };
  fetchUser();
}, [getProfile]); 

useEffect(() => {
  if (user) {
    setFirstName(user.firstname);
    setLastName(user.lastname);
    setEmail(user.email);
    setPicture(user.profilePicture || "");

  }
}, [user]);

const group = chats.filter((chat) => chat.isGroup);

//  Handle profile update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Updating profile with:", { firstName, lastName, email });
      await updateProfile({ firstname: firstName, lastname: lastName, email });
      console.log("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Error updating profile. Please try again.");
    }
  };

    const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

    const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  return (
    <div id="profile">
      <div className="text-center  mb-6 pt-4">
        <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-3xl font-bold mb-2">
          Profile
        </h1>
        <p className="text-secondary">Manage your personal information</p>
      </div>

      <div className="bg-[#161b22]/80 border border-primary rounded-2xl p-6 mb-4 relative overflow-hidden text-center backdrop-blur-lg">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-purple opacity-10"></div>
 <div
  className="w-20 h-20 rounded-full border-4 border-blue-400 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl text-white cursor-pointer overflow-hidden relative z-10"
  onClick={handleClick}
>
  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleFileChange}
    className="hidden"
  />

  {picture ? (
    <Image
      width={80}
      height={80}
      src={picture}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    initials
  )}

  {/* Camera Icon Overlay */}
  <div className="absolute bottom-0 z-[1000] right-1 bg-black/60 rounded-full p-1 flex items-center justify-center ">
    <Camera className="w-5 h-5 text-white" />
  </div>
</div>
        <div className="text-xl font-bold mt-2">{firstName} {lastName}</div>

        <div className="flex justify-around pt-4 border-t border-primary">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{friends.length}</div>
            <div className="text-secondary text-sm">Friends</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{group.length}</div>
            <div className="text-secondary text-sm">Groups</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="bg-[#161b22]/80 border border-primary rounded-2xl p-6 mb-4 backdrop-blur-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

        <div className="mb-4">
          <label className="block mb-2 font-medium">First Name</label>
          <input
            type="text"
            className="w-full p-3 bg-primary border border-primary rounded-lg text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Last Name</label>
          <input
            type="text"
            className="w-full p-3 bg-primary border border-primary rounded-lg text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-3 bg-primary border border-primary rounded-lg text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <button
        type="button"
           onClick={()=> router.push('/change-password')}
        
          className="w-full flex items-center justify-center gap-2 bg-gradient-purple text-primary py-2 px-6 rounded-lg font-semibold hover:translate-y-[-2px] hover:shadow-lg transition disabled:opacity-50"
        >
         <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M3 8a5 5 0 1 1 9.584 1H16v2h-2v2h-2v-2H9v-2.416A5 5 0 0 1 3 8zm5-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
</svg>
         Change password 
        </button>
        <button
 
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-purple text-primary py-2 px-6 rounded-lg font-semibold hover:translate-y-[-2px] hover:shadow-lg transition disabled:opacity-50"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L9.708 9H2.5A1.5 1.5 0 0 0 1 10.5v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V14h1.5a.5.5 0 0 0 .5-.5v-2.293L15.854 3.854a.5.5 0 0 0 0-.708l-3-3z"/>
          </svg>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileDetails;
