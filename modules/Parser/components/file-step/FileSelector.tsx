import React, { useCallback, useRef } from 'react';
import { useLocale } from '../../locale/LocaleContext';
import { Group, Text, useMantineTheme } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, DropzoneProps, MS_EXCEL_MIME_TYPE } from '@mantine/dropzone';

export const FileSelector: React.FC<{ onSelected: (file: File) => void }> = ({
  onSelected
}) => {
  const theme = useMantineTheme();
  const onSelectedRef = useRef(onSelected);
  onSelectedRef.current = onSelected;

  const dropHandler = useCallback((acceptedFiles: File[]) => {
    // silently ignore if nothing to do
    if (acceptedFiles.length < 1) {
      return;
    }

    const file = acceptedFiles[0];
    onSelectedRef.current(file);
  }, []);

  const l10n = useLocale('fileStep');

  return (
    <>
    <Dropzone
      onDrop={(files) => dropHandler(files)}
      onReject={(files) => console.log('rejected files', files)}
      accept={["text/csv"]}
    >
      <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size={50} stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
    </>
  );
};
