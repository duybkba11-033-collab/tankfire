# INTERNSHIP REPORT
## Development of an Online Tank Battle Game on the Web

---

### Declaration of Authenticity

I hereby declare that this report is the result of my research, investigation, and implementation based on the process of developing and analyzing the "Tankfire" project during my internship period. The content presented in this report is compiled from system research, source code analysis, functional testing, and result evaluation. The opinions, assessments, and conclusions in this report are my own and are not copied from any source without proper citation.

### Acknowledgments

I wish to express my sincere gratitude to the faculty members, advisors, and colleagues who have provided support and valuable feedback throughout the research and implementation process. Their guidance and suggestions have helped me improve my knowledge, analytical thinking, and professional presentation skills.

### Project Summary

The "Tankfire" project is an online tank battle game system running on the web, built using a client-server model with real-time communication through Socket.IO. The system supports basic functions including user registration, login, match-making, tank control, collision handling, match status updates, match history recording, and ranking statistics display. This report presents the entire research, analysis, design, implementation, and evaluation process of the system to demonstrate the academic and practical value of the project.

### List of Abbreviations

- API: Application Programming Interface
- CSS: Cascading Style Sheets
- HTML: HyperText Markup Language
- JWT: JSON Web Token
- MySQL: relational database management system
- Node.js: JavaScript runtime environment for server-side execution
- REST: Representational State Transfer
- Socket.IO: real-time bidirectional communication library
- SQL: Structured Query Language

---

### Table of Contents

1. Project Overview
   1.1 Project Selection Rationale
   1.2 Project Objectives
   1.3 Scope and Research Subject
   1.4 Project Significance
   1.5 Research Methodology
   1.6 Report Structure
   1.7 Preliminary Assessment of Project Feasibility
   1.8 Overview Conclusion
2. Technologies and Tools
   2.1 Frontend Technologies
   2.2 Backend Technologies
   2.3 Database
   2.4 Development Support Tools
   2.5 Role of Technology in Project Implementation
3. System Analysis and Design
   3.1 Functional Requirements Analysis
   3.2 Non-Functional Requirements Analysis
   3.3 Business Process Analysis
   3.4 System Design Analysis
   3.5 Analysis of Main System Modules
   3.6 Evaluation of Design Appropriateness
4. System Design
   4.1 Overall System Architecture
   4.2 Real-Time Communication Design
   4.3 Backend Module Design
   4.4 Frontend Module Design
   4.5 Database Design
   4.6 Gameplay and Match Logic Design
   4.7 Security and Session Management
   4.8 Overall System Design Evaluation
   4.9 Comments on Architecture Appropriateness
5. Implementation and Installation
   5.1 Deployment Environment
   5.2 Backend Installation
   5.3 Frontend Installation
   5.4 Database Configuration
   5.5 System Execution and Usage
   5.6 Implementation Process Evaluation
6. Testing and Evaluation
   6.1 Testing Objectives
   6.2 Functional Testing
   6.3 Real-Time Communication Testing
   6.4 Overall Quality Evaluation
   6.5 Assessment of Testing Value
7. Results and Limitations
   7.1 Achieved Results
   7.2 System Limitations
   7.3 Lessons Learned
   7.4 Overall Implementation Evaluation
8. Future Development
   8.1 Gameplay Enhancement
   8.2 Matchmaking Expansion
   8.3 Enhanced Security
   8.4 Performance Optimization and Scalability
   8.5 Development Directions Suitable for Practical Context
9. Conclusion
   9.1 Significance of Achieved Results
   9.2 Final Recommendations
Appendices

---

## Introduction

In recent years, web technology has evolved from a platform serving simple communication and transaction purposes into an environment capable of deploying complex interactive applications, including online games. The advancement of technologies such as HTML5, Canvas, WebSocket, and various server-side frameworks has opened new possibilities for building products that can run directly in web browsers while maintaining real-time experiences. In this context, researching and developing an online tank battle game on the web platform becomes an appropriate approach, possessing both academic and practical value.

The "Tankfire" project was implemented with the objective of building an online tank battle game capable of operating on a web platform with complete basic functionalities. The system allows users to register, log in, connect to the server, participate in match-finding, and experience real-time battles. Beyond gameplay mechanics such as movement, shooting, and collision handling, the system also supports recording match history and updating rankings, creating a fairly comprehensive user activity cycle. Although still in the prototype phase, the project demonstrates how a web game product can be organized, deployed, and operated according to a clear architecture.

Implementing this project not only improves understanding of how to build an online game but also provides opportunities to apply knowledge related to web development, computer networking, system design, and database administration to a concrete product. In reality, an online game is not merely an interface or graphics but a combination of multiple components including client, server, database, and real-time state handling rules. Therefore, this project's value lies not only in "creating a playable game" but also in understanding how software systems interact under real-world conditions.

This report aims to summarize the research results, analysis, and implementation of the project from the initial concept stage until the system reaches a certain level of completion. The content is organized by chapters, sequentially presenting the project overview, technologies used, system analysis and design, implementation process, testing and evaluation. Through this, readers can understand the entire development process of the project as well as the strengths, limitations, and development directions of the system.

---

## Chapter 1: Project Overview

### 1.1 Project Selection Rationale

In recent times, online games on web platforms have become a rapidly developing field, not only for entertainment purposes but also due to high interactivity and broad accessibility. With support from modern technologies, users can engage in games directly in web browsers without installing complex software. Among game genres, real-time battle games have maintained particular appeal due to their competitive nature, quick reaction requirements, and the need for state synchronization between players and the system.

Motivated by the desire to apply the knowledge learned to a product with practical application value, the topic of developing an online tank battle game on the web was chosen as an appropriate research direction. This is a project with high practical value while also reflecting fundamental principles of modern software system development. Beyond creating a playable game, the project helps the implementer better understand how to build systems with requirements for continuous data processing, state synchronization, and maintaining stable user experience.

### 1.2 Project Objectives

The primary objective of the project is to build an online tank battle game running on a web platform with complete basic functionalities for users to experience. Specifically, the system needs to allow users to register and log in, connect to the server, find matches, and participate in game rooms. Throughout the gameplay, users can perform actions such as movement, shooting, and controlling the tank's viewing angle to interact with opponents.

Additionally, the system must be capable of handling gameplay events such as collisions, damage, respawn, match termination, and saving results to the database. Supporting functions such as recording match history, updating rankings, and maintaining player status are also considered important objectives. The project's goal is not limited to creating a working game but aims to build a system with clear structure, easy to develop, and capable of future expansion.

### 1.3 Scope and Research Subject

The project scope focuses on building a prototype version of an online tank battle game with core functionalities. The system is designed to support one 1v1 match between two players in the same room, rather than implementing a large-scale multiplayer platform. This aligns with the project's initial objectives since implementation scope is limited and the focus is on realizing fundamental functions of a real-time online game.

The research subject is a real-time web game system, particularly how to organize communication between client and server, how to manage game state, how to transmit data between components, and how to store data to support subsequent functions. Additionally, the project considers applying appropriate technologies for developing interfaces, handling game logic, and database administration.

### 1.4 Project Significance

The project has clear significance from both academic and practical perspectives. Academically, this is an opportunity to apply knowledge about web development, real-time communication, system design, and database administration to a product with practical application. Implementing an online game helps the implementer gain deeper understanding of how software systems operate when processing continuous events and synchronizing data between multiple components.

Practically, the project demonstrates web technology's capability in building applications with high interactivity without relying heavily on complex installation platforms. Furthermore, this product can serve as a foundation for developing new features such as more diverse maps, richer item systems, more complex gameplay mechanics, or improved graphics interfaces.

### 1.5 Research Methodology

During project implementation, the research methodology primarily follows a combined approach of analysis, design, and direct implementation. Initially, functional and non-functional requirements of the system are clearly defined. Subsequently, system components such as frontend, backend, database, and gameplay logic are divided into separate modules for convenient implementation and testing.

The development process is not limited to source code creation but also includes analyzing system workflow, evaluating how data is transmitted between components, and checking consistency of game states under real-world conditions. This methodology suits an internship project because it allows the implementer to understand theory while observing and verifying results through a concrete product.

Moreover, the research methodology demonstrates continuous iteration and improvement. After each development cycle, the system is reviewed from performance, architecture clarity, and requirement satisfaction perspectives. Through this approach, technical issues are not solved once but continuously improved throughout development, resulting in a systematic product with long-term development potential.

### 1.6 Report Structure

