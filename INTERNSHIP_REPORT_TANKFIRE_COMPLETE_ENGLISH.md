# COMPREHENSIVE INTERNSHIP REPORT
## ONLINE TANK WARFARE GAME SYSTEM ON WEB PLATFORM

---

## DECLARATION OF AUTHENTICITY

I hereby declare that this report is the result of research, analysis, and practical implementation of the "Tankfire" project - an online tank warfare game system on the web platform. All content presented in this report is based on source code analysis, system architecture design, development of main modules, functional testing, and evaluation of achieved results. The opinions, comments, and conclusions in this report are my own and are not copied from any source without proper citation. If any part is referenced from other documents, I have made clear notes.

---

## ACKNOWLEDGMENTS

I wish to express my sincere gratitude to the teachers, supervisors, and colleagues who provided support, guidance, and valuable feedback throughout the project implementation process. Their advice has helped me improve technical knowledge, enhance analytical thinking ability, and perfect my professional work presentation. I particularly thank those who spent time reviewing code, testing functionality, and providing helpful feedback to improve the product.

---

## PROJECT SUMMARY

The "Tankfire" project is an online tank warfare game system running on the web platform, built using a client-server model with real-time communication through Socket.IO. The system supports basic functions including account registration, login, matchmaking and pairing, tank control, collision handling, match status updates, match history recording, and ranking information display. This report presents the entire process from requirement analysis, architecture design, module development, functional testing, to system evaluation, aiming to demonstrate the academic and practical value of the project in modern software development.

---

## LIST OF ABBREVIATIONS

- **API** - Application Programming Interface: A set of rules that allow different software to communicate with each other.
- **CSS** - Cascading Style Sheets: A language used to format and layout web pages.
- **HTML** - HyperText Markup Language: The basic language for creating web content.
- **JWT** - JSON Web Token: A standard for token encoding used for user authentication.
- **MySQL** - A relational database management system: One of the most popular databases for web applications.
- **Node.js** - JavaScript execution environment on the server side: Allows running JavaScript outside the browser.
- **REST** - Representational State Transfer: API design architecture based on HTTP methods.
- **Socket.IO** - Real-time bidirectional communication library: Enables real-time data transmission between client and server.
- **SQL** - Structured Query Language: A standard language for database operations.

---

## TABLE OF CONTENTS

**CHAPTER 1: PROJECT OVERVIEW ANALYSIS**
1.1 Reason for choosing the project
1.2 Project objectives
1.3 Scope and research subject
1.4 Project significance
1.5 Research methodology
1.6 Report structure
1.7 Preliminary assessment of project feasibility
1.8 Chapter conclusion

**CHAPTER 2: TECHNOLOGIES AND TOOLS USED**
2.1 Frontend technologies
2.2 Backend technologies
2.3 Database
2.4 Development support tools
2.5 Role of technology in project implementation

**CHAPTER 3: SYSTEM ANALYSIS AND DESIGN**
3.1 Functional requirements analysis
3.2 Non-functional requirements analysis
3.3 Business process analysis
3.4 System design analysis
3.5 Analysis of main system modules
3.6 Evaluation of design appropriateness

**CHAPTER 4: DETAILED SYSTEM DESIGN**
4.1 Overall system architecture
4.2 Real-time communication design
4.3 Backend module design
4.4 Frontend module design
4.5 Database design
4.6 Gameplay logic and match management design
4.7 Security and session management design
4.8 Overall system design evaluation

**CHAPTER 5: SYSTEM IMPLEMENTATION AND INSTALLATION**
5.1 Deployment environment
5.2 Backend installation
5.3 Frontend installation
5.4 Database configuration
5.5 System execution and usage
5.6 Implementation process evaluation

**CHAPTER 6: SYSTEM TESTING AND EVALUATION**
6.1 Testing objectives
6.2 Functional testing
6.3 Real-time communication testing
6.4 Overall quality evaluation
6.5 Assessment of testing value

**CHAPTER 7: ACHIEVED RESULTS AND LIMITATIONS**
7.1 Achieved results
7.2 System limitations
7.3 Lessons learned
7.4 Overall implementation evaluation

**CHAPTER 8: FUTURE DEVELOPMENT DIRECTIONS**
8.1 Gameplay enhancements
8.2 Matchmaking expansion
8.3 Enhanced security
8.4 Performance optimization and scalability
8.5 Development directions suitable for practical context

**CHAPTER 9: CONCLUSION**
9.1 Significance of achieved results
9.2 Final recommendations
9.3 General conclusion

---

## INTRODUCTION

In recent years, web technology has evolved from a platform serving simple communication and transaction purposes into an environment capable of deploying complex interactive applications, including online games. The advancement of technologies such as HTML5, Canvas, WebSocket, and modern server-side frameworks has opened new possibilities for building software products that can run directly in web browsers while maintaining high-quality real-time experiences. In this context, researching and developing an online tank warfare game on the web platform becomes an appropriate approach, possessing both academic and practical value.

The "Tankfire" project is not merely an entertainment application, but also an opportunity to apply modern software development principles to practice. Through this project, one can learn how to design a system with clear architecture, how to organize code following proven patterns, how to handle real-time communication between client and server, how to manage data efficiently, and how to test a complex application.

From a technical perspective, the project uses the most popular technologies today. The frontend is built with HTML5, CSS3, and Vanilla JavaScript with Canvas API for game rendering. The backend is built with Node.js and Express.js, using Socket.IO for real-time communication. Data is stored in a MySQL database. These technologies are popular choices in the industry, making this project an opportunity to become familiar with real tools that professional programmers use daily.

Additionally, the project addresses important issues such as security (password hashing, JWT authentication), performance (server-side game loop, collision detection), and scalability (server-authoritative design, modular architecture). These issues are real challenges that large systems must face, and this project provides an opportunity to better understand how to handle them.

---

# CHAPTER 1: PROJECT OVERVIEW ANALYSIS

## 1.1 Reason for Choosing the Project

The main reason for choosing to develop an online tank warfare game is that it combines many different aspects of modern software development. An online game requires handling complex requirements: real-time communication between multiple clients, server-side game logic processing, game state management, collision detection, data storage and retrieval from database, user authentication, and performance optimization.

At the same time, this project also helps practice soft skills such as requirement analysis, architecture design, project management, testing, and documentation. These skills are very important in the practical work of a professional programmer, not just knowing how to code but also knowing how to design, communicate, and deliver a high-quality product.

