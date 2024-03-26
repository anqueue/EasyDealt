import { Card } from "./Card";

export type GameState = "PREROUND" | "BLINDS" | "PREFLOP" | "FLOP" | "TURN" | "RIVER" | "SHOWDOWN";

export type PokerGame = {
  gameState: GameState;
  currentTurn: string;
  communityCards: Card[];
  currentBet: number;
  currentDealer: string;
  currentSmallBlind: string;
  currentBigBlind: string;
  pots: {
    type: "MAIN" | "SIDE";
    participants: string[];
    amount: {
      [key: string]: number; // How much each player has contributed to this pot
    };
  }[];
};

export type PokerPlayer = {
  id: string;
  cards: Card[];
  displayName: string;
  folded: boolean;
  currentBet: number;
  allIn: boolean;
};

export type PokerSettings = {
  forcedBetOption: "BLINDS" | "ANTE";
  smallBlind: number;
  bigBlind: number;
  ante: number;
};