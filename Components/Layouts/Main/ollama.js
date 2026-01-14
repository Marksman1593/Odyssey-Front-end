"use client";
import axios from "axios";
import React, { useState } from "react";

const OllamaChat = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [ messages, setMessages ] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    let temp = messages
    
    setLoading(true);
    setResponse("");
    
    try {
        temp.push({ role: 'user', content: input })
        setMessages(temp)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/ollama/chatDB`, { model: 'llama3:latest', messages: [{ role: 'user', content: input }] });

        console.log(res)
        setResponse(res.data.result.message.content);
        temp.push({ role: 'assistant', content: res.data.result.message.content })
        setMessages(temp)

    } catch (err) {
      console.error(err);
      setResponse("Error talking to Ollama");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <input
        type="text"
        value={input}
        placeholder="Ask Ollama..."
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <button onClick={sendMessage} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.role === 'user' ? 'User' : 'Ollama'}</strong>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default OllamaChat;