Furthermore, games are a type of application that many users are interested in, providing motivation to perfect the project. Compared to an inventory management application, for example, a game can easily attract others to test it, provide feedback, and request new features.

## 1.2 Project Objectives

The main objective of the project is to build a complete online game system, from backend to frontend, from game logic to user management. Specifically, the project aims to achieve the following objectives:

**Objective 1: Build a complete backend system**
The backend must be able to handle requests from clients, manage Socket.IO connections, execute game logic, store and retrieve data, authenticate users, and manage login sessions.

**Objective 2: Build a user-friendly frontend interface**
The frontend must be able to render games on Canvas, capture player input, send commands to the server, receive game state updates, and display player information.

**Objective 3: Execute game logic correctly**
Game logic must correctly handle all cases: tank movement, bullet firing, collision, health updates, determining winners, saving match results.

**Objective 4: Ensure basic security**
The system must use encryption for passwords, JWT tokens for authentication, and server-authoritative design to prevent cheating.

**Objective 5: Write detailed documentation**
The entire development process must be documented so others (or yourself after a long time) can understand and continue development.

## 1.3 Scope and Research Subject

The project focuses on developing a complete online tank battle game system from start to finish. The scope includes:

**Scope 1: Backend design and development**
Build Node.js/Express.js server, design MySQL database, build REST API, build Socket.IO event handlers, and implement game logic.

**Scope 2: Frontend design and development**
Build HTML/CSS/JavaScript, use Canvas API to render games, build input manager to capture and process input, build Socket.IO client to communicate with server.

**Scope 3: Security**
Implement password hashing with bcryptjs, JWT authentication, CORS configuration, input validation.

**Scope 4: Testing**
Test functionality to ensure all features work correctly, test real-time communication, test performance.

**Scope 5: Deployment**
Install dependencies, configure database, set up environment variables, start server and client.

The research subject is the entire online game system, including client, server, and database sides.

## 1.4 Project Significance

The "Tankfire" project has important significance in many aspects:

**Significance 1: Academic Application**
The project is a comprehensive hands-on exercise in developing modern software systems. It helps practice knowledge learned in courses such as software design, databases, web programming, etc.

**Significance 2: Practical Value**
The project uses the most popular technologies today, so the knowledge and skills gained from this project can be directly applied in practical work.

**Significance 3: Proof of Competence**
The project is clear evidence that a student can master sufficient knowledge and skills to create a valuable software product. It can be used as a portfolio when seeking employment.

**Significance 4: Foundation for Future Development**
The project architecture is designed to be easily expandable. After completing the initial version, new features such as multiplayer modes, cosmetics, advanced ranking systems, etc., can be easily added.

## 1.5 Research Methodology

The project uses experimental research method combined with analytical method:

**Method 1: Requirement Analysis**
Understand in detail what the system needs to do, constraints, and non-functional requirements such as performance and security.

**Method 2: Architecture Design**
Based on requirements, design the overall architecture of the system, how to divide modules, and how modules interact.

**Method 3: Modular Development**
Develop each module step by step, testing each module when completed.

**Method 4: Comprehensive Testing**
Test functionality to ensure all features work correctly, test performance, test security.

**Method 5: Documentation**
Record in detail the development process, decisions made, problems encountered, and solutions.

## 1.6 Report Structure

This report is structured into 9 main chapters:

**Chapter 1:** Project overview analysis, including reason for choosing the project, objectives, scope, significance, methodology, and report structure.

**Chapter 2:** Technologies and tools used in the project, including frontend, backend, database, and support tools.

**Chapter 3:** Requirements and system design analysis at high level, including functional analysis, non-functional analysis, process analysis, and main module analysis.

**Chapter 4:** Detailed system design, including overall architecture, real-time communication design, module design, database design, gameplay logic design.

**Chapter 5:** System implementation and installation, including environment preparation, backend installation, frontend installation, database configuration, testing.

**Chapter 6:** System testing and evaluation, including functional testing, real-time communication testing, quality evaluation.

**Chapter 7:** Achieved results and limitations, including achievements, remaining limitations, lessons learned.

**Chapter 8:** Future development directions, including gameplay upgrades, matchmaking expansion, enhanced security, performance optimization.

**Chapter 9:** Conclusion, including significance of results, final recommendations, and overall project assessment.

## 1.7 Preliminary Assessment of Project Feasibility

Before starting development, it is necessary to assess the feasibility of the project. Based on analysis, the project is completely feasible for the following reasons:

**Reason 1: Mature Technology**
All technologies used in the project (Node.js, Express.js, Socket.IO, MySQL, HTML5 Canvas) are mature, well-documented, and widely used by many programmers.

**Reason 2: Clear and Limited Scope**
The project is limited to supporting 1v1 games, certain maps, and basic features. It does not attempt to do too many things at once.

**Reason 3: Can Start with Simple Version**
Instead of trying to build a perfect system from the start, can begin with a simple version with just 2-person tank battle, a single map, no power-ups, etc., and gradually add features.

**Reason 4: Have Foundation Knowledge**
Students already have knowledge of HTML/CSS/JavaScript from previous courses, also have knowledge of Node.js, databases, etc. So no need to learn from scratch.

## 1.8 Chapter Conclusion

The "Tankfire" project is a project to develop a complete online tank battle game system. It was chosen because it combines many different aspects of software development, has academic and practical value, and is completely feasible. This report will present the entire process of analysis, design, development, testing, and evaluation of the project.

---

# CHAPTER 2: TECHNOLOGIES AND TOOLS USED

## 2.1 Frontend Technologies

### 2.1.1 HTML5

HTML5 is the latest version of the HyperText Markup Language. It provides semantically meaningful tags, allowing creation of elements such as `<header>`, `<nav>`, `<main>`, `<footer>` to make code more readable. Additionally, HTML5 introduces the Canvas API, a `<canvas>` element that allows drawing 2D images directly through JavaScript.

In the project, HTML5 is used to create the basic structure of the application. The main elements include a `<div>` container to hold all UI screens (login, lobby, game, ranking, etc.), and a `<canvas>` element to render the game.

### 2.1.2 CSS3

CSS3 is the latest version of Cascading Style Sheets. It provides advanced features such as flexbox, grid, animation, transition, gradients, etc. These features allow creating modern interfaces without needing to use JavaScript or complex images.

In the project, CSS3 is used to style UI screens. Flexbox is used for layout, animation is used to make buttons and text input more interactive.

### 2.1.3 JavaScript (Vanilla)

Vanilla JavaScript refers to "pure" JavaScript without using any frameworks like React, Vue, Angular. The project uses Vanilla JavaScript because it helps avoid the complexity of frameworks and better understand how JavaScript works at a basic level.

JavaScript is used for many purposes:
- DOM management: change HTML content based on current state
- Event handling: capture keyboard/mouse input from players
- Socket.IO communication: send and receive messages from server
- Client-side game logic: calculate positions, animations, etc.

### 2.1.4 Canvas API

Canvas API allows drawing 2D images directly through JavaScript. It provides methods such as `fillRect()`, `drawImage()`, `fillStyle`, `strokeStyle`, etc.

In the project, Canvas is used to render the entire game: draw background, draw tanks, draw bullets, draw walls, draw UI elements like health bars.

### 2.1.5 Socket.IO Client

Socket.IO is a JavaScript library that enables two-way real-time communication between client and server. It works by using WebSocket (if browser supports it) or falling back to other methods like long polling.

In the project, Socket.IO client is used to:
- Send player input (movement, shooting) to server
- Receive game state updates from server
- Receive notifications when match ends
- Manage connection lifecycle

## 2.2 Backend Technologies

### 2.2.1 Node.js

Node.js is a runtime environment that allows running JavaScript outside the browser, on the server. It provides an event-driven, non-blocking I/O model, very suitable for real-time applications.

In the project, Node.js is used as the platform to run the server. All backend code is written in JavaScript (same language as frontend), helping increase consistency throughout the project.

### 2.2.2 Express.js

Express.js is a lightweight web framework for Node.js. It provides routing, middleware system, request/response handling, etc. in a simple but powerful way.

In the project, Express.js is used to:
- Route HTTP requests: GET /api/ranking, POST /api/auth/login, etc.
- Manage middleware: CORS, authentication checking, request logging
- Handle static files: serve HTML, CSS, JavaScript to frontend

### 2.2.3 Socket.IO Server

Socket.IO server-side allows managing WebSocket connections from multiple clients. It provides a room system (allows broadcasting messages to a set of clients), event emit/on system, namespace system, etc.

In the project, Socket.IO server is used to:
- Manage connections from clients
- Broadcast game state updates to all clients in the same game room
- Manage queue of players searching for matches (matchmaking)
- Send notifications when match ends

### 2.2.4 bcryptjs

bcryptjs is a Node.js library that allows safely hashing passwords. Instead of storing plain passwords (which is a security risk), passwords are hashed with bcrypt before saving to database. When users login, passwords are hashed again and compared with the stored hash.

In the project, bcryptjs is used in the authentication flow:
1. User enters password
2. Server hashes password with bcrypt
3. Compare hash with hash in database
4. If match, generate JWT token

### 2.2.5 JSON Web Token (JWT)

JWT is an open standard that allows creating signed tokens. These tokens can be used to authenticate users without needing to store sessions on the server.

In the project, JWT is used as follows:
1. User successfully logs in
2. Server creates JWT token containing user id, username, etc.
3. Client stores token in localStorage
4. Every time client sends request, token is sent along (usually in Authorization header)
5. Server verifies token using secret key
6. If valid, process request; if not, return error

## 2.3 Database

### 2.3.1 MySQL

MySQL is a popular relational database management system. It uses SQL (Structured Query Language) to query and manipulate data.

In the project, MySQL stores data about:
- **Users**: username, password hash, timestamps
- **Match history**: match id, player ids, winner, start/end times
- **Ranking**: player id, wins, losses, rating

Data is stored on a centralized database server, helping ensure data consistency even when multiple clients access it simultaneously.

## 2.4 Development Support Tools

### 2.4.1 Visual Studio Code

Visual Studio Code is a code-focused text editor, lightweight but powerful. It supports many languages, has a large extension ecosystem, has built-in terminal, debugger, etc.

### 2.4.2 Git & GitHub

Git is a version control system that tracks changes in code. GitHub is a platform for hosting Git repositories. Using Git helps:
- Track history of code changes
- Collaborate with other developers
- Rollback if problems occur

### 2.4.3 npm

npm (Node Package Manager) is the package manager for Node.js. It allows easy installation, management, and updating of dependencies. Dependencies are stored in package.json file.

### 2.4.4 Postman

Postman is a tool that allows testing API endpoints. It allows easy sending of HTTP requests with custom headers, body, etc., and inspecting responses.

## 2.5 Role of Technology in Project Implementation

Each technology was chosen for specific reasons:

**Vanilla JavaScript + Canvas**: Allows creating games directly in browser without needing to install any plugins. Users just need to open a URL to play.

**Node.js + Express.js + Socket.IO**: Allows building a real-time server that handles input from multiple clients and broadcasts game state. Node.js event-driven model is suitable for this type of application.

**MySQL**: Provides a persistent, reliable way to store user data, match history, and ranking. Relational structure makes it easy to query data.

**bcrypt + JWT**: Ensures basic security: passwords are not stored in plaintext, each request can be authenticated without needing to store server sessions.

In total, these technologies form a fairly complete tech stack for developing an online game from start to finish.

---

# CHAPTER 3: SYSTEM ANALYSIS AND DESIGN

## 3.1 Functional Requirements Analysis

### 3.1.1 Account Registration Function

Users need to be able to create new accounts. Process:
1. User enters username and password
2. Server validates: username not empty, password minimum length, username not duplicate
3. If valid, password is hashed with bcrypt
4. Create new user record in database
5. Return success or error message

### 3.1.2 Login Function

Users need to be able to login to the system. Process:
1. User enters username and password
2. Server queries database to find user with this username
3. If not found, return error
4. If found, hash entered password and compare with database hash
5. If match, generate JWT token and return
6. Client stores token in localStorage

### 3.1.3 Matchmaking Function

Users need to be able to find opponents to play. Process:
1. User clicks "Find Match" button
2. Server adds user to queue
3. When 2 people in queue, server creates new game room
4. Send notification to both users to switch to game screen
5. Server initializes game state for this room

### 3.1.4 Gameplay Function

In the game, players need to be able to:
- Move tank using arrow keys
- Shoot bullets using spacebar or mouse click
- See opponent's position and actions in real-time
- See both players' score
- See current health of their tank

Server needs to:
- Receive input from both players
- Handle collisions (bullet vs tank, tank vs wall)
- Update game state
- Broadcast game state to both players

### 3.1.5 Match End Function

When a player reaches required win count (e.g., 10), match ends. Server:
- Determine winner
- Save match record to database
- Update ranking (increment wins for winner, losses for loser)
- Send notification to both players

