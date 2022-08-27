import usePreview from "../../hooks/usePreview";
import { useSteps } from "../../provider/Stepper.provider";
import ConfigParser from "../ConfigParser/ConfigParser";
import { FormatDataRowPreview } from "../file-step/FormatDataRowPreview";

const PreviewParser = () => {
  const { dispatch } = useSteps();
  const [preview] = usePreview(
    (parsedPreview: any) => {
      dispatch({ type: "SET_FILE_STATE", payload: parsedPreview });
    },
    { encoding: "utf8" }
  );
  return (
    <div>
      <ConfigParser />
      {preview && (
        <FormatDataRowPreview hasHeaders={true} rows={preview.firstRows} />
      )}
    </div>
  );
};
export default PreviewParser;
