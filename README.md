# DevCollab

> Built this because my placement prep group was a mess — 
> WhatsApp messages like "bhai tune sliding window kiya?" 
> with no real answer. DevCollab gives everyone their own 
> progress view on shared DSA boards.

[Live Demo](https://dev-collab-nu-sepia.vercel.app/)

![App Screenshot](image.png)

## What it does

You and your study group create a board for a DSA pattern 
(say, Sliding Window). Everyone adds problems as cards. 
Each member tracks their own progress — todo, in-progress, 
done — independently on the same board. When someone 
finishes a problem, everyone sees it move in real time.

Paste your code, write your approach notes, and get 
AI feedback on whether you used the right pattern, 
your actual time/space complexity, and where you can improve.

## The part that took longest to get right

Token refresh on the frontend. When an access token expires 
mid-session, the axios interceptor catches the 401, calls 
the refresh endpoint, retries the original request — all 
without the user noticing. But if the refresh token is also 
expired, it forces logout instead of infinite retry loop. 
Took a while to get that flow right.

## Technical decisions worth mentioning

**Per-user card progress** — cards are shared across the board 
but each member has their own CardProgress document tracking 
their status. One card, five members, five independent states.

**WebSockets for activity feed** — when anyone moves a card 
or adds a comment, the activity appears instantly for everyone 
in that board room. No polling, no refresh.

**AI feedback without storing code** — code is sent to Gemini 
server-side, feedback is stored, code is discarded. 
Only your notes and feedback stay in the DB.

**JWT with refresh rotation** — short-lived access tokens 
(15min) with httpOnly cookie refresh tokens. Middleware chain 
separates auth → board ownership → card ownership concerns.

## Stack

- **Frontend** — React, Redux Toolkit, Socket.io-client, 
  Tailwind CSS, React Router
- **Backend** — Node.js, Express, MongoDB, Socket.io
- **Services** — Cloudinary (avatars), Gemini AI (feedback), 
  JWT (auth)

## Architecture

DevCollab is a collaborative DSA-workspace application. A board and its cards
are shared by a group, while each member owns an independent progress record
for every card. This lets one member mark a problem as complete without
changing another member's board view.

The diagrams below describe the repository as it is currently implemented.
They use Mermaid, which GitHub renders directly in Markdown.

## 1. System overview

```mermaid
flowchart LR
    user([User]) --> client

    subgraph browser[Browser]
        client[React + Vite UI]
        router[React Router\nProtected routes]
        state[Redux Toolkit\nAuth persisted in localStorage]
        http[Axios client\nCredentials enabled\n401 refresh-and-retry]
        socketClient[Socket.io client]

        client --> router
        client <--> state
        client --> http
        client <--> socketClient
    end

    subgraph api[Node.js backend]
        express[Express API\n/api/v1/*]
        auth[JWT middleware\nBoard/member and owner checks]
        controllers[Controllers\nUser · Board · Card · Comment\nColumn · Activity]
        realtime[Socket.io server\nBoard rooms]

        express --> auth --> controllers
    end

    db[(MongoDB\nMongoose models)]
    cloudinary[Cloudinary\nAvatar storage]
    gemini[Google Gemini\nDSA feedback]

    http -->|HTTPS / REST| express
    socketClient <-->|WebSocket events| realtime
    controllers <--> db
    controllers -->|registration avatar| cloudinary
    controllers -->|code + notes| gemini
    controllers -->|create activity| realtime
```

## 2. Backend request path

Every protected REST endpoint follows the same layered path. Authorization is
added only where the action needs it: board-member access for shared board
data, board-owner access for administration, and card-creator access for card
management.

```mermaid
flowchart LR
    request[HTTP request] --> cors[CORS + JSON + cookie parser]
    cors --> route[Feature router]
    route --> jwt[verifyJWT\nReads access-token cookie\nor Bearer token]
    jwt --> guard{Action requires\nresource guard?}
    guard -->|Board access| member[authenticateUser\nOwner or member]
    guard -->|Board admin| owner[verifyBoardOwner]
    guard -->|Card edit/delete| cardOwner[verifyCardOwner]
    guard -->|No extra guard| controller
    member --> controller[Async controller]
    owner --> controller
    cardOwner --> controller
    controller --> model[Mongoose model/service]
    model --> response[ApiResponse JSON]
    controller --> activity[createActivity when applicable]
    activity --> db[(MongoDB)]
    activity --> socket[Emit activity:new\nto board room]
```

## 3. Core data model

`CardProgress` is the key domain design: it separates shared problem metadata
from personal learning state. A single card can therefore appear in different
lanes for different users.

```mermaid
erDiagram
    USER {
        ObjectId id PK
        string fullName
        string username UK
        string email UK
        string avatar
        string refreshToken
    }
    BOARD {
        ObjectId id PK
        string title
        string type
        ObjectId owner FK
        ObjectId[] members
    }
    CARD {
        ObjectId id PK
        ObjectId board FK
        ObjectId createdBy FK
        string title
        string[] tags
        string difficulty
        string priority
    }
    CARD_PROGRESS {
        ObjectId id PK
        ObjectId card FK
        ObjectId user FK
        string status
        number order
        object notes
        object aiFeedback
    }
    COMMENT {
        ObjectId id PK
        ObjectId board FK
        ObjectId card FK
        ObjectId createdBy FK
        string text
    }
    ACTIVITY {
        ObjectId id PK
        ObjectId board FK
        string action
        date createdAt
    }
    COLUMN {
        ObjectId id PK
        ObjectId board FK
        string title
        number order
    }

    USER ||--o{ BOARD : owns
    USER }o--o{ BOARD : joins_as_member
    BOARD ||--o{ CARD : contains
    USER ||--o{ CARD : creates
    CARD ||--o{ CARD_PROGRESS : has_personal_state
    USER ||--o{ CARD_PROGRESS : tracks
    BOARD ||--o{ COMMENT : contains
    CARD ||--o{ COMMENT : receives
    USER ||--o{ COMMENT : writes
    BOARD ||--o{ ACTIVITY : records
    BOARD ||--o{ COLUMN : defines
```

## 4. Authentication and token recovery

The frontend uses cookies for both tokens. The access token is short-lived;
Axios retries one failed protected request after asking the backend for a new
access token. If refresh fails, it clears Redux and its persisted auth state.

```mermaid
sequenceDiagram
    participant U as User
    participant C as React + Axios
    participant A as Express API
    participant D as MongoDB

    U->>C: Login with credentials
    C->>A: POST /user/login
    A->>D: Verify password and store refresh token
    A-->>C: Set httpOnly access + refresh cookies
    C->>C: Store safe user profile in Redux

    C->>A: Protected API request
    alt Access token valid
        A-->>C: Requested data
    else Access token expired
        A-->>C: 401
        C->>A: POST /user/refresh-access-token
        A->>D: Validate refresh token matches user
        A-->>C: Set new access-token cookie
        C->>A: Retry original request once
        A-->>C: Requested data
    else Refresh fails
        A-->>C: 401
        C->>C: Clear Redux and persisted auth state
    end
```

## 5. Collaborative board workflow

The board page loads the user's view of each shared card, grouped by personal
status. Activities are both written to MongoDB and broadcast to everyone who
has joined the board's Socket.io room.

```mermaid
sequenceDiagram
    participant M as Board member
    participant UI as BoardComponent
    participant API as Express API
    participant DB as MongoDB
    participant IO as Socket.io room
    participant G as Other board members

    M->>UI: Open a board
    UI->>API: GET cards + activities (in parallel)
    API->>DB: Read shared Cards + member's CardProgress
    DB-->>API: Grouped to-do / in-progress / completed view
    API-->>UI: Board data
    UI->>IO: join:board(boardId)

    M->>UI: Create card, add member, or update progress
    UI->>API: Protected REST mutation
    API->>DB: Persist domain change
    API->>DB: Create Activity
    API->>IO: activity:new to boardId room
    IO-->>UI: New activity
    IO-->>G: New activity
    UI->>UI: Update Redux state
```

## 6. Complete-a-problem and AI feedback workflow

Moving a card to **Completed** opens the problem-analysis dialog. The server
persists reflection notes and Gemini's structured feedback in `CardProgress`.
The submitted solution code is sent to Gemini for evaluation but is not a
field in the database model.

```mermaid
sequenceDiagram
    participant U as User
    participant UI as ProblemAnalyze dialog
    participant API as Card controller
    participant DB as MongoDB
    participant AI as Gemini 2.5 Flash

    U->>UI: Drag card to Completed
    U->>UI: Submit code and learning notes
    UI->>API: PATCH update-progress
    API->>DB: Upsert CardProgress(status, notes)
    API-->>UI: Progress saved
    UI->>API: PATCH ai-feedback
    API->>AI: Problem title + code + notes
    AI-->>API: Structured JSON feedback
    API->>DB: Store aiFeedback on CardProgress
    API-->>UI: Feedback and updated progress
```

## Current design notes

- The client renders fixed **To-do**, **In-Progress**, and **Completed** lanes from `CardProgress.status`. The `Column` model and endpoints exist server-side but are not used by the current `BoardComponent` display.
- Socket.io is used to update the activity feed in real time. Card and board data itself is updated locally after REST responses, then reloaded when a board is opened.
- Board deletion cascades through boards, cards, comments, columns, and activities. `CardProgress` is a separate collection and is not included in that delete operation in the current controller.

## Summary

> DevCollab is a MERN collaboration platform for DSA study groups. It combines shared boards and cards with per-user `CardProgress` documents, so each group member has an independent learning state. Authentication uses short-lived JWT access cookies with a refresh-and-retry Axios interceptor; board activities are persisted in MongoDB and broadcast through board-scoped Socket.io rooms. When a learner completes a problem, their notes and Gemini feedback are stored as part of their personal progress, while their submitted code is not persisted.


