import { getEagerRecordFieldMetadataItems } from '@/object-record/record-field/on-demand/utils/getEagerRecordFieldMetadataItems';
import { STANDARD_OBJECT_FIELDS } from 'twenty-shared/metadata';
import { FieldMetadataType } from 'twenty-shared/types';

const titleField = {
  id: 'title-field',
  universalIdentifier:
    STANDARD_OBJECT_FIELDS.callRecording.title.universalIdentifier,
  type: FieldMetadataType.TEXT,
  isUIEditable: true,
};

const transcriptField = {
  id: 'transcript-field',
  universalIdentifier:
    STANDARD_OBJECT_FIELDS.callRecording.transcript.universalIdentifier,
  type: FieldMetadataType.RAW_JSON,
  isUIEditable: false,
};

describe('getEagerRecordFieldMetadataItems', () => {
  it('omits on-demand display fields from existing saved views', () => {
    expect(
      getEagerRecordFieldMetadataItems({
        visibleFieldMetadataItems: [titleField, transcriptField],
        requiredFieldMetadataItems: [],
        isOnDemandFieldsEnabled: true,
      }),
    ).toEqual([titleField]);
  });

  it('preserves current selections when the feature flag is disabled', () => {
    expect(
      getEagerRecordFieldMetadataItems({
        visibleFieldMetadataItems: [titleField, transcriptField],
        requiredFieldMetadataItems: [],
        isOnDemandFieldsEnabled: false,
      }),
    ).toEqual([titleField, transcriptField]);
  });

  it('keeps a transcript needed for local filter matching', () => {
    expect(
      getEagerRecordFieldMetadataItems({
        visibleFieldMetadataItems: [titleField, transcriptField],
        requiredFieldMetadataItems: [transcriptField],
        isOnDemandFieldsEnabled: true,
      }),
    ).toEqual([titleField, transcriptField]);
  });

  it('keeps hidden required fields and deduplicates visible dependencies', () => {
    expect(
      getEagerRecordFieldMetadataItems({
        visibleFieldMetadataItems: [titleField],
        requiredFieldMetadataItems: [titleField, transcriptField],
        isOnDemandFieldsEnabled: true,
      }),
    ).toEqual([titleField, transcriptField]);
  });

  it('keeps other JSON fields and editable values eager', () => {
    const otherJsonField = {
      ...transcriptField,
      id: 'other-json-field',
      universalIdentifier: 'custom-transcript',
    };
    const editableTranscriptField = { ...transcriptField, isUIEditable: true };

    expect(
      getEagerRecordFieldMetadataItems({
        visibleFieldMetadataItems: [otherJsonField, editableTranscriptField],
        requiredFieldMetadataItems: [],
        isOnDemandFieldsEnabled: true,
      }),
    ).toEqual([otherJsonField, editableTranscriptField]);
  });
});
