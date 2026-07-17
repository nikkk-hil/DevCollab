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

See the full [architecture and workflow diagrams](docs/ARCHITECTURE.md), including the system overview, data model, authentication lifecycle, real-time activity flow, and Gemini feedback workflow.

