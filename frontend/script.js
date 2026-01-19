
document.addEventListener("DOMContentLoaded", () => {
window.openPrivateMode = function () {
    addMessage("🔒 Private Mode is under development. It will be available very soon.", "ai");
};

    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");

window.sendMessage = function () {

    const welcome = document.getElementById("welcome");
    const chat = document.getElementById("chatArea");
    const inputBar = document.getElementById("inputBar");

    if (welcome) welcome.style.display = "none";
    if (chat) chat.classList.remove("hidden");

    // 🔥 MOVE INPUT TO FOOTER
    inputBar.classList.remove("center-input");
    inputBar.classList.add("footer-input");

    const text = userInput.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    userInput.value = "";

    setTimeout(() => {
        jarvisReply(text);
    }, 300);
};


    function addMessage(text, sender) {
        const div = document.createElement("div");
        div.className = "message " + sender;
        div.innerText = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    let memory = JSON.parse(localStorage.getItem("jarvis_memory")) || {};

    function saveMemory(key, value) {
        memory[key] = value;
        localStorage.setItem("jarvis_memory", JSON.stringify(memory));
    }

    const brain = [
    { q: ["hello", "hi", "hey"], a: "Hello! How can I help you?" },
    { q: ["your name"], a: "I am JARVIS, your smart AI assistant." },

    { 
      q: ["who made you", "who created you", "your creator", "kis ne banaya", "tumhein kis ne banaya"],
      a: "I was created by Muhammad Ali as a public helper. Muhammad Ali ne mujhe is liye banaya taake main logon ki madad kar sakoon."
    },

    { q: ["time"], a: () => "Current time is " + new Date().toLocaleTimeString() },
    { q: ["date"], a: () => "Today's date is " + new Date().toDateString() },
    { q: ["how are you"], a: "I'm working perfectly and ready to help." },
    { q: ["what can you do"], a: "I can chat, listen, speak and help people smartly." }
];


async function askAI(prompt) {
    const response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: prompt
        })
    });

    const data = await response.json();
    return data.reply;
}


function showTyping() {
    const div = document.createElement("div");
    div.className = "typing";
    div.id = "typing";
    div.innerHTML = "<span></span><span></span><span></span>";
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById("typing");
    if (t) t.remove();
}
async function jarvisReply(userText) {
    userText = userText.toLowerCase();

    // Name memory
    if (userText.includes("my name is")) {
        const name = userText.replace("my name is", "").trim();
        saveMemory("name", name);

        const reply = `Nice to meet you ${name}! I will remember your name 😊`;
        addMessage(reply, "ai");
        speak(reply);
        return;
    }

    // Offline brain
    for (let item of brain) {
        for (let key of item.q) {
            if (userText.includes(key)) {
                const reply = typeof item.a === "function" ? item.a() : item.a;
                addMessage(reply, "ai");
                speak(reply);
                return;
            }
        }
    }

    // 🔥 HERE
    showTyping();

    try {
        const aiReply = await askAI(userText);
        removeTyping();
        addMessage(aiReply, "ai");
        speak(aiReply);
    } catch (error) {
        removeTyping();
        addMessage("AI service is unavailable right now.", "ai");
    }
}

    // ===== TEXT TO SPEECH =====
function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();
    utter.voice = voices.find(v => v.lang.includes("en")) || voices[0];

    utter.rate = 0.95;
    utter.pitch = 0.89;

    window.speechSynthesis.speak(utter);
}


    // ===== VOICE INPUT =====
    window.startVoice = function () {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            userInput.value = event.results[0][0].transcript;
            sendMessage();
        };

        recognition.start();
    };


    // ✅ ENTER KEY FIX (YAHAN HONA CHAHIYE)
    document.getElementById("userInput").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });
});

// slide bar
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}
// input auto slide
userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
});
// send btn hide
userInput.addEventListener("input", () => {
    sendBtn.disabled = userInput.value.trim() === "";
});
