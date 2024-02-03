import {
  Center,
  Container,
  Paper,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import Twemoji from "react-twemoji";
import { Card } from "../utils/Game";
import { useRecoilState, useRecoilValue } from "recoil";
import { STATE, State, STATE_WATCHER } from "../App";
import {
  IconClubs,
  IconClubsFilled,
  IconDiamondFilled,
  IconHeartFilled,
} from "@tabler/icons-react";

export default function PlayingCard(props: {
  card: Card;
  removeCard: (card: Card) => void;
}) {
  const theme = useMantineTheme();

  return (
    <Paper
      withBorder
      shadow="md"
      style={{
        width: "4.5rem",
        height: "4.5rem",
        backgroundColor: theme.colors.gray[0],
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Text
          size="2rem"
          fw={800}
          ta="center"
          c={
            props.card.suit === "hearts" || props.card.suit === "diamonds"
              ? theme.colors.red[6]
              : theme.colors.dark[5]
          }
        >
          <div
            style={{
              verticalAlign: "middle",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {suitToIcon(props.card.suit)}
            {props.card.rank}
          </div>
        </Text>
      </div>
    </Paper>
  );
}

const suitToIcon = (name: string): React.ReactNode => {
  let size = "1.7rem";

  switch (name) {
    case "hearts":
      return <IconHeartFilled size={size} />;
    case "diamonds":
      return <IconDiamondFilled size={size} />;
    case "clubs":
      return <IconClubsFilled size={size} />;
    case "spades":
      return <IconClubsFilled size={size} />;
  }
};