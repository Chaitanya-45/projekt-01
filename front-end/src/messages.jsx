import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000", { withCredentials: true });

export default function Messages() {
  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Retrieve user information from the authentication system
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/me", { withCredentials: true });
        const { id, name } = response.data.user; // Adjust based on your API response
        socket.emit("user_login", { userId: id, username: name });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  
    // Listen for updates to the logged-in user list
    socket.on("update_user_list", (users) => {
      setLoggedInUsers(users);
    });
  
    // Listen for private messages
    socket.on("receive_private_message", (data) => {
      setMessages((prev) => [
        ...prev,
        { senderId: data.senderId, text: data.message },
      ]);
    });
  
    // Clean up on unmount
    return () => {
      socket.off("update_user_list");
      socket.off("receive_private_message");
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() && selectedUser) {
      const messageData = {
        receiverId: selectedUser.userId,
        senderId: loggedInUser.userId, // Use the logged-in user's ID
        message: messageInput,
      };
      socket.emit("send_private_message", messageData);
      setMessages((prev) => [
        ...prev,
        { senderId: "You", text: messageInput },
      ]);
      setMessageInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-white shadow-lg p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Logged-In Users</h2>
        <div className="space-y-3 overflow-y-auto max-h-[75vh]">
          {loggedInUsers.map((user) => (
            <div
              key={user.userId}
              className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition ${
                selectedUser?.userId === user.userId ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <p className="font-medium">{user.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white shadow-lg">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center justify-between bg-gray-100">
              <h2 className="text-lg font-semibold">{selectedUser.username}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 max-w-xs rounded-lg shadow-md ${
                      msg.senderId === "You"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 flex bg-gray-100">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE6059]"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                className="ml-2 bg-[#FE6059] text-white px-4 py-2 rounded-md hover:bg-[#e1504e] transition"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a user to start messaging
          </div>
        )}
      </div>
    </div>
  );
}