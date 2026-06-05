// ── Session Management ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = {
    role: "system",
    content: "You are a helpful assistant with perfect memory. When the user tells you something personal like 'my friend is John' or 'my sister is Sara', store that as a fact. When later asked 'who is my friend?' or 'what is my friend's name?', look back at the conversation and answer with exactly what the user told you. Never say you don't know if the user already told you earlier in this conversation."
};

function getAllSessions() {
    return JSON.parse(localStorage.getItem("nm_sessions") || "{}");
}

function saveAllSessions(sessions) {
    localStorage.setItem("nm_sessions", JSON.stringify(sessions));
}

function getActiveSessionId() {
    return localStorage.getItem("nm_active_session");
}

function setActiveSessionId(id) {
    localStorage.setItem("nm_active_session", id);
}

function createSession() {
    const id = "s_" + Date.now();
    const sessions = getAllSessions();
    sessions[id] = {
        id,
        title: "New Chat",
        createdAt: Date.now(),
        messages: [SYSTEM_PROMPT]
    };
    saveAllSessions(sessions);
    return id;
}

function getSession(id) {
    const sessions = getAllSessions();
    return sessions[id] || null;
}

function saveSession(id, data) {
    const sessions = getAllSessions();
    sessions[id] = data;
    saveAllSessions(sessions);
}

function deleteSession(id) {
    const sessions = getAllSessions();
    delete sessions[id];
    saveAllSessions(sessions);
}

function autoTitleSession(id, firstUserMsg) {
    const sessions = getAllSessions();
    if (sessions[id] && sessions[id].title === "New Chat") {
        sessions[id].title = firstUserMsg.slice(0, 36) + (firstUserMsg.length > 36 ? "…" : "");
        saveAllSessions(sessions);
    }
}

// ── State ───────────────────────────────────────────────────────────────────
let activeSessionId = null;
let isFirstMessage  = true;

// ── Sidebar rendering ────────────────────────────────────────────────────────
function renderSidebar() {
    const sessions = getAllSessions();
    const list = document.getElementById("session-list");
    list.innerHTML = "";

    // Sort newest first
    const sorted = Object.values(sessions).sort((a, b) => b.createdAt - a.createdAt);

    if (sorted.length === 0) {
        list.innerHTML = `<div class="no-chats">No conversations yet</div>`;
        return;
    }

    sorted.forEach(s => {
        const item = document.createElement("div");
        item.className = "session-item" + (s.id === activeSessionId ? " active" : "");
        item.dataset.id = s.id;

        const userMsgs = s.messages.filter(m => m.role === "user");
        const preview  = userMsgs.length ? userMsgs[userMsgs.length - 1].content.slice(0, 42) : "No messages yet";

        item.innerHTML = `
            <div class="session-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
            <div class="session-info">
                <div class="session-title">${escapeHtml(s.title)}</div>
                <div class="session-preview">${escapeHtml(preview)}</div>
            </div>
            <button class="session-delete" data-id="${s.id}" title="Delete">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path></svg>
            </button>
        `;

        item.addEventListener("click", (e) => {
            if (e.target.closest(".session-delete")) {
                handleDeleteSession(s.id);
            } else {
                loadSession(s.id);
                closeSidebar();
            }
        });

        list.appendChild(item);
    });
}

function handleDeleteSession(id) {
    deleteSession(id);
    if (id === activeSessionId) {
        const sessions = getAllSessions();
        const remaining = Object.keys(sessions);
        if (remaining.length > 0) {
            loadSession(remaining[remaining.length - 1]);
        } else {
            const newId = createSession();
            loadSession(newId);
        }
    }
    renderSidebar();
}

// ── Load a session into the chat UI ──────────────────────────────────────────
function loadSession(id) {
    activeSessionId = id;
    setActiveSessionId(id);

    const session = getSession(id);
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    const userMsgs = session.messages.filter(m => m.role !== "system");

    if (userMsgs.length === 0) {
        // Show welcome screen
        isFirstMessage = true;
        chatBox.innerHTML = `
            <div class="welcome-screen">
                <img src="/static/robot.png" alt="AI Robot" class="hero-robot">
                <h1>Your <span class="highlight">✨ Smart Assistant</span><br>for Daily Tasks</h1>
            </div>
        `;
    } else {
        isFirstMessage = false;
        session.messages.forEach(m => {
            if (m.role === "user") {
                chatBox.insertAdjacentHTML("beforeend", userBubbleHTML(m.content));
            } else if (m.role === "assistant") {
                chatBox.insertAdjacentHTML("beforeend", botBubbleHTML(m.content));
            }
        });
        document.querySelectorAll(".markdown-body pre code").forEach(b => hljs.highlightElement(b));
        scrollToBottom();
    }

    renderSidebar();
}

// ── Sidebar open/close ────────────────────────────────────────────────────────
function openSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebar-overlay").classList.add("show");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebar-overlay").classList.remove("show");
}

// ── Message HTML helpers ──────────────────────────────────────────────────────
function escapeHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function userBubbleHTML(content) {
    return `
        <div class="msg-row user msg-appear">
            <div class="avatar user-avatar">Me</div>
            <div class="bubble-wrap">
                <div class="bubble user">${escapeHtml(content)}</div>
            </div>
        </div>`;
}

function botBubbleHTML(content) {
    return `
        <div class="msg-row msg-appear">
            <img src="/static/robot.png" class="avatar" alt="Bot">
            <div class="bubble-wrap">
                <div class="bubble bot markdown-body">${marked.parse(content)}</div>
            </div>
        </div>`;
}

// ── Scroll ────────────────────────────────────────────────────────────────────
function scrollToBottom() {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function showTypingIndicator() {
    const chatBox = document.getElementById("chat-box");
    chatBox.insertAdjacentHTML("beforeend", `
        <div class="msg-row msg-appear" id="typing-indicator-row">
            <img src="/static/robot.png" class="avatar" alt="Bot">
            <div class="bubble-wrap">
                <div class="bubble bot">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        </div>
    `);
    scrollToBottom();
}

function removeTypingIndicator() {
    const el = document.getElementById("typing-indicator-row");
    if (el) el.remove();
}

// ── Send message ──────────────────────────────────────────────────────────────
async function sendMessage() {
    const input   = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    // /clear command
    if (message.toLowerCase() === "/clear") {
        const newId = createSession();
        loadSession(newId);
        renderSidebar();
        input.value = "";
        return;
    }

    const chatBox = document.getElementById("chat-box");
    const session = getSession(activeSessionId);

    // Remove welcome screen on first message
    if (isFirstMessage) {
        const welcome = document.querySelector(".welcome-screen");
        if (welcome) welcome.remove();
        isFirstMessage = false;
    }

    // Render user bubble
    chatBox.insertAdjacentHTML("beforeend", userBubbleHTML(message));
    input.value = "";
    scrollToBottom();

    // Update session
    session.messages.push({ role: "user", content: message });
    autoTitleSession(activeSessionId, message);
    saveSession(activeSessionId, session);
    renderSidebar();

    showTypingIndicator();

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: session.messages })
        });

        const data = await response.json();
        removeTypingIndicator();

        session.messages.push({ role: "assistant", content: data.response });
        saveSession(activeSessionId, session);

        chatBox.insertAdjacentHTML("beforeend", botBubbleHTML(data.response));
        document.querySelectorAll(".markdown-body pre code").forEach(b => hljs.highlightElement(b));
        scrollToBottom();

    } catch (err) {
        removeTypingIndicator();
        console.error("Error connecting to server", err);
    }
}

// ── Init ──────────────────────────────────────────────────────────────────────
window.onload = function () {
    // Migrate old localStorage format if needed
    const legacyHistory = localStorage.getItem("chatHistory");
    if (legacyHistory) {
        const msgs = JSON.parse(legacyHistory);
        if (msgs.length > 1) {
            const id = createSession();
            const sessions = getAllSessions();
            sessions[id].messages = msgs;
            const firstUser = msgs.find(m => m.role === "user");
            if (firstUser) sessions[id].title = firstUser.content.slice(0, 36);
            saveAllSessions(sessions);
        }
        localStorage.removeItem("chatHistory");
    }

    // Load or create active session
    let sid = getActiveSessionId();
    const sessions = getAllSessions();
    if (!sid || !sessions[sid]) {
        sid = createSession();
    }
    loadSession(sid);

    // Sidebar open/close
    document.getElementById("sidebar-toggle").addEventListener("click", openSidebar);
    document.getElementById("sidebar-overlay").addEventListener("click", closeSidebar);
    document.getElementById("sidebar-close-btn").addEventListener("click", closeSidebar);

    // New chat — sidebar full-width button
    document.getElementById("new-chat-btn").addEventListener("click", () => {
        const newId = createSession();
        loadSession(newId);
        closeSidebar();
    });

    // New chat — header pencil icon
    document.getElementById("header-new-chat").addEventListener("click", () => {
        const newId = createSession();
        loadSession(newId);
    });

    // Enter key
    document.getElementById("userInput").addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage();
    });
};
