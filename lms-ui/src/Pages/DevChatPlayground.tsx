import React, { useState } from "react";
import ChatRoom from "../Components/Chat/ChatRoom";

const DevChatPlayground = () => {
  // Helper to generate a valid 24-char hex string (MongoDB ObjectId format)
  const generateObjectId = () => {
    return Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  };

  const [batchId, setBatchId] = useState(generateObjectId());
  const [userId, setUserId] = useState(generateObjectId());
  const [userName, setUserName] = useState("Student A");
  const [role, setRole] = useState<"Student" | "Trainer">("Student");

  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isChatOpen) {
    return (
      <div className="flex flex-col h-screen bg-[#f0f2f5] items-center justify-center">
        <div className="flex gap-5 items-center mb-5">
          <button onClick={() => setIsChatOpen(false)}>Back to Config</button>
          <h2>Dev Chat Playground</h2>
        </div>
        <div className="w-full max-w-[600px] h-[80vh]">
          <ChatRoom
            batchId={batchId}
            currentUser={{ id: userId, name: userName, role: role }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] items-center justify-center">
      <div className="bg-white p-[30px] rounded-lg shadow-md w-[400px] flex flex-col gap-[15px]">
        <h2>Chat Playground Config</h2>
        <p>Use this to simulate a user joining a batch chat.</p>

        <label className="font-bold text-sm">Batch ID</label>
        <input
          className="p-[10px] border border-gray-300 rounded"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
        />

        <label className="font-bold text-sm">User ID (Simulated)</label>
        <input
          className="p-[10px] border border-gray-300 rounded"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <label className="font-bold text-sm">Display Name</label>
        <input
          className="p-[10px] border border-gray-300 rounded"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label className="font-bold text-sm">Role</label>
        <select
          className="p-[10px] border border-gray-300 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="Student">Student</option>
          <option value="Trainer">Trainer</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          className="bg-[#28a745] text-white border-none p-3 rounded cursor-pointer font-bold mt-2.5 hover:bg-[#218838]"
          onClick={() => setIsChatOpen(true)}
        >
          Open Chat
        </button>

        <div className="mt-5 text-xs text-[#666] bg-[#e9ecef] p-2.5 rounded">
          <strong>Tip:</strong> Open this page in a new Tab/Window to simulate a
          second user.
        </div>
      </div>
    </div>
  );
};

export default DevChatPlayground;
