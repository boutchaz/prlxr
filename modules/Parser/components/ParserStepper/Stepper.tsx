import { Button, Group, Stepper } from "@mantine/core";
import React, { useMemo, useState } from "react";
import { BaseRow } from "react-csv-importer";
import {
  Importer,
  ImporterField,
  ImporterFilePreview,
  ImporterProps,
} from "../..";
import useStep from "../../hooks/useStep";
import { LocaleContext } from "../../locale/LocaleContext";
import { useSteps } from "../../provider/Stepper.provider";
import { FieldDef, FieldListSetter } from "../../types";
import { generatePreviewColumns } from "../fields-step/ColumnPreview";
import { FieldsStep } from "../fields-step/FieldsStep";
import { FileSelector } from "../file-step/FileSelector";
import { FileStep } from "../file-step/FileStep";
import { ActionTypes } from "../../reducers/stepsReducer";
import PreviewParser from "../PreviewParser";
const ParserStepper = <Row extends BaseRow>({
  children: content,
}: ImporterProps<Row>) => {
  const [currentStep, helpers] = useStep(4);
  const { state, dispatch } = useSteps();
  const [fields, setFields] = useState<FieldDef[]>([]);

  const FieldDefinitionContext = React.createContext<
    ((setter: FieldListSetter) => void) | null
  >(null);
  const externalPreview = useMemo<ImporterFilePreview | null>(() => {
    // generate stable externally-visible data objects
    const externalColumns =
      state.fileState &&
      generatePreviewColumns(
        state.fileState.firstRows,
        state.fileState.hasHeaders
      );
    return (
      state.fileState &&
      externalColumns && {
        rawData: state.fileState.firstChunk,
        columns: externalColumns,
        skipHeaders: !state.fileState.hasHeaders,
        parseWarning: state.fileState.parseWarning,
      }
    );
  }, [state.fileState]);
  // render provided child content that defines the fields
  const contentNodes = useMemo(() => {
    return typeof content === "function"
      ? content({
          file: state.fileState && state.fileState.file,
          preview: externalPreview,
        })
      : content;
  }, [state.fileState, externalPreview, content]);
  const contentWrap = (
    <FieldDefinitionContext.Provider value={setFields}>
      {contentNodes}
    </FieldDefinitionContext.Provider>
  );
  const customPapaParseConfig = {};
  const assumeNoHeaders = false;
  return (
    <>
      <Stepper
        active={currentStep - 1}
        onStepClick={helpers.setStep}
        breakpoint="sm"
      >
        <Stepper.Step label="First step" description="Import Data">
          {!state.selectedFile ? (
            <FileSelector
              onSelected={(file) =>
                dispatch({ type: "SET_FILE", payload: file })
              }
            />
          ) : <div>{state.selectedFile.name}</div>}
          {/* {!state.fieldsAccepted || state.fieldsState === null ? (
            <>
              <div className="CSVImporter_Importer">
                <FieldsStep
                  fileState={state.fileState}
                  fields={state.fields}
                  prevState={state.fieldsState}
                  onChange={(state) => {
                    // setFieldsState(state);
                  }}
                  onAccept={() => {
                    // setFieldsAccepted(true);
                  }}
                  onCancel={() => {
                    // keep existing preview data and assignments
                    // setFileAccepted(false);
                  }}
                />

                {contentWrap}
              </div>
            </>
          ) : null} */}
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Process Data">
          <PreviewParser />
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Upload Data">
       
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        <Button
          variant="default"
          onClick={() => {
            helpers.goToPrevStep();
          }}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            helpers.goToNextStep();
          }}
        >
          Next step
        </Button>
      </Group>
    </>
  );
};
export default ParserStepper;