The report follows a logical and systematic structure, starting with an introduction to the project overview, then diving into technologies and tools, system analysis and design, implementation process, and testing and evaluation. Subsequent chapters focus on achieved results, existing limitations, and project development directions. This organization helps readers understand the complete development process of the system from initial concept to final product.

### 1.7 Preliminary Assessment of Project Feasibility

The project has high feasibility because the technologies used have clear foundations and are appropriate for the implementation scope. Building an online tank battle game on the web does not require an overly complex graphics system; instead, the focus lies in implementing core functionalities such as real-time connections, character control, collision handling, and state updates. These can be achieved within the constraints of an internship project with reasonable work distribution and proper understanding of software architecture.

### 1.8 Overview Conclusion

From the above analysis, the project is not merely an entertainment product but a comprehensive practical exercise in modern web application development. It involves multiple technical fields ranging from user interfaces, event handling, network architecture, to data storage and security. Therefore, implementing this project creates a good foundation for the learner to improve system thinking abilities and apply knowledge to a concrete product.

---

## Chapter 2: Technologies and Tools

### 2.1 Frontend Technologies

The frontend of the system is built using HTML, CSS, and vanilla JavaScript, combined with HTML5 Canvas to display game graphics components. Choosing Canvas is appropriate for the project's nature since it's a technology allowing continuous drawing and updating of dynamic objects such as tanks, bullets, items, walls, or map elements without heavy reliance on large graphics libraries. Thus, the system can create a direct gaming experience in the browser with considerable control over individual on-screen objects.

JavaScript is used to handle user input events, control interfaces, and establish server connections through Socket.IO. Within the project scope, the frontend not only displays information but also collects control signals such as movement, shooting, direction changes, and sends them to the server for processing. Through this organization, the system maintains close connections between user actions and game state in real-time.

From a design perspective, the frontend is divided into separate modules to increase clarity and maintainability. These modules include login interface, lobby interface, input management, socket connection, and renderer. This division helps components have clear responsibilities, while reducing code complexity when the system needs expansion or modification. An online game system like this requires separation between interface and operation logic because merging these functions would make bug fixes and feature updates considerably more difficult.

### 2.2 Backend Technologies

The system's backend is built on Node.js platform combined with Express framework. Node.js is an appropriate choice because it allows building applications with real-time capabilities and handling multiple concurrent connections efficiently. In online game systems, this is an important advantage since the server typically must receive many events simultaneously from multiple players and process them without interruption.

Express is used to build REST APIs serving functions such as registration, login, retrieving match history, and querying rankings. With clear route organization, the backend can separate distinct operations and easily expand when new features are needed. Beyond information-serving APIs, the system uses Socket.IO to manage real-time connections between client and server.

Socket.IO is a core component in the game's operating model. It allows the server to receive input signals from clients and send back game state in real-time. This is particularly important in gameplay because events such as movement, shooting, damage, and match termination need to be updated continuously so players can experience direct and consistent gaming. Additionally, libraries such as bcryptjs, jsonwebtoken, and dotenv are used to support password encryption, token creation and verification, and managing environment variables during deployment.

### 2.3 Database

The system uses MySQL as the database management system. MySQL was chosen because it's a stable, popular, and easily integrated solution with Node.js applications. In a prototype project context, using a relational database management system is appropriate because it meets needs for storing user data and match history while keeping data structures understandable and manageable.

The database is designed with clear separation between data types. The users table stores login information and account-related data. The match_history table records results of past matches, including participating players, winner, start time, and end time. The ranking table stores statistics related to player performance such as total matches, wins, scores, and win ratio. Organizing data into separate tables helps the system retrieve information systematically while enabling expansion when data management needs increase.

A notable point is that the database in this project not only serves storage purposes but also supports analysis and user experience tracking functions. By recording match history and updating rankings, the system creates a complete data loop: players participate in matches, results are recorded, data is updated, and finally displayed to users through the interface.

### 2.4 Development Support Tools

Beyond core technologies, the system uses several tools supporting development and operation. npm is used to manage dependencies and run startup commands for the backend. Environment configuration files help the system easily adjust parameters related to database, server ports, or secrets without needing to modify source code directly. The system also uses SQL schema to create initial data structure, contributing to making the deployment process consistent and more controllable.

These tools have importance not only in technical aspects but also in software development process. When a project is divided into clear modules and managed with appropriate tools, developers can control progress better, detect errors faster, and upgrade the system more efficiently. This is an important factor that cannot be overlooked in any software project, especially with interactive real-time applications like online games.

### 2.5 Role of Technology in Project Implementation

Overall, the chosen technologies not only serve as alternatives but create an ecosystem suitable for the project's objectives. Frontend handles user experience, backend handles game logic and communication, database stores data, and development tools help keep the building process on schedule. It is precisely through this combination that the system can operate as a structured product capable of expansion.

---

## Chapter 3: System Analysis and Design

### 3.1 Functional Requirements Analysis

The system must satisfy basic functional requirements to operate as an online game. First, users must be able to register and log in. After successful login, users need to connect to the server and participate in a match. Another important requirement is that the system must have the capability to match players and create game rooms when conditions are met.

Beyond connection and match-finding functions, the system must support gameplay actions such as movement, shooting, collisions, and item collection. After each match concludes, the system must save results and update rankings. These requirements form the foundation for user experience and are core functionalities of the product.

In the analysis process, functional requirements cannot be viewed individually but must be placed within system context. For example, login functionality directly affects player authentication before match participation, while match-finding depends on managing user and room status. Therefore, requirements analysis must be conducted systematically rather than treating each feature in isolation.

### 3.2 Non-Functional Requirements Analysis

Besides functional requirements, the system must satisfy several non-functional criteria. First is stability, since real-time games can be severely affected if connection or state processing encounters problems. Second is security, particularly protecting passwords and authenticating users. Third is scalability, because the system may develop with more maps, more item types, or more players in the future.

Additionally, maintainability is an important requirement. The system needs clear architecture so that when fixes or feature expansion is needed, developers can work efficiently without significantly impacting the entire system.

### 3.3 Business Process Analysis

The business process begins with user login or registration. After successful login, the client connects to the server. From the lobby interface, players can select maps and begin searching for matches. When the system detects two players, the server creates a new room and puts them together. From there, the gameplay process begins and events are handled in real-time.

Throughout the match, player actions such as movement, shooting, and view adjustment are sent to the server. The server updates the room state and broadcasts it back to relevant clients. When the match ends, the system records results, updates match history, and rankings. This represents a typical business workflow of a real-time online game system.

### 3.4 System Design Analysis

System design analysis shows the project is implemented using a layered client-server model. Frontend is responsible for receiving user input, displaying interfaces, and rendering games. Backend is responsible for handling match logic, managing game rooms, and storing data. The database serves to store user data, match results, and ranking statistics.

A highlight of the design is the server's central role in controlling gameplay. This helps the system have high synchronization, reducing discrepancies between clients and creating more stable gaming experience. Although this is a prototype-level product, the architecture still demonstrates all necessary elements of a real-world game system.

### 3.5 Analysis of Main System Modules

In the system, modules can be classified by function with distinct roles. The authentication module handles registration, login, and session management. The matchmaking module manages player pairing and room creation. The gameplay module coordinates the game loop and in-match events. The persistence module handles recording history, updating rankings, and saving match results. Each module has specific responsibilities but interconnects with others to form a unified system.

Such separation is significant because it makes the system easy to test, modify, and expand. If one module needs changes, impact on other parts is minimized, enabling long-term maintenance.

### 3.6 Evaluation of Design Appropriateness

From the above analysis, the system design is appropriate for the initial objectives. The client-server model allows the system to be deployed on web environments simply while providing a foundation for adding new features later. This is both a reasonable and sufficiently powerful choice to satisfy real-world requirements of a game prototype.

---

## Chapter 4: System Design

### 4.1 Overall System Architecture

The system is implemented using a client-server model where frontend and backend perform different roles but maintain close relationships. The client side runs in web browsers and is responsible for receiving user interactions, displaying interfaces, and rendering games on canvas. The server side is built with Node.js and handles overall match operation logic, manages real-time connections, stores data, and provides services related to users, match history, and rankings.

The system's workflow follows a logical sequence. After successful login, the client connects to the server through Socket.IO. When players begin searching for matches, the system puts them in a matchmaking queue for pairing into game rooms. Subsequently, actions like movement, shooting, and view adjustment are sent to the server for processing. The server updates match state and broadcasts it to participating clients, creating unified gaming experience.

### 4.2 Real-Time Communication Design

