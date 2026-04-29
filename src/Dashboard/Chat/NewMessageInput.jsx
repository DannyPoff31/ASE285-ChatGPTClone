import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsSend, BsPlusLg } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import { addMessage, setSelectedConversationId, sendConversationMessage } from "../dashboardSlice";

const NewMessageInput = () => {
  const [content, setContent] = useState("");
  const [imgContent, setImgContent] = useState("");

  const dispatch = useDispatch();

  const selectedConversationId = useSelector(
    (state) => state.dashboard.selectedConversationId
  );

  const conversations = useSelector((state) => state.dashboard.conversations);
  const loading = useSelector((state) => state.dashboard.loading);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const proceedMessage = () => {
    const message = {
      aiMessage: false,
      content,
      imgContent,
      id: uuid(),
    };

    const conversationId =
      selectedConversationId === "new" ? uuid() : selectedConversationId;

    // Add user message to store
    dispatch(
      addMessage({
        conversationId,
        message,
      })
    );

    dispatch(setSelectedConversationId(conversationId));

    // Get conversation messages for context
    const conversation = conversations.find(c => c.id === conversationId);
    const conversationMessages = conversation ? conversation.messages : [];

    // Send message to AI
    dispatch(sendConversationMessage({ 
      message, 
      conversationId,
      conversationMessages 
    }));

    // Reset input
    setContent("");
    setImgContent("");
  };

  const handleSendMessage = () => {
    if (content.length > 0 && !loading) {
      proceedMessage();
    }
  };

  const handleKeyPressed = (event) => {
    if (event.code === "Enter" && content.length > 0 && !loading) {
      proceedMessage();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; 

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result.split(",")[1]; // remove data URL prefix
      setImgContent({
        mimeType: file.type, // e.g. image/jpeg or image/png
        data: base64
      });

    };

    reader.readAsDataURL(file);
  
  }

  return (
    <div className="new_message_input_container" style={{ position: "relative" }}>
      <input
        className="new_message_input"
        placeholder={loading ? "Waiting for response..." : "Send a message ..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyPressed}
        disabled={loading}
      />
      <div style={{
          position: "absolute",
          right: "50%",
          display: "flex",
          gap: "12px"
        }}>
        <label htmlFor="file-upload" className="new_message_icon_container">
          <BsPlusLg color={loading ? "lightgrey" : "grey"} />
        </label>
        <input 
          type="file" 
          onChange={(e) => handleFileUpload(e)} 
          style={{ display: "none" }} 
          id="file-upload"
      
        />
        <div className="new_message_icon_container" onClick={handleSendMessage}>
          <BsSend color={loading ? "lightgrey" : "grey"} />
        </div>
      </div>
    </div>
  );
};

export default NewMessageInput;
