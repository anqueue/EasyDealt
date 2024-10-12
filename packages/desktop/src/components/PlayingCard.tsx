import { SETTINGS_STATE } from "@/Root";
import { Card } from "@/types/Card";
import { getSuit, suitToIcon, getRank, EMPTY_CARD } from "@/utils/CardHelper";
import {
  Paper,
  useMantineTheme,
  Text,
  darken,
  MantineStyleProp,
  MantineColor,
} from "@mantine/core";
import { IconLock, IconPlus } from "@tabler/icons-react";
import { useRecoilValue } from "recoil";

export default function PlayingCard({
  card,
  onClick,
  disabled,
  highContrast,
  strict,
  style,
  twoTone,
}: {
  card: Card;
  onClick: (card: Card) => void;
  disabled: boolean;
  highContrast?: boolean;
  strict?: boolean;
  style?: MantineStyleProp;
  bgColorOverride?: MantineColor;
  twoTone?: boolean;
}) {
  const theme = useMantineTheme();
  const settings = useRecoilValue(SETTINGS_STATE);

  let backgroundColor;
  if (card == EMPTY_CARD || !disabled) {
    backgroundColor = "transparent";
  }

  if (card != EMPTY_CARD) {
    backgroundColor = theme.colors.gray[0];
  }

  let iconColor = theme.colors.dark[3];

  if (highContrast) {
    if (card == EMPTY_CARD && !disabled) {
      backgroundColor = darken(theme.colors.dark[6], 0.12);
    } else if (card == EMPTY_CARD && disabled) {
      backgroundColor = theme.colors.dark[5];
      iconColor = theme.colors.gray[6];
    }
  }

  const invalidCard = strict && getSuit(card) === "-" && getRank(card) !== "-";
  if (invalidCard) {
    // We have a rank but no suit
    backgroundColor = theme.colors.red[8];
  }

  let cardColor =
    getSuit(card) === "h" || getSuit(card) === "d" ? theme.colors.red[6] : theme.colors.dark[5];

  if (settings.fourColorDeck && !twoTone) {
    if (getSuit(card) === "d") {
      cardColor = theme.colors.blue[6];
    } else if (getSuit(card) === "c") {
      cardColor = theme.colors.green[7];
    }
  }

  return (
    <Paper
      withBorder
      shadow="md"
      style={{
        width: "4.5rem",
        height: "4.5rem",
        backgroundColor: backgroundColor,
        border: invalidCard ? `2px solid ${theme.colors.gray[0]}` : undefined,

        cursor: disabled ? "pointer" : "not-allowed",
        userSelect: "none",

        ...style,
      }}
      onClick={() => {
        if (disabled) {
          onClick(card);
        }
      }}
    >
      {card == EMPTY_CARD ? (
        <>
          <Text
            size="xl"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {disabled ? (
              <IconPlus color={iconColor} />
            ) : highContrast ? (
              <IconLock color={iconColor} />
            ) : null}
          </Text>
        </>
      ) : (
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
            c={cardColor}
            style={{
              verticalAlign: "middle",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {suitToIcon(getSuit(card))}
            {getRank(card)}
          </Text>
        </div>
      )}
    </Paper>
  );
}
