import { Chip, DEFAULT_SETTINGS, Settings } from "@/types/Settings";
import { Button, Container, createTheme, MantineProvider, Title } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { notifications, Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { atom, RecoilRoot } from "recoil";
import { createStore } from "@tauri-apps/plugin-store";
import App from "./App";
import {
  BlackjackGame,
  BlackjackPlayer,
  BlackjackSettings,
  DEFAULT_BLACKJACK_GAME,
  DEFAULT_BLACKJACK_PLAYER,
  DEFAULT_BLACKJACK_SETTINGS,
} from "./types/Blackjack";
import { Keybinding } from "./types/Keybindings";
import { DEFAULT_PLAYER, Player } from "./types/Player";
import {
  DEFAULT_POKER_GAME,
  DEFAULT_POKER_PLAYER,
  DEFAULT_POKER_POT,
  DEFAULT_POKER_SETTINGS,
  PokerGame,
  PokerPlayer,
  PokerSettings,
} from "./types/Poker";
import { DefaultKeybinds } from "./utils/DefaultKeybinds";

export const TAURI_STORE = await createStore(".data");

export const PLAYERS_STATE = atom<Player[]>({
  key: "PLAYERS",
  default: new Promise(async (resolve) => {
    let storedData: Partial<Player>[] | null = await TAURI_STORE.get("players");

    let players = storedData || [];

    players = players.map((player) => ({
      ...DEFAULT_PLAYER,
      ...player,
    }));

    TAURI_STORE.set("players", players);
    resolve(players as Player[]);
  }),
});

export const KEYBINDINGS_STATE = atom<Keybinding[]>({
  key: "KEYBINDINGS",
  default: new Promise(async (resolve) => {
    let keybindings = await TAURI_STORE.get("keybindings");
    if (!keybindings) {
      console.log(`keybindings not found, setting to default`);
      keybindings = [...DefaultKeybinds];
      await TAURI_STORE.set("keybindings", keybindings);
    }

    resolve(keybindings as Keybinding[]);
  }),
});

export const BLACKJACK_GAME_STATE = atom<BlackjackGame>({
  key: "BLACKJACK_GAME",
  default: new Promise(async (resolve) => {
    let storedData: Partial<BlackjackGame> | null = await TAURI_STORE.get("blackjackGame");

    let game = deepMerge(DEFAULT_BLACKJACK_GAME, storedData || {});

    TAURI_STORE.set("blackjackGame", game);
    resolve(game as BlackjackGame);
  }),
});

export const BLACKJACK_SETTINGS = atom<BlackjackSettings>({
  key: "BLACKJACK_SETTINGS",
  default: new Promise(async (resolve) => {
    let storedData: Partial<BlackjackSettings> | null = await TAURI_STORE.get("blackjackSettings");

    let settings = deepMerge(DEFAULT_BLACKJACK_SETTINGS, storedData || {});

    TAURI_STORE.set("blackjackSettings", settings);
    resolve(settings as BlackjackSettings);
  }),
});

export const BLACKJACK_PLAYERS_STATE = atom<BlackjackPlayer[]>({
  key: "BLACKJACK_PLAYERS",
  default: new Promise(async (resolve) => {
    let storedData: Partial<BlackjackPlayer>[] | null = await TAURI_STORE.get("blackjackPlayers");

    let players = storedData || [];

    players = players.map((player) => ({
      ...DEFAULT_BLACKJACK_PLAYER,
      ...player,
    }));

    TAURI_STORE.set("blackjackPlayers", players);
    resolve(players as BlackjackPlayer[]);
  }),
});

export const POKER_GAME_STATE = atom<PokerGame>({
  key: "POKER_GAME",
  default: new Promise(async (resolve) => {
    let storedData: Partial<PokerGame> | null = await TAURI_STORE.get("pokerGame");

    let game = deepMerge(DEFAULT_POKER_GAME, storedData || {});

    game.pots = game.pots.map((pot) => deepMerge(DEFAULT_POKER_POT, pot));

    TAURI_STORE.set("pokerGame", game);
    resolve(game as PokerGame);
  }),
});

export const POKER_PLAYERS_STATE = atom<PokerPlayer[]>({
  key: "POKER_PLAYERS",
  default: new Promise(async (resolve) => {
    let storedData: Partial<PokerPlayer>[] | null = await TAURI_STORE.get("pokerPlayers");

    let players = storedData || [];

    players = players.map((player) => ({
      ...DEFAULT_POKER_PLAYER,
      ...player,
    }));

    TAURI_STORE.set("pokerPlayers", players);
    resolve(players as PokerPlayer[]);
  }),
});

export const POKER_SETTINGS_STATE = atom<PokerSettings>({
  key: "POKER_SETTINGS",
  default: new Promise(async (resolve) => {
    let storedData: Partial<PokerSettings> | null = await TAURI_STORE.get("pokerSettings");

    let settings = deepMerge(DEFAULT_POKER_SETTINGS, storedData || {});

    TAURI_STORE.set("pokerSettings", settings);
    resolve(settings as PokerSettings);
  }),
});

export const SETTINGS_STATE = atom<Settings>({
  key: "SETTINGS",
  default: new Promise(async (resolve) => {
    let storedData: Partial<Settings> | null = await TAURI_STORE.get("settings");

    let settings = deepMerge(DEFAULT_SETTINGS, storedData || {});

    TAURI_STORE.set("settings", settings);
    resolve(settings as Settings);
  }),
});

export const CHIPS_STATE = atom<Chip[]>({
  key: "CHIPS",
  default: new Promise(async (resolve) => {
    let chips = await TAURI_STORE.get("chips");
    if (!chips) {
      chips = [];
      await TAURI_STORE.set("chips", chips);
    }

    resolve(chips as Chip[]);
  }),
});

function deepMerge<T>(defaultObj: T, storedObj: Partial<T>): T {
  const result: any = { ...defaultObj };
  for (const key in storedObj) {
    if (storedObj.hasOwnProperty(key)) {
      if (
        typeof storedObj[key] === "object" &&
        storedObj[key] !== null &&
        !Array.isArray(storedObj[key])
      ) {
        result[key] = deepMerge(defaultObj[key] as any, storedObj[key] as any);
      } else {
        result[key] = storedObj[key];
      }
    }
  }
  return result as T;
}

setInterval(() => {
  console.log(`Autosaving...`);
  TAURI_STORE.save();
}, 1000 * 60);

import * as Sentry from "@sentry/react";
import DevTools from "./components/DevTools";

if (process.env.NODE_ENV === "production")
  Sentry.init({
    dsn: "https://974f6beb8a6de4c30bbe28b8d7c7c00d@o4505139595575296.ingest.us.sentry.io/4507600938401792",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    beforeSend(event) {
      if (event.exception && event.event_id) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }
      return event;
    },
  });

