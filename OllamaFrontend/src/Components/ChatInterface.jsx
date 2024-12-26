import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send, Loader2, FileText, X, MessageCircle } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setCurrentFile(uploadedFile);
    } else {
      alert('Please upload only PDF files');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('question', input);

      if (currentFile) {
        formData.append('file', currentFile);
      }

      const response = await fetch('http://localhost:8080/api/chat/ask', {
        method: 'POST',
        body: formData,
      });

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = { type: 'ai', content: '', timestamp: new Date().toLocaleTimeString() };

      // Add a placeholder for the AI message
      setMessages((prev) => [...prev, aiMessage]);

      // Read the streamed response
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
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'error',
          content: 'Something went wrong. Please try again.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4 sticky-top">
      <div className="chat-container w-full max-w">
        {/* Header */}
        <div className="chat-header">
          <div className="flex items-center space-x-2">
            <div className="logo-icon">E</div>
            <h1 className="text-xl font-semibold">Edumatrix AI Chatbot</h1>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="file-upload-btn upload-btn"
            >
              <Plus size={20} />
              Upload PDF
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

        {/* File Upload Display */}
        {currentFile && (
          <div className="bg-green-50 p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="text-green-600 w-5 h-5" />
              <span className="text-sm text-green-800">{currentFile.name}</span>
            </div>
            <button
              onClick={() => setCurrentFile(null)}
              className="text-red-500 hover:bg-red-100 rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="h-[500px] overflow-y-auto p-4 space-y-3 bg-gray-50"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                message.type === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`
                  ${message.type === 'user' ? 'user-message' : 'ai-message'}
                  relative
                `}
              >
                {message.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <span className="text-xs opacity-50 block mt-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-gray-300 rounded-full px-4 py-2">
                <Loader2 className="animate-spin w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t flex space-x-2 sticky-bottom">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question about your document..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-brand-500 text-white p-2 rounded-lg hover:bg-brand-600 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default { ChatInterface};
