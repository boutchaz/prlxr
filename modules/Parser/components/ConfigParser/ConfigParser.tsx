import { MultiSelect } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { BaseRow, excludeColumns, FieldAssignmentMap } from "../../parser";
import { useSteps } from "../../provider/Stepper.provider";
import { FieldDef } from "../../types";
import {
  Column,
  generatePreviewColumns,
  generateColumnCode,
} from "../fields-step/ColumnPreview";

const ConfigParser = () => {
  const { state } = useSteps();
  const [headers, setHeaders] = useState<string[]>([]);
  const [fields, setFields] = useState<FieldDef[]>([]);
  useEffect(() => {
    if (state?.fileState?.hasHeaders) {
      setHeaders(state?.fileState?.firstRows[0]);
    }
  }, []);
  const columns = useMemo<Column[]>(
    () =>
      state?.fileState &&
      generatePreviewColumns(
        state?.fileState?.firstRows,
        state?.fileState?.hasHeaders
      ).map((item) => ({ ...item, code: generateColumnCode(item.index) })),
    [state.fileState]
  );
  const initialAssignments = useMemo<FieldAssignmentMap>(() => {
    // prep insensitive/fuzzy match stems for known columns
    // (this is ignored if there is already previous state to seed from)
    const columnStems = columns?.map((column) => {
      const trimmed = column.header && column.header.trim();

      if (!trimmed) {
        return undefined;
      }

      return trimmed.toLowerCase();
    });

    // pre-assign corresponding fields
    const result: FieldAssignmentMap = {};
    const assignedColumnIndexes: boolean[] = [];

    fields.forEach((field) => {
      // find by field stem
      const fieldLabelStem = field.label.trim().toLowerCase(); // @todo consider normalizing other whitespace/non-letters

      const matchingColumnIndex = columnStems.findIndex(
        (columnStem, columnIndex) => {
          // no headers or no meaningful stem value
          if (columnStem === undefined) {
            return false;
          }

          // always check against assigning twice
          if (assignedColumnIndexes[columnIndex]) {
            return false;
          }

          return columnStem === fieldLabelStem;
        }
      );

      // assign if found
      if (matchingColumnIndex !== -1) {
        assignedColumnIndexes[matchingColumnIndex] = true;
        result[field.name] = matchingColumnIndex;
      }
    });

    return result;
  }, [fields, columns]);
  console.log(initialAssignments);
  
  const onChangeHandler = (columns: string[]) => {
    let data: any[] = []
    excludeColumns(state.fileState, columns, (res,info) => {
      data = [...data, ...res]
    }).then((res) => {
      console.log(data);
    });
  };
  return (
    <>
      <MultiSelect
        data={headers.map((header) => ({ value: header, label: header }))}
        label="Pick columns to exclude"
        placeholder="Pick columns to exclude"
        onChange={onChangeHandler}
      />
    </>
  );
};

export default ConfigParser;
