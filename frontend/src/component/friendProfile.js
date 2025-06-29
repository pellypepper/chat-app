"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const image_1 = __importDefault(require("next/image"));
const react_2 = require("@headlessui/react");
const friendStore_1 = require("@/store/friendStore");
const loginStore_1 = require("@/store/loginStore");
const FriendCard = ({ chat, handleClickOutside }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [friendDetails, setFriendDetails] = (0, react_1.useState)(null);
    const initials = chat.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    const { user } = (0, loginStore_1.useAuthStore)();
    const { fetchFriendDetails } = (0, friendStore_1.useFriendsStore)();
    const friendId = chat.participants.find((id) => id !== user?.id);
    (0, react_1.useEffect)(() => {
        const fetchDetails = async () => {
            if (friendId) {
                try {
                    const res = await fetchFriendDetails(friendId);
                    setFriendDetails(res);
                }
                catch (err) {
                    console.error("Failed to fetch friend details", err);
                }
            }
        };
        fetchDetails();
    }, [friendId]);
    if (!friendDetails)
        return null;
    return (<>
      <div onClick={handleClickOutside} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(13, 17, 23, 0.8)" }}>
        <div className="relative w-auto bg-navbar-bg border-primary border max-w-md p-4 backdrop-blur-sm rounded-lg shadow-lg flex flex-col items-center">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden cursor-pointer border-2 border-blue-400 relative" onClick={() => setIsOpen(true)}>
            {friendDetails.profilePicture ? (<image_1.default src={friendDetails.profilePicture} alt={friendDetails.firstname} width={80} height={80} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold">
                {initials}
              </div>)}
          </div>

          <div className="mt-2 text-white text-sm font-semibold">
            {friendDetails.firstname} {friendDetails.lastname}
          </div>
          <div className="mt-1 text-gray-400 text-sm">{friendDetails.email}</div>
        </div>
      </div>

      {/* Modal to show full image */}
      <react_2.Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true"/>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <react_2.Dialog.Panel className="bg-[#0d1117] p-4 rounded-lg border border-primary max-w-md w-full">
            <div className="text-right mb-2">
              <button onClick={() => setIsOpen(false)} className="text-sm text-gray-400 hover:text-white">
                Close
              </button>
            </div>
            {friendDetails.profilePicture ? (<image_1.default src={friendDetails.profilePicture} alt={`${friendDetails.firstname}'s profile`} width={400} height={400} className="w-full h-auto rounded"/>) : (<div className="w-full h-64 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-4xl font-bold rounded">
                {initials}
              </div>)}
          </react_2.Dialog.Panel>
        </div>
      </react_2.Dialog>
    </>);
};
exports.default = FriendCard;
