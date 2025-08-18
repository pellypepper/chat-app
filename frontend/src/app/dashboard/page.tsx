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

  const { isAuthenticated, getSession, sessionChecked, isLoading } = useAuthStore();
  const { chats, fetchChatsSummary } = useChatStore();
  const { fetchFriends, fetchOnlineFriends, fetchAllUsers } = useFriendsStore();

  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<'redirecting' | 'authenticating'>('redirecting');

  // Check if returning from Google login
  const isReturningFromGoogle = typeof window !== 'undefined' && 
    sessionStorage.getItem('googleLoginInProgress') === 'true';

  // Fetch user session on mount
  useEffect(() => {
    const initSession = async () => {
      // Clear Google login flag if present
      if (isReturningFromGoogle) {
        sessionStorage.removeItem('googleLoginInProgress');
        // Add extra delay for mobile after Google redirect
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await getSession();
    };

    initSession();
  }, [getSession]);

  // Handle authentication state changes
  useEffect(() => {
    if (sessionChecked) {
      if (isAuthenticated) {
        // Successfully authenticated
        setLoadingStage('authenticating');
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
      } else {
        // Not authenticated, redirect to public
        const timer = setTimeout(() => {
          router.push('/public');
        }, 500); // Small delay for mobile
        
        return () => clearTimeout(timer);
      }
    }
  }, [sessionChecked, isAuthenticated, router]);

  // Fetch data after successful authentication
  useEffect(() => {
    if (sessionChecked && isAuthenticated && !loading) {
      const fetchData = async () => {
        try {
          await Promise.all([
            fetchAllUsers(),
            fetchFriends(),
            fetchChatsSummary(),
            fetchOnlineFriends()
          ]);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        }
      };

      fetchData();
    }
  }, [sessionChecked, isAuthenticated, loading, fetchAllUsers, fetchFriends, fetchOnlineFriends, fetchChatsSummary]);

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

  // Show loading while session is being checked or during auth process
  if (loading || (!sessionChecked && isLoading)) {
    const displayText = isReturningFromGoogle 
      ? 'Completing Google sign-in...'
      : loadingStage === 'redirecting' 
        ? 'Redirecting...' 
        : 'Authenticating...';

    return (
      <div className="h-screen bg-navbar-bg flex flex-col justify-center items-center gap-4">
        <MultiRingSpinner />
        <p className="text-lg font-semibold text-primary">{displayText}</p>
        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-600 animate-progressBar"
            style={{ animationDuration: '5s' }}
          />
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated and session is checked
  if (sessionChecked && !isAuthenticated) {
    return null; // Router push will handle redirect
  }

  // Render main dashboard only when authenticated
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