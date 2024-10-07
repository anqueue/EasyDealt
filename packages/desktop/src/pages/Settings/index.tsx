import GeneralSettings from "./components/GeneralSettings";
import PokerSettings from "./components/PokerSettings";
import BlackjackSettings from "./components/BlackjackSettings";
import { Divider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Text } from "@mantine/core";
import AIRecognitionSettings from "./components/AIRecognitionSettings";
import OtherSettings from "./components/OtherSettings";
import { app } from "@tauri-apps/api";

let appVersion = "<unknown>";
let tauriVersion = "<unknown>";
app.getVersion().then((v) => {
  appVersion = v;
});

app.getTauriVersion().then((v) => {
  tauriVersion = v;
});

export default function Settings() {
  const [firstTime, setFirstTime] = useLocalStorage({
    key: "first-time",
    defaultValue: true,
  });

  return (
    <>
      <GeneralSettings />
      <Divider my="sm" />
      <BlackjackSettings />
      <Divider my="sm" />
      <PokerSettings />
      <Divider my="sm" />
      <AIRecognitionSettings />
      <Divider my="sm" />
      <OtherSettings />
      <Text size="sm" c="dimmed">
        v{appVersion} (Tauri v{tauriVersion})
      </Text>
      {!firstTime && (
        <Text
          mb="md"
          style={{
            cursor: "pointer",
          }}
          onClick={() => setFirstTime(true)}
        >
          You have agreed to the License and Disclaimer. Click to view again (this will NOT void
          your agreement, it's just for your reference).
        </Text>
      )}
    </>
  );
}
