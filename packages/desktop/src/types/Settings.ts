import { UUID } from "crypto";
import { Page } from "./State";

export const DEFAULT_SETTINGS: Settings = {
  scale: 100,
  debug: false,
  activeTab: "Players",
  cornerOfEyeMode: false,
  chipsMode: false,
  fourColorDeck: false,
  touchscreenMenu: false,
  swapSideMenus: false,
  touchscreenMenuWidth: 30,
  touchscreenMenuChipsColumns: 3,
  touchscreenMenuCalculator: true,
  autoClearChipTotal: true,
  tts: false,
  ttsVoice: "Microsoft David Desktop - English (United States)",
  ttsRate: 1,
  ttsPitch: 1,
  ttsVolume: 1,
  cardRecognitionMode: "GEMINI",
  geminiApiKey: "",
  roboflowModelId: "card-detection-zk7wu-gzidp",
  roboflowModelVersion: 1,
  roboflowPublishableKey: "",
  roboflowShowOverlay: true,
  cameraDeviceId: "",
  cameraFlipHorizontal: false,
  cameraMenu: false,
  cameraMenuWidth: 15,
  selectorAVisualFocus: "NONE",
  selectorBVisualFocus: "NONE",
};

export type Settings = {
  scale: number;
  debug: boolean;
  activeTab: Page;
  cornerOfEyeMode: boolean;
  chipsMode: boolean;
  fourColorDeck: boolean;
  touchscreenMenu: boolean;
  swapSideMenus: boolean;
  touchscreenMenuWidth: number;
  touchscreenMenuChipsColumns: number;
  touchscreenMenuCalculator: boolean;
  autoClearChipTotal: boolean;
  tts: boolean;
  ttsVoice: string;
  ttsRate: number;
  ttsPitch: number;
  ttsVolume: number;
  cardRecognitionMode: "GEMINI" | "ROBOFLOW";
  geminiApiKey: string;
  roboflowModelId: string;
  roboflowModelVersion: number;
  roboflowPublishableKey: string;
  roboflowShowOverlay: boolean;
  cameraDeviceId: string;
  cameraFlipHorizontal: boolean;
  cameraMenu: boolean;
  cameraMenuWidth: number;
  selectorAVisualFocus: VisualFocusTarget;
  selectorBVisualFocus: VisualFocusTarget;
};

export type VisualFocusTarget = "CAMERA" | "TOUCHSCREEN" | "GAME" | "NONE";
export const VISUAL_FOCUS_TARGETS: VisualFocusTarget[] = ["CAMERA", "TOUCHSCREEN", "GAME", "NONE"];

export const DEFAULT_CHIP: Chip = {
  id: crypto.randomUUID(),
  color: "#ffffff",
  denomination: 0,
};

export type Chip = {
  id: UUID;
  color: string;
  denomination: number;
};