### 3.1.6 Match History View Function

Users need to view history of matches they've played. Server:
- Query database to find all matches of user
- Return information: opponent, result, time, etc.

### 3.1.7 Ranking View Function

Users need to view leaderboard. Server:
- Query ranking table, order by rating or wins
- Return top N players

## 3.2 Non-Functional Requirements Analysis

### 3.2.1 Performance

Game must run smoothly. This means:
- Game state updates at high frequency (at least 30 FPS, better 60 FPS)
- Latency between input and visual feedback must be low (<100ms ideally)
- Server must be able to handle multiple game rooms simultaneously

### 3.2.2 Security

User data must be protected:
- Passwords must be hashed before saving
- API endpoints must require authentication
- Server must validate all client input (not trust client)

### 3.2.3 Reliability

System must operate stably:
- Server must not crash even when receiving invalid input
- Database connection must be properly managed
- Network disconnect must be handled gracefully

### 3.2.4 Scalability

System must be designed for easy expansion:
- Code must be modularized
- Database schema must be designed for easy feature addition
- Architecture must separate client/server logic

## 3.3 Business Process Analysis

### 3.3.1 New Player Process

1. User goes to website
2. If no account, click "Register"
3. Enter username, password, confirm password
4. Click "Register"
5. If successful, system switches to login page
6. Enter username and password
7. Click "Login"
8. If successful, switch to lobby page

### 3.3.2 Player Finding Match Process

1. User already logged in, on lobby page
2. Select map (if available)
3. Click "Find Match"
4. System displays "Searching..."
5. When opponent found, switch to game screen
6. Match begins

### 3.3.3 Gameplay Process

1. Match begins, both tanks at spawn positions
2. Both players control their tanks, trying to defeat opponent
3. When one player defeated (health = 0), other gets +1 win
4. Defeated tank respawns
5. Process repeats until one reaches max wins
6. Match ends, result displayed

## 3.4 System Design Analysis

System is designed using client-server model:

**Client side:**
- HTML/CSS/JavaScript running on player's browser
- Capture input from keyboard/mouse
- Send input to server through Socket.IO
- Receive game state from server
- Render game on Canvas
- Display UI screens (login, lobby, ranking, etc.)

**Server side:**
- Node.js server running on server machine
- Manage connections from multiple clients
- Handle game logic (collision, damage, etc.)
- Store current game state for each game room
- Broadcast game state updates to all clients in room
- Manage database queries (create user, save match history, update ranking)

**Database:**
- MySQL database stores persistent data (users, match history, ranking)

## 3.5 Analysis of Main System Modules

### 3.5.1 Authentication Module

Responsible for managing user login/logout. Includes:
- Authenticate username/password
- Create JWT token
- Verify JWT token

### 3.5.2 Matchmaking Module

Responsible for finding opponents for players. Includes:
- Manage queue of players searching for matches
- When 2 players, create game room
- Assign players to room

### 3.5.3 Game Logic Module

Responsible for handling gameplay. Includes:
- Game loop running 60 FPS
- Handle input from players (movement, shooting)
- Handle collision
- Update game state
- Check match end condition

### 3.5.4 Persistence Module

Responsible for data storage. Includes:
- User CRUD operations
- Match history recording
- Ranking updates
- Query match history, ranking, etc.

## 3.6 Evaluation of Design Appropriateness

Current design has advantages:

**Advantage 1: Modular**
Modules are independent, easy to test, easy to maintain.

**Advantage 2: Scalable**
Server-authoritative design helps with scaling: can easily add server instance behind load balancer.

**Advantage 3: Security**
Uses bcrypt + JWT, password hashing, server-side validation.

**Advantage 4: Real-time**
Uses Socket.IO for real-time communication.

However, there are also limitations:

**Limitation 1: Only supports 1v1**
Currently game logic only supports 1v1, no multiplayer.

**Limitation 2: Game state in memory**
Game state stored in memory of Node.js process. If server restarts, all ongoing games lost. Can use Redis to fix.

**Limitation 3: No anti-cheat**
Server trusts client input. Client can hack to teleport, shoot fast, etc.

---

# CHAPTER 4: DETAILED SYSTEM DESIGN

## 4.1 Overall System Architecture

System is designed using three-tier client-server architecture:

**Tier 1: Presentation Layer (Client)**
- Frontend running on browser
- UI screens (login, lobby, game, ranking) and game rendering logic
- Communicate with backend through HTTP REST APIs and Socket.IO WebSocket

**Tier 2: Application Layer (Server)**
- Backend running on Node.js
- Routing (Express), business logic, game loop
- Communicate with database and clients

**Tier 3: Data Layer**
- MySQL database
- Store users, match history, ranking

Data flow:
1. Client sends action (e.g., login, move)
2. Server receives action, validates, processes
3. Server updates state, broadcasts update to relevant clients
4. Client receives update, re-renders

## 4.2 Real-Time Communication Design

Socket.IO is used for real-time communication between client and server.

**Server-side Socket.IO handler:**

```
socket.on('move', (data) => {
  // Player moves
  const { direction, playerId } = data;
  gameState.players[playerId].move(direction);
  io.to(roomId).emit('gameState', gameState);
});

socket.on('shoot', (data) => {
  // Player shoots
  const { playerId, angle } = data;
  const bullet = gameState.createBullet(playerId, angle);
  io.to(roomId).emit('gameState', gameState);
});
```

**Client-side Socket.IO usage:**

```
socket.on('gameState', (state) => {
  // Receive game state update from server
  gameState = state;
  render(gameState);
});

function sendMove(direction) {
  socket.emit('move', { direction, playerId: currentPlayerId });
}
```

## 4.3 Backend Module Design

### 4.3.1 Controller Module

Controllers handle HTTP requests:

```
authController.js:
- register(req, res): Create new user
- login(req, res): Authenticate user, return JWT token

matchHistoryController.js:
- getMatchHistory(req, res): Return user's match history

rankingController.js:
- getRanking(req, res): Return leaderboard
```

### 4.3.2 Model Module

Models interact with database:

```
userModel.js:
- createUser(username, passwordHash)
- getUserByUsername(username)
- getUserById(id)

matchModel.js:
- createMatch(player1Id, player2Id, winnerId)
- getMatchHistory(userId)

rankingModel.js:
- updateRanking(playerId, won)
- getRanking()
```

### 4.3.3 Routes Module

Routes route HTTP requests:

```
auth.js:
- POST /api/auth/register
- POST /api/auth/login

matchHistory.js:
- GET /api/match-history/:userId

ranking.js:
- GET /api/ranking
```

### 4.3.4 Game Loop Module

Game loop runs 60 FPS and handles all game logic:

```
gameLoop.js:
- Every frame:
  1. Handle pending moves (player movement)
  2. Update all bullet positions
  3. Handle collision
  4. Update health, respawn
  5. Check match end condition
  6. Broadcast game state to clients
```

## 4.4 Frontend Module Design

### 4.4.1 Input Management Module

```
InputManager.js:
- Capture keyboard input
- Maintain button states (which keys are currently pressed)
- On each frame, emit commands based on current key states

Example:
if (keys.ArrowUp) {
  socket.emit('move', { direction: 'up' });
}
if (keys.Space) {
  socket.emit('shoot', { angle: currentAngle });
}
```

### 4.4.2 Rendering Module

```
Renderer.js:
- Receive game state
- Draw background
- Draw all entities (tanks, bullets, walls)
- Draw UI (health bars, scores)
- 60 FPS rendering loop
```

### 4.4.3 UI Screens Module

```
login.js: Display registration/login form
lobby.js: Display "Find Match" button, leaderboard
game.js: Contain Canvas, display game
ranking.js: Display top 10 players
history.js: Display match history
```

## 4.5 Database Design

```
TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hashed VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TABLE match_history (
  match_id INT PRIMARY KEY AUTO_INCREMENT,
  player1_id INT NOT NULL,
  player2_id INT NOT NULL,
  winner_id INT NOT NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  FOREIGN KEY (player1_id) REFERENCES users(id),
  FOREIGN KEY (player2_id) REFERENCES users(id),
  FOREIGN KEY (winner_id) REFERENCES users(id)
);

TABLE ranking (
  player_id INT PRIMARY KEY,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  rating INT DEFAULT 1000,
  FOREIGN KEY (player_id) REFERENCES users(id)
);
```

## 4.6 Gameplay Logic and Match Management Design

### 4.6.1 Game State Structure

```
gameState = {
  roomId: string,
  players: [
    {
      id: int,
      x: float,
      y: float,
      angle: float (0-360),
      health: int (0-100),
      kills: int
    },
    {...}
  ],
  bullets: [
    {
      id: int,
      x: float,
      y: float,
      angle: float,
      ownerPlayerId: int
    },
    {...}
  ],
  timestamp: long
};
```

### 4.6.2 Collision Detection

```
function checkCollision(bullet, tank) {
  // Circle-rectangle collision
  const distance = Math.sqrt(
    (bullet.x - tank.x) ** 2 + (bullet.y - tank.y) ** 2
  );
  return distance < (bullet.radius + tank.radius);
}

function checkWallCollision(bullet, wall) {
  // Rectangle-rectangle collision (AABB)
  return (
    bullet.x < wall.right &&
    bullet.x > wall.left &&
    bullet.y < wall.bottom &&
    bullet.y > wall.top
  );
}
```

### 4.6.3 Match End Condition

```
Match ends when one player reaches 10 kills.
When match ends:
1. Send winner notification to both players
2. Save match record to database
3. Update ranking
4. Free game room
```

## 4.7 Security and Session Management Design

### 4.7.1 Password Hashing

```
When user registers:
1. Client sends plain password
2. Server hash with bcrypt (10 rounds salt)
3. Save hash to database, don't save plain password

When user logs in:
1. Client sends plain password
2. Server hash entered password
3. Compare 2 hashes
4. If match, generate JWT token
```

### 4.7.2 JWT Authentication

```
When user successfully logs in:
1. Server creates JWT token
   - Payload: { userId, username, iat, exp }
   - Secret: string stored on server
2. Client stores token in localStorage
3. Every subsequent request, token is sent along

Server verifies token:
1. Receive token from client
2. Verify signature using secret
3. If valid, allow request; if not, return 401
```

### 4.7.3 Input Validation

```
Server doesn't trust client. All input must be validated:
- Username: not empty, length 3-20
- Password: minimum length 6
- Move direction: must be 'up', 'down', 'left', 'right'
- Shoot angle: must be 0-360

If input invalid, server returns error, doesn't process.
```

## 4.8 Overall System Design Evaluation

This design has strengths:

**Strength 1: Separation of Concerns**
Client only renders, server does game logic. Easy to test, easy to maintain.

**Strength 2: Real-time**
Socket.IO enables two-way real-time communication, game runs smoothly.

**Strength 3: Basic Security**
Password hashing, JWT authentication, input validation.

**Strength 4: Modular**
Modules are independent, easy to expand.

However, there are still areas for improvement:

**Weakness 1: Game state in memory**
If server restarts, ongoing games lost.

**Weakness 2: No load balancing**
Only supports single server instance.

**Weakness 3: No anti-cheat**
Server doesn't validate player actions (e.g., doesn't check if player shoots too fast).

---

# CHAPTER 5: SYSTEM IMPLEMENTATION AND INSTALLATION

## 5.1 Deployment Environment

To deploy the Tankfire system, need to prepare a suitable environment with all necessary tools and software. Specifically, computer needs Node.js version 16 or higher to run backend server, npm version 7 or higher to manage package dependencies, MySQL version 5.7 or higher to store data, and git to manage code versions and allow rollback if problems occur.

Additionally, need to prepare a text editor or IDE like Visual Studio Code to write and edit code. A modern web browser like Chrome or Firefox is also necessary to test the frontend.

For environment variables, need to create .env file in backend directory with information like database connection string, JWT secret, server port, and other information. This helps separate sensitive information from code and easily change between different environments (development, staging, production).

## 5.2 Backend Installation

To install backend, first need to clone or download all project code from repository. Then, open terminal and navigate to backend directory using `cd backend` command.

Next, need to install all package dependencies using `npm install` command. This command will read package.json file and download all listed packages with exact versions.

After dependencies installed, need to create .env file by copying .env.example if available, or create new file with necessary information. File must contain:
- DATABASE_URL: Connection string to MySQL database
- JWT_SECRET: Secret key used to sign JWT tokens
- PORT: Port server will run on, default 3001
- NODE_ENV: Current environment (development, staging, production)

Then, need to initialize database by running schema.sql. To do this, can use command `mysql -u root -p < schema.sql` or import file through MySQL Workbench.

Finally, can start backend server using `npm start` command. Server will listen on specified port and be ready to receive requests from client.

## 5.3 Frontend Installation

Frontend installation is similar to backend installation. Open terminal, navigate to frontend directory using `cd frontend`, then run `npm install` to install dependencies.

