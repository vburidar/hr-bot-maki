import classNames from "classnames";
import {useState} from "react";
import "./Chat.css";
import {postRequest} from "./client";
import {useParams} from "react-router";

enum Character {
  AI = "AI",
  USER = "USER",
}

const Chat = () => {
  const params = useParams();
  const [chatEnded, setChatEnded] = useState(false);
  const [messages, setMessages] = useState([
    {
      character: Character.AI,
      content:
        "Bonjour je suis AImeric et je vais vous accompagner dans votre recherche d'emploi. Commençons par apprendre à vous connaître. Pouvez-vous me dire ce que vous recherchez aujourd'hui dans votre carrière professionnelle ?",
    },
  ]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendUserAnswer = () => {
    const tmpMessages = [
      ...messages,
      {character: Character.USER, content: userAnswer},
    ];

    setMessages(tmpMessages);
    setUserAnswer("");
    postRequest("http://localhost:3000/user/chat", {
      userId: `${params.userId}`,
      content: JSON.stringify(tmpMessages),
    })
      .then((result) => {
        setIsLoading(false);
        if (result.stopChat) {
          setChatEnded(true);
          setMessages([
            ...tmpMessages,
            {
              character: Character.AI,
              content:
                "J'ai tout ce qu'il me faut merci ! Vous pouvez quitter cette page, notre équipe vous recontactera d'ici quelques jours",
            },
          ]);
        } else {
          setMessages([
            ...tmpMessages,
            // TO DO replace type assumption by proper typed API contract
            {character: Character.AI, content: result.content as string},
          ]);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {messages.map((message) => (
        <p
          className={classNames(
            "chatMessage",
            message.character === Character.AI
              ? "chatAiMessage"
              : "chatUserMessage"
          )}
        >
          {message.content}
        </p>
      ))}
      {isLoading && <div>AI is Typing</div>}
      {!chatEnded && (
        <>
          <textarea
            className="userInputBox"
            onChange={(e) => {
              setUserAnswer(e.target.value);
            }}
            value={userAnswer}
          />
          <button
            disabled={isLoading}
            className="chatSendButton"
            onClick={() => sendUserAnswer()}
          >
            Envoyer
          </button>
        </>
      )}
    </>
  );
};

export default Chat;
