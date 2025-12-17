"use client";
import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { PaperClipOutlined } from "@ant-design/icons";

const VannaChat = ({ userId = "user123" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);
  const reconnectInterval = useRef(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileContext, setFileContext] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- 1. Get or generate persistent convo_id in cookies ---
  const getConvoId = () => {
    let convoId = Cookies.get("vanna_convo_id");
    // if (!convoId) {
      // convoId = crypto.randomUUID();
      // Cookies.set("vanna_convo_id", convoId, { expires: 7 }); // expires in 7 days
    // }
    return convoId;
  };

  const convoId = getConvoId();

  // --- 2. Scroll to bottom ---
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- 3. Connect WebSocket ---
  const connectWebSocket = () => {
    wsRef.current = new WebSocket(
      `ws://localhost:8000/api/vanna/v2/chat_websocket?conversation_id=${convoId}`
    );

    wsRef.current.onopen = () => {
      console.log("Connected to Vanna WebSocket");
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.rich?.data?.content && data.rich.type == 'text') {
          console.log("Received message:", data);
          const newMsg = { sender: "vanna", text: data.rich.data.content };
          setMessages((prev) => {
            const updated = [...prev, newMsg];
            Cookies.set("vanna_convo_id", data.conversation_id, { expires: 7 }); // persist messages in cookies
            return updated;
          });
          scrollToBottom();
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(() => {
          console.log("Reconnecting WebSocket...");
          connectWebSocket();
        }, 3000);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      wsRef.current.close();
    };
  };

  // --- 4. Load previous messages from cookies ---
  useEffect(() => {
    // const savedMessages = JSON.parse(Cookies.get("vanna_messages") || "[]");
    // setMessages(savedMessages);
    connectWebSocket();

    return () => {
      wsRef.current?.close();
      if (reconnectInterval.current) clearInterval(reconnectInterval.current);
    };
  }, [userId]);

  // --- 5. Send message ---
  // const sendMessage = () => {
  //   if (!input.trim()) return;
  //   if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
  //     console.error("WebSocket not open. Message not sent.");
  //     return;
  //   }

  //   const newMsg = { sender: "user", text: input };
  //   setMessages((prev) => {
  //     const updated = [...prev, newMsg];
  //     Cookies.set("vanna_messages", JSON.stringify(updated), { expires: 7 }); // persist
  //     return updated;
  //   });

  //   scrollToBottom();
  //   wsRef.current.send(JSON.stringify({ message: input }));
  //   setInput("");
  // };

  const sendMessage = () => {
  if (!input.trim()) return;
  if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
    console.error("WebSocket not open. Message not sent.");
    return;
  }

  let finalPrompt = input;

  if (fileContext) {
    finalPrompt = `
The user has uploaded a file named "${fileContext.filename}".
Below is the extracted content.

--- FILE CONTENT START ---
${fileContext.content}
--- FILE CONTENT END ---

User question:
${input}
`;
  }

  const newMsg = { sender: "user", text: input };

  setMessages((prev) => {
    const updated = [...prev, newMsg];
    // Cookies.set("vanna_messages", JSON.stringify(updated), { expires: 7 });
    return updated;
  });

  wsRef.current.send(
    JSON.stringify({
      message: finalPrompt,
      metadata: {
        has_file: !!fileContext,
        filename: fileContext?.filename || null,
      },
    })
  );

  setInput("");
  setFileContext(null);
  setAttachedFile(null);
};


  // --- 6. Handle Shift+Enter for newline ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      sendMessage();      // Send message only if Shift is NOT pressed
    }
    // Shift+Enter inserts newline naturally
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAttachedFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8001/api/ingest-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      setFileContext({
        filename: data.filename,
        content: data.content,
        charCount: data.char_count,
      });

      // Optional UI message
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: `📎 Attached: ${data.filename} (${data.char_count} chars)`,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input
    }
  };

  const removeAttachedFile = () => {
  setAttachedFile(null);
  setUploading(false);

  // Reset file input so the same file can be re-selected
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        width: "100%",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Chat Messages */}
      <div
        style={{
          height: "65vh",
          overflowY: "auto",
          marginBottom: "1rem",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              backgroundColor: msg.sender === "user" ? "#4A90E2" : "#E5E5EA",
              color: msg.sender === "user" ? "#fff" : "#000",
              marginBottom: "10px",
              padding: "12px 16px",
              borderRadius: "20px",
              maxWidth: "80%",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              whiteSpace: "pre-wrap",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease",
            }}
          >
            <b>{msg.sender === "user" ? "You" : "Odyssey AI"}:</b> {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            position: "relative",
            flex: 1,
          }}
        >
          {attachedFile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                marginBottom: "6px",
                color: "#555",
                background: "#eef2f7",
                padding: "6px 10px",
                borderRadius: "6px",
                width: "fit-content",
                maxWidth: "100%",
              }}
            >
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                📎 {attachedFile.name}
              </span>

              {uploading && <span style={{ fontStyle: "italic" }}>(uploading…)</span>}

              {/* Remove button */}
              <button
                onClick={removeAttachedFile}
                title="Remove file"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#888",
                  fontSize: "14px",
                  lineHeight: 1,
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#d00")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
              >
                ✕
              </button>
            </div>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{
              width: "100%",
              padding: "10px 42px 10px 10px", // right padding for icon
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "none",
              height: "60px",
              fontSize: "14px",
              outline: "none",
            }}
          />

          {/* Attach icon */}
          <label
            htmlFor="file-upload"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#666",
              fontSize: "18px",
            }}
            title="Attach file"
          >
            <PaperClipOutlined />
          </label>

          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            hidden
            accept=".pdf,.xlsx,.csv,.docx"
            onChange={handleFileUpload}
          />
        </div>
        <button
          onClick={sendMessage}
          style={{
            padding: "0 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4A90E2",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#357ABD")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4A90E2")}
        >
          Send
        </button>
        <button
          onClick={() => {
            setMessages([]);
            Cookies.remove("vanna_messages"); // clear messages
          }}
          style={{
            padding: "0 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f0f0f0";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default VannaChat;