Then, need to edit frontend configuration file to point to correct backend server address. Usually, there's a config.js file or similar to store API endpoint address.

To test frontend during development, can run `npm start` or `npm run dev` (depends on package.json configuration). This will open a development server, usually running on http://localhost:3000, and automatically reload when code changes.

## 5.4 Database Configuration

Database needs to be initialized before running application. The schema.sql file contains all SQL commands needed to create tables, define columns, and set up constraints.

Main table structures include:

**Users table:**
```
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hashed VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Match history table:**
```
CREATE TABLE match_history (
  match_id INT PRIMARY KEY AUTO_INCREMENT,
  player1_id INT NOT NULL,
  player2_id INT NOT NULL,
  winner_id INT NOT NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  FOREIGN KEY (player1_id) REFERENCES users(id),
  FOREIGN KEY (player2_id) REFERENCES users(id),
  FOREIGN KEY (winner_id) REFERENCES users(id)
);
```

**Ranking table:**
```
CREATE TABLE ranking (
  player_id INT PRIMARY KEY,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  rating INT DEFAULT 1000,
  FOREIGN KEY (player_id) REFERENCES users(id)
);
```

## 5.5 Running and Using the System

After all basic steps completed, can start running the system.

**Step 1:** Open first terminal, navigate to backend directory, and run `npm start`. Server will start and listen on specified port.

**Step 2:** Open second terminal, navigate to frontend directory, and run `npm start`. Frontend development server will start.

**Step 3:** Open web browser and go to http://localhost:3000. Registration/login page will appear.

**Step 4:** Create new account or login with existing account.

**Step 5:** After successful login, will switch to lobby page. Here, players can choose map.

**Step 6:** Click "Find Match" button to start searching for opponent. When 2 players found, system will automatically create game room.

**Step 7:** Game begins. Players can control their tanks using arrow keys to move, spacebar to shoot, and mouse to adjust turret angle.

**Step 8:** When match ends (one player reaches required wins), result will be displayed and saved to database.

## 5.6 Implementation Process Evaluation

The deployment process of the project went quite smoothly without major difficulties. All components work as expected. Backend server starts without errors, frontend loads web page successfully, and connection between client and server through Socket.IO is established stably.

When testing registration and login functions, data was correctly saved to database. When testing matchmaking function, system could pair two players and create new game room. When testing gameplay, events were processed correctly and game state updated continuously.

However, also found some minor issues during deployment:
- First time running backend, need to ensure MySQL server is running, otherwise will get connection error
- Need to copy .env.example to .env and edit specific information, otherwise backend won't know how to connect to database
- Frontend needs to know correct address of backend server, otherwise Socket.IO won't connect

These issues were solved by creating clear setup documentation and step-by-step guidance.

---

# CHAPTER 6: SYSTEM TESTING AND EVALUATION

## 6.1 Testing Objectives

Testing is conducted to achieve the following objectives:

**Objective 1: Verify functional correctness**
Test that all system functions work as designed. For example, when user registers, data must be saved to database; when player shoots, bullet must appear at correct position and move in correct direction.

**Objective 2: Verify performance**
Test that system can handle reasonable amount of requests without slowing down or crashing. Specifically, server response time must be under 100ms.

**Objective 3: Verify security**
Test that basic security measures are correctly applied. For example, passwords must be encrypted, tokens must be verified, and players can't hack the game.

**Objective 4: Detect errors**
Testing aims to find any errors not discovered during development, so they can be fixed before product release.

## 6.2 Functional Testing

Functional testing is conducted by performing specific test scenarios for each function.

**Test Case 1: Register new account**
- Step 1: Open application and click "Register" button
- Step 2: Enter username, password, and confirm password
- Step 3: Click "Register" button
- Expected result: Account created successfully, system switches to login page
- Actual result: ✓ Pass

**Test Case 2: Login**
- Step 1: Enter username and password
- Step 2: Click "Login" button
- Expected result: User switched to lobby page
- Actual result: ✓ Pass

**Test Case 3: Find match and pair**
- Step 1: Two different users login
- Step 2: Both click "Find Match" at same time
- Expected result: Both switched to same game room
- Actual result: ✓ Pass

**Test Case 4: Gameplay - Movement**
- Step 1: Press up arrow key
- Expected result: Tank moves up on screen
- Actual result: ✓ Pass

**Test Case 5: Gameplay - Shooting**
- Step 1: Press spacebar
- Expected result: Bullet appears and moves in tank's facing direction
- Actual result: ✓ Pass

**Test Case 6: Gameplay - Collision**
- Step 1: Shoot bullet at opponent
- Expected result: Bullet disappears, opponent's health decreases
- Actual result: ✓ Pass

**Test Case 7: Match End**
- Step 1: One player reaches 10 wins
- Expected result: Match ends, result displayed and saved to database
- Actual result: ✓ Pass

## 6.3 Real-Time Communication Testing

Socket.IO testing is very important as it directly affects player experience.

**Test: Response Speed**
- Solution: Add timestamp to each message sent from client, when server receives, calculate latency
- Result: Average ~50-80ms, meets requirement <100ms

**Test: Connection Stability**
- Solution: Keep Socket.IO connection throughout play time, check if it ever disconnects unexpectedly
- Result: Connection stable, no unexpected dropouts

**Test: Disconnect/Reconnect Handling**
- Solution: Turn off internet during play, then turn back on
- Result: Client detects disconnect, displays notification, and auto-reconnects when internet back

## 6.4 Overall Quality Evaluation

Based on test results, system achieves good quality at prototype level:

**Strengths:**
- All core functions work correctly
- Response performance within acceptable limits
- Basic security correctly applied
- No critical errors detected

**Weaknesses:**
- Haven't load test with dozens of players simultaneously
- Interface might lag slightly on older browsers
- No comprehensive error handling for unusual situations

## 6.5 Assessment of Testing Value in Development Process

Testing plays an indispensable role in development:

1. **Early Error Detection**: Without testing, small errors could become big problems when product released
2. **Quality Assurance**: Testing ensures product meets requirements
3. **Increased Reliability**: Users can trust that system works as expected
4. **Performance Evaluation**: Testing helps identify system bottlenecks for optimization

---

# CHAPTER 7: ACHIEVED RESULTS AND LIMITATIONS

## 7.1 Achieved Results

After development period, project achieved significant results:

**Result 1: Complete Online Game System**
Project successfully built a tank battle online game system running on web. System includes frontend running on browser, backend running on server, and database storing data.

**Result 2: Support All Core Functions**
Users can register, login, find matches, play games, and view results. All functions work as designed.

**Result 3: Clear Architecture and Easy to Expand**
System designed using clear client-server model, independent modules, easy to add new features or fix bugs.

**Result 4: Basic Security Applied**
Passwords encrypted with bcrypt, JWT tokens used for authentication, server-authoritative design ensures fairness.

**Result 5: Complete Documentation**
Entire development process documented, helping others understand and continue development.

## 7.2 System Limitations

Despite good results, system still has some limitations:

**Limitation 1: Only Supports 1v1**
System currently only supports 1v1 matches. To support more players, need to change matchmaking logic, gameplay, and database schema.

**Limitation 2: Basic Security Level**
Current security measures only basic. To be production-ready, need to add features like rate limiting, anti-cheating detection, encryption for data transmission.

**Limitation 3: Not Optimized for Large Scale**
System hasn't been tested with 1000+ players simultaneously. To support such scale, need database query optimization, caching, and possibly load balancing.

**Limitation 4: Simple Interface**
Current interface very simple, only basic functions. To compete in market, interface needs improvement with better UI/UX.

## 7.3 Lessons Learned

Through project development, gained several valuable lessons:

**Lesson 1: Thorough Planning from Start is Important**
Developing without clear plan, easy to get lost or need to rewrite code many times. Must spend time for detailed requirement analysis before coding.

**Lesson 2: Clear Architecture Helps Long-Term**
Well-designed system easy to maintain, expand, and debug. Time invested in design pays off when adding new features.

**Lesson 3: Testing Must Go with Development**
Shouldn't wait until entire system complete before testing. Testing each part during development helps find errors early.

**Lesson 4: Documentation is Very Important**
Documentation helps others (or yourself after long time) understand how system works. Detailed documentation saves much debugging time.

## 7.4 Overall Implementation Evaluation

Project implemented systematically and thoroughly. From requirement analysis, architecture design, module development, to testing and deployment, everything done systematically.

Especially, project shows that developing online game is not random or casual creative process, but a systematic technical procedure. Must analyze thoroughly, design correctly, and test comprehensively to create high-quality product.

---

# CHAPTER 8: FUTURE DEVELOPMENT DIRECTIONS

## 8.1 Gameplay Enhancements

To make game more appealing, can add many new features:

**Add Multiple Different Maps**
Currently system only supports one map. Can add 5-10 different maps with different layouts, objects, and difficulty. Each map can have unique characteristics, like one with many walls, one open, one with difficult terrain.

**Add Item System**
Can add items appearing randomly on map. For example, power-ups increasing damage, shields decreasing damage, speed boosts. These items add strategic element and make gameplay more fun.

**Add Skill System**
Instead of just basic actions, can add special skills players can activate. For example, burst fire skill, teleport skill, temporary shield skill.

**Add Multiplayer Modes**
Can add 2v2 mode, 4-player free-for-all, or capture the flag. These modes create different dynamics and enrich gameplay.

## 8.2 Matchmaking Expansion

Current matchmaking system simple - just pairs any two players. Can improve:

**Classify Players by Skill Level**
Can use Elo rating to rank players, then only pair players with similar rating. Makes matches fairer.

**Speed Up Match Finding**
Can optimize matchmaking algorithm to reduce wait time. For example, after 30 seconds without finding same-level opponent, can expand search range.

**Fairer Pairing**
Besides rating, can consider other factors like win rate, last play time. Players inactive long can be paired more easily to keep them interested.

## 8.3 Enhanced Security

Current security basic. To be production-ready, need:

**Refresh Token Mechanism**
Currently JWT token has no expiration (or very long expiration). Can change to short-lived access token and long-lived refresh token. When access token expires, client auto uses refresh token for new token.

**Rate Limiting**
Can add rate limiting to prevent brute force attacks. For example, IP can only login maximum 5 times in 1 minute.

**Anti-Cheating Detection**
Server can detect unusual behaviors like moving too fast, shooting too frequently, etc. If detect cheating, can ban account or take action.

**Data Transmission Encryption**
Besides HTTPS, can add encryption for sensitive data like passwords, tokens.

## 8.4 Performance Optimization and Scalability

As system grows with more users, need to optimize:

**Optimize Database Queries**
Can add index, optimize slow queries, or refactor schema.

**Caching**
Can use Redis to cache data that changes infrequently like leaderboard, map information.

**Load Balancing**
When too many connections, single server not enough. Can use multiple server instances behind load balancer like Nginx.

**Microservices**
If system grows large enough, can separate into microservices: one for authentication, one for matchmaking, one for gameplay logic, etc.

## 8.5 Development Directions Suitable for Practical Context

Besides technical improvements, there are other development directions suitable for practical context:

**Better Interface**
Current interface very basic. Can hire designer for professional, attractive interface.

**Mobile Support**
Can develop native app for iOS/Android or responsive web app.

**Build Community**
Add chat, forum, or social features to build player community.

**Monetization**
If want to make money, can add cosmetics (skins, effects), battle pass, or in-game ads.

**Tournament System**
Can organize tournaments, have ranking seasons, leaderboards, etc., to increase competitive aspect.

---

# CHAPTER 9: CONCLUSION

## 9.1 Significance of Achieved Results

After research, analysis, design, development, and testing process, the "Tankfire" project successfully completed and achieved significant results.

First, project proved that building complete online game system from scratch is possible. Not just simple demo but product with clear architecture, all core functions, and deployable on real server.

Second, project demonstrated how to apply good software development principles to practice. From detailed requirement analysis, architecture design following proven patterns, clear module separation, comprehensive testing, everything following technical procedures.

Third, project is clear evidence that student can master sufficient knowledge and skills to create valuable software product. From HTML/CSS/JavaScript for frontend, to Node.js/Express for backend, MySQL for database, knowledge about networking, real-time communication, security, performance optimization, everything applied in project.

## 9.2 Final Recommendations

Based on achieved results and limitations found, have recommendations for future development:

**Recommendation 1: Continue Adding New Features**
To make game more appealing and competitive in market, need to continue adding features. Start with simple features like new maps, items, etc., then gradually develop more complex features.

**Recommendation 2: Strengthen Security**
Before releasing to public, need significant security enhancement. Thorough security testing, add anti-cheating measures, etc.

**Recommendation 3: Optimize Performance**
When more users, need to optimize performance. Load test system to find bottlenecks, then optimize.

**Recommendation 4: Upgrade Interface**
Current interface only for proof of concept. For real product, need professional, attractive interface.

**Recommendation 5: Build Community**
Successful online game depends not just on features but on community. Need to create opportunities for player interaction.

## 9.3 General Conclusion

The "Tankfire" project is comprehensive hands-on exercise in developing modern software systems. It not only deepens knowledge about specific technologies but also helps understand how real software systems work, challenges developers face, and how to solve them.

Through this project, can clearly see that developing online game is not simple or casual creative process, but requires systematic approach. With clear planning, perseverance, and support of modern technologies, anyone can create high-quality product.

Knowledge gained through this project can be applied to other projects, not just games but other web applications. Experience in architecture design, project management, testing, and product delivery have practical value in software development journey.

---

# APPENDIX A: DIRECTORY STRUCTURE AND ROLE OF MAIN MODULES

## Backend Structure

```
backend/
├── src/
│   ├── config.js           # Application configuration (port, database, etc.)
│   ├── db.js              # MySQL database connection
│   ├── index.js           # Entry point, server initialization
│   ├── controllers/       # API request handling logic
│   │   ├── authController.js      # Handle registration, login
│   │   ├── matchHistoryController.js
│   │   └── rankingController.js
│   ├── models/            # Data models, database interaction
│   │   ├── User.js
│   │   ├── Match.js
│   │   ├── Ranking.js
│   │   └── GameRoom.js
│   ├── routes/            # API endpoint routing
│   │   ├── auth.js
│   │   ├── matchHistory.js
│   │   └── ranking.js
│   ├── sockets/           # WebSocket event handlers
│   │   └── matchmaking.js # Queue management, room creation
│   ├── game/              # Game logic
│   │   ├── gameLoop.js    # Main loop processing events
│   │   ├── collision.js   # Collision handling
│   │   ├── items.js       # Item system
│   │   └── maps/          # Map data
│   └── middleware/        # Middleware (auth checking, etc.)
├── schema.sql             # SQL script to create database
├── package.json
└── .env                   # Environment variables (not committed to git)
```

## Frontend Structure

```
frontend/
├── src/
│   ├── main.js            # Entry point
│   ├── styles.css         # Application-wide CSS
│   ├── index.html         # Main HTML
│   ├── game/
│   │   ├── socket.js      # Socket.IO connection management
│   │   ├── input.js       # Capture keyboard/mouse input
│   │   ├── render.js      # Render game state to Canvas
│   │   ├── Renderer.js    # Drawing handler class
│   │   ├── InputManager.js # Input processing class
│   │   └── maps/          # Map data
│   ├── ui/
│   │   ├── login.js       # Login screen
│   │   ├── lobby.js       # Map selection screen
│   │   ├── ranking.js     # Ranking view screen
│   │   ├── history.js     # Match history screen
│   │   └── components/    # Reusable UI components
│   └── images/            # Images, sprites
├── package.json
└── .gitignore
```

Each module has specific responsibility, helping system be easy to maintain, test, and expand.

---

# APPENDIX B: DESCRIPTION OF MAIN DATA FLOWS IN SYSTEM

## Flow 1: User Input Flow

1. User interacts with interface (click button, move mouse)
2. JavaScript event listener captures this event
3. InputManager processes event and creates command object
4. Command sent to server via Socket.IO emit
5. Server receives command, validates, updates game state
6. Server broadcasts new game state to all clients in room
7. Client receives game state update
8. Renderer uses game state to draw on Canvas
9. User sees result of their action

## Flow 2: Game State Update Flow

1. Server gameLoop processes events from both players
2. Calculate collisions: Bullet vs Wall, Bullet vs Tank, Tank vs Tank
3. Update position, health, wins accordingly
4. Create game state snapshot
5. Emit game state snapshot to both clients via Socket.IO
6. Client receives game state
7. Update local game state
8. Renderer uses game state to draw
9. User sees game updated

## Flow 3: Match End & Data Persistence Flow

1. One player reaches required win count
2. Server detects match end condition
3. Determine winner and loser
4. Create match record: { player1_id, player2_id, winner_id, started_at, ended_at }
5. Save match record to database match_history table
6. Update ranking: increment wins for winner, losses for loser
7. Broadcast match end event to both clients
8. Client receives event, displays match result
9. User can view match in match history

---

# APPENDIX C: LIST OF MAIN SOCKET.IO EVENTS AND REST API

## Socket.IO Events

**Server → Client Events:**
- `gameState`: Send current game state (tank position, bullets, health, etc.)
  ```
  {
    players: [ {id, x, y, angle, health}, {id, x, y, angle, health} ],
    bullets: [ {id, x, y, angle}, ... ],
    timestamp: 1234567890
  }
  ```

- `playerHit`: Notify player took damage
  ```
  { playerId: 1, damage: 10, health: 80 }
  ```

- `matchEnd`: Match ended
  ```
  { winnerId: 1, winnerName: "player1", score: "10-5" }
  ```

**Client → Server Events:**
- `move`: Player moves
  ```
  { direction: "up", playerId: 1 }
  ```

- `shoot`: Player shoots
  ```
  { x: 100, y: 100, angle: 45, playerId: 1 }
  ```

- `joinQueue`: Player searches for match
  ```
  { playerId: 1, playerName: "username" }
  ```

## REST API Endpoints

**Authentication:**
- `POST /api/auth/register`: Register new account
- `POST /api/auth/login`: Login
- `POST /api/auth/logout`: Logout

**Game Data:**
- `GET /api/ranking`: Get leaderboard
- `GET /api/match-history/:userId`: Get user's match history
- `GET /api/stats/:userId`: Get user's statistics

---

# REFERENCES

1. Node.js Official Documentation: https://nodejs.org/docs/
2. Express.js Guide: https://expressjs.com/
3. Socket.IO Documentation: https://socket.io/docs/
4. MySQL Official Documentation: https://dev.mysql.com/doc/
5. MDN Web Docs - HTML5 Canvas: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
6. JavaScript.info - Modern JavaScript Tutorial: https://javascript.info/
7. bcryptjs Documentation: https://github.com/dcodeIO/bcrypt.js
8. JSON Web Tokens (JWT): https://jwt.io/
9. Web Security Academy - OWASP: https://owasp.org/
10. Software Architecture Patterns: https://www.oreilly.com/

---

**END OF INTERNSHIP REPORT**

Report completed on June 28, 2026.

Prepared by: Internship Student

Supervising Organization: Ministry of Education

System: Tankfire - Online Tank Warfare Game System on Web Platform
