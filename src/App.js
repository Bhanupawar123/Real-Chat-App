import React, { useState, useEffect, useRef } from 'react';

const WS_URL = 'ws://localhost:8080';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const message = event.data;
      setMessages(prev => [...prev, { text: message, from: 'other' }]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === '') return;
    ws.current.send(input);
    setMessages(prev => [...prev, { text: input, from: 'me' }]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <h2>Real-Time Chat</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.from === 'me' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.from === 'me' ? '#DCF8C6' : '#FFF',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
  },
  chatBox: {
    flex: 1,
    border: '1px solid #ccc',
    padding: 10,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#f5f5f5',
  },
  message: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
  },
  inputContainer: {
    display: 'flex',
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  button: {
    marginLeft: 10,
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default App;
