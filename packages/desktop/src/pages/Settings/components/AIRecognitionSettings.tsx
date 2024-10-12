import { SETTINGS_STATE } from "@/Root";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Collapse,
  Grid,
  Input,
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
              <Input
                value={settings.roboflowModelVersion}
                placeholder="Enter your Roboflow Model Version"
                onChange={(event) => {
                  setSettings({
                    ...settings,
                    roboflowModelVersion: parseInt(event.currentTarget.value),
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
      </Collapse>

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
