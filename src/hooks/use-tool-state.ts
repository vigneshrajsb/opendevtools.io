import { useCallback } from "react";
import { useToolPreferences } from "@/lib/stores/tool-preferences";
import type { ToolPath } from "@/lib/tools-config";

export function useToolState(toolPath: ToolPath) {
  const { toolStates, setToolInput, setToolSetting, clearToolState } =
    useToolPreferences();
  const state = toolStates[toolPath];

  const setInput = useCallback(
    (input: string) => setToolInput(toolPath, input),
    [toolPath, setToolInput]
  );

  const setSetting = useCallback(
    (key: string, value: string) => setToolSetting(toolPath, key, value),
    [toolPath, setToolSetting]
  );

  const clear = useCallback(
    () => clearToolState(toolPath),
    [toolPath, clearToolState]
  );

  return {
    input: state?.input ?? "",
    settings: state?.settings ?? {},
    setInput,
    setSetting,
    clear,
  };
}
