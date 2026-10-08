import { getObjectPermissionsForObject } from '@/object-metadata/utils/getObjectPermissionsForObject';
import { ON_DEMAND_FIELD_STORY_RECORD_FIELDS } from '@/object-record/record-field/on-demand/testing/seedOnDemandCollectionFieldStory';
import { ON_DEMAND_FIELD_STORY_OBJECT_METADATA } from '@/object-record/record-field/on-demand/testing/seedOnDemandFieldStory';
import { RecordTableBodyContextProvider } from '@/object-record/record-table/components/RecordTableBodyContextProvider';
import {
  getRecordTableColumnWidthInlineStyles,
  RecordTableStyleWrapper,
} from '@/object-record/record-table/components/RecordTableStyleWrapper';
import { RecordTableContextProvider } from '@/object-record/record-table/contexts/RecordTableContext';
import { RecordTableBodyFocusKeyboardEffect } from '@/object-record/record-table/record-table-body/components/RecordTableBodyFocusKeyboardEffect';
import { RecordTableCellPortals } from '@/object-record/record-table/record-table-cell/components/RecordTableCellPortals';
import { useMoveHoverToCurrentCell } from '@/object-record/record-table/record-table-cell/hooks/useMoveHoverToCurrentCell';
import { RecordTableRowCells } from '@/object-record/record-table/record-table-row/components/RecordTableRowCells';
import { RecordTableStaticTr } from '@/object-record/record-table/record-table-row/components/RecordTableStaticTr';
import { recordTableHoverPositionComponentState } from '@/object-record/record-table/states/recordTableHoverPositionComponentState';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { type MouseEvent } from 'react';
import { isDefined } from 'twenty-shared/utils';

type OnDemandRecordTableStoryProps = { recordId: string };

export const OnDemandRecordTableStory = ({
  recordId,
}: OnDemandRecordTableStoryProps) => {
  const setRecordTableHoverPosition = useSetAtomComponentState(
    recordTableHoverPositionComponentState,
  );
  const { moveHoverToCurrentCell } =
    useMoveHoverToCurrentCell('on-demand-story');

  const handleMouseMove = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const cellElement = event.target.closest<HTMLElement>(
      '[data-record-table-col]',
    );

    if (!isDefined(cellElement)) {
      return;
    }

    moveHoverToCurrentCell({
      column: Number(cellElement.dataset.recordTableCol),
      row: Number(cellElement.dataset.recordTableRow),
    });
  };

  return (
    <RecordTableContextProvider
      value={{
        recordTableId: 'on-demand-story',
        viewBarId: 'on-demand-story',
        objectNameSingular: 'callRecording',
        objectMetadataItem: ON_DEMAND_FIELD_STORY_OBJECT_METADATA,
        objectMetadataItems: [ON_DEMAND_FIELD_STORY_OBJECT_METADATA],
        objectPermissions: getObjectPermissionsForObject(
          {},
          ON_DEMAND_FIELD_STORY_OBJECT_METADATA.id,
        ),
        isObjectReadOnly: false,
        visibleRecordFields: ON_DEMAND_FIELD_STORY_RECORD_FIELDS,
        triggerEvent: 'CLICK',
      }}
    >
      <RecordTableBodyContextProvider>
        <RecordTableStyleWrapper
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRecordTableHoverPosition(null)}
          style={getRecordTableColumnWidthInlineStyles({
            visibleRecordFields: ON_DEMAND_FIELD_STORY_RECORD_FIELDS,
            isDragColumnHidden: true,
            isCheckboxColumnHidden: true,
          })}
        >
          <RecordTableBodyFocusKeyboardEffect />
          <RecordTableStaticTr recordId={recordId} focusIndex={0}>
            <RecordTableRowCells rowIndexForFocus={0} />
          </RecordTableStaticTr>
          <RecordTableCellPortals />
        </RecordTableStyleWrapper>
      </RecordTableBodyContextProvider>
    </RecordTableContextProvider>
  );
};
