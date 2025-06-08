

const ProfileDetails = () => {


  return (
 
     <div className="" id="profile">
            <div className="text-center mb-6 pt-4">
                <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-3xl font-bold mb-2">
                    Profile
                </h1>
                <p className="text-secondary">Manage your personal information</p>
            </div>
            <div className="bg-[#161b22]/80 border border-primary rounded-2xl p-6 mb-4 relative overflow-hidden text-center backdrop-blur-lg">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-purple opacity-10"></div>
                <div className="w-20 h-20 rounded-full border-4 border-blue-400 mx-auto bg-gradient-purple flex items-center justify-center text-3xl relative z-10">
                    JD
                </div>
                <div className="text-xl font-bold mt-2">John Doe</div>
                <div className="text-secondary mb-2">Always learning something new 🚀</div>
                <div className="flex justify-around pt-4 border-t border-primary">
                    <div className="text-center">
                        <div className="text-xl font-bold text-blue-400">142</div>
                        <div className="text-secondary text-sm">Friends</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-blue-400">8</div>
                        <div className="text-secondary text-sm">Groups</div>
                    </div>
                
                </div>
            </div>
            <div className="bg-[#161b22]/80 border border-primary rounded-2xl p-6 mb-4 backdrop-blur-lg">
                <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">First Name</label>
                    <input type="text" className="w-full p-3 bg-primary border border-[#30363d] rounded-lg text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10" value="John Doe" placeholder="Enter your name" />
                </div>
              <div className="mb-4">
                    <label className="block mb-2 font-medium">Last Name</label>
                    <input type="text" className="w-full p-3 bg-primary border border-[#30363d] rounded-lg text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10" value="John Doe" placeholder="Enter your name" />
                </div>
              <div className="mb-4">
                    <label className="block mb-2 font-medium">Email</label>
                    <input type="text" className="w-full p-3 bg-primary border border-[#30363d] rounded-lg text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10" value="John Doe" placeholder="Enter your name" />
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-purple text-primary py-2 px-6 rounded-lg font-semibold hover:translate-y-[-2px] hover:shadow-lg transition">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L9.708 9H2.5A1.5 1.5 0 0 0 1 10.5v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V14h1.5a.5.5 0 0 0 .5-.5v-2.293L15.854 3.854a.5.5 0 0 0 0-.708l-3-3z"/>
                    </svg>
                    Save Changes
                </button>
            </div>
        </div>

  )
}

export default ProfileDetails
