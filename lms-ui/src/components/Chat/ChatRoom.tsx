import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

// import axios from "axios"; // Assuming axios is available, if not use fetch

interface User {
  id: string;
  name: string; // Display name
  role: "Student" | "Trainer" | "Admin";
}

interface ChatRoomProps {
  batchId: string;
  currentUser: User;
}

interface Message {
  _id: string; // Temp or Real ID
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file";
  fileUrl?: string;
  createdAt: string;
}

const SOCKET_URL = "http://localhost:8000"; // Should be env var in prod

const ChatRoom: React.FC<ChatRoomProps> = ({ batchId, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Socket
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket");
      newSocket.emit("join_chat", { batchId, user: currentUser });
    });

    newSocket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Fetch History
    fetchMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [batchId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${SOCKET_URL}/api/v1/chat/${batchId}/messages`
      );
      const data = await response.json();
      if (data.success) {
        // data.data is [newest, ..., oldest] usually, but we want to display chronological
        // My backend returns newest first for pagination. So we reverse it here.
        setMessages(data.data.reverse());
      }
    } catch (error) {
      console.error("Failed to load history", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !socket) return;

    const payload = {
      batchId,
      content: inputText,
      senderId: currentUser.id,
      senderModel: currentUser.role,
      senderName: currentUser.name,
      type: "text",
    };

    socket.emit("send_message", payload);
    setInputText("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socket) return;

    const formData = new FormData();
    formData.append("chatMedia", file);

    try {
      const response = await fetch(`${SOCKET_URL}/api/v1/chat/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        const payload = {
          batchId,
          content: inputText.trim() || file.name, // Use input text as caption if confirmed, else filename
          senderId: currentUser.id,
          senderModel: currentUser.role,
          senderName: currentUser.name,
          type: data.type,
          fileUrl: data.fileUrl,
        };
        socket.emit("send_message", payload);
        setInputText("");
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 bg-white rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-100 border-b border-gray-200">
        <h3 className="m-0 text-base">Batch Chat</h3>
        <small className="text-gray-500 text-xs">
          Logged in as: {currentUser.name}
        </small>
      </div>

      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={index}
              className={`max-w-[70%] self-${isMe ? "end" : "start"} bg-${
                isMe ? "blue-500" : "gray-200"
              } text-${isMe ? "white" : "black"} p-2 px-3 rounded-xl relative`}
              style={{ alignSelf: isMe ? "flex-end" : "flex-start" }} // Tailwind sometimes needs help with dynamic align-self if not safelisted, but let's try classes first. Actually, `self-end` `self-start` are standard tailwind.
            >
              <div className="text-[10px] font-bold opacity-80 mb-0.5">
                {msg.senderName}
              </div>
              {msg.type === "text" && (
                <div className="break-words">{msg.content}</div>
              )}
              {msg.type === "image" && (
                <div>
                  <img
                    src={msg.fileUrl}
                    alt="shared"
                    className="max-w-full rounded mt-1"
                    onLoad={scrollToBottom}
                  />
                  {msg.content && (
                    <div className="mt-1 text-sm">{msg.content}</div>
                  )}
                </div>
              )}
              {msg.type === "video" && (
                <div>
                  <video
                    src={msg.fileUrl}
                    controls
                    className="max-w-full rounded mt-1"
                    onLoadedData={scrollToBottom}
                  />
                  {msg.content && (
                    <div className="mt-1 text-sm">{msg.content}</div>
                  )}
                </div>
              )}
              {msg.type === "audio" && (
                <div>
                  <audio
                    src={msg.fileUrl}
                    controls
                    className="w-full mt-1"
                    onLoadedData={scrollToBottom}
                  />
                  {msg.content && (
                    <div className="mt-1 text-sm">{msg.content}</div>
                  )}
                </div>
              )}
              {msg.type === "file" && (
                <a
                  href={msg.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-inherit underline text-xs"
                >
                  📎 {msg.content || "Download File"}
                </a>
              )}
              <div className="text-[10px] opacity-60 text-right mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200 flex gap-3 items-center">
        <button
          className="bg-transparent border-none text-xl cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <input
          className="flex-1 p-2 border border-gray-200 rounded-full outline-none"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white border-none py-2 px-4 rounded-full cursor-pointer hover:bg-blue-600"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
