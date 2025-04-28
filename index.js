const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data
const locations = [
  { id: '1', name: 'Pine Valley Golf Club' },
  { id: '2', name: 'Augusta National Golf Club' },
  { id: '3', name: 'Pebble Beach Golf Links' }
];

const messageStreams = [
  {
    id: '1',
    clientName: 'John Smith',
    clientImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAEW0lEQVR4nOzdO6sQZBzHcY+e4kSRENhtyDBwsMGIhkqIJOzo1BIRJiVESBJhkUu12G0IRAiDoOg6mUVbRmAN3aFwOkPRIJYFhlOQJgW9ij8E38/nBfye6ct/fBbfuufqVZN27l4e3d+4/83R/Y8+/Wp0//3Hvxzd33nu29H99Rs+HN1feezm0f3Vo+vwPycA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQtXLt0bPSBo4feHt3ffGHr6P71x9eN7u97/eDo/o83nR3dP7hl9v+EB/d9MrrvApAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkLW46vWH0gbWv/jq6/9p3a0f3Tx24eHT/uX9vGN1/+JfPRvdXjhwa3T/6xbOj+y4AaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQNrCe++8MPrA93fMNnbljlOj+6uveWV0//Z7Xxrd37Rl1+j+9tueGt1/5I3To/suAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBEDawtLhy0cf+Ovj30f3N1769Oj+seXR+VUnlmf/N7j1m/tH95dvPDe6//xv20b3XQDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmAtMWHtjw6+sDu3f+M7v9x+Mzo/t9rnhzd/+m+q0b3X1z78uj+/h8+H91fObl9dN8FIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEhbPHn4/OgDC0t7Rvf37vpgdP/82XdH98+sOz66f8niidH9lcsujO5v3XvR6L4LQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZC2uOvn60Yf2HPkidH9W5ZmG96x/s/R/TUPfD26f+DOK0b37978zOj+XZu2je67AKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBp/wUAAP//qpZcY30c7KAAAAAASUVORK5CYII=',
    unreadCount: 2,
    lastMessageAt: '2025-04-26T20:00:00.000Z',
    lastMessage: 'Is there availability for a foursome this Saturday?',
    locationId: '1',
    messages: [
      {
        id: '1',
        content: 'Hi, I would like to book a tee time for this weekend.',
        sentAt: '2025-04-26T19:55:00.000Z',
        senderId: 'client-1'
      },
      {
        id: '2',
        content: 'Is there availability for a foursome this Saturday?',
        sentAt: '2025-04-26T20:00:00.000Z',
        senderId: 'client-1'
      }
    ]
  },
  {
    id: '2',
    clientName: 'Sarah Johnson',
    clientImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAEYElEQVR4nOzd3cvY8x/H8e36Xb9WblvsYNSksQMxWWQkrSgHWomLMzkYSw7UWik3KSduijMlsU3mxCZKFMrIzc6W5DJXypw5kOuEFW25+CvepZ6Pxx/w+hw9e599v4sLx0+um3TT/+8c3X/g0Luj+/ecd+/o/pOrz43u3/7dR6P7O1fPju5ft/Dm6P7C6Dr8xwmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGmLl106+3332z79c3R/9fDa6P7CY6+O7j+85YPR/UcOLY3ubz73jdH9q/fsHt13AUgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSFq989tjoA8unPhvd37Zh5+j+Vdf/PLp/4coPo/ublp4e3d+64YnR/c0P/TW67wKQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApC1uPLBt9IEj+0+P7p/4/uzo/sHtH47uH7tx1+j+0TP7RvcffHF0ft3y3uOj+y4AaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQNr6tbe3jz6wfHjH6P7+i46M7r/01Fuj+9e+dmZ0/5YLXh7dX/ltZXR/z1cHR/ddANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYC09ff9773RB3555ZnR/V9PvD+6/+Xls/9P+Prin0b3Hz86+33989edM7p/7MzW0X0XgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBt8fO/vxh94Md/bh3d37Gyd3R/y/MHRvdXrrl/dH/TxtdH9/edPD26/8fNH4/uuwCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaeu/vWRt9IEXvnlndP/RU7+P7u/+ZHV0/+AVm0b371o6Mbp/x903jO4v7Voe3XcBSBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANL+DQAA//9x2WMxXrQkHAAAAABJRU5ErkJggg==',
    unreadCount: 0,
    lastMessageAt: '2025-04-26T18:30:00.000Z',
    lastMessage: 'Perfect, see you tomorrow at 2 PM!',
    locationId: '2',
    messages: [
      {
        id: '3',
        content: 'Do you have any tee times available tomorrow afternoon?',
        sentAt: '2025-04-26T18:00:00.000Z',
        senderId: 'client-2'
      },
      {
        id: '4',
        content: 'Yes, we have a slot at 2 PM.',
        sentAt: '2025-04-26T18:15:00.000Z',
        senderId: 'user-123'
      },
      {
        id: '5',
        content: 'Perfect, see you tomorrow at 2 PM!',
        sentAt: '2025-04-26T18:30:00.000Z',
        senderId: 'client-2'
      }
    ]
  }
];

// Middleware to check for JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  // Note: We're not actually validating the token as per requirements
  next();
};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Hardcoded credentials for testing
  if (username !== 'manager' || password !== 'golfcourse123') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({
    userId: 'user-123',
    username: username,
    role: 'manager'
  }, JWT_SECRET);

  res.json({ token });
});

// Get locations endpoint
app.get('/location', authenticateToken, (req, res) => {
  res.json(locations);
});

// Get message streams endpoint
app.get('/message-stream', authenticateToken, (req, res) => {
  const { locationId } = req.query;
  
  let filteredStreams = messageStreams.map(stream => {
    const { messages, ...streamWithoutMessages } = stream;
    return streamWithoutMessages;
  });

  if (locationId) {
    filteredStreams = filteredStreams.filter(stream => stream.locationId === locationId);
  }

  res.json(filteredStreams);
});

// Get single message stream endpoint
app.get('/message-stream/:id', authenticateToken, (req, res) => {
  const stream = messageStreams.find(s => s.id === req.params.id);
  
  if (!stream) {
    return res.status(404).json({ error: 'Message stream not found' });
  }

  res.json(stream);
});

// Mark message stream as read endpoint
app.put('/message-stream/:id', authenticateToken, (req, res) => {
  const streamIndex = messageStreams.findIndex(s => s.id === req.params.id);
  
  if (streamIndex === -1) {
    return res.status(404).json({ error: 'Message stream not found' });
  }

  messageStreams[streamIndex].unreadCount = 0;
  res.status(200).json({ success: true });
});

// Send message endpoint
app.post('/message/:stream_id', authenticateToken, (req, res) => {
  const { stream_id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const streamIndex = messageStreams.findIndex(s => s.id === stream_id);
  
  if (streamIndex === -1) {
    return res.status(404).json({ error: 'Message stream not found' });
  }

  const newMessage = {
    id: `${Date.now()}`,
    content,
    sentAt: new Date().toISOString(),
    senderId: 'user-123'
  };

  messageStreams[streamIndex].messages.push(newMessage);
  messageStreams[streamIndex].lastMessage = content;
  messageStreams[streamIndex].lastMessageAt = newMessage.sentAt;

  res.status(201).json({ success: true });
});

app.listen(port, () => {
  console.log(`Golf chat API listening on port ${port}`);
});