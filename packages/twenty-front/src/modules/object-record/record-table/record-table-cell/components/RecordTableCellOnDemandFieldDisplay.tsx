import { OnDemandJsonFieldViewer } from '@/object-record/record-field/on-demand/components/OnDemandJsonFieldViewer';
import { useOnDemandFieldDisplay } from '@/object-record/record-field/on-demand/hooks/useOnDemandFieldDisplay';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { useFocusedRecordTableRow } from '@/object-record/record-table/hooks/useFocusedRecordTableRow';
import { useRecordTableSelectAllHotkeys } from '@/object-record/record-table/hooks/useRecordTableSelectAllHotkeys';
import { useListenToSidePanelOpening } from '@/ui/layout/side-panel/hooks/useListenToSidePanelOpening';
import { useHotkeysOnFocusedElement } from '@/ui/utilities/hotkey/hooks/useHotkeysOnFocusedElement';
import { styled } from '@linaria/react';
import { useContext, useRef } from 'react';
import { Key } from 'ts-key-enum';

const StyledAnchor = styled.span`
  inset: 0;
  pointer-events: none;
  position: absolute;
`;

type RecordTableCellOnDemandFieldDisplayProps = {
  cellFocusId: string;
};

export const RecordTableCellOnDemandFieldDisplay = ({
  cellFocusId,
}: RecordTableCellOnDemandFieldDisplayProps) => {
  const { isForbidden, fieldDefinition } = useContext(FieldContext);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const { loadStatus, openOnDemandField, closeOnDemandField } =
    useOnDemandFieldDisplay();
  const { restoreRecordTableRowFocusFromCellPosition } =
    useFocusedRecordTableRow();

  useHotkeysOnFocusedElement({
    keys: [Key.Enter, 'space'],
    focusId: cellFocusId,
    callback: () => void openOnDemandField(),
    dependencies: [openOnDemandField],
    options: {
      ignoreEventWhen: () => isForbidden ?? false,
    },
  });

  useHotkeysOnFocusedElement({
    keys: [Key.Escape],
    focusId: cellFocusId,
    callback: () => {
      if (loadStatus !== 'closed') {
        closeOnDemandField();
        return;
      }

      restoreRecordTableRowFocusFromCellPosition();
    },
    dependencies: [
      closeOnDemandField,
      loadStatus,
      restoreRecordTableRowFocusFromCellPosition,
    ],
  });

  useRecordTableSelectAllHotkeys({ focusId: cellFocusId });
  useListenToSidePanelOpening(closeOnDemandField);

  if (isForbidden) {
    return null;
  }

  return (
    <>
      <StyledAnchor
        ref={anchorRef}
        tabIndex={-1}
        aria-label={fieldDefinition.label}
      />
      {loadStatus !== 'closed' && (
        <OnDemandJsonFieldViewer
          anchorElement={anchorRef.current ?? undefined}
          loadStatus={loadStatus}
          onClose={closeOnDemandField}
          onRetry={() => void openOnDemandField()}
        />
      )}
    </>
  );
};
