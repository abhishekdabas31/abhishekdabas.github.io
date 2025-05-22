/**
 * AI Chat Functionality using Hugging Face Llama 3.1
 * Author: Abhishek Dabas
 */

// DOM Elements
const chatMessages = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-btn');
const starterButtons = document.querySelectorAll('.starter-btn');
const chatWelcome = document.querySelector('.chat-welcome');

// Configuration - Replace with your Hugging Face token
const API_CONFIG = {
    token: 'YOUR_HUGGING_FACE_TOKEN_HERE', // Replace with your actual token
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    endpoint: 'https://api-inference.huggingface.co/models/'
};

// Portfolio context for the AI
const portfolioContext = `
You are an AI assistant for Abhishek Dabas, a Research Scientist specializing in LLM and agent systems evaluation.

Key information about Abhishek:
- Background: 4+ years experience in leading experimental research on LLMs and agent systems
- Education: Master of Science in Information Systems from Northeastern University (Completed Dec 2021)
- Current role: Research Scientist working on autonomy evaluation and AI safety
- Skills: Python (Advanced), Experimental Design, Risk Modeling, Hypothesis Testing, Claude 3.0/3.5, Llama 3, Agent Evaluation, AWS, PyTorch, TensorFlow, Kubernetes, LlamaIndex
- Projects: LLM Agent Evaluation Framework, Agentic RAG Systems, Sophisticated Agent Memory Systems, Agent Benchmarking Framework
- Previous Experience: Machine Learning Engineer at Intellica.ai where he worked on conversational AI systems and speech-to-text pipelines

Keep responses concise, professional and helpful. Direct users to relevant sections of the portfolio when appropriate.
`;

// Chat history array for context
let chatHistory = [];
const MAX_HISTORY_LENGTH = 10; // Maximum number of messages to keep for context

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Set up conversation starter buttons
    starterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const question = button.getAttribute('data-question');
            if (question) {
                chatInput.value = question;
                sendMessage();
            }
        });
    });
    
    // Auto-hide welcome ASCII art after 5 seconds
    setTimeout(() => {
        if (chatWelcome) {
            chatWelcome.style.maxHeight = '0';
            setTimeout(() => { chatWelcome.style.display = 'none'; }, 500);
        }
    }, 5000);
});

/**
 * Send user message and get AI response
 */
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Clear input
    chatInput.value = '';
    
    // Add user message to chat
    addMessage('user', message);
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    try {
        // Add message to history for context
        updateChatHistory('user', message);
        
        // In a real implementation, this would call the Hugging Face API
        const response = await getAIResponse(message);
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Add AI response
        addMessage('ai', response);
        
        // Add to chat history
        updateChatHistory('ai', response);
        
    } catch (error) {
        console.error('Error getting response:', error);
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Show error message
        addMessage('ai', "I'm having trouble connecting right now. Please try again later.");
    }
    
    // Scroll to bottom
    scrollToBottom();
}

/**
 * Format conversation for Llama 3.1
 */
function formatConversation(userMessage) {
    // Simplified version for demo purposes
    // In a real implementation, you'd construct a proper conversation history
    let prompt = `<|system|>\n${portfolioContext}\n</s>\n`;
    
    // Add chat history for context
    chatHistory.forEach(msg => {
        if (msg.role === 'user') {
            prompt += `<|user|>\n${msg.content}\n</s>\n`;
        } else {
            prompt += `<|assistant|>\n${msg.content}\n</s>\n`;
        }
    });
    
    // Add the current message
    prompt += `<|user|>\n${userMessage}\n</s>\n<|assistant|>\n`;
    
    return prompt;
}

/**
 * Get response from Hugging Face API
 */
async function getAIResponse(message) {
    // For demo purposes, we'll use preset responses
    // In a production environment, uncomment the API call code below
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo responses based on keywords
    if (message.toLowerCase().includes('project')) {
        return "Abhishek has worked on several projects including an LLM Agent Evaluation Framework, Agentic RAG Systems using LlamaIndex and Claude 3.5, and Sophisticated Agent Memory Systems that enhanced performance by 30% on document analysis tasks.";
    } else if (message.toLowerCase().includes('skill') || message.toLowerCase().includes('tech')) {
        return "Abhishek's core skills include Python, Experimental Design, and Risk Modeling. He's proficient with AI systems like Claude 3.0/3.5 and Llama 3, as well as ML infrastructure tools like AWS, PyTorch, TensorFlow, and LlamaIndex.";
    } else if (message.toLowerCase().includes('contact') || message.toLowerCase().includes('email')) {
        return "You can contact Abhishek via email at adabhishekdabas@gmail.com or connect with him on LinkedIn at linkedin.com/in/adabhishek/";
    } else if (message.toLowerCase().includes('experience') || message.toLowerCase().includes('work')) {
        return "Abhishek has 4+ years of experience in leading experimental research on LLMs and agent systems. He previously worked as a Machine Learning Engineer at Intellica.ai where he built real-time conversational AI systems and improved speech-to-text pipelines for Indian English accents.";
    } else if (message.toLowerCase().includes('education') || message.toLowerCase().includes('degree')) {
        return "Abhishek holds a Master of Science in Information Systems from Northeastern University, completed in December 2021. His coursework included Artificial Intelligence, Data Science Engineering, Reinforcement Learning, and NLP.";
    }
    
    // Default response for other queries
    return "I'm Abhishek's AI assistant. He specializes in LLM and agent systems evaluation with expertise in designing comprehensive testing methodologies for autonomous systems. Is there anything specific about his work, skills, or experience you'd like to know?";
    
    /* 
    // Uncomment this section to use the actual Hugging Face API
    try {
        const response = await fetch(`${API_CONFIG.endpoint}${API_CONFIG.model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: formatConversation(message),
                parameters: {
                    max_new_tokens: 200,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const result = await response.json();
        return result[0].generated_text;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
    */
}

/**
 * Add message to the chat UI
 */
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${role === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">
                <p>${content}</p>
            </div>
            <div class="message-time">${currentTime}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Add animation class for entrance effect
    setTimeout(() => {
        messageDiv.classList.add('active');
    }, 10);
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.classList.add('message', 'ai', 'typing-indicator');
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-text typing">
                <p>...</p>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    return typingId;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator(id) {
    const typingDiv = document.getElementById(id);
    if (typingDiv) {
        typingDiv.remove();
    }
}

/**
 * Update chat history array
 */
function updateChatHistory(role, content) {
    chatHistory.push({ role, content });
    
    // Limit history length
    if (chatHistory.length > MAX_HISTORY_LENGTH * 2) { // *2 because each exchange is 2 messages
        chatHistory = chatHistory.slice(-MAX_HISTORY_LENGTH * 2);
    }
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
} 