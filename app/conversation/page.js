"use client";

import { useEffect, useRef, useState } from "react";
import { NODES } from "../../data/conversation/Nodes";
import { TRANSITIONS } from "../../data/conversation/Transitions";
import { processChoice } from "../../helpers/conversationEngine";
import MyButton from "../../components/Button";

export default function ConversationPage() {
  const [currentNodeId, setCurrentNodeId] = useState("START");
  const [messages, setMessages] = useState(
    NODES && NODES["START"]
      ? [
          {
            sender: "npc",
            text: NODES["START"]["prompt"],
            timestamp: Date.now(),
          },
        ]
      : []
  );
  const [typing, setTyping] = useState(false);
  const currentNode = NODES ? NODES[currentNodeId] : null;
  const chatEndRef = useRef(null);
  const [visitedNodeIds, setVisitedNodeIds] = useState(
    () => new Set(["START"])
  );

  useEffect(() => {
    const unvisited = Object.keys(NODES).filter(
      (nodeId) => !visitedNodeIds.has(nodeId)
    );
  }, [visitedNodeIds]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleChoice = (choice) => {
    const now = Date.now();
    setTyping(true);
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: choice.text, timestamp: now },
    ]);

    setTimeout(() => {
      setTyping(false);
      const result = processChoice({
        choice,
        nodes: NODES,
        transitions: TRANSITIONS,
        visitedNodeIds,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "npc", text: result.npcMessage, timestamp: now },
      ]);

      setVisitedNodeIds((prev) => {
        const next = new Set(prev);
        next.add(result.nextNodeId);
        return next;
      });
      setCurrentNodeId(result.nextNodeId);
    }, 800);
  };

  if (!currentNode) {
    return (
      <main className="flex items-center justify-center h-screen">
        Conversation error. Invalid node.
      </main>
    );
  }

  return (
    <main className="flex flex-col     gap-4      w-1/2 max-w-3xl h-screen">
      <div className="indicator  text-center w-fit mx-auto mt-4">
        <span className="indicator-item badge badge-secondary">BETA</span>
        <h1 className="text-xl  font-bold text-center text-neutral">
          Conversation Practice
        </h1>
      </div>
      {/* Chat Window */}
      <div
        ref={chatEndRef}
        className="flex flex-col gap-2 bg-[white] opacity-85 p-2 rounded-lg   overflow-auto overflow-y-scroll border-3 border-[gray] h-1/2 max-h-[600px] "
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat ${
              msg.sender === "npc" ? "chat-start" : "chat-end "
            }`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg text-[white]  chat-bubble ${
                msg.sender === "npc" ? "" : "bg-primary"
              } `}
            >
              {msg.text}
            </div>
            <div className="chat-footer opacity-50 text-neutral">
              {msg.sender === "user"
                ? `Seen at ${new Date(msg.timestamp).toLocaleTimeString()}`
                : `Received at ${new Date(
                    msg.timestamp
                  ).toLocaleTimeString()} `}
            </div>
          </div>
        ))}
        {typing ? (
          <span
            className={`${
              typing ? "loading loading-dots loading-lg text-[#414040]" : ""
            }`}
          ></span>
        ) : null}
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-2">
        {currentNode && currentNode.choices.length > 0 && (
          <div className="text-xl font-bold text-[black] text-center">
            Select your response:
          </div>
        )}
        {currentNode &&
          currentNode.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              className="btn btn-outline text-lg bg-[black]"
            >
              {choice.text}
            </button>
          ))}
        {currentNode && currentNode.choices.length === 0 && (
          <MyButton
            func={() => {
              setCurrentNodeId("START");
              if (NODES && NODES.START) {
                setMessages([
                  {
                    sender: "npc",
                    text: NODES.START.prompt,
                    timestamp: Date.now(),
                  },
                ]);
              }
            }}
            className="btn btn-primary mt-4"
            text="Start New Conversation"
          ></MyButton>
        )}
      </div>
    </main>
  );
}
