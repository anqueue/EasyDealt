import { SETTINGS_STATE } from "@/Root";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Collapse,
  Grid,
  Input,
  InputWrapper,
  NumberInput,
  PasswordInput,
  Select,
  Slider,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandGoogle,
  IconCamera,
  IconCameraOff,
  IconCircleLetterR,
  IconSparkles,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function AIRecognitionSettings() {
  const [settings, setSettings] = useRecoilState(SETTINGS_STATE);

  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback(
    (mediaDevices: any) =>
      setDevices(mediaDevices.filter(({ kind }: any) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <>
      <Title order={2}>
        <IconSparkles /> AI Card Recognition
      </Title>
      <Text size="sm" c="dimmed">
        Use Google's Gemini AI or Roboflow Object Detection to detect playing cards through your
        webcam. Additional terms and conditions apply.
      </Text>
      <Text size="sm" c="dimmed" mt="xs">
        <span style={{ fontWeight: "bold" }}>Gemini:</span> You can get your Generative Language
        Client API key from aistudio.google.com. The free tier is sufficient for this application.
      </Text>
      <Text size="sm" c="dimmed">
        <span style={{ fontWeight: "bold" }}>Roboflow:</span> You can get your Publishable API key
        from app.roboflow.com. The free tier is sufficient for this application.
      </Text>

      <Text size="sm" c="dimmed" mt="xs">
        Roboflow is recommended because it is more accurate and faster, however it uses significant
        CPU and RAM. Roboflow is continuously detecting while Gemini only detects when you click the
        video.
      </Text>

      <Text size="sm" c="dimmed" mt="xs" fw="bold">
        It is recommended to toggle off and on the Camera Menu after changing recognition settings.
      </Text>
      <Input.Wrapper
        label="Enable Camera Menu"
        description="Show the menu to preview and capture images from the camera. The menu will be on the opposite side of the touchscreen menu."
        mt="sm"
        mb="sm"
      >
        <ButtonGroup mt={5}>
          <Button
            variant={settings.cameraMenu ? "filled" : "default"}
            leftSection={<IconCamera />}
            onClick={() => {
              setSettings({ ...settings, cameraMenu: true });
            }}
          >
            On
          </Button>
          <Button
            variant={!settings.cameraMenu ? "filled" : "default"}
            leftSection={<IconCameraOff />}
            onClick={() => {
              setSettings({ ...settings, cameraMenu: false });
            }}
          >
            Off
          </Button>
        </ButtonGroup>
      </Input.Wrapper>
      <Input.Wrapper
        label="Card Recognition Mode"
        description="Choose between Google's Gemini AI or Roboflow Object Detection"
        mt="sm"
        mb="sm"
      >
        <ButtonGroup mt={5}>
          <Button
            variant={settings.cardRecognitionMode == "GEMINI" ? "filled" : "default"}
            leftSection={<IconBrandGoogle />}
            onClick={() => {
              setSettings({ ...settings, cardRecognitionMode: "GEMINI" });
            }}
          >
            Gemini
          </Button>
          <Button
            variant={settings.cardRecognitionMode == "ROBOFLOW" ? "filled" : "default"}
            leftSection={<IconCircleLetterR />}
            onClick={() => {
              setSettings({ ...settings, cardRecognitionMode: "ROBOFLOW" });
            }}
          >
            Roboflow
          </Button>
        </ButtonGroup>
      </Input.Wrapper>

      <Collapse in={settings.cardRecognitionMode === "GEMINI"}>
        <Input.Wrapper label="Gemini API Key">
          <Grid>
            <Grid.Col span={{ base: 8 }}>
              <PasswordInput
                value={settings.geminiApiKey}
                placeholder="Enter your Gemini API Key"
                onChange={(event) => {
                  setSettings({ ...settings, geminiApiKey: event.currentTarget.value });
                }}
              />
            </Grid.Col>
          </Grid>
        </Input.Wrapper>
      </Collapse>

      <Collapse in={settings.cardRecognitionMode === "ROBOFLOW"}>
        <Input.Wrapper label="Roboflow Publishable Key">
          <Grid>
            <Grid.Col span={{ base: 8 }}>
              <PasswordInput
                value={settings.roboflowPublishableKey}
                placeholder="Enter your Roboflow Publishable Key"
                onChange={(event) => {
                  setSettings({ ...settings, roboflowPublishableKey: event.currentTarget.value });
                }}
              />
            </Grid.Col>
          </Grid>
        </Input.Wrapper>

        <Input.Wrapper
          label="Roboflow Model ID"
          description="Default: card-detection-zk7wu-gzidp"
          mt="xs"
        >
          <Grid>
            <Grid.Col span={{ base: 6 }}>
              <Input
                value={settings.roboflowModelId}
                placeholder="Enter your Roboflow Model ID"
                onChange={(event) => {
                  setSettings({ ...settings, roboflowModelId: event.currentTarget.value });
                }}
              />
            </Grid.Col>
          </Grid>
        </Input.Wrapper>

        <Input.Wrapper label="Roboflow Model Version" description="Default: 1" mt="xs">
          <Grid>
            <Grid.Col span={{ base: 4 }}>
              <NumberInput
                mt={5}
                value={settings.roboflowModelVersion}
                placeholder="Enter your Roboflow Model Version"
                onChange={(value) => {
                  setSettings({
                    ...settings,
                    roboflowModelVersion: parseInt(`${value}`),
                  });
                }}
              />
            </Grid.Col>
          </Grid>
        </Input.Wrapper>

        <Input.Wrapper
          label="Roboflow Frame Rate"
          description="If your device is too slow to handle a consistent frame rate, you may want to set this value to -1 and manually capture images by tapping the video."
          mt="xs"
        >
          <Grid>
            <Grid.Col span={{ base: 4 }}>
              <NumberInput
                mt={5}
                value={settings.roboflowFrameRate}
                placeholder="Enter your Roboflow Frame Rate"
                onChange={(value) => {
                  setSettings({
                    ...settings,
                    roboflowFrameRate: parseInt(`${value}`),
                  });
                }}
              />
            </Grid.Col>
          </Grid>
        </Input.Wrapper>

        <Checkbox
          mt="sm"
          radius="sm"
          size="sm"
          label="Show Detection Overlay"
          description="Show the bounding boxes around the detected cards, may flicker"
          checked={settings.roboflowShowOverlay}
          onChange={(event) => {
            setSettings({ ...settings, roboflowShowOverlay: event.currentTarget.checked });
          }}
        />

        <Input.Wrapper
          label="Roboflow Minimum Confidence"
          description="The minimum confidence level required to detect a card"
          mt="sm"
        >
          <Slider
            mt="xs"
            defaultValue={settings.roboflowMinimumConfidence}
            min={0}
            max={1}
            step={0.01}
            marks={[
              {
                label: "0%",
                value: 0,
              },
              {
                label: "50%",
                value: 0.5,
              },
              {
                label: "100%",
                value: 1,
              },
            ]}
            onChangeEnd={(value) => {
              setSettings({ ...settings, roboflowMinimumConfidence: value });
            }}
          />
        </Input.Wrapper>
      </Collapse>

      <Input.Wrapper
        mb="xl"
        label="Camera Scaling Factor"
        description="Lower values will reduce CPU and RAM usage but may reduce recognition accuracy. 1x is 640x480"
        mt="sm"
      >
        <Slider
          mt="xs"
          defaultValue={settings.cameraDownscalingFactor}
          min={0.1}
          max={3}
          step={0.1}
          marks={[
            {
              label: "0.1x",
              value: 0.1,
            },
            {
              label: "0.5x",
              value: 0.5,
            },
            {
              label: "1x",
              value: 1,
            },
            {
              label: "2x",
              value: 2,
            },
            {
              label: "3x",
              value: 3,
            },
          ]}
          onChangeEnd={(value) => {
            setSettings({ ...settings, cameraDownscalingFactor: value });
          }}
        />
      </Input.Wrapper>

      <Input.Wrapper
        mb="xl"
        label="Camera Menu Width"
        description="Certain UI elements may look weird at low and high percents"
        mt="sm"
      >
        <Slider
          mt="xs"
          defaultValue={settings.cameraMenuWidth}
          min={15}
          max={85}
          step={5}
          marks={[
            {
              label: "15%",
              value: 15,
            },
            {
              label: "30%",
              value: 30,
            },
            {
              label: "45%",
              value: 45,
            },
            {
              label: "60%",
              value: 60,
            },
            {
              label: "75%",
              value: 75,
            },
            {
              label: "85%",
              value: 85,
            },
          ]}
          onChangeEnd={(value) => {
            setSettings({ ...settings, cameraMenuWidth: value });
          }}
        />
      </Input.Wrapper>
      <Input.Wrapper mt="sm" label="Camera Source">
        <Select
          data={devices.map((device: any) => ({
            value: device.deviceId,
            label: device.label || `Camera ${device.deviceId}`,
          }))}
          defaultValue={settings.cameraDeviceId}
          allowDeselect={false}
          placeholder={
            settings.cameraDeviceId !== ""
              ? (
                  devices.find((device: any) => device.deviceId === settings.cameraDeviceId) || {
                    label: "Select Camera",
                  }
                ).label
              : "Select Camera"
          }
          onChange={(value) => {
            setSettings({ ...settings, cameraDeviceId: value as string });
          }}
        />
      </Input.Wrapper>
      <Checkbox
        mt="sm"
        radius="sm"
        size="md"
        label="Mirrored"
        checked={settings.cameraFlipHorizontal}
        onChange={(event) => {
          setSettings({ ...settings, cameraFlipHorizontal: event.currentTarget.checked });
        }}
      />
    </>
  );
}
