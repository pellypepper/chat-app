'use client';

import React, { useEffect, useState } from 'react';
import { useChatStore } from '@/store/messageStore';
import { useAuthStore } from '@/store/loginStore';
import { useFriendsStore } from '@/store/friendStore';
import type { Chat } from '@/types/user';
import { MultiRingSpinner } from '@/component/spinner';
import { useRouter } from 'next/navigation'; 
import DashboardMobileView from '@/component/dashboardMobileView';
import DashboardDesktopView from '@/component/dashboardDesktopView';
import ModalsContainer from '@/component/ModalContainer';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showUpdateGroup, setShowUpdateGroup] = useState(false);
  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const [updateGroupChat, setUpdateGroupChat] = useState<Chat | null>(null);
  const router = useRouter();  

  const { isAuthenticated, getSession, sessionChecked, isLoading, error } = useAuthStore();
  const { chats, fetchChatsSummary } = useChatStore();
  const { fetchFriends, fetchOnlineFriends, fetchAllUsers } = useFriendsStore();

  const [loadingStage, setLoadingStage] = useState<'checking' | 'authenticating' | 'loading-data'>('checking');

  // Fetch user session on mount
  useEffect(() => {
    if (!sessionChecked) {
      getSession();
    }
  }, [getSession, sessionChecked]);

  // Handle authentication status changes
  useEffect(() => {
    if (sessionChecked) {
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to public page');
        router.push('/public');
      } else {
        setLoadingStage('loading-data');
      }
    }
  }, [sessionChecked, isAuthenticated, router]);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (sessionChecked && isAuthenticated && !isLoading) {
      const fetchData = async () => {
        try {
          await Promise.all([
            fetchAllUsers(),
            fetchFriends(),
            fetchChatsSummary(),
            fetchOnlineFriends()
          ]);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      fetchData();
    }
  }, [fetchAllUsers, fetchFriends, fetchOnlineFriends, fetchChatsSummary, sessionChecked, isAuthenticated, isLoading]);

  // Handlers
  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleChatSelect = (chatId: number, optionalChat?: Chat) => {
    if (optionalChat) {
      setSelectedChat(optionalChat);
      return;
    }

    const selected = chats.find(c => Number(c.id) === chatId) || null;
    if (!selected || !Array.isArray(selected.participants)) {
      setSelectedChat(null);
      return;
    }

    setSelectedChat({
      ...selected,
      participants: selected.participants.map((p: any) => ({
        id: p.id,
        name: p.name ?? '',
      })),
      lastMessage: selected.lastMessage ?? undefined,
      lastMessageAt: selected.lastMessageAt ?? undefined,
    });
  };

  const handleGroup = () => setShowCreateGroup(!showCreateGroup);

  const handleUpdateOpen = (chat: Chat) => {
    if (chat?.isGroup) {
      setUpdateGroupChat(chat);
      setShowUpdateGroup(!showUpdateGroup);
    } else {
      setShowFriendProfile(!showFriendProfile);
      setUpdateGroupChat(chat);
    }
  };

  const handleClickOutside = () => {
    setShowCreateGroup(false);
    setShowUpdateGroup(false);
    setShowFriendProfile(false);
  };

  const handleGroupUpdated = (updated: { id: number; name: string; participants: number[] }) => {
    setSelectedChat(prev => prev && prev.id === updated.id
      ? {
          ...prev,
          name: updated.name,
          participants: updated.participants.map(id => {
            const found = prev.participants.find(p => p.id === id);
            return found ? found : { id, name: "" };
          })
        }
      : prev
    );
  };

  const handleBack = () => setSelectedChat(null);

  // Show loading screen while checking authentication or loading data
  if (!sessionChecked || isLoading || (sessionChecked && isAuthenticated && loadingStage !== 'loading-data')) {
    let loadingText = 'Loading...';
    if (loadingStage === 'checking') loadingText = 'Checking authentication...';
    else if (loadingStage === 'authenticating') loadingText = 'Authenticating...';
    else if (loadingStage === 'loading-data') loadingText = 'Loading dashboard...';

    return (
      <div className="h-screen bg-navbar-bg flex flex-col justify-center items-center gap-4">
        <MultiRingSpinner />
        <p className="text-lg font-semibold text-primary">{loadingText}</p>
        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}
        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse"
          />
        </div>
      </div>
    );
  }

  // If session is checked and user is not authenticated, don't render dashboard
  // (redirect should happen in useEffect above)
  if (sessionChecked && !isAuthenticated) {
    return null;
  }

  // Render main dashboard
  return (
    <div className="h-screen overflow-hidden">
      <DashboardMobileView
        selectedChat={selectedChat}
        handleUpdateOpen={handleUpdateOpen}
        handleBack={handleBack}
        handleGroup={handleGroup}
        handleChatSelect={handleChatSelect}
        handleClick={handleClick}
      />
      <DashboardDesktopView
        selectedChat={selectedChat}
        handleUpdateOpen={handleUpdateOpen}
        handleBack={handleBack}
        handleGroup={handleGroup}
        handleChatSelect={handleChatSelect}
        handleClick={handleClick}
      />
      <ModalsContainer
        isOpen={isOpen}
        handleClose={handleClose}
        showCreateGroup={showCreateGroup}
        handleClickOutside={handleClickOutside}
        showUpdateGroup={showUpdateGroup}
        updateGroupChat={updateGroupChat}
        handleGroupUpdated={handleGroupUpdated}
        showFriendProfile={showFriendProfile}
      />
    </div>
  );
};

export default Dashboard;