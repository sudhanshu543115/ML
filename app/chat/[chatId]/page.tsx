"use client";

import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "@/api/Allapi";
import { Send, Paperclip, MoreVertical, ArrowLeft, Phone, Video } from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";
import socket from "@/src/lib/socket";

import { createPeer } from "@/src/lib/webrtc";


interface Message {
  _id: string;
  // Sender can be an object (populated) or a string ID (unpopulated)
  sender: {
    _id: string;
    name: string;
    email: string;
  } | string; 
  text: string;
  createdAt: string;
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserData, setCurrentUserData] = useState<{name: string, email: string} | null>(null);
  const [otherUserId, setOtherUserId] = useState<string>("");
  const [isInCall, setIsInCall] = useState(false);
  const [isCallIncoming, setIsCallIncoming] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingAnswerRef = useRef<(() => Promise<void>) | null>(null);


useEffect(() => {
  socket.on("incoming-call", async ({ offer, fromUserId }) => {
    console.log('📞 Incoming call from:', fromUserId);
    console.log('📞 Call offer:', offer);
    setOtherUserId(fromUserId);
    setIsCallIncoming(true);

    const peer = createPeer();
    peerRef.current = peer;

    await peer.setRemoteDescription(offer);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    peer.ontrack = (event) => {
      console.log('📹 Received remote track');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate to:', fromUserId);
        socket.emit("ice-candidate", {
          toUserId: fromUserId,
          candidate: event.candidate,
        });
      }
    };

    // Store answer for when user accepts call
    pendingAnswerRef.current = async () => {
      console.log('📞 Creating answer for call from:', fromUserId);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answer-call", {
        toUserId: fromUserId,
        answer,
      });
      console.log('📤 Answer sent to:', fromUserId);
    };
  });

  socket.on("call-answered", async ({ answer }) => {
    console.log('📞 Call answered:', answer);
    await peerRef.current?.setRemoteDescription(answer);
  });

  socket.on("ice-candidate", async ({ candidate }) => {
    console.log('🧊 Received ICE candidate:', candidate);
    await peerRef.current?.addIceCandidate(candidate);
  });

  return () => {
    socket.off("incoming-call");
    socket.off("call-answered");
    socket.off("ice-candidate");
  };
}, []);





  

  useEffect(() => {
    // Get full user details safely on mount
    const userStr = localStorage.getItem("user");
    console.log('User from localStorage:', userStr);
    
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log('Parsed user:', user);
      
      if (user._id) {
        setCurrentUserId(user._id);
        setCurrentUserData(user);
        console.log('Set currentUserId to:', user._id);
      } else {
        console.error('User object missing _id field:', user);
      }
    } else {
      console.error('No user found in localStorage');
    }
  }, []);

  // Add temporary debug function
  const debugLocalStorage = () => {
    console.log('=== DEBUG LOCAL STORAGE ===');
    const accessToken = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    console.log('🔑 Access Token exists:', !!accessToken);
    console.log('👤 User string:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('👤 Parsed user:', user);
        console.log('🆔 User ID:', user._id);
        console.log('📧 User email:', user.email);
        console.log('📛 User name:', user.name);
      } catch (e) {
        console.error('❌ Failed to parse user:', e);
      }
    }
    
    console.log('📦 All localStorage keys:', Object.keys(localStorage));
  };

  // Call debug function on mount
  useEffect(() => {
    debugLocalStorage();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!chatId) {
          setIsLoading(false);
          return;
        }
        const response = await getMessages(chatId);
        setMessages(response.messages || []);
        
        // Get other user ID from messages or chat participants
        if (response.messages && response.messages.length > 0) {
          const firstMessage = response.messages[0];
          const senderId = typeof firstMessage.sender === 'string' 
            ? firstMessage.sender 
            : firstMessage.sender._id;
          
          console.log('👤 First message sender ID:', senderId);
          console.log('👤 Current user ID:', currentUserId);
          
          if (senderId !== currentUserId) {
            setOtherUserId(senderId);
            console.log('✅ Set other user ID from messages:', senderId);
          }
        }
        
        // Also try to get chat details to find participants
        try {
          const chatResponse = await fetch(`/api/chat/${chatId}`);
          const chatData = await chatResponse.json();
          console.log('👥 Chat data:', chatData);
          
          if (chatData.chat && chatData.chat.participants) {
            console.log('👥 Chat participants:', chatData.chat.participants);
            const otherParticipant = chatData.chat.participants.find(
              (p: string) => p !== currentUserId
            );
            if (otherParticipant) {
              setOtherUserId(otherParticipant);
              console.log('✅ Set other user ID from participants:', otherParticipant);
            }
          }
        } catch (error) {
          console.log('Could not fetch chat details:', error);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, currentUserId]);

    const getCurrentUserId = () => {
  if (currentUserId) return currentUserId;

  const userStr = localStorage.getItem("user");
  if (!userStr) return "";

  try {
    const user = JSON.parse(userStr);
    return user._id || user.id || "";
  } catch {
    return "";
  }
};

  const handleSendMessage = async () => {
    console.log('=== SEND MESSAGE CLICKED ===');
    console.log('Text:', text);
    console.log('Text trimmed:', text.trim());
    
    if (!text.trim()) {
      console.log('❌ Message is empty, not sending');
      return;
    }
    
    const userId = getCurrentUserId();
    console.log('getCurrentUserId() returned:', userId);
    
    if (!userId) {
      console.error('❌ No user ID available - cannot send message');
      return;
    }
    
    const messageData = {
      chatId,
      senderId: userId,
      text: text.trim()
    };
    
    console.log('📤 Sending message via socket:', messageData);
    
    try {
      // Send via socket for real-time delivery
      socket.emit('send-message', messageData);
      console.log('✅ Message sent via socket');
      
      // Clear input immediately for better UX
      setText('');
      console.log('✅ Input cleared');
      
    } catch (error) {
      console.error('❌ Failed to send message via socket:', error);
      // Fallback to REST API if socket fails
      try {
        console.log('🔄 Trying fallback to REST API...');
        const response = await sendMessage(chatId, text);
        setMessages(prev => [...prev, response.message]);
        setText('');
        console.log('✅ Message sent via REST API fallback');
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to safely get Sender ID
  const getSenderId = (sender: Message['sender']) => {
    if (typeof sender === 'string') return sender;
    return sender?._id;
  };

  // Helper to safely get Sender Name
  const getSenderName = (sender: Message['sender']) => {
    if (typeof sender === 'string') return "User"; // Fallback if we only have ID
    return sender?.name || "Unknown";
  };

  


  // In chat/[chatId]/page.tsx
useEffect(() => {
  console.log('🔌 Setting up socket connection...');
  console.log('Socket connected status:', socket.connected);
  console.log('Socket ID:', socket.id);
  
  // Connect socket if not connected
  if (!socket.connected) {
    console.log('🔌 Socket not connected, connecting...');
    socket.connect();
  }

  // Get current user ID and emit user-online
  const userId = getCurrentUserId();
  console.log('👤 User ID for socket:', userId);
  
  if (userId) {
    socket.emit('user-online', userId);
    console.log('✅ Emitted user-online for:', userId);
  } else {
    console.warn('⚠️ No user ID available for user-online event');
  }

  // Join chat room
  socket.emit('join-chat', chatId);
  console.log('🏠 Joined chat room:', chatId);
  
  // Listen for new messages
  socket.on('new-message', (message) => {
    console.log('📨 Received new message:', message);
    setMessages(prev => [...prev, message]);
  });

  // Listen for pending messages (offline messages)
  socket.on('pending-messages', ({ chatId: pendingChatId, messages: pendingMessages }) => {
    console.log('📨 Received pending messages:', pendingMessages);
    if (pendingChatId === chatId) {
      setMessages(prev => {
        // Filter out duplicates and add new messages
        const existingIds = new Set(prev.map(m => m._id));
        const newMessages = pendingMessages.filter((m: Message) => !existingIds.has(m._id));
        return [...prev, ...newMessages];
      });
    }
  });

  // Listen for message errors
  socket.on('message-error', ({ error }) => {
    console.error('❌ Socket message error:', error);
  });

  // Listen for connection status
  socket.on('connect', () => {
    console.log('✅ Socket connected successfully!');
    console.log('Socket ID after connect:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  return () => {
    console.log('🧹 Cleaning up socket listeners...');
    socket.off('new-message');
    socket.off('pending-messages');
    socket.off('message-error');
    socket.off('connect');
    socket.off('disconnect');
    socket.emit('leave-chat', chatId);
    if (userId) {
      socket.emit('user-offline', userId);
    }
  };
}, [chatId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
          <div className="text-indigo-500 font-medium">Loading conversation...</div>
        </div>
      </div>
    );
  }

  const startAudioCall = async () => {
    console.log('📞 Audio call clicked');
    console.log('👤 Other user ID:', otherUserId);
    console.log('👤 Current user ID:', getCurrentUserId());
    
    if (!otherUserId) {
      alert('Could not find user to call');
      return;
    }

    try {
      console.log('🔌 Starting audio call to:', otherUserId);
      const peer = createPeer();
      peerRef.current = peer;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      localStreamRef.current = stream;
      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('🧊 Sending ICE candidate to:', otherUserId);
          socket.emit("ice-candidate", {
            toUserId: otherUserId,
            candidate: event.candidate,
          });
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      console.log('📤 Emitting call-user event to:', otherUserId);
      socket.emit("call-user", {
        toUserId: otherUserId,
        offer,
      });

      setIsInCall(true);
      setCallStartTime(new Date());
      console.log('✅ Audio call initiated');
    } catch (error) {
      console.error('❌ Error starting audio call:', error);
      alert('Failed to start audio call. Please check microphone permissions.');
    }
  };

  const startVideoCall = async () => {
    if (!otherUserId) {
      alert('Could not find user to call');
      return;
    }

    try {
      const peer = createPeer();
      peerRef.current = peer;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            toUserId: otherUserId,
            candidate: event.candidate,
          });
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("call-user", {
        toUserId: otherUserId,
        offer,
      });

      setIsInCall(true);
      setCallStartTime(new Date());
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Failed to start video call. Please check camera and microphone permissions.');
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsInCall(false);
    setIsCallIncoming(false);
    setCallStartTime(null);
  };

  const answerCall = async () => {
    if (pendingAnswerRef.current) {
      await pendingAnswerRef.current();
      pendingAnswerRef.current = null;
    }
    setIsCallIncoming(false);
    setIsInCall(true);
    setCallStartTime(new Date());
  };

  const rejectCall = () => {
    setIsCallIncoming(false);
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6]">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm z-10 sticky top-0">
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Link 
              href="/chat"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h2 className="font-semibold text-gray-900">Chat</h2>
              <p className="text-sm text-gray-500">Chat ID: {chatId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Phone onClick={startAudioCall}  size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Video onClick={startVideoCall} size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      <div className="bg-yellow-50 border border-yellow-200 p-2 text-xs">
        <div>Current User ID: {getCurrentUserId()}</div>
        <div>Other User ID: {otherUserId || 'Not found'}</div>
        <div>Socket Connected: {socket.connected ? 'Yes' : 'No'}</div>
      </div>

      {/* Incoming Call UI */}
      {isCallIncoming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Incoming Call</h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={answerCall}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
              >
                Answer
              </button>
              <button
                onClick={rejectCall}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Call UI */}
      {isInCall && (
        <div className="bg-gray-900 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white">
              {callStartTime && (
                <span className="text-sm">
                  {Math.floor((new Date().getTime() - callStartTime.getTime()) / 1000)}s
                </span>
              )}
            </div>
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              End Call
            </button>
          </div>
          <div className="flex gap-4 justify-center">
            <video ref={localVideoRef} autoPlay muted className="w-40 h-30 rounded bg-gray-800" />
            <video ref={remoteVideoRef} autoPlay className="w-40 h-30 rounded bg-gray-800" />
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-5xl mx-auto w-full flex flex-col">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Send size={24} className="ml-1 opacity-50" />
              </div>
              <p>No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((m, index) => {
              // --- FIXED LOGIC HERE ---
              const msgSenderId = getSenderId(m.sender);
              const isMe = msgSenderId === currentUserId;
              
              // Check previous/next message for grouping styling
              const nextMsg = messages[index + 1];
              const nextSenderId = nextMsg ? getSenderId(nextMsg.sender) : null;
              const isLastFromSender = !nextMsg || nextSenderId !== msgSenderId;
              // ------------------------

              return (
                <div 
                  key={m._id || index} 
                  className={`flex w-full mb-1 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[85%] sm:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                    
                    {/* Avatar (Left side - only for them) */}
                    {!isMe && (
                      <div className="w-8 h-8 flex-shrink-0 mb-1">
                        {isLastFromSender ? (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                            {getSenderName(m.sender)[0]?.toUpperCase()}
                          </div>
                        ) : (
                          <div className="w-8 h-8" /> 
                        )}
                      </div>
                    )}

                    {/* Bubble */}
                    <div 
                      className={`
                        relative px-4 py-2 shadow-sm
                        ${isMe 
                          ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm" 
                          : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
                        }
                      `}
                    >
                      {/* Name label for group chats (Received only) */}
                      {!isMe && isLastFromSender && (
                         <p className="text-[10px] text-gray-500 font-bold mb-1 ml-0.5 uppercase tracking-wide">
                           {getSenderName(m.sender)}
                         </p>
                      )}

                      <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                        {m.text}
                      </p>
                      
                      <div className={`text-[10px] mt-1 text-right ${isMe ? "text-indigo-200" : "text-gray-400"}`}>
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-20">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-200 rounded-full transition">
              <Paperclip size={20} />
            </button>

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-2 py-1 focus:outline-none text-gray-700 placeholder-gray-400"
            />

            <button
              onClick={handleSendMessage}
              disabled={!text.trim()}
              className={`
                p-3 rounded-xl transition-all duration-200 flex items-center justify-center
                ${text.trim() 
                  ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transform hover:scale-105" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}