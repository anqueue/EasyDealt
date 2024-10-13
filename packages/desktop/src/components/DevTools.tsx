import {
  BLACKJACK_GAME_STATE,
  BLACKJACK_PLAYERS_STATE,
  CHIPS_STATE,
  KEYBINDINGS_STATE,
  PLAYERS_STATE,
  POKER_GAME_STATE,
  POKER_PLAYERS_STATE,
  SETTINGS_STATE,
  TAURI_STORE,
} from "@/Root";
import { Player } from "@/types/Player";
import { DefaultKeybinds } from "@/utils/DefaultKeybinds";
import { useRecoilImmerState } from "@/utils/RecoilImmer";
import {
  Button,
  Checkbox,
  Collapse,
  Flex,
  JsonInput,
  Paper,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function DevTools() {
  const [players, setPlayers] = useRecoilImmerState(PLAYERS_STATE);
  const [tempPlayers, setTempPlayers] = useState<string>(JSON.stringify(players, null, 2));
  const [playersOpen, setPlayersOpen] = useState(false);
  const [autoUpdatePlayers, setAutoUpdatePlayers] = useState(false);

  const [blackjackPlayers, setBlackjackPlayers] = useRecoilImmerState(BLACKJACK_PLAYERS_STATE);
  const [tempBlackjackPlayers, setTempBlackjackPlayers] = useState<string>(
    JSON.stringify(blackjackPlayers, null, 2)
  );
  const [blackjackPlayersOpen, setBlackjackPlayersOpen] = useState(false);
  const [autoUpdateBlackjackPlayers, setAutoUpdateBlackjackPlayers] = useState(false);

  const [blackjackGame, setBlackjackGame] = useRecoilState(BLACKJACK_GAME_STATE);
  const [tempBlackjackGame, setTempBlackjackGame] = useState<string>(
    JSON.stringify(blackjackGame, null, 2)
  );
  const [blackjackGameOpen, setBlackjackGameOpen] = useState(false);
  const [autoUpdateBlackjackGame, setAutoUpdateBlackjackGame] = useState(false);

  const [pokerPlayers, setPokerPlayers] = useRecoilImmerState(POKER_PLAYERS_STATE);
  const [tempPokerPlayers, setTempPokerPlayers] = useState<string>(
    JSON.stringify(pokerPlayers, null, 2)
  );
  const [pokerPlayersOpen, setPokerPlayersOpen] = useState(false);
  const [autoUpdatePokerPlayers, setAutoUpdatePokerPlayers] = useState(false);

  const [pokerGame, setPokerGame] = useRecoilState(POKER_GAME_STATE);
  const [tempPokerGame, setTempPokerGame] = useState<string>(JSON.stringify(pokerGame, null, 2));
  const [pokerGameOpen, setPokerGameOpen] = useState(false);
  const [autoUpdatePokerGame, setAutoUpdatePokerGame] = useState(false);

  const [settings, setSettings] = useRecoilState(SETTINGS_STATE);
  const [tempSettings, setTempSettings] = useState<string>(JSON.stringify(settings, null, 2));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoUpdateSettings, setAutoUpdateSettings] = useState(false);

  const [chips, setChips] = useRecoilState(CHIPS_STATE);
  const [tempChips, setTempChips] = useState<string>(JSON.stringify(chips, null, 2));
  const [chipsOpen, setChipsOpen] = useState(false);
  const [autoUpdateChips, setAutoUpdateChips] = useState(false);

  const [keybindings, setKeybindings] = useRecoilImmerState(KEYBINDINGS_STATE);
  const [tempKeybindings, setTempKeybindings] = useState<string>(
    JSON.stringify(keybindings, null, 2)
  );
  const [keybindingsOpen, setKeybindingsOpen] = useState(false);
  const [autoUpdateKeybindings, setAutoUpdateKeybindings] = useState(false);

  const [exporterOpen, setExporter] = useState(false);
  const [exporterData, setExporterData] = useState<string>(
    "Paste existing data here or fetch to get"
  );

  useEffect(() => {
    if (autoUpdatePlayers) {
      setTempPlayers(JSON.stringify(players, null, 2));
    }
  }, [players, autoUpdatePlayers]);

  useEffect(() => {
    if (autoUpdateBlackjackPlayers) {
      setTempBlackjackPlayers(JSON.stringify(blackjackPlayers, null, 2));
    }
  }, [blackjackPlayers, autoUpdateBlackjackPlayers]);

  useEffect(() => {
    if (autoUpdateBlackjackGame) {
      setTempBlackjackGame(JSON.stringify(blackjackGame, null, 2));
    }
  }, [blackjackGame, autoUpdateBlackjackGame]);

  useEffect(() => {
    if (autoUpdatePokerPlayers) {
      setTempPokerPlayers(JSON.stringify(pokerPlayers, null, 2));
    }
  }, [pokerPlayers, autoUpdatePokerPlayers]);

  useEffect(() => {
    if (autoUpdatePokerGame) {
      setTempPokerGame(JSON.stringify(pokerGame, null, 2));
    }
  }, [pokerGame, autoUpdatePokerGame]);

  useEffect(() => {
    if (autoUpdateSettings) {
      setTempSettings(JSON.stringify(settings, null, 2));
    }
  }, [settings, autoUpdateSettings]);

  useEffect(() => {
    if (autoUpdateChips) {
      setTempChips(JSON.stringify(chips, null, 2));
    }
  }, [chips, autoUpdateChips]);

  return (
    <Paper withBorder p="sm">
      <Text fw="bold" size="lg">
        DevTools
      </Text>
      <Button
        onClick={() => {
          setSettings({
            ...settings,
            debug: false,
          });
        }}
        color="green"
      >
        Close DevTools
      </Button>
      <Button
        onClick={() => {
          const players: Player[] = [
            "Michael",
            "Jim",
            "Pam",
            "Dwight",
            "Angela",
            "Kevin",
            "Oscar",
            "Toby",
            "Creed",
            "Stanley",
          ].map((name) => {
            return {
              name,
              balance: 100,
              id: crypto.randomUUID(),
            };
          });

          setPlayers(players);
        }}
      >
        Set Fake Players
      </Button>
      <Button
        onClick={() => {
          setPlayers((draft) => {
            draft.forEach((player) => {
              // Between $20 and $100
              player.balance = Math.floor(Math.random() * 50) + 50;
            });
          });
        }}
      >
        Set Random Balances
      </Button>
      <Button
        onClick={() => {
          setKeybindings([...DefaultKeybinds]);
        }}
      >
        Set Default Keybindings
      </Button>
      <Button
        onClick={() => {
          setKeybindings((draft) => {
            draft.forEach((keybinding) => {
              keybinding.selector = "None";
            });
          });
        }}
      >
        Migrate Keybindings to Selector
      </Button>

      <Button
        onClick={() => {
          setPlayersOpen(!playersOpen);
        }}
        color="yellow"
      >
        {playersOpen ? "Close" : "Open"} Players
      </Button>
      <Button
        onClick={() => {
          setBlackjackPlayersOpen(!blackjackPlayersOpen);
        }}
        color="orange"
      >
        {blackjackPlayersOpen ? "Close" : "Open"} Blackjack Players
      </Button>
      <Button
        onClick={() => {
          setBlackjackGameOpen(!blackjackGameOpen);
        }}
        color="orange"
      >
        {blackjackGameOpen ? "Close" : "Open"} Blackjack Game
      </Button>
      <Button
        onClick={() => {
          setPokerPlayersOpen(!pokerPlayersOpen);
        }}
        color="grape"
      >
        {pokerPlayersOpen ? "Close" : "Open"} Poker Players
      </Button>
      <Button
        onClick={() => {
          setPokerGameOpen(!pokerGameOpen);
        }}
        color="grape"
      >
        {pokerGameOpen ? "Close" : "Open"} Poker Game
      </Button>
      <Button
        onClick={() => {
          setSettingsOpen(!settingsOpen);
        }}
        color="cyan"
      >
        {settingsOpen ? "Close" : "Open"} Settings
      </Button>
      <Button
        onClick={() => {
          setChipsOpen(!chipsOpen);
        }}
        color="blue"
      >
        {chipsOpen ? "Close" : "Open"} Chips
      </Button>
      <Button
        onClick={() => {
          setKeybindingsOpen(!keybindingsOpen);
        }}
        color="blue"
      >
        {keybindingsOpen ? "Close" : "Open"} Keybindings
      </Button>
      <Button onClick={() => setExporter(!exporterOpen)} color="red">
        {exporterOpen ? "Close" : "Open"} Exporter
      </Button>
      {/* <Select
        value={localStorage.getItem("FONT_FAMILY")}
        onChange={(value) => {
          localStorage.setItem("FONT_FAMILY", value as string);
          window.location.reload();
        }}
        placeholder="Font"
        data={[
          "Noto Sans",
          "Roboto",
          "Open Sans",
          "Inter",
          "Lato",
          "Poppins",
          "Raleway",
          "Nunito Sans",
        ]}
      /> */}
      <Button
        color="red"
        onClick={() => {
          throw new Error("Test error");
        }}
      >
        Throw Error
      </Button>
      <Button
        color="red"
        onClick={() => {
          TAURI_STORE.clear();
          window.location.reload();
        }}
      >
        Reset data
      </Button>

      <Collapse in={playersOpen}>
        <JsonInput
          label={
            JSON.stringify(players, null, 2) === tempPlayers ? "Players" : "Players (modified)"
          }
          radius="sm"
          value={tempPlayers}
          onChange={(value) => {
            setTempPlayers(value);
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={20}
          validationError="Invalid JSON"
          onKeyDown={getHotkeyHandler([
            [
              "mod+S",
              () => {
                let parsed = null;
                try {
                  parsed = JSON.parse(tempPlayers);
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    message: "Invalid JSON",
                    color: "red",
                  });
                }

                setPlayers(parsed);
              },
            ],
          ])}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let parsed = null;
              try {
                parsed = JSON.parse(tempPlayers);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });
              }

              setPlayers(parsed);
            }}
          >
            Save
          </Button>
          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              setTempPlayers(JSON.stringify(players, null, 2));
            }}
          >
            Reset
          </Button>
          <Checkbox
            radius="sm"
            checked={autoUpdatePlayers}
            onChange={(event) => {
              setAutoUpdatePlayers(event.currentTarget.checked);
            }}
          />
        </Flex>
      </Collapse>

      <Collapse in={blackjackPlayersOpen}>
        <JsonInput
          label={
            JSON.stringify(blackjackPlayers, null, 2) === tempBlackjackPlayers
              ? "Blackjack Players"
              : "Blackjack Players (modified)"
          }
          radius="sm"
          value={tempBlackjackPlayers}
          onChange={(value) => {
            setTempBlackjackPlayers(value);
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={20}
          validationError="Invalid JSON"
          onKeyDown={getHotkeyHandler([
            [
              "mod+S",
              () => {
                let parsed = null;
                try {
                  parsed = JSON.parse(tempBlackjackPlayers);
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    message: "Invalid JSON",
                    color: "red",
                  });
                }

                if (parsed) {
                  setBlackjackPlayers(parsed);
                }
              },
            ],
          ])}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let parsed = null;
              try {
                parsed = JSON.parse(tempBlackjackPlayers);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });
              }

              if (parsed) {
                setBlackjackPlayers(parsed);
              }
            }}
          >
            Save
          </Button>

          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              setTempBlackjackPlayers(JSON.stringify(blackjackPlayers, null, 2));
            }}
          >
            Reset
          </Button>
          <Checkbox
            radius="sm"
            checked={autoUpdateBlackjackPlayers}
            onChange={(event) => {
              setAutoUpdateBlackjackPlayers(event.currentTarget.checked);
            }}
          />
        </Flex>
      </Collapse>

      <Collapse in={blackjackGameOpen}>
        <JsonInput
          label={
            JSON.stringify(blackjackGame, null, 2) === tempBlackjackGame
              ? "Blackjack Game"
              : "Blackjack Game (modified)"
          }
          radius="sm"
          value={tempBlackjackGame}
          onChange={(value) => {
            setTempBlackjackGame(value);
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={20}
          validationError="Invalid JSON"
          onKeyDown={getHotkeyHandler([
            [
              "mod+S",
              () => {
                let parsed = null;
                try {
                  parsed = JSON.parse(tempBlackjackGame);
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    message: "Invalid JSON",
                    color: "red",
                  });
                }

                if (parsed) {
                  setBlackjackGame(parsed);
                }
              },
            ],
          ])}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let parsed = null;
              try {
                parsed = JSON.parse(tempBlackjackGame);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });
              }

              if (parsed) {
                setBlackjackGame(parsed);
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              setTempBlackjackGame(JSON.stringify(blackjackGame, null, 2));
            }}
          >
            Reset
          </Button>
          <Checkbox
            radius="sm"
            checked={autoUpdateBlackjackGame}
            onChange={(event) => {
              setAutoUpdateBlackjackGame(event.currentTarget.checked);
            }}
          />
        </Flex>
      </Collapse>

      <Collapse in={pokerPlayersOpen}>
        <JsonInput
          label={
            JSON.stringify(pokerPlayers, null, 2) === tempPokerPlayers
              ? "Poker Players"
              : "Poker Players (modified)"
          }
          radius="sm"
          value={tempPokerPlayers}
          onChange={(value) => {
            setTempPokerPlayers(value);
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={20}
          validationError="Invalid JSON"
          onKeyDown={getHotkeyHandler([
            [
              "mod+S",
              () => {
                let parsed = null;
                try {
                  parsed = JSON.parse(tempPokerPlayers);
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    message: "Invalid JSON",
                    color: "red",
                  });
                }

                if (parsed) {
                  setPokerPlayers(parsed);
                }
              },
            ],
          ])}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let parsed = null;
              try {
                parsed = JSON.parse(tempPokerPlayers);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });
              }

              if (parsed) {
                setPokerPlayers(parsed);
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              setTempPokerPlayers(JSON.stringify(pokerPlayers, null, 2));
            }}
          >
            Reset
          </Button>
          <Checkbox
            radius="sm"
            checked={autoUpdatePokerPlayers}
            onChange={(event) => {
              setAutoUpdatePokerPlayers(event.currentTarget.checked);
            }}
          />
        </Flex>
      </Collapse>

      <Collapse in={pokerGameOpen}>
        <JsonInput
          label={
            JSON.stringify(pokerGame, null, 2) === tempPokerGame
              ? "Poker Game"
              : "Poker Game (modified)"
          }
          radius="sm"
          value={tempPokerGame}
          onChange={(value) => {
            setTempPokerGame(value);
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={20}
          validationError="Invalid JSON"
          onKeyDown={getHotkeyHandler([
            [
              "mod+S",
              () => {
                let parsed = null;
                try {
                  parsed = JSON.parse(tempPokerGame);
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    message: "Invalid JSON",
                    color: "red",
                  });
                }

                if (parsed) {
                  setPokerGame(parsed);
                }
              },
            ],
          ])}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let parsed = null;
              try {
                parsed = JSON.parse(tempPokerGame);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });
              }

              if (parsed) {
                setPokerGame(parsed);
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              setTempPokerGame(JSON.stringify(pokerGame, null, 2));
            }}
          >
            Reset
          </Button>
          <Checkbox
            radius="sm"
            checked={autoUpdatePokerGame}
            onChange={(event) => {
              setAutoUpdatePokerGame(event.currentTarget.checked);
            }}
          />
        </Flex>
      </Collapse>

      <Collapse in={settingsOpen}>
        <JsonInput
          label={
            JSON.stringify(settings, null, 2) === tempSettings ? "Settings" : "Settings (modified)"
          }
          radius="sm"
          value={tempSettings}
          onChange={(value) => {
            setTempSettings(value);
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={20}
          validationError="Invalid JSON"
          onKeyDown={getHotkeyHandler([
            [
              "mod+S",
              () => {
                let parsed = null;
                try {
                  parsed = JSON.parse(tempSettings);
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    message: "Invalid JSON",
                    color: "red",
                  });
                }

                if (parsed) {
                  setSettings(parsed);
                }
              },
            ],
          ])}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let parsed = null;
              try {
                parsed = JSON.parse(tempSettings);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });
              }

              if (parsed) {
                setSettings(parsed);
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              setTempSettings(JSON.stringify(settings, null, 2));
            }}
          >
            Reset
          </Button>
          <Checkbox
            radius="sm"
            checked={autoUpdateSettings}
            onChange={(event) => {
              setAutoUpdateSettings(event.currentTarget.checked);
            }}
          />
        </Flex>
      </Collapse>

      <Collapse in={chipsOpen}>
        <JsonInput
          label={JSON.stringify(chips, null, 2) === tempChips ? "Chips" : "Chips (modified)"}
          radius="sm"
          value={tempChips}
          onChange={(value) => {
            setTempChips(value);
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={20}
          validationError="Invalid JSON"
          onKeyDown={getHotkeyHandler([
            [
              "mod+S",
              () => {
                let parsed = null;
                try {
                  parsed = JSON.parse(tempChips);
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    message: "Invalid JSON",
                    color: "red",
                  });
                }

                if (parsed) {
                  setChips(parsed);
                }
              },
            ],
          ])}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let parsed = null;
              try {
                parsed = JSON.parse(tempChips);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });
              }

              if (parsed) {
                setChips(parsed);
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              setTempChips(JSON.stringify(chips, null, 2));
            }}
          >
            Reset
          </Button>
          <Checkbox
            radius="sm"
            checked={autoUpdateChips}
            onChange={(event) => {
              setAutoUpdateChips(event.currentTarget.checked);
            }}
          />
        </Flex>
      </Collapse>
      <Collapse in={keybindingsOpen}>
        <JsonInput
          label={
            JSON.stringify(keybindings, null, 2) === tempKeybindings
              ? "Keybindings"
              : "Keybindings (modified)"
          }
          radius="sm"
          value={tempKeybindings}
          onChange={(value) => {
            setTempKeybindings(value);
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={20}
          validationError="Invalid JSON"
          onKeyDown={getHotkeyHandler([
            [
              "mod+S",
              () => {
                let parsed = null;
                try {
                  parsed = JSON.parse(tempKeybindings);
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    message: "Invalid JSON",
                    color: "red",
                  });
                }

                if (parsed) {
                  setKeybindings(parsed);
                }
              },
            ],
          ])}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let parsed = null;
              try {
                parsed = JSON.parse(tempKeybindings);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });
              }

              if (parsed) {
                setKeybindings(parsed);
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              setTempKeybindings(JSON.stringify(keybindings, null, 2));
            }}
          >
            Reset
          </Button>
          <Checkbox
            radius="sm"
            checked={autoUpdateKeybindings}
            onChange={(event) => {
              setAutoUpdateKeybindings(event.currentTarget.checked);
            }}
          />
        </Flex>
      </Collapse>
      <Collapse in={exporterOpen}>
        <Textarea
          label="Exporter"
          radius="sm"
          value={exporterData}
          onChange={(event) => {
            setExporterData(event.currentTarget.value);
          }}
          autosize
          minRows={4}
          maxRows={20}
        />
        <Flex gap="xs" mt="xs" align="center">
          <Button
            variant="light"
            fullWidth
            onClick={() => {
              let newData = null;
              try {
                newData = JSON.parse(exporterData);
              } catch (e) {
                console.error(e);
                notifications.show({
                  message: "Invalid JSON",
                  color: "red",
                });

                return;
              }

              for (const key in newData) {
                if (key === "players") {
                  setPlayers(newData[key]);
                } else if (key === "blackjackPlayers") {
                  setBlackjackPlayers(newData[key]);
                } else if (key === "blackjackGame") {
                  setBlackjackGame(newData[key]);
                } else if (key === "pokerPlayers") {
                  setPokerPlayers(newData[key]);
                } else if (key === "pokerGame") {
                  setPokerGame(newData[key]);
                } else if (key === "settings") {
                  setSettings(newData[key]);
                } else if (key === "chips") {
                  setChips(newData[key]);
                } else if (key === "keybindings") {
                  setKeybindings(newData[key]);
                }
              }
            }}
          >
            Set
          </Button>
          <Button
            variant="light"
            fullWidth
            color="red"
            onClick={() => {
              const data = {
                players,
                blackjackPlayers,
                blackjackGame,
                pokerPlayers,
                pokerGame,
                settings,
                chips,
                keybindings,
              };

              setExporterData(JSON.stringify(data, null, 2));
            }}
          >
            Fetch Pretty
          </Button>
          <Button
            variant="light"
            fullWidth
            color="yellow"
            onClick={() => {
              // Minify the data
              const data = {
                players,
                blackjackPlayers,
                blackjackGame,
                pokerPlayers,
                pokerGame,
                settings,
                chips,
                keybindings,
              };

              setExporterData(JSON.stringify(data));
            }}
          >
            Fetch Minified
          </Button>
        </Flex>
      </Collapse>
    </Paper>
  );
}