The system uses Socket.IO to establish real-time connections between client and server. This is an appropriate solution for applications with high interactivity, particularly online games. With continuous connection, the system can transmit data faster than typical HTTP requests, while reducing latency in event processing.

In this design, clients primarily send input information and receive game states from the server. Actions like movement, shooting, view changes, and match end conditions are all processed by the server and broadcast to players. Thus, the server becomes the central data source and primary decision-maker for the entire match progression.

This also reflects an important design principle of modern game systems: server-authoritative design. In this model, match logic and outcome decisions are placed on the server, helping reduce risks from client tampering while enhancing reliability of the entire operation.

### 4.3 Backend Module Design

Backend is organized into separate modules to increase clarity and maintainability. Features related to users are divided into API REST processing modules, including login, registration, viewing match history, and retrieving rankings. This separation helps source code structure better and allows independent feature development.

Beyond API modules, backend contains specialized components for game logic and real-time communication. The matchmaking module manages player queues and creates rooms when conditions are met. The game loop module updates state for each room, including movement, bullets, collisions, respawn, and match termination. This organization makes the system easy to test, debug, and expand.

### 4.4 Frontend Module Design

Frontend is also designed separating user interface from game operation logic. UI components like login screen, lobby, history table, and rankings table are built separately to help users interact intuitively. Meanwhile, modules like input, socket, and renderer are separated to reduce application complexity.

Separating interface and logic helps frontend adapt flexibly without significantly impacting the entire system. Frontend primarily serves to receive user input data and render results sent back by the server.

### 4.5 Database Design

The system's database is built on MySQL to store important data such as user accounts, match results, and rankings. The users table stores login information and account data. The match_history table records past matches. The ranking table stores statistics about player performance.

This design suits the project's scope because it meets basic storage needs while keeping the system simple and easy to deploy. If expansion is needed in the future, this data model can be supplemented with new tables serving more advanced functions.

### 4.6 Gameplay and Match Logic Design

Match logic is implemented centrally on the server to ensure accuracy and consistency. Players can move using navigation keys, adjust view angle using mouse, and perform shooting. These actions are sent to the server for processing, where the server updates states like position, rotation angle, health, armor, and win/loss conditions.

Beyond basic actions, the system also integrates elements like collisions, items, respawn, and match end conditions. These elements make the game more interactive and create richer gaming experience, while still remaining at prototype level.

### 4.7 Security and Session Management

Regarding security, the system has applied basic measures appropriate for project scale. Passwords are encrypted before being stored in the database using bcrypt. Additionally, the system uses JWT to authenticate users after login. Session management is implemented by storing tokens on the client side to maintain login status between accesses.

However, at the current scope, the system still has some security limitations. For example, storing tokens in localStorage can be vulnerable to XSS attacks. This is an area needing improvement if the system develops into a real-world product.

### 4.8 Overall System Design Evaluation

Overall, the project's system design suits the initial objective of building an online tank battle game on web with basic functional capabilities and stable operation. The layered architecture helps separate interfaces, game logic, and data. Using Socket.IO for real-time data transmission makes gaming experience smoother, while the database is designed sufficiently to serve basic storage and statistics needs.

### 4.9 Comments on Architecture Appropriateness

The current architecture has the advantage of keeping the system simple enough to implement while powerful enough to demonstrate real-time application principles. For internship scope, this is a reasonable choice because it focuses on perfecting core features rather than diving into overly complex technical details. However, to develop into a larger system, additional processing layers, error control, and clearer separation between business components would be necessary.

---

## Chapter 5: Implementation and Installation

### 5.1 Deployment Environment

To deploy the system, an environment with Node.js, npm, and MySQL is required. Backend runs on Node.js, frontend is served in browsers, and data is stored in MySQL. The system is configured using environment variables for flexibility and security during deployment.

### 5.2 Backend Installation

Backend is installed by initializing packages, installing necessary dependencies, and configuring database connections. After installation, the server runs using appropriate startup commands. During execution, the server listens for REST requests and Socket.IO connections to serve client requests.

The installation process demonstrates the importance of dependency management and environment configuration. If libraries are not fully installed or environment variables are not set correctly, the entire system can be severely affected immediately from startup. Therefore, careful pre-run verification is an essential step in the deployment process.

### 5.3 Frontend Installation

Frontend is deployed by configuring HTML, CSS, and JavaScript files while connecting the socket client to communicate with the backend. Interfaces like login, lobby, and rankings are built directly in the browser and can interact with the server immediately.

### 5.4 Database Configuration

The database is created through SQL schema. Necessary tables like users, match_history, and ranking are initialized before the system runs. When the backend starts operating, the system connects to MySQL and is ready to serve requests.

### 5.5 System Execution and Usage

After complete installation, users can access the web interface, log in, search for matches, and start playing. During gameplay, the system automatically handles input, updates match state, and saves results after the match ends.

### 5.6 Implementation Process Evaluation

The deployment process shows the system can operate at a basic level on web environments and can be verified directly through actual usage. While not yet a complete product, core components have been connected together and form a complete sequence of operations from users to data.

---

## Chapter 6: Testing and Evaluation

### 6.1 Testing Objectives

Testing is performed to confirm the system operates correctly according to specified functions. Testing objectives include verifying login and registration, match-finding, real-time data transmission, gameplay handling, and data storage in the database.

### 6.2 Functional Testing

In functional testing, main workflows like login, registration, room creation, match searching, and match starting are tested. Results show the system can perform basic operations stably. When users send input, the server receives and updates state correctly. When matches end, data is saved to the database and rankings are updated.

An important element in functional testing is verifying system consistency when performing multiple consecutive actions. If a small error occurs in the login flow or match result update, the entire user experience can be significantly impacted. Therefore, testing not only addresses successful scenarios but also considers exceptional cases and unanticipated conditions.

### 6.3 Real-Time Communication Testing

Since the system is real-time in nature, testing communication between client and server is very important. Tests focus on response speed, connection stability, and consistency of game state when multiple events occur consecutively. Results show the system can maintain stable connections within prototype scope and update game state relatively smoothly.

### 6.4 Overall Quality Evaluation

The system has achieved its basic objectives. However, since it's a prototype project, there remain some limitations related to performance, stability under poor connection conditions, and scalability. These are areas needing improvement during future development.

### 6.5 Assessment of Testing Value

Testing is an indispensable step in any software project, especially real-time interactive systems. It helps detect errors early, clarify development scope, and provide data for improving product quality. For this project, testing is not only a way to verify functions but also a tool for evaluating system architecture and logic feasibility.

---

## Chapter 7: Results and Limitations

### 7.1 Achieved Results

After implementation, the project has completed basic functions of an online web game. Users can register, log in, search for matches, participate in game rooms, perform movement and shooting, while viewing match history and rankings. The system can operate on standard web environments and demonstrates web technology's potential in game development.

Additionally, applying client-server architecture and using Socket.IO helps the system handle real-time interactions in an organized manner. This model also creates a foundation for developing new features.

### 7.2 System Limitations

Despite achieving initial objectives, the system still has certain limitations. First, matchmaking is relatively simple, only suitable for pairing two players in a room. Second, the system does not yet support multiple players or multiple simultaneous rooms in complex ways. Third, security remains at basic level and is not optimized for production environments.

Moreover, system performance and stability can be affected when user numbers increase or network connections become unstable. These limitations need to be addressed in subsequent development phases. Additionally, developing the system toward greater professionalism requires improvements in scalability, error management, and optimizing data flow between client and server.

### 7.3 Lessons Learned

Through project implementation, the implementer gained deeper understanding of building real-time interactive web systems. The most important lesson is the need for clear responsibility division between frontend, backend, and database from the start to prevent source code from becoming tangled and difficult to maintain. Additionally, setting objectives appropriate to realistic scope is very necessary, especially when working on a project with limited time and resources.

### 7.4 Overall Implementation Evaluation

The project implementation demonstrates that software development is not merely writing code but a continuous process of research, experimentation, debugging, and improvement. This helps the implementer understand the value of planning, work distribution, and quality control. For an online game system, these elements have particular significance since small errors in communication or logic layers can severely impact user experience.

---

## Chapter 8: Future Development

### 8.1 Gameplay Enhancement

In the future, the system can be expanded with richer gameplay features. For example, more maps, more item types, skill systems, or multi-player modes can be added. These improvements will make the game more attractive and increase competitive aspects for players.

### 8.2 Matchmaking Expansion

