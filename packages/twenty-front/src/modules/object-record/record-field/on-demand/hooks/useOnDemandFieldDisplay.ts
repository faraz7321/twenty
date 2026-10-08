import { useLoadOnDemandFieldValue } from '@/object-record/record-field/on-demand/hooks/useLoadOnDemandFieldValue';
import { type OnDemandFieldLoadResult } from '@/object-record/record-field/on-demand/types/OnDemandFieldLoadResult';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { useContext, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';

export const useOnDemandFieldDisplay = () => {
  const { recordId, fieldDefinition, isForbidden } = useContext(FieldContext);
  const { loadOnDemandFieldValue } = useLoadOnDemandFieldValue();
  const [displayState, setDisplayState] = useState<{
    loadStatus: 'closed' | 'loading' | OnDemandFieldLoadResult;
  }>({ loadStatus: 'closed' });

  const openOnDemandField = async () => {
    if (displayState.loadStatus === 'loading') {
      return;
    }

    if (isForbidden) {
      setDisplayState({ loadStatus: 'forbidden' });
      return;
    }

    const objectNameSingular =
      fieldDefinition.metadata.objectMetadataNameSingular;

    if (!isDefined(objectNameSingular)) {
      setDisplayState({ loadStatus: 'error' });
      return;
    }

    const loadingState: typeof displayState = { loadStatus: 'loading' };
    setDisplayState(loadingState);

    const result = await loadOnDemandFieldValue({
      objectNameSingular,
      recordId,
      fieldMetadataId: fieldDefinition.fieldMetadataId,
    });

    setDisplayState((currentState) =>
      currentState === loadingState ? { loadStatus: result } : currentState,
    );
  };

  const closeOnDemandField = () => {
    setDisplayState({ loadStatus: 'closed' });
  };

  return {
    loadStatus: displayState.loadStatus,
    openOnDemandField,
    closeOnDemandField,
  };
};
