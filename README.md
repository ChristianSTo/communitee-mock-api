# CommuniTee Golf API

A mock API for testing a golf course chat application. This API provides endpoints for user authentication and managing chat messages between golf course staff and players.

## Setup

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will run on port 8080.

## Authentication

All endpoints except `/login` require a JWT token to be present in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Note: For testing purposes, the JWT validation is not enforced. The token only needs to be present.

## API Endpoints

### Login

Authenticate a user and receive a JWT token.

```
POST /login
```

#### Credentials

For testing purposes, the API accepts the following hardcoded credentials:

- Username: `manager`
- Password: `golfcourse123`

#### Request Body

```json
{
  "username": "string",
  "password": "string"
}
```

#### Response (200 OK)

```json
{
  "token": "jwt_token_string"
}
```

#### Error Responses

400 Bad Request

```json
{
  "error": "Username and password are required"
}
```

401 Unauthorized

```json
{
  "error": "Invalid credentials"
}
```

### Get Locations

Retrieve a list of golf course locations.

```
GET /location
```

#### Response (200 OK)

```json
[
  {
    "id": "string",
    "name": "string"
  }
]
```

### Get Message Streams

Retrieve a list of chat message streams.

```
GET /message-stream
```

#### Query Parameters

- `locationId` (optional): Filter streams by location ID

#### Response (200 OK)

```json
[
  {
    "id": "string",
    "clientName": "string",
    "clientImage": "base64_string",
    "unreadCount": 0,
    "lastMessageAt": "2025-04-26T20:00:00.000Z",
    "lastMessage": "string",
    "locationId": "string"
  }
]
```

### Get Single Message Stream

Retrieve a single message stream with full message history.

```
GET /message-stream/:id
```

#### Response (200 OK)

```json
{
  "id": "string",
  "clientName": "string",
  "clientImage": "base64_string",
  "unreadCount": 0,
  "lastMessageAt": "2025-04-26T20:00:00.000Z",
  "lastMessage": "string",
  "locationId": "string",
  "messages": [
    {
      "id": "string",
      "content": "string",
      "sentAt": "2025-04-26T20:00:00.000Z",
      "senderId": "string"
    }
  ]
}
```

#### Error Response (404 Not Found)

```json
{
  "error": "Message stream not found"
}
```

### Mark Stream as Read

Mark all messages in a stream as read.

```
PUT /message-stream/:id
```

#### Response (200 OK)

```json
{
  "success": true
}
```

#### Error Response (404 Not Found)

```json
{
  "error": "Message stream not found"
}
```

### Send Message

Send a new message to a stream.

```
POST /message/:stream_id
```

#### Request Body

```json
{
  "content": "string"
}
```

#### Response (201 Created)

```json
{
  "success": true
}
```

#### Error Responses

400 Bad Request

```json
{
  "error": "Message content is required"
}
```

404 Not Found

```json
{
  "error": "Message stream not found"
}
```

## Example Usage

1. Login to get a token:

```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username": "manager", "password": "golfcourse123"}'
```

2. Use the token to get locations:

```bash
curl http://localhost:8080/location \
  -H "Authorization: Bearer your_token_here"
```

3. Get message streams for a specific location:

```bash
curl "http://localhost:8080/message-stream?locationId=1" \
  -H "Authorization: Bearer your_token_here"
```
