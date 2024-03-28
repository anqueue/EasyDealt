import { POKER_GAME_STATE, POKER_SETTINGS_STATE } from "@/Root";
import GenericPlayerCard from "@/components/GenericPlayerCard";
import PlayingCard from "@/components/PlayingCard";
import { CARD_SELECTOR_STATE } from "@/pages/Blackjack/routes/Round";
import { Player } from "@/types/Player";
import { PokerPlayer } from "@/types/Poker";
import { formatMoney } from "@/utils/MoneyHelper";
import {
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  NumberInput,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure, useScrollIntoView } from "@mantine/hooks";
import { IconCurrencyDollar, IconTriangleFilled } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { AllInBadge, BigBlindBadge, DealerBadge, SmallBlindBadge } from "../routes/PreRound";
import { ALLIN_CONFIRM, BETUI_OPEN, FOLD_CONFIRM, PLAYER_BET, TIMER_START } from "../routes/Round";

export default function RoundPlayerCard({
  player,
  pokerPlayer,
  active,
  checkAction,
  callAction,
  betAction,
  foldAction,
}: {
  player: Player;
  pokerPlayer: PokerPlayer;
  active: boolean;
  checkAction: () => void;
  callAction: () => void;
  betAction: (amount: number) => void;
  foldAction: () => void;
}) {
  const theme = useMantineTheme();
  const [cardSelector, setCardSelector] = useRecoilState(CARD_SELECTOR_STATE);
  const pokerGame = useRecoilValue(POKER_GAME_STATE);
  const pokerSettings = useRecoilValue(POKER_SETTINGS_STATE);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 100,
    duration: 500,
  });

  useEffect(() => {
    if (active) {
      scrollIntoView({
        alignment: "center",
      });
    }
  }, [active]);

  const [foldConfirm, setFoldConfirm] = useRecoilState(FOLD_CONFIRM);
  const [allInConfirm, setAllInConfirm] = useRecoilState(ALLIN_CONFIRM);
  const [timerStart, setTimerStart] = useRecoilState(TIMER_START);

  const [dateNow, setDateNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      if (foldConfirm || allInConfirm) {
        setDateNow(Date.now());
      }
    }, 5);

    return () => clearInterval(interval);
  }, [foldConfirm, allInConfirm]);

  const [betOrRaise, setBetOrRaise] = useState<"BET" | "RAISE">("BET");
  const [betOpened, setBetOpened] = useRecoilState(BETUI_OPEN);
  const [bet, setBet] = useRecoilState(PLAYER_BET);
  const betInputRef = useRef<HTMLInputElement>(null);

  const [betError, setBetError] = useState<string | null>(null);
  useEffect(() => {
    if (bet < pokerGame.currentBet) {
      setBetError("Bet must be greater than the current bet");
      return;
    }

    setBetError(null);
  }, [bet]);

  useEffect(() => {
    if (active) {
      setBet(pokerGame.currentBet);
    } else {
      setBetOpened(false);
    }
  }, [active]);

  const mustGoAllIn = pokerGame.currentBet - pokerPlayer.currentBet > player.balance;

  return (
    <div ref={targetRef}>
      <GenericPlayerCard
        header={
          <>
            <Flex align="center" mr="sm" gap="xs">
              <Text
                size="xl"
                c={pokerPlayer.folded ? "dimmed" : undefined}
                fw={pokerPlayer.folded ? 600 : "bold"}
                td={pokerPlayer.folded ? "line-through" : undefined}
              >
                {pokerPlayer.displayName}
              </Text>
              {pokerPlayer.allIn && <AllInBadge />}
              {pokerGame.currentDealer == player.id && <DealerBadge />}
              {pokerSettings.forcedBetOption == "BLINDS" &&
                pokerGame.currentSmallBlind == player.id && <SmallBlindBadge />}
              {pokerSettings.forcedBetOption == "BLINDS" &&
                pokerGame.currentBigBlind == player.id && <BigBlindBadge />}
            </Flex>
          </>
        }
        backgroundColor={active ? theme.colors.dark[6] : theme.colors.dark[7]}
        subsection={
          <>
            <Text size="md" fw={600}>
              {formatMoney(pokerPlayer.currentBet)}
            </Text>
            <Text size="sm" c="dimmed">
              {formatMoney(player.balance)}
            </Text>
          </>
        }
        rightSection={
          <>
            {pokerPlayer.cards.map((card, index) => (
              <Container p={0} m={0} pl="xs" key={`${card}-${index}`}>
                <PlayingCard
                  strict
                  key={index}
                  card={card}
                  onClick={() => {
                    setCardSelector({
                      ...cardSelector,
                      intitalCard: card,
                      opened: true,
                      onSubmitTarget: pokerPlayer.id,
                      onSubmitIndex: index,
                    });
                  }}
                  disabled={active}
                />
              </Container>
            ))}
          </>
        }
      >
        <>
          <Divider my="xs" />
          {betOpened && active ? (
            <>
              <Group grow>
                <Grid columns={24}>
                  <Grid.Col span={9}>
                    <NumberInput
                      ref={betInputRef}
                      radius="md"
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator=","
                      placeholder="0.00"
                      error={betError}
                      leftSection={<IconCurrencyDollar />}
                      allowNegative={false}
                      value={bet}
                      onChange={(value) => {
                        setBet(parseFloat(`${value}`));
                      }}
                      onKeyDown={getHotkeyHandler([["enter", () => betAction(bet)]])}
                    />
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Button
                      fullWidth
                      color="gray"
                      disabled={!active}
                      onClick={() => {
                        setBet(0);
                        setBetOpened(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Button
                      fullWidth
                      color="red"
                      disabled={!active || pokerPlayer.currentBet == player.balance}
                      style={{
                        background: active
                          ? `linear-gradient(to left, ${theme.colors.red[8]} ${Math.min(
                              100,
                              ((dateNow - (timerStart || 0)) / 3000) * 100
                            )}%, ${theme.colors.red[9]} 0%)`
                          : undefined,
                      }}
                      leftSection={timerStart ? undefined : <IconTriangleFilled />}
                      onClick={() => {
                        if (allInConfirm && active) {
                          setBet(player.balance);
                          betAction(player.balance);
                          setBetOpened(false);
                          setAllInConfirm(false);
                          setTimerStart(null);
                        } else {
                          setAllInConfirm(true);

                          // We wait 3 seconds to reset the all in confirm
                          setTimerStart(Date.now());
                          setTimeout(() => {
                            setAllInConfirm(false);
                            setTimerStart(null);
                          }, 3000);
                        }
                      }}
                    >
                      {allInConfirm && active
                        ? "Are you sure?"
                        : `All In (${formatMoney(player.balance, true, true)})`}
                    </Button>
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Button
                      fullWidth
                      color="blue"
                      disabled={!active || betError != null}
                      onClick={() => {
                        betAction(bet);
                        setBetOpened(false);
                      }}
                    >
                      {betOrRaise == "BET" ? "Bet" : "Raise to"} {formatMoney(bet, true, false)}
                    </Button>
                  </Grid.Col>
                </Grid>
              </Group>
            </>
          ) : (
            <Group grow>
              {pokerGame.currentBet > pokerPlayer.currentBet && (
                <Button fullWidth color="green" disabled={!active} onClick={callAction}>
                  Call{" "}
                  {mustGoAllIn
                    ? `${formatMoney(player.balance)} (All In)`
                    : formatMoney(
                        Math.min(pokerGame.currentBet - pokerPlayer.currentBet, player.balance),
                        true,
                        true
                      )}
                </Button>
              )}
              {pokerGame.currentBet <= pokerPlayer.currentBet && (
                <Button fullWidth color="green" disabled={!active} onClick={checkAction}>
                  Check
                </Button>
              )}
              <Button
                fullWidth
                color="red"
                disabled={!active}
                style={{
                  // Make the background like a progress bar, showing how long until the fold confirm is reset
                  background: active
                    ? `linear-gradient(to left, ${theme.colors.red[8]} ${Math.min(
                        100,
                        ((dateNow - (timerStart || 0)) / 3000) * 100
                      )}%, ${theme.colors.red[9]} 0%)`
                    : undefined,
                }}
                onClick={() => {
                  if (foldConfirm && active) {
                    foldAction();
                    setFoldConfirm(false);
                    setTimerStart(null);
                    return;
                  } else {
                    setFoldConfirm(true);

                    // We wait 3 seconds to reset the fold confirm
                    setTimerStart(Date.now());
                    setTimeout(() => {
                      setFoldConfirm(false);
                      setTimerStart(null);
                    }, 3000);
                  }
                }}
              >
                {foldConfirm && active ? "Are you sure?" : "Fold"}
              </Button>
              {pokerGame.currentBet > 0 && (
                <Button
                  fullWidth
                  color="blue"
                  disabled={!active || pokerPlayer.allIn}
                  onClick={() => {
                    setBetOrRaise("RAISE");
                    setBetOpened(true);

                    // Focus and go to the beginning of the input
                    // We wait 100ms to make sure the input is rendered
                    setTimeout(() => {
                      betInputRef.current?.focus();
                      betInputRef.current?.setSelectionRange(0, 0);
                    }, 100);
                  }}
                >
                  Raise
                </Button>
              )}
              {pokerGame.currentBet == 0 && (
                <Button
                  fullWidth
                  color="blue"
                  disabled={!active || pokerPlayer.allIn}
                  onClick={() => {
                    setBetOrRaise("BET");
                    setBetOpened(true);

                    // Focus and go to the beginning of the input
                    // We wait 100ms to make sure the input is rendered
                    setTimeout(() => {
                      betInputRef.current?.focus();
                      betInputRef.current?.setSelectionRange(0, 0);
                    }, 100);
                  }}
                >
                  Bet
                </Button>
              )}
            </Group>
          )}
        </>
      </GenericPlayerCard>
    </div>
  );
}
