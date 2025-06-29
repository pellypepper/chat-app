"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profileDetails_1 = __importDefault(require("@/component/profileDetails"));
const createGroup_1 = __importDefault(require("@/component/createGroup"));
const updateGroup_1 = __importDefault(require("@/component/updateGroup"));
const friendProfile_1 = __importDefault(require("@/component/friendProfile"));
const ModalsContainer = ({ isOpen, handleClose, showCreateGroup, handleClickOutside, showUpdateGroup, updateGroupChat, handleGroupUpdated, showFriendProfile, }) => (<>
    {/* Profile Details Modal */}
    <div className={`${isOpen ? "flex" : "hidden"} fixed inset-0 z-[1000] bg-navbar-bg flex-col  items-center justify-center overflow-auto`}>
      <button onClick={handleClose} className="text-primary text-3xl font-bold hover:text-red-500 transition-colors p-2" aria-label="Close">
        &times;
      </button>
      <profileDetails_1.default />
    </div>

    <div className={`${showCreateGroup ? "block" : "hidden"} absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center h-full border p-4 md:p-8 z-[100]`}>
      <createGroup_1.default handleClickOutside={handleClickOutside}/>
    </div>

    <div className={`${showUpdateGroup ? "block" : "hidden"} absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center h-full border p-4 md:p-8 z-[100]`}>
      {updateGroupChat && (<updateGroup_1.default handleClickOutside={handleClickOutside} onGroupUpdated={handleGroupUpdated} group={{
            id: updateGroupChat.id,
            name: updateGroupChat.name,
            participants: updateGroupChat.participants.map(p => p.id),
        }}/>)}
    </div>

    <div className={`${showFriendProfile ? "block" : "hidden"} absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center h-full border p-4 md:p-8 z-[100]`}>
      {updateGroupChat && (<friendProfile_1.default chat={{
            id: updateGroupChat.id,
            name: updateGroupChat.name,
            participants: updateGroupChat.participants.map(p => p.id),
        }} handleClickOutside={handleClickOutside}/>)}
    </div>
  </>);
exports.default = ModalsContainer;
