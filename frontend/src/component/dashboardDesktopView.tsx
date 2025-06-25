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

const DashboardDesktopView: React.FC<Props> = ({
  selectedChat,
  handleUpdateOpen,
  handleBack,
  handleGroup,
  handleChatSelect,
  handleClick
}) => (
  <div className="hidden md:grid md:grid-cols-[30%_70%] overflow-hidden">
    <div className="overflow-hidden">
      <Leftdashboard handleGroup={handleGroup} onChatSelect={handleChatSelect} handleClick={handleClick} />
    </div>
    <div className="overflow-hidden">
      <Rightdashboard onBack={handleBack} handleUpdateOpen={handleUpdateOpen} chat={selectedChat} />
    </div>
  </div>
);

export default DashboardDesktopView;