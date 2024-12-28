import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send, Loader2, FileText, X, MessageCircle, Bot, User, AlertCircle } from 'lucide-react';
import './App.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please upload a smaller file.');
      fileInputRef.current.value = '';
      return;
    }

    if (uploadedFile.type !== 'application/pdf') {
      setError('Please upload only PDF files.');
      fileInputRef.current.value = '';
      return;
    }

    try {
      setCurrentFile(uploadedFile);
      setShowWelcome(false);
    } catch (err) {
      setError('Error uploading file. Please try again.');
      fileInputRef.current.value = '';
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.type === 'ai' && !lastMessage?.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!currentFile) {
      setError('Please upload a PDF file before asking questions.');
      return;
    }

    setShowWelcome(false);
    setError(null);

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append('question', input);

      if (currentFile) {
        formData.append('file', currentFile);
      }

      const response = await fetch('http://localhost:8080/api/chat/ask', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = {
        type: 'ai',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const dataLines = chunk.split('\n');

        for (const line of dataLines) {
          if (line.startsWith('data:')) {
            const jsonData = line.replace('data:', '').trim();
            if (jsonData) {
              try {
                const parsedData = JSON.parse(jsonData);
                if (parsedData.response) {
                  setMessages((prev) =>
                    prev.map((msg, index) =>
                      index === prev.length - 1
                        ? { ...msg, content: msg.content + parsedData.response }
                        : msg
                    )
                  );
                }
              } catch (error) {
                console.error('Error parsing stream data:', error);
                setError('Error processing response. Please try again.');
              }
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error:', error);
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="logo">
            <Bot className="bot-icon" />
            <h1>EduMatrix AI</h1>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="upload-btn"
              title="Upload PDF"
            >
              <Plus />
              <span>Upload PDF</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf"
            />
          </div>
        </div>

        {/* Error Message Banner */}
        {error && (
          <div className="error-banner">
            <AlertCircle className="error-icon" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-dismiss">
              <X size={16} />
            </button>
          </div>
        )}

        {/* File Display */}
        {currentFile && (
          <div className="file-indicator">
            <div className="file-info">
              <FileText className="file-icon" />
              <span className="file-name">{currentFile.name}</span>
            </div>
            <button 
              onClick={() => setCurrentFile(null)}
              className="remove-file-btn"
              title="Remove file"
            >
              <X />
            </button>
          </div>
        )}

        {/* Messages Area */}
        <div ref={chatContainerRef} className="messages-container">
          {showWelcome && (
            <div className="welcome-message">
              <Bot className="welcome-icon" />
              <h2>Welcome to EduMatrix AI!</h2>
              <p>Upload a PDF document and ask me questions about it. I'm here to help!</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-wrapper ${message.type}-wrapper`}
            >
              <div className={`message ${message.type}-message`}>
                <div className="message-header">
                  {message.type === 'user' ? (
                    <User className="user-icon" />
                  ) : message.type === 'error' ? (
                    <AlertCircle className="error-icon" />
                  ) : (
                    <Bot className="bot-icon" />
                  )}
                </div>
                <div className="message-content">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <span className="timestamp">{message.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="typing-indicator">
              <div className="typing-bubble">
                <Loader2 className="typing-icon" />
                <span>EduMatrix is thinking...</span>
              </div>
              <button 
                className="stop-button" 
                onClick={handleStop}
                title="Stop generating"
              >
                <X size={16} />
                Stop
              </button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={currentFile ? "Ask me anything about your document..." : "Please upload a PDF first"}
            disabled={isLoading || !currentFile}
            className="message-input"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim() || !currentFile}
            className="send-button"
            title="Send message"
          >
            {isLoading ? <Loader2 className="loading-icon" /> : <Send className="send-icon" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;