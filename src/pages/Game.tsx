import { useRecoilState, useRecoilValue } from "recoil";
import { GameState, STATE, STATE_WATCHER, State } from "../App";
import { Button } from "@mantine/core";
import { Table } from "../components/Table";

export default function Game() {
  const [state, setState] = useRecoilState(STATE);
  const val = useRecoilValue<State>(STATE_WATCHER);

  switch (val.gameState) {
    case GameState.NONE:
      return (
        <Button
          onClick={() => setState({ ...state, gameState: GameState.CREATING })}
        >
          Create Game
        </Button>
      );
    case GameState.CREATING:
      return <Table />;
  }
}