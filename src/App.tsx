import {
  BLACKJACK_GAME_STATE,
  BLACKJACK_PLAYERS_STATE,
  BLACKJACK_SETTINGS,
  PLAYERS_STATE,
  SETTINGS_STATE,
} from "@/Root";
import { Container, Divider, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { TAURI_STORE } from "./Root";
import Header from "./components/Header";
import Blackjack from "./pages/Blackjack";
import Players from "./pages/Players";
import Poker from "./pages/Poker";
import Settings from "./pages/Settings";
import { Page } from "./types/State";

export default function App() {
  const [activeTab, setActiveTab] = useState<Page>("Players");

  const [players] = useRecoilState(PLAYERS_STATE);
  const [playersLastSaved, setPlayersLastSaved] = useState(0);
  const [blackjackGame] = useRecoilState(BLACKJACK_GAME_STATE);
  const [blackjackGameLastSaved, setBlackjackGameLastSaved] = useState(0);
  const [blackjackSettings] = useRecoilState(BLACKJACK_SETTINGS);
  const [blackjackSettingsLastSaved, setBlackjackSettingsLastSaved] = useState(0);
  const [blackjackPlayers] = useRecoilState(BLACKJACK_PLAYERS_STATE);
  const [blackjackPlayersLastSaved, setBlackjackPlayersLastSaved] = useState(0);
  const [settings] = useRecoilState(SETTINGS_STATE);
  const [settingsLastSaved, setSettingsLastSaved] = useState(0);

  useEffect(() => {
    if (playersLastSaved < Date.now() - 500) {
      setPlayersLastSaved(Date.now());
      TAURI_STORE.set("players", players);
    }
  }, [players]);

  useEffect(() => {
    if (blackjackGameLastSaved < Date.now() - 500) {
      setBlackjackGameLastSaved(Date.now());
      TAURI_STORE.set("blackjackGame", blackjackGame);
    }
  }, [blackjackGame]);

  useEffect(() => {
    if (blackjackSettingsLastSaved < Date.now() - 500) {
      setBlackjackSettingsLastSaved(Date.now());
      TAURI_STORE.set("blackjackSettings", blackjackSettings);
    }
  }, [blackjackSettings]);

  useEffect(() => {
    if (blackjackPlayersLastSaved < Date.now() - 500) {
      setBlackjackPlayersLastSaved(Date.now());
      TAURI_STORE.set("blackjackPlayers", blackjackPlayers);
    }
  }, [blackjackPlayers]);

  useEffect(() => {
    if (settingsLastSaved < Date.now() - 500) {
      setSettingsLastSaved(Date.now());
      TAURI_STORE.set("settings", settings);
    }
  }, [settings]);

  let content: JSX.Element = <Text>No content</Text>;
  switch (activeTab) {
    case "Players":
      content = <Players />;
      break;

    case "Blackjack":
      content = <Blackjack />;
      break;

    case "Poker":
      content = <Poker />;
      break;

    case "Settings":
      content = <Settings />;
      break;
  }

  return (
    <>
      <Header active={activeTab} setActive={setActiveTab} />
      <Divider my="xs" />
      <Container>{content}</Container>
    </>
  );
}
