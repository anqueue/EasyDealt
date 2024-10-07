import { KEYBINDINGS_STATE, SETTINGS_STATE } from "@/Root";
import { Button, Flex } from "@mantine/core";
import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, copyFile, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useRecoilState } from "recoil";

export default function OtherSettings() {
  const [settings, setSettings] = useRecoilState(SETTINGS_STATE);
  const [keybindings, setKeybindings] = useRecoilState(KEYBINDINGS_STATE);

  return (
    <Flex gap={5}>
      <Button
        size="compact-sm"
        variant="light"
        onClick={() => {
          setSettings({ ...settings, debug: !settings.debug });
          if (!settings.debug) {
            window.scrollTo(0, 0);
          }
        }}
      >
        {settings.debug ? "Close" : "Open"} Developer Tools
      </Button>
      <Button
        size="compact-sm"
        variant="light"
        onClick={() => {
          writeTextFile("keybindings.json", JSON.stringify(keybindings, null, 2), {
            baseDir: BaseDirectory.Desktop,
          });
          alert("Keybindings exported to your Desktop");
        }}
      >
        Export Keybindings to JSON
      </Button>
      <Button
        size="compact-sm"
        variant="light"
        onClick={async () => {
          const file = await open({
            directory: false,
            multiple: false,
          });

          if (!file) {
            return;
          }

          if (typeof file === "string") {
            const contents = await readTextFile(file);

            let parsed = null;
            try {
              parsed = JSON.parse(contents);
            } catch (e) {
              alert("Invalid file");
              return;
            }

            setKeybindings(parsed);
          } else {
            alert("Invalid file");
            return;
          }
        }}
      >
        Import Keybindings from JSON
      </Button>
      <Button
        size="compact-sm"
        variant="light"
        onClick={() => {
          copyFile(".data", `${Date.now()}.data`, {
            toPathBaseDir: BaseDirectory.AppConfig,
            fromPathBaseDir: BaseDirectory.AppConfig,
          });
        }}
      >
        Backup Data
      </Button>
    </Flex>
  );
}
