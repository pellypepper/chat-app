"use client";
import Leftdashboard from "@/component/leftdashboard";
import Rightdashboard from "@/component/rightdashboard";
import type { Chat } from '@/types/user';

interface Props {
  selectedChat: Chat | null;
  handleUpdateOpen: (chat: Chat) => void;
  handleBack: () => void;
  handleGroup: () => void;
  handleChatSelect: (chatId: number, optionalChat?: Chat) => void;
  handleClick: () => void;
}

const DashboardMobileView: React.FC<Props> = ({
  selectedChat,
  handleUpdateOpen,
  handleBack,
  handleGroup,
  handleChatSelect,
  handleClick
}) => (
  <div className="md:hidden overflow-hidden ">
    {selectedChat ? (
      <Rightdashboard chat={selectedChat} handleUpdateOpen={handleUpdateOpen} onBack={handleBack} />
    ) : (
      <Leftdashboard handleGroup={handleGroup} onChatSelect={handleChatSelect} handleClick={handleClick} />
    )}
  </div>
);

export default DashboardMobileView;