import { getIsOnDemandFieldEnabled } from '@/object-record/record-field/on-demand/utils/getIsOnDemandFieldEnabled';
import { STANDARD_OBJECT_FIELDS } from 'twenty-shared/metadata';
import { FieldMetadataType } from 'twenty-shared/types';

const transcriptField = {
  universalIdentifier:
    STANDARD_OBJECT_FIELDS.callRecording.transcript.universalIdentifier,
  type: FieldMetadataType.RAW_JSON,
  isUIEditable: false,
};

describe('getIsOnDemandFieldEnabled', () => {
  it('enables a registered field when the feature flag is enabled', () => {
    expect(
      getIsOnDemandFieldEnabled({
        isOnDemandFieldsEnabled: true,
        fieldMetadataItem: transcriptField,
      }),
    ).toBe(true);
  });

  it.each([false, undefined])(
    'keeps a registered field disabled when the feature flag is %s',
    (isOnDemandFieldsEnabled) => {
      expect(
        getIsOnDemandFieldEnabled({
          isOnDemandFieldsEnabled,
          fieldMetadataItem: transcriptField,
        }),
      ).toBe(false);
    },
  );

  it('keeps missing field metadata disabled when the feature flag is enabled', () => {
    expect(getIsOnDemandFieldEnabled({ isOnDemandFieldsEnabled: true })).toBe(
      false,
    );
  });
});
