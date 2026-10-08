import { OnDemandJsonFieldDisplay } from '@/object-record/record-field/on-demand/components/OnDemandJsonFieldDisplay';
import {
  ON_DEMAND_FIELD_STORY_DEFINITION,
  ON_DEMAND_FIELD_STORY_NEXT_RECORD_ID,
  ON_DEMAND_FIELD_STORY_RECORD_ID,
} from '@/object-record/record-field/on-demand/testing/seedOnDemandFieldStory';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { useState } from 'react';
import { Button } from 'twenty-ui/primitives/input';

type OnDemandFieldStoryProps = {
  isForbidden?: boolean;
  allowRecordChange?: boolean;
  onRecordClick?: () => void;
};

export const OnDemandFieldStory = ({
  isForbidden = false,
  allowRecordChange = false,
  onRecordClick,
}: OnDemandFieldStoryProps) => {
  const [recordId, setRecordId] = useState(ON_DEMAND_FIELD_STORY_RECORD_ID);

  return (
    <FieldContext.Provider
      value={{
        recordId,
        fieldDefinition: ON_DEMAND_FIELD_STORY_DEFINITION,
        isLabelIdentifier: false,
        isRecordFieldReadOnly: true,
        isForbidden,
      }}
    >
      <div onClick={onRecordClick}>
        <OnDemandJsonFieldDisplay
          key={`${recordId}-${ON_DEMAND_FIELD_STORY_DEFINITION.fieldMetadataId}`}
        />
      </div>
      {allowRecordChange && (
        <Button
          onClick={() => setRecordId(ON_DEMAND_FIELD_STORY_NEXT_RECORD_ID)}
        >
          Show next record
        </Button>
      )}
    </FieldContext.Provider>
  );
};
