import { useEffect, useRef, useState } from "react";
import {
  CustomizablePapaParseConfig,
  parsePreview,
  PreviewResults,
} from "../parser";
import { useSteps } from "../provider/Stepper.provider";
import { FileStepState } from "../types";

const usePreview = (
  onChange: (state: FileStepState | null) => void,
  customConfig?: CustomizablePapaParseConfig
) => {
  const { state } = useSteps();

  // seed from previous state as needed
  const [selectedFile, setSelectedFile] = useState<File | null>(
    state.selectedFile ? state.selectedFile : null
  );

  const [preview, setPreview] = useState<PreviewResults | null>(
    () =>
    state.fileState && {
        parseError: undefined,
        ...state.fileState,
      }
  );

  const [papaParseConfig, setPapaParseConfig] = useState(
    state.fileState ? state.fileState.papaParseConfig : customConfig
  );

  const [hasHeaders, setHasHeaders] = useState(
    state.fileState ? state.fileState.hasHeaders : false
  );

  // wrap in ref to avoid triggering effect
  const customConfigRef = useRef(customConfig);
  customConfigRef.current = customConfig;
  const assumeNoHeadersRef = useRef(false);
  assumeNoHeadersRef.current = false;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // notify of current state
  useEffect(() => {
    onChangeRef.current(
      preview && !preview.parseError
        ? { ...preview, papaParseConfig, hasHeaders }
        : null
    );
  }, [preview, papaParseConfig, hasHeaders]);

  // perform async preview parse once for the given file
  const asyncLockRef = useRef<number>(0);
  useEffect(() => {
    // clear other state when file selector is reset
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    // preserve existing state when parsing for this file is already complete
    if (preview && preview.file === selectedFile) {
      return;
    }

    const oplock = asyncLockRef.current;

    // lock in the current PapaParse config instance for use in multiple spots
    const config = customConfigRef.current;

    // kick off the preview parse
    parsePreview(selectedFile, config,20).then((results) => {
      // ignore if stale
      if (oplock !== asyncLockRef.current) {
        return;
      }

      // save the results and the original config
      setPreview(results);
      setPapaParseConfig(config);

      // pre-fill headers flag (only possible with >1 lines)
      setHasHeaders(
        results.parseError
          ? false
          : !assumeNoHeadersRef.current && !results.isSingleLine
      );
    });

    return () => {
      // invalidate current oplock on change or unmount
      asyncLockRef.current += 1;
    };
  }, [selectedFile, preview]);
  return [preview, papaParseConfig, hasHeaders, setSelectedFile];
};

export default usePreview;
