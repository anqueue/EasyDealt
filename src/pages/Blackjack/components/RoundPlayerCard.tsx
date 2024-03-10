import {
  BLACKJACK_GAME_STATE,
  BLACKJACK_PLAYERS_STATE,
  BLACKJACK_SETTINGS,
  PLAYERS_STATE,
} from "@/Root";
import GenericPlayerCard from "@/components/GenericPlayerCard";
import PlayingCard from "@/components/PlayingCard";
import { BlackjackPlayer } from "@/types/Blackjack";
import { Player } from "@/types/Player";
import {
  calculateBasePayoutMultiplier,
  findPerfectPairs,
  findTwentyOnePlusThree,
  getCardTotal,
  getCardValue,
  shortenTwentyOnePlusThree,
} from "@/utils/BlackjackHelper";
import { EMPTY_CARD } from "@/utils/CardHelper";
import { formatMoney } from "@/utils/MoneyHelper";
import { useRecoilImmerState } from "@/utils/RecoilImmer";
import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useRecoilState, useRecoilValue } from "recoil";
import { CARD_SELECTOR_STATE } from "../routes/Round";

export default function RoundPlayerCard({
  player,
  blackjackPlayer,
  isActive,
  nextTurn,
  forceTurn,
}: {
  player: Player;
  blackjackPlayer: BlackjackPlayer;
  isActive: boolean;
  nextTurn: () => void;
  forceTurn: (playerId: string) => void;
}) {
  const [cardSelector, setCardSelector] = useRecoilState(CARD_SELECTOR_STATE);
  const [blackjackPlayers, setBlackjackPlayers] = useRecoilImmerState(BLACKJACK_PLAYERS_STATE);
  const blackjackSettings = useRecoilValue(BLACKJACK_SETTINGS);
  const blackjackGame = useRecoilValue(BLACKJACK_GAME_STATE);
  const [players, setPlayers] = useRecoilImmerState(PLAYERS_STATE);
  const theme = useMantineTheme();

  const calculatedCardResult = getCardTotal(blackjackPlayer.cards);

  const calculatedPerfectPairs = blackjackPlayer.sidebets.perfectPairs
    ? findPerfectPairs(blackjackPlayer.cards)
    : null;

  let perfectPairEarnings = -blackjackPlayer.sidebets.perfectPairs;
  switch (calculatedPerfectPairs) {
    case "None":
      break;

    case "Mixed":
      perfectPairEarnings =
        blackjackPlayer.sidebets.perfectPairs * blackjackSettings.perfectPairsMixedPayout;
      break;

    case "Colored":
      perfectPairEarnings =
        blackjackPlayer.sidebets.perfectPairs * blackjackSettings.perfectPairsColoredPayout;
      break;

    case "Perfect":
      perfectPairEarnings =
        blackjackPlayer.sidebets.perfectPairs * blackjackSettings.perfectPairsSuitedPayout;
      break;
  }

  const calculatedTwentyOnePlusThree = blackjackPlayer.sidebets.twentyOnePlusThree
    ? findTwentyOnePlusThree([
        blackjackPlayer.cards[0],
        blackjackPlayer.cards[1],
        blackjackGame.dealerCards[0],
      ])
    : null;

  let twentyOnePlusThreeEarnings = -blackjackPlayer.sidebets.twentyOnePlusThree;
  switch (calculatedTwentyOnePlusThree) {
    case "None":
      break;

    case "Flush":
      twentyOnePlusThreeEarnings =
        blackjackPlayer.sidebets.twentyOnePlusThree *
        blackjackSettings.twentyOnePlusThreeFlushPayout;
      break;

    case "Straight":
      twentyOnePlusThreeEarnings =
        blackjackPlayer.sidebets.twentyOnePlusThree *
        blackjackSettings.twentyOnePlusThreeStraightPayout;
      break;

    case "Three of a Kind":
      twentyOnePlusThreeEarnings =
        blackjackPlayer.sidebets.twentyOnePlusThree *
        blackjackSettings.twentyOnePlusThreeThreeOfAKindPayout;
      break;

    case "Straight Flush":
      twentyOnePlusThreeEarnings =
        blackjackPlayer.sidebets.twentyOnePlusThree *
        blackjackSettings.twentyOnePlusThreeStraightFlushPayout;
      break;

    case "Suited Three of a Kind":
      twentyOnePlusThreeEarnings =
        blackjackPlayer.sidebets.twentyOnePlusThree *
        blackjackSettings.twentyOnePlusThreeThreeOfAKindSuitedPayout;
      break;
  }

  let betBehindResult = "None";
  let betBehindName = "";
  let betBehindPayout = 0;
  if (blackjackPlayer.sidebets.betBehind.target) {
    betBehindPayout = -blackjackPlayer.sidebets.betBehind.bet;
    const betBehindPlayer = blackjackPlayers.find(
      (player) => player.id == blackjackPlayer.sidebets.betBehind.target
    );
    if (!betBehindPlayer) {
      console.warn("Bet behind player not found", blackjackPlayer.sidebets.betBehind.target);
      return;
    }

    betBehindName = betBehindPlayer.displayName;

    if (betBehindPlayer.cards.filter((c) => c == EMPTY_CARD).length == 2) {
      betBehindResult = "Pending";
    } else {
      let betBehindBetMultiplier = calculateBasePayoutMultiplier(
        getCardTotal(betBehindPlayer.cards).total,
        getCardTotal(blackjackGame.dealerCards).total
      );

      if (betBehindBetMultiplier != 0)
        betBehindPayout = blackjackPlayer.sidebets.betBehind.bet * betBehindBetMultiplier;

      console.log(betBehindBetMultiplier, "1");

      if (betBehindBetMultiplier == 2.5) {
        betBehindResult = "Blackjack";
      } else if (betBehindBetMultiplier == 2) {
        betBehindResult = "Win";
      } else if (betBehindBetMultiplier == 1) {
        betBehindResult = "Push";
      } else if (betBehindBetMultiplier == 0) {
        betBehindResult = "Lose";
      }
    }
  }

  return (
    <GenericPlayerCard
      header={blackjackPlayer.displayName}
      backgroundColor={isActive ? theme.colors.dark[6] : theme.colors.dark[7]}
      subsection={
        <>
          <Text size="md" fw={600}>
            {formatMoney(blackjackPlayer.bet)} {blackjackPlayer.doubledDown ? "(X2)" : ""}{" "}
            {blackjackPlayer.split ? "(Split)" : ""}
          </Text>
          <Text size="sm" c="dimmed">
            {formatMoney(player.balance)}
          </Text>
        </>
      }
      rightSection={
        <>
          {calculatedPerfectPairs && (
            <Paper
              style={{
                width: "4.5rem",
                height: "4.5rem",
                backgroundColor: "transparent",
              }}
              ml="xs"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Text size="xs" c="dimmed" fw={600} tt="capitalize" ta="center">
                  Perfect Pairs
                </Text>
                {blackjackPlayer.cards.filter((card) => card != EMPTY_CARD).length > 0 ? (
                  <>
                    <Text size="md" fw="bold" ta="center">
                      {calculatedPerfectPairs}
                    </Text>
                    <Text
                      size="sm"
                      fw={600}
                      ta="center"
                      c={perfectPairEarnings <= 0 ? "red" : "green"}
                    >
                      {perfectPairEarnings > 0 && "+"}
                      {formatMoney(perfectPairEarnings)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text size="md" fw="bold" ta="center">
                      Pending
                    </Text>
                    <Text size="sm" fw={600} ta="center" c="dimmed">
                      {formatMoney(blackjackPlayer.sidebets.perfectPairs)}
                    </Text>
                  </>
                )}
              </div>
            </Paper>
          )}
          {calculatedTwentyOnePlusThree && (
            <Paper
              style={{
                width: "4.5rem",
                height: "4.5rem",
                backgroundColor: "transparent",
              }}
              ml="xs"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Text size="xs" c="dimmed" fw={600} tt="capitalize" ta="center">
                  21+3
                </Text>
                {blackjackPlayer.cards.filter((card) => card != EMPTY_CARD).length > 0 ? (
                  <>
                    <Text
                      size="md"
                      fw="bold"
                      ta="center"
                      style={{
                        lineHeight: 1.2,
                      }}
                    >
                      {shortenTwentyOnePlusThree(calculatedTwentyOnePlusThree)}
                    </Text>
                    <Text
                      size="sm"
                      fw={600}
                      ta="center"
                      c={twentyOnePlusThreeEarnings <= 0 ? "red" : "green"}
                    >
                      {twentyOnePlusThreeEarnings > 0 && "+"}
                      {formatMoney(twentyOnePlusThreeEarnings)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text size="md" fw="bold" ta="center">
                      Pending
                    </Text>
                    <Text size="sm" fw={600} ta="center" c="dimmed">
                      {formatMoney(blackjackPlayer.sidebets.twentyOnePlusThree)}
                    </Text>
                  </>
                )}
              </div>
            </Paper>
          )}
          {betBehindResult != "None" && (
            <Paper
              style={{
                width: "4.5rem",
                height: "4.5rem",
                backgroundColor: "transparent",
              }}
              ml="xs"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Text size="xs" c="dimmed" fw={600} tt="capitalize" ta="center">
                  Bet Behind
                </Text>
                <Text size="xs" ta="center">
                  {betBehindName}
                </Text>
                <>
                  <Text
                    size="md"
                    fw="bold"
                    ta="center"
                    style={{
                      lineHeight: 1.2,
                    }}
                  >
                    {betBehindResult}
                  </Text>
                  {betBehindResult == "Pending" ? (
                    <Text size="sm" fw={600} ta="center" c="dimmed">
                      {formatMoney(blackjackPlayer.sidebets.betBehind.bet)}
                    </Text>
                  ) : (
                    <Text size="sm" fw={600} ta="center" c={betBehindPayout <= 0 ? "red" : "green"}>
                      {betBehindPayout > 0 && "+"}
                      {formatMoney(betBehindPayout)}
                    </Text>
                  )}
                </>
              </div>
            </Paper>
          )}
          <Paper
            style={{
              width: "4.5rem",
              height: "4.5rem",
              backgroundColor: "transparent",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Text size={rem(14)} fw={600} tt="uppercase" ta="center">
                {calculatedCardResult.ace !== "NONE" ? calculatedCardResult.ace : ""}
              </Text>
              <Text size={rem(30)} fw="bold" ta="center">
                {calculatedCardResult.total}
              </Text>
            </div>
          </Paper>
          {blackjackPlayer.cards.map((card, index) => (
            <Container p={0} m={0} pl="xs" key={`${card}-${index}`}>
              <PlayingCard
                key={index}
                card={card}
                onClick={() => {
                  setCardSelector({
                    ...cardSelector,
                    intitalCard: card,
                    opened: true,
                    onSubmitTarget: blackjackPlayer.id,
                    onSubmitIndex: index,
                  });
                }}
                disabled={isActive}
              />
            </Container>
          ))}
        </>
      }
    >
      <Divider my="xs" />
      <Group grow>
        <Button
          disabled={
            !isActive ||
            blackjackPlayer.doubledDown ||
            blackjackPlayer.cards.some((card) => card == EMPTY_CARD)
          }
          fullWidth
          onClick={() => {
            setBlackjackPlayers((draft) => {
              draft.map((player) => {
                if (player.id == blackjackPlayer.id) {
                  if (!player.cards.some((card) => card == EMPTY_CARD)) {
                    player.cards.push(EMPTY_CARD);
                  }
                }
              });
            });
          }}
        >
          Hit
        </Button>
        <Button disabled={!isActive} fullWidth color="green" onClick={nextTurn}>
          Stand
        </Button>
        <Button
          disabled={
            !isActive || blackjackPlayer.doubledDown || player.balance < blackjackPlayer.bet
          }
          fullWidth
          color="red"
          onClick={() => {
            setBlackjackPlayers((draft) => {
              draft.map((player) => {
                if (player.id == blackjackPlayer.id) {
                  player.doubledDown = true;
                  player.cards.push(EMPTY_CARD);
                }
              });
            });

            setPlayers((draft) => {
              draft.map((player) => {
                if (player.id == blackjackPlayer.id) {
                  player.balance -= blackjackPlayer.bet;
                }
              });
            });
          }}
        >
          Double
        </Button>
        <Button
          disabled={
            !isActive ||
            blackjackPlayer.cards.length != 2 ||
            getCardValue(blackjackPlayer.cards[0]) != getCardValue(blackjackPlayer.cards[1])
          }
          fullWidth
          color="grape"
          onClick={() => {}}
        >
          Split
        </Button>
        <Button
          disabled={isActive}
          fullWidth
          color="gray"
          onClick={() => {
            forceTurn(blackjackPlayer.id);
          }}
        >
          Force Turn
        </Button>
      </Group>
    </GenericPlayerCard>
  );
}
