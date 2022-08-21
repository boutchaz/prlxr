import React from 'react';

import { TextButton } from '../TextButton';

import { useLocale } from '../../locale/LocaleContext';

export const FormatErrorMessage: React.FC<{
  onCancelClick: () => void;
  // eslint-disable-next-line react/display-name
}> = React.memo(({ onCancelClick, children }) => {
  const l10n = useLocale('fileStep');
  return (
    <div className="CSVImporter_FormatErrorMessage">
      <span>{children}</span>
      <TextButton onClick={onCancelClick}>{l10n.goBackButton}</TextButton>
    </div>
  );
});
