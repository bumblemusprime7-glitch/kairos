# kairos

A Node.js project using **Express.js** and **Socket.io** on the backend, with a plain JavaScript (HTML/CSS/JS) frontend.

If you've only written frontend JavaScript before (the kind that runs in a browser, e.g. clicking buttons, changing the page), this section explains how the backend fits in and how it talks to your frontend.

Also see [USING_GIT.md](USING_GIT.md) for how we're using Git/GitHub as a team.

## The big picture

Normally, a plain frontend project is just files a browser opens directly — `index.html`, `style.css`, `script.js` — and that's the whole app. There's no "server", just static files.

Here, we add a **server**: a Node.js program that:
1. Sends those same HTML/CSS/JS files to the browser (like a tiny web host).
2. Can talk back and forth with the browser in real time, using Socket.io.

So the project has two "sides":

```
kairos/
├── server.js          <- the backend (Node.js) — runs on your computer/a host
├── package.json        <- lists what packages the backend needs
└── public/              <- the frontend — this is what runs in the browser
    ├── index.html
    ├── style.css
    └── script.js
```

The browser only ever sees files in `public/`. It never runs `server.js` directly — Node.js runs that.

## What is Node.js?

Normally JavaScript only runs inside a browser. **Node.js** lets JavaScript run outside the browser too — e.g. as a server program on a computer. Same language, different environment. So our backend code (`server.js`) is JavaScript, just running via Node instead of in Chrome/Firefox.

## What is Express.js?

**Express** is a small library that makes it easy to write a web server in Node. Its main job here: serve our frontend files, and optionally handle simple web requests (like an API).

A minimal Express server looks like this:

```js
// server.js
const express = require('express');
const app = express();

// Serve everything inside the "public" folder as static files
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Run it with `node server.js`, then open `http://localhost:3000` in a browser — Express sends the browser `public/index.html`, `public/style.css`, `public/script.js`, exactly like a normal static site. So far, nothing magic — Express is just a file server.

You can also define custom routes, e.g. a simple API endpoint:

```js
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});
```

Your frontend JS could then `fetch('/api/hello')` to get that data — same as calling any other API.

## What is Socket.io?

Normal web requests (like `fetch`) are one-off: the browser asks, the server answers, done. That's fine for loading a page, but not great for things that need to update live — like a chat app, live game state, notifications, etc.

**Socket.io** keeps an open connection between browser and server, so either side can send messages to the other, at any time, without the browser having to ask first. This is what lets us build real-time features.

### Server side (Node/Express)

```js
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // wrap Express in a plain http server
const io = new Server(server);          // attach Socket.io to that server

app.use(express.static('public'));

// Runs every time a browser connects
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for a message named "chat message" from this browser
  socket.on('chat message', (text) => {
    console.log('Received:', text);

    // Send it back out to every connected browser
    io.emit('chat message', text);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Note: with Socket.io, we listen with `server.listen(...)` instead of `app.listen(...)`, because `server` is the one with Socket.io attached to it.

### Client side (plain JS, in `public/script.js`)

The frontend needs the Socket.io client library. Express is already serving it automatically at `/socket.io/socket.io.js` (no need to download anything), so we just include it in the HTML:

```html
<!-- public/index.html -->
<script src="/socket.io/socket.io.js"></script>
<script src="script.js"></script>
```

Then in plain JS:

```js
// public/script.js
const socket = io(); // connects automatically to the server that served this page

// Send a message to the server
function sendMessage(text) {
  socket.emit('chat message', text);
}

// Listen for messages the server sends us
socket.on('chat message', (text) => {
  const li = document.createElement('li');
  li.textContent = text;
  document.getElementById('messages').appendChild(li);
});
```

That's the whole pattern:
- `.emit(name, data)` — send an event with some data.
- `.on(name, callback)` — listen for an event and react to it.

Both the server and the browser use the exact same `.emit` / `.on` pattern — they're just talking to each other as equal peers over the open connection. An event name (like `'chat message'`) is just a string we make up; server and client just need to agree on the same names.

## Project structure recap

- **`server.js`** — Node.js backend. Starts Express, sets up Socket.io, defines what happens when browsers connect or send events. You run this with `node server.js`, it never runs in the browser.
- **`public/`** — everything here is sent as-is to the browser. This is your familiar HTML/CSS/JS world. Nothing in here can use `require(...)` or other Node-only features — it's regular browser JavaScript.
- **`package.json`** — lists the packages the project depends on (`express`, `socket.io`, etc.) so anyone can install them with one command.

## Getting set up and running it

1. Install [Node.js](https://nodejs.org/) if you don't already have it.
2. Clone the repo (see [USING_GIT.md](USING_GIT.md)).
3. Install the project's dependencies:
   ```bash
   npm install
   ```
   This reads `package.json` and downloads everything listed (Express, Socket.io, etc.) into a `node_modules/` folder.
4. Start the server:
   ```bash
   node server.js
   ```
5. Open `http://localhost:3000` in your browser.

Any time you change files in `public/`, just refresh the browser. Any time you change `server.js`, you need to stop the server (`Ctrl+C`) and run `node server.js` again for changes to take effect.

## Quick mental model

| Concept | Analogy |
|---|---|
| Node.js | JavaScript running on a computer instead of in a browser |
| Express | A simple web server — hands out your HTML/CSS/JS files, and can handle API requests |
| Socket.io | A phone line kept open between browser and server, so either can talk anytime |
| `public/` folder | Your normal frontend — exactly like a plain HTML/CSS/JS site |
| `server.js` | The backend brain — runs once, stays running, manages connections |
