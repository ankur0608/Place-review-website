// src/data/chatData.js
export const staticQA = {
  hello: "Hi there! How can I assist you today?",
  "what is your name": "I am Ai, your virtual assistant.",
  "how to contact support":
    "You can reach out to support at support@example.com",
  "thank you": "You're welcome! 😊",

  // Dynamic responses
  date: `Today's date is ${new Date().toLocaleDateString()}.`,
  "today date": `Today's date is ${new Date().toLocaleDateString()}.`,
  time: `Current time is ${new Date().toLocaleTimeString()}.`,
  "what is the time": `Current time is ${new Date().toLocaleTimeString()}.`,

  // Extra FAQs
  "how can i review in this app":
    "To leave a review, go to the place's page and click the 'Write a Review' button.",

  "tell me about this website":
    "This is a tourist place finder and review website built to help you explore, rate, and share your experiences about destinations across India.",

  // "how does this app work":
  //   "You can search for tourist places, view details, and submit reviews to help others.",

  "is this app free to use":
    "Yes, this website is completely free for all users.",
};
