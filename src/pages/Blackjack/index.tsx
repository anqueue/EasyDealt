import { useRecoilState, useRecoilValue } from "recoil";
import PostRound from "./routes/PostRound";
import PreRound from "./routes/PreRound";
import Round from "./routes/Round";
import { BLACKJACK_GAME_STATE } from "@/Root";
import { Button } from "@mantine/core";
import { EMPTY_CARD } from "@/utils/CardHelper";

export default function Blackjack() {
  const [gameState, setGameState] = useRecoilState(BLACKJACK_GAME_STATE);

  let component;

  switch (gameState.gameState) {
    case "PREROUND":
      component = <PreRound />;
      break;
    case "ROUND":
      component = <Round />;
      break;
    case "POSTROUND":
      component = <PostRound />;
      break;
  }

  return (
    <>
      {component}{" "}
      {true && (
        <Button
          variant="outline"
          onClick={() => {
            console.log("setting preround", gameState);
            setGameState({
              currentTurn: "",
              dealerCards: [EMPTY_CARD, EMPTY_CARD],
              dealerFirstTime: true,
              gameState: "PREROUND",
            });
          }}
        >
          SET PREROUND
        </Button>
      )}
      {gameState.currentTurn} | {gameState.dealerFirstTime ? "First" : "Not First"}
    </>
  );
}
