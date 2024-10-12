// works good now

import {
  Center,
  Code,
  Container,
  Divider,
  Image,
  Loader,
  LoadingOverlay,
  Paper,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";

import Webcam from "react-webcam";

import { CAMERA_DISABLED, HOTKEY_SELECTOR_A_ENABLED, HOTKEY_SELECTOR_B_ENABLED } from "@/App";
import { emitBjAction } from "@/pages/Blackjack/routes/Round";
import { emitPokerAction } from "@/pages/Poker/routes/Round";
import { BLACKJACK_GAME_STATE, KEYBINDINGS_STATE, POKER_GAME_STATE, SETTINGS_STATE } from "@/Root";
import { Card, CardRank_NOEMPTY, CardSuit_NOEMPTY } from "@/types/Card";
import { useRecoilImmerState } from "@/utils/RecoilImmer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useElementSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { createEvent } from "react-event-hook";
import { useHotkeys } from "react-hotkeys-hook";
import { useRecoilValue } from "recoil";
import PlayingCard from "./PlayingCard";
import { InferenceEngine, CVImage } from "inferencejs";

export const { useCameraResetListener, emitCameraReset } = createEvent("cameraReset")();

export default function CameraMenu() {
  const theme = useMantineTheme();
  const [image, setImage] = useState<string | null>(null);
  const [stats, setStats] = useState<string>("No image captured");

  const inferEngine = useMemo(() => {
    return new InferenceEngine();
  }, []);
  const [modelWorkerId, setModelWorkerId] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const cameraDisabled = useRecoilValue(CAMERA_DISABLED);

  const settings = useRecoilValue(SETTINGS_STATE);
  const pokerGameState = useRecoilValue(POKER_GAME_STATE).gameState;
  const blackjackGameState = useRecoilValue(BLACKJACK_GAME_STATE).gameState;

  const [keybindings] = useRecoilImmerState(KEYBINDINGS_STATE);

  const selectorA = useRecoilValue(HOTKEY_SELECTOR_A_ENABLED);
  const selectorB = useRecoilValue(HOTKEY_SELECTOR_B_ENABLED);

  keybindings.forEach((keybinding) => {
    if (keybinding.scope === "Camera Menu") {
      useHotkeys(keybinding.key, () => {
        if (keybinding.selector == "A" && !selectorA) return;
        if (keybinding.selector == "B" && !selectorB) return;

        if (keybinding.selector == "None" && (selectorA || selectorB)) return;

        switch (keybinding.action) {
          case "Capture":
            capture();
            break;

          case "Add Card":
            if (detectedCards.length > 0) {
              // Add the first/leftmost card
              addCard(0);
            }
            break;
        }
      });
    }
  });

  const [resettingCamera, setResettingCamera] = useState(false);
  useCameraResetListener(() => {
    setResettingCamera(true);

    setTimeout(() => {
      setResettingCamera(false);
    }, 1000);
  });

  const [rawResponse, setRawResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [detectedCards, setDetectedCards] = useState<
    {
      card: Card;
      expiresAt: number;
    }[]
  >([]);

  const genAI = new GoogleGenerativeAI(settings.geminiApiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      'Determine which suit and rank the card is. You must respond in JSON format with a rank and suit field. You must give the suit in the abbreviated form (s for Spades, h for Hearts, c for Clubs, d for Diamonds). You must give the rank in the abbreviated form (A for Ace, 2-9 for cards 2-9, T for 10, J for Jacks, Q for Queens, K for Kings). [{"rank": _, "suit": _}]. Return an array of card or cards. If you cannot determine the card, return an empty array.',
  });

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!modelLoaded && settings.cardRecognitionMode == "ROBOFLOW") {
      setModelLoaded(true);
      inferEngine
        .startWorker(
          settings.roboflowModelId,
          settings.roboflowModelVersion,
          settings.roboflowPublishableKey
        )
        .then((id) => {
          setModelWorkerId(id);
        });
    }
  }, [inferEngine, modelLoaded]);

  useEffect(() => {
    console.log("Roboflow model worker ID:", modelWorkerId);
    if (modelWorkerId) detectFrame();
  }, [modelWorkerId]);

  const {
    ref: webcamContainerRef,
    width: containerWidth,
    height: containerHeight,
  } = useElementSize();

  useEffect(() => {
    if (modelWorkerId) detectFrame();
  }, [modelWorkerId, containerWidth, containerHeight]);

  const detectFrame = () => {
    if (
      !modelWorkerId ||
      !webcamRef.current ||
      !webcamRef.current.video ||
      !canvasRef.current ||
      cameraDisabled
    ) {
      setTimeout(detectFrame, 100 / 3);
      return;
    }

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new CVImage(video);
    inferEngine.infer(modelWorkerId, img).then((predictions) => {
      // Set canvas size to match container
      canvas.width = containerWidth;
      canvas.height = containerHeight;

      // Calculate scale factors
      const scaleX = canvas.width / video.videoWidth;
      const scaleY = canvas.height / video.videoHeight;

      console.log(predictions);

      for (const prediction of predictions) {
        ctx.strokeStyle = prediction.color;

        // Scale and position the bounding box
        let x = (prediction.bbox.x - prediction.bbox.width / 2) * scaleX;
        let y = (prediction.bbox.y - prediction.bbox.height / 2) * scaleY;
        let width = prediction.bbox.width * scaleX;
        let height = prediction.bbox.height * scaleY;

        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw label
        const label = `${prediction.class} ${Math.round(prediction.confidence * 100)}%`;
        ctx.font = "15px monospace";
        const textMetrics = ctx.measureText(label);
        ctx.fillStyle = prediction.color;
        ctx.fillRect(x, y - 30, textMetrics.width + 4, 30);
        ctx.fillStyle = "black";
        ctx.fillText(label, x + 2, y - 10);

        let detectedCard = `${prediction.class
          .replace("10", "T")
          .replace(/[SCHD]/g, (c: string) => c.toLowerCase())}` as Card;

        // append to detected cards
        setDetectedCards((detectedCards) => {
          // return [...detectedCards, { card: detectedCard, timestampFound: Date.now() }];

          // Update or add the card
          let found = false;
          const updated = detectedCards.map((card) => {
            if (card.card == detectedCard) {
              found = true;
              return { card: detectedCard, expiresAt: Date.now() + 1000 };
            } else {
              return card;
            }
          });

          if (!found) {
            updated.push({ card: detectedCard, expiresAt: Date.now() + 1000 });
          }

          return updated.filter((card) => card.expiresAt > Date.now());
        });
      }

      setTimeout(detectFrame, 100 / 3);
    });
  };

  useEffect(() => {
    (async () => {
      if (!image) {
        return;
      }

      model.generationConfig = {
        temperature: 2,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };

      // We need to remove the data:image/png;base64, part of the image
      // and just send the base64 part
      const imageBase64 = image.split(",")[1];

      setLoading(true);
      const t0 = performance.now();
      const result = await model.generateContent([
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/png",
          },
        },
      ]);

      const response = await result.response;
      const text = await response.text();
      console.log(`AI Response: ${text}`);
      const cardData: { rank: CardRank_NOEMPTY; suit: CardSuit_NOEMPTY }[] = JSON.parse(text);
      setRawResponse(text);
      const t1 = performance.now();
      setDetectedCards(
        cardData.map((card) => {
          return { card: `${card.rank.replace("10", "T")}${card.suit}` as Card, expiresAt: 0 };
        })
      );
      setLoading(false);

      setStats(`${(t1 - t0).toFixed(2)}ms • ${response.usageMetadata?.totalTokenCount} tokens`);
    })().catch((e) => {
      notifications.show({
        title: "Error",
        message: e.message,
        color: "red",
      });

      setLoading(false);
    });
  }, [image]);

  const capture = () => {
    if (!webcamRef.current) return;
    if (loading) return;
    if (resettingCamera) return;
    if (settings.cardRecognitionMode == "ROBOFLOW") return;

    setImage(webcamRef.current.getScreenshot());
  };

  const addCard = (index: number) => {
    const card = detectedCards[index].card;

    if (settings.activeTab == "Poker" && pokerGameState != "PREROUND") {
      emitPokerAction(card);
    }
    if (settings.activeTab == "Blackjack" && blackjackGameState != "PREROUND") {
      emitBjAction(card);
    }
  };

  return (
    <Paper p="sm">
      {resettingCamera ||
      (settings.cardRecognitionMode == "ROBOFLOW" && !modelLoaded) ||
      cameraDisabled ? (
        <Center mb="sm">{cameraDisabled ? "Camera is disabled" : <Loader />}</Center>
      ) : (
        <div
          ref={webcamContainerRef}
          style={{
            cursor: settings.cardRecognitionMode == "GEMINI" ? "pointer" : "default",
            position: "relative",
            width: "100%",
            height: "auto",
          }}
          onClick={capture}
        >
          {loading && (
            <LoadingOverlay
              visible={loading || resettingCamera}
              style={{
                marginBottom: "9px",
              }}
              loaderProps={{
                color: "white",
              }}
              overlayProps={{
                color: "rgba(0, 0, 0, 0.75)",
                blur: 2,
                radius: theme.radius.md,
              }}
            />
          )}
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={settings.cameraFlipHorizontal}
            screenshotFormat="image/png"
            videoConstraints={{
              deviceId: settings.cameraDeviceId,
              facingMode: { ideal: "environment" },
            }}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: theme.radius.md,
            }}
          />
          {settings.roboflowShowOverlay && (
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </div>
      )}
      <Divider />
      {detectedCards.length > 0 && (
        <Text c="dimmed" ta="center" size="xs" my={5}>
          Click on a card to add it to the game
        </Text>
      )}

      {detectedCards.length == 0 && (
        <Text size="sm" c="dimmed" ta="center" mt="xs">
          No cards detected
        </Text>
      )}

      <Container
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: theme.spacing.xs,
        }}
      >
        {detectedCards.map((detectedCard, index) => (
          <>
            <PlayingCard
              key={index}
              onClick={() => {
                addCard(index);
              }}
              disabled
              card={detectedCard.card}
              style={{
                opacity: (detectedCard.expiresAt - Date.now()) / 1000,
              }}
              twoTone
            />
          </>
        ))}
      </Container>

      {settings.cardRecognitionMode == "GEMINI" && (
        <>
          <Divider my="sm" />
          <Text
            c="dimmed"
            ta="center"
            size="sm"
            style={{
              cursor: "pointer",
            }}
            title="More information"
            onClick={() => {
              modals.open({
                title: "Image Capture",
                children: (
                  <>
                    <Code>{rawResponse}</Code>
                    <Image src={image} radius="lg" />
                  </>
                ),
              });
            }}
          >
            {stats}
          </Text>
          <Divider my="sm" />
          <Text
            c="dimmed"
            ta="justify"
            size="xs"
            px="sm"
            style={{
              textAlignLast: "center",
              marginBottom: theme.spacing.xs,
            }}
          >
            Click the camera to capture an image
          </Text>
          <Text
            c="dimmed"
            ta="justify"
            size="xs"
            px="sm"
            style={{
              textAlignLast: "center",
            }}
          >
            Accuracy may vary. For best results, ensure the card is in focus and well lit, and that
            there are less than 4 cards in the image. Sideways cards may be detected incorrectly.
          </Text>
        </>
      )}
    </Paper>
  );
}
