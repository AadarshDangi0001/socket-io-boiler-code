import { useState, useEffect } from 'react'
import './App.css'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')

function App() {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    // Listen for AI responses
    socket.on('ai-response', (response) => {
      setChatHistory(prev => [...prev, { text: response, isUser: false }])
    })

    // Cleanup socket connection on component unmount
    return () => {
      socket.off('ai-response')
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message to chat history
    setChatHistory(prev => [...prev, { text: message, isUser: true }])
    
    // Send message to server
    socket.emit('ai-message', message)
    setMessage('')
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  )
}

export default App