Currently, the system uses relatively simple pairing mechanisms. In the future, more sophisticated matchmaking can be developed by categorizing players by skill level, wait time, or geographic region. This will help improve user experience and increase fairness in matches.

### 8.3 Enhanced Security

An important development direction is strengthening system security. Refresh tokens, request rate limiting, multi-layer data encryption, or safer token storage mechanisms can be added. These improvements are necessary if the system is deployed to real users.

### 8.4 Performance Optimization and Scalability

The system can also be improved in performance by optimizing the game loop, reducing server load, improving room management, and better resource allocation. This will help the system operate more stably as user numbers increase.

### 8.5 Development Directions Suitable for Practical Context

Beyond technical improvements, operational and business considerations should be addressed. If development continues, adding more user-friendly interfaces, supporting multiple platforms, enhancing audio experience, and building player communities will help the product have greater appeal. These are appropriate directions to transform a prototype into a product with long-term development potential.

---

## Chapter 9: Conclusion

After a research and implementation process, the "Tankfire" project has achieved its basic initial objectives. The system has been built as an operational web product with main functions including registration, login, match-finding, online gameplay, recording match history, and updating rankings. This is a noteworthy achievement for a prototype-level project and demonstrates the feasibility of building a real-time interactive web game using modern technologies.

Although some limitations exist regarding features, performance, and security, the achieved results create a solid foundation for continued system development. Applying client-server model, Socket.IO, Node.js, Express, MySQL, and Canvas demonstrates that system architecture has been designed rationally and can be expanded in multiple directions.

Overall, the project has successfully implemented a web game idea with interaction capabilities, while helping consolidate knowledge about web application development, system design, and real-time data processing. This is an appropriate starting point for subsequent research and development in online games and real-time web applications.

### 9.1 Significance of Achieved Results

The project's significance extends beyond having a working game; it proves that real-time web application principles can be applied to a product with entertainment value and practical importance. This demonstrates that combining academic knowledge with practical implementation can create products with clear value.

### 9.2 Final Recommendations

For subsequent research and development, continued improvements in security, performance, interfaces, and scalability are necessary. Simultaneously, building more realistic test scenarios and optimizing gameplay flows will make the system more professional. Through such efforts, the project can advance from prototype to a more realistic product in the future.

---

## Appendices

### Appendix A: Directory Structure and Role of Main Modules

Backend is organized into directories such as src/config.js, src/db.js, src/controllers, src/models, src/routes, src/sockets, and src/game. Files in the controllers directory handle request reception and dispatch business logic. Files in models describe data and interaction procedures with the database. Files in sockets manage real-time connections and matchmaking flows. Files in game handle match logic such as game loops, collisions, items, and match termination conditions.

Frontend is organized into modules like main.js, game/socket.js, game/input.js, game/render.js, game/Renderer.js, game/InputManager.js, UI, and maps. Each module has specific responsibility scope, helping the system be developed clearly and controlled better. Module division also enables future expansion of interfaces and game logic.

### Appendix B: Description of Main Data Flow in System

Data flow begins with user interaction with the interface. Input is captured through keyboard or mouse events, then sent to the server via Socket.IO. The server processes the data, updates room state, and broadcasts information back to participating clients. After match termination, the system records results to the database and updates rankings. This demonstrates the system's information structure is operated in a continuous loop with high real-time characteristics.

### Appendix C: List of Main Socket Events and REST APIs

REST APIs mainly serve authentication, match history, and ranking functions. Socket.IO manages events related to matchmaking, game rooms, match status updates, and match termination notifications. Through this categorization, the system clearly separates static information tasks from real-time update tasks, helping the architecture become clearer and more maintainable.

---

## References

1. Node.js official documentation.
2. Express.js documentation.
3. Socket.IO documentation.
4. MySQL documentation.
5. JavaScript and HTML5 Canvas documentation.
6. bcryptjs and jsonwebtoken documentation.

---

## Project Appendix

- Backend: main files include src/index.js, src/sockets/matchmaking.js, src/game/gameLoop.js, src/controllers, src/models.
- Frontend: main files include src/main.js, src/game/socket.js, src/game/input.js, src/game/render.js, src/ui.
- Database: schema.sql contains structure for users, match_history, and ranking tables.
- Main workflow: login → socket connection → match search → room creation → game state update → match termination → data storage.

---

**END OF ENGLISH REPORT**
