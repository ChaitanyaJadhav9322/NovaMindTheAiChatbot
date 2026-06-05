                                                                                    # 🤖 NovaMind AI ChatBot

<div align="center">

### Intelligent Conversational AI Powered by Qwen2.5-1.5B

AI Chatbot with Multi-Session Memory, Modern UI, Markdown Support, and Hugging Face Deployment

[Live Demo](https://huggingface.co/spaces/Chaitanya182004/NovaMindAiChatBot)

</div>

---

## 🌟 Overview

NovaMind AI ChatBot is a full-stack conversational AI application built using Flask, Hugging Face Transformers, and the Qwen2.5-1.5B-Instruct Large Language Model.

The project provides a modern ChatGPT-inspired experience with conversation history management, session persistence, markdown rendering, syntax-highlighted code responses, typing indicators, and an elegant responsive user interface.

Unlike basic chatbot implementations, NovaMind supports multiple chat sessions and maintains conversational context to generate more meaningful and relevant responses.

---

## 🚀 Live Demo

👉 **Try NovaMind AI ChatBot**

https://huggingface.co/spaces/Chaitanya182004/NovaMindAiChatBot

---

## ✨ Features

### 🧠 AI-Powered Conversations
- Powered by Qwen2.5-1.5B-Instruct
- Context-aware response generation
- Natural language understanding
- Coding and technical assistance

### 💬 Multi-Session Chat System
- Create unlimited chat sessions
- Switch between conversations
- Delete previous chats
- Automatic session storage

### 📝 Markdown & Code Rendering
- Syntax highlighted code blocks
- Markdown support
- Clean response formatting
- Developer-friendly output

### ⚡ Smart Context Management
- Conversation history retention
- Context-aware replies
- Prompt optimization
- Recent message trimming for performance

### 🎨 Modern User Experience
- Responsive design
- Animated gradients
- Typing indicators
- Smooth message animations
- ChatGPT-inspired interface

### 💾 Local Conversation Memory
- Browser-based storage
- Persistent conversations
- Session restoration after refresh

---

## 🏗️ System Architecture

```text
User Interface
       │
       ▼
Frontend (HTML + CSS + JavaScript)
       │
       ▼
Flask Backend API
       │
       ▼
Transformers Pipeline
       │
       ▼
Qwen2.5-1.5B-Instruct
       │
       ▼
Generated Response
```

---

## 🛠️ Technology Stack

| Category | Technologies |
|-----------|-------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Flask, Python |
| AI Model | Qwen2.5-1.5B-Instruct |
| ML Framework | PyTorch |
| NLP Library | Hugging Face Transformers |
| Deployment | Docker, Hugging Face Spaces |
| Storage | Browser Local Storage |

---

## 📂 Project Structure

```bash
NovaMind-AI-ChatBot/
│
├── app.py
├── requirements.txt
├── Dockerfile
│
├── templates/
│   └── index.html
│
├── static/
│   ├── script.js
│   ├── style.css
│   └── robot.png
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/NovaMind-AI-ChatBot.git
cd NovaMind-AI-ChatBot
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows:

```bash
venv\Scripts\activate
```

Linux / Mac:

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

Open:

```text
http://localhost:7860
```

---

## 🔍 How It Works

1. User enters a query.
2. Frontend stores conversation history.
3. Messages are sent to Flask API.
4. Backend formats messages using Qwen Chat Template.
5. Qwen2.5-1.5B generates a response.
6. Response is returned as JSON.
7. Frontend renders formatted output.
8. Session history is automatically saved.

---

## 🎯 Key Highlights

- Full Stack AI Application
- Hugging Face Deployment
- Real-Time Conversational Experience
- Session-Based Memory
- Markdown Rendering
- Syntax Highlighting
- Responsive Design
- Docker Support

---

## 🔮 Future Enhancements

- Voice Assistant Integration
- Long-Term Vector Memory
- User Authentication
- Cloud Chat Synchronization
- Document Analysis
- Web Search Integration
- Multi-Model Support
- Image Understanding

 
---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

## 📜 License

This project is licensed under the MIT License.