window.addEventListener("error", (event) => {
  notifications.show({
    title: "An error occurred",
    message: event.message,
    color: "red",
  });
});

// Make console.errors and warns show a notification
const consoleError = console.error;
console.error = (...args: any[]) => {
  notifications.show({
    title: "An error occurred (stderr)",
    message: args.join(" "),
    color: "red",
  });
  consoleError(...args);
};

const consoleWarn = console.warn;
console.warn = (...args: any[]) => {
  notifications.show({
    title: "A warning occurred (stderr)",
    message: args.join(" "),
    color: "yellow",
  });
  consoleWarn(...args);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      theme={createTheme({
        fontFamily: `${localStorage.getItem("FONT_FAMILY") || "Inter"}, Segoe UI, sans-serif`,
        colors: {
          dark: [
            "#BFBFC2",
            "#A4A5A9",
            "#8E9196",
            "#595C63",
            "#34373D",
            "#292B30",
            "#212225",
            "#161719",
            "#101113",
            "#0C0D0F",
          ],
        },
        defaultRadius: "lg",
      })}
      defaultColorScheme="dark"
    >
      <RecoilRoot>
        <ErrorBoundary fallbackRender={fallbackRender}>
          <ModalsProvider
            modalProps={{
              radius: "md",
              centered: true,
            }}
          >
            <Notifications limit={3} />
            <App />
          </ModalsProvider>
        </ErrorBoundary>
      </RecoilRoot>
    </MantineProvider>
  </React.StrictMode>
);

function fallbackRender(props: { error: any; resetErrorBoundary: any }) {
  return (
    <Container mt="sm">
      <Title order={1}>An error occurred</Title>
      <Button fullWidth mt="sm" variant="light" onClick={props.resetErrorBoundary}>
        Retry
      </Button>
      <Button
        fullWidth
        mt="sm"
        variant="light"
        color="red"
        onClick={() => {
          TAURI_STORE.clear();
          window.location.reload();
        }}
      >
        Reset data
      </Button>
      <pre>{props.error.message}</pre>
      <pre>{props.error?.stack}</pre>
      <DevTools />
    </Container>
  );
}
