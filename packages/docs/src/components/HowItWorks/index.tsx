import React from "react";
import {
  Container,
  Title,
  Paper,
  SimpleGrid,
  Text,
  rem,
  rgba,
  useMantineTheme,
} from "@mantine/core";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <Container
      size="lg"
      mt={60}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <Container ta="center" mb={20}>
        <Title order={2} c="white" size={rem(45)} fw="bold">
          Set Up Your Game in Minutes
        </Title>
        <Text>See how easy it is to start using EasyDealt in three simple steps:</Text>
      </Container>
      <Section
        title="Set Up Players"
        description="Easily add and manage players in the Players tab. Create profiles, set balances, and prepare for your game in seconds."
        subtitle="Step 1"
        svg="/img/add.svg"
        side="left"
      />
      <Section
        title="Manage the Game"
        description="Navigate Blackjack or Poker with ease. Input player actions, track bets, and let the app assist with game-specific rules and calculations."
        subtitle="Step 2"
        svg="/img/track.svg"
        side="right"
      />
      <Section
        title="Celebrate Smooth Gameplay"
        description="Let the app determine winners and calculate payouts. View detailed results and updated balances for a seamless post-game experience."
        subtitle="Step 3"
        svg="/img/celebrate.svg"
        side="left"
      />
    </Container>
  );
}

function Section({
  title,
  description,
  subtitle,
  svg,
  side,
}: {
  title: string;
  description: string;
  subtitle: string;
  svg: string;
  side: "left" | "right";
}) {
  const theme = useMantineTheme();

  const TextContent = (
    <Container
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
      pl={side == "right" ? undefined : "45px"}
      pr={side == "left" ? undefined : "45px"}
    >
      <Text fw="bold" c="dimmed" size={rem(22)} mb="sm">
        {subtitle}
      </Text>
      <Text fw="bold" size={rem(30)} c="gray.4">
        {title}
      </Text>
      <Text c="gray.5" mt="sm">
        {description}
      </Text>
    </Container>
  );

  const ImageContent = (
    <Container
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={svg}
        alt={title}
        height="100%"
        width="100%"
        style={{
          padding: "45px",
        }}
      />
    </Container>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      viewport={{ once: true }}
      style={{
        display: "flex",
        width: "90%",
        justifyContent: "center",
      }}
    >
      <Paper
        h={300}
        w="100%"
        style={{
          backgroundColor: theme.colors.dark[6],
        }}
        radius="xl"
      >
        <SimpleGrid cols={2} h="100%">
          {side === "left" ? TextContent : ImageContent}
          {side === "left" ? ImageContent : TextContent}
        </SimpleGrid>
      </Paper>
    </motion.div>
  );
}
