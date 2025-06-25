"use client";
import ProfileDetails from '@/component/profileDetails';
import CreateGroup from '@/component/createGroup';
import UpdateGroup from '@/component/updateGroup';
import FriendProfile from '@/component/friendProfile';
import type { Chat } from '@/types/user';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  showCreateGroup: boolean;
  handleClickOutside: () => void;
  showUpdateGroup: boolean;
  updateGroupChat: Chat | null;
  handleGroupUpdated: (updated: { id: number; name: string; participants: number[] }) => void;
  showFriendProfile: boolean;
}

const ModalsContainer: React.FC<Props> = ({
  isOpen,
  handleClose,
  showCreateGroup,
  handleClickOutside,
  showUpdateGroup,
  updateGroupChat,
  handleGroupUpdated,
  showFriendProfile,
}) => (
  <>
    {/* Profile Details Modal */}
    <div
      className={`${
        isOpen ? "flex" : "hidden"
      } fixed inset-0 z-[1000] bg-navbar-bg flex-col  items-center justify-center overflow-auto`}
    >
      <button
        onClick={handleClose}
        className="text-primary text-3xl font-bold hover:text-red-500 transition-colors p-2"
        aria-label="Close"
      >
        &times;
      </button>
      <ProfileDetails />
    </div>

    <div className={`${showCreateGroup ? "block" : "hidden"} absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center h-full border p-4 md:p-8 z-[100]`}>
      <CreateGroup handleClickOutside={handleClickOutside} />
    </div>

    <div className={`${showUpdateGroup ? "block" : "hidden"} absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center h-full border p-4 md:p-8 z-[100]`}>
      {updateGroupChat && (
        <UpdateGroup
          handleClickOutside={handleClickOutside}
          onGroupUpdated={handleGroupUpdated}
          group={{
            id: updateGroupChat.id,
            name: updateGroupChat.name,
            participants: updateGroupChat.participants.map(p => p.id),
          }}
        />
      )}
    </div>

    <div className={`${showFriendProfile ? "block" : "hidden"} absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center h-full border p-4 md:p-8 z-[100]`}>
      {updateGroupChat && (
        <FriendProfile
          chat={{
            id: updateGroupChat.id,
            name: updateGroupChat.name,
            participants: updateGroupChat.participants.map(p => p.id),
          }}
          handleClickOutside={handleClickOutside}
        />
      )}
    </div>
  </>
);

export default ModalsContainer;