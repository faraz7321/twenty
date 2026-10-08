import { isOnDemandField } from '@/object-record/record-field/on-demand/utils/isOnDemandField';
import { STANDARD_OBJECT_FIELDS } from 'twenty-shared/metadata';
import { FieldMetadataType } from 'twenty-shared/types';

const transcriptField = {
  universalIdentifier:
    STANDARD_OBJECT_FIELDS.callRecording.transcript.universalIdentifier,
  type: FieldMetadataType.RAW_JSON,
  isUIEditable: false,
};

describe('isOnDemandField', () => {
  it('recognizes the built-in transcript by its universal identifier', () => {
    expect(isOnDemandField(transcriptField)).toBe(true);
  });

  it('keeps unrelated JSON fields eager', () => {
    expect(
      isOnDemandField({
        ...transcriptField,
        universalIdentifier: 'custom-transcript',
      }),
    ).toBe(false);
  });

  it.each([true, undefined, null])(
    'does not defer fields without explicit read-only metadata (%s)',
    (isUIEditable) => {
      expect(isOnDemandField({ ...transcriptField, isUIEditable })).toBe(false);
    },
  );

  it('does not defer unsupported field types', () => {
    expect(
      isOnDemandField({ ...transcriptField, type: FieldMetadataType.TEXT }),
    ).toBe(false);
  });
});
