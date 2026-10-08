import { currentUserWorkspaceState } from '@/auth/states/currentUserWorkspaceState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { type FieldJsonValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { STANDARD_OBJECT_FIELDS } from 'twenty-shared/metadata';
import { mockedUserData } from '~/testing/mock-data/users';
import { getMockFieldMetadataItemOrThrow } from '~/testing/utils/getMockFieldMetadataItemOrThrow';
import { getMockObjectMetadataItemOrThrow } from '~/testing/utils/getMockObjectMetadataItemOrThrow';
import { setTestObjectMetadataItemsInMetadataStore } from '~/testing/utils/setTestObjectMetadataItemsInMetadataStore';

const WORKFLOW_RUN_METADATA = getMockObjectMetadataItemOrThrow('workflowRun');
const RAW_JSON_METADATA = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: WORKFLOW_RUN_METADATA,
  fieldName: 'state',
});

const TRANSCRIPT_METADATA = {
  ...RAW_JSON_METADATA,
  name: 'transcript',
  label: 'Transcript',
  isUIEditable: false,
  universalIdentifier:
    STANDARD_OBJECT_FIELDS.callRecording.transcript.universalIdentifier,
};

export const ON_DEMAND_FIELD_STORY_OBJECT_METADATA: EnrichedObjectMetadataItem =
  {
    ...WORKFLOW_RUN_METADATA,
    nameSingular: 'callRecording',
    namePlural: 'callRecordings',
    labelSingular: 'Call recording',
    labelPlural: 'Call recordings',
    fields: WORKFLOW_RUN_METADATA.fields.map((field) =>
      field.id === TRANSCRIPT_METADATA.id ? TRANSCRIPT_METADATA : field,
    ),
  };

export const ON_DEMAND_FIELD_STORY_DEFINITION =
  formatFieldMetadataItemAsColumnDefinition({
    field: TRANSCRIPT_METADATA,
    objectMetadataItem: ON_DEMAND_FIELD_STORY_OBJECT_METADATA,
    position: 1,
  });

export const ON_DEMAND_FIELD_STORY_RECORD_ID =
  '36d325f0-6932-4e9b-bab6-8e397fb01d48';
export const ON_DEMAND_FIELD_STORY_NEXT_RECORD_ID =
  'b361ed6b-9e26-41a8-a860-847c456fc5a2';
export const ON_DEMAND_FIELD_STORY_UPDATED_AT = '2026-01-01T00:00:00.000Z';

export const seedOnDemandFieldStory = (
  options: { value?: FieldJsonValue } = {},
) => {
  setTestObjectMetadataItemsInMetadataStore(jotaiStore, [
    ON_DEMAND_FIELD_STORY_OBJECT_METADATA,
  ]);
  jotaiStore.set(currentWorkspaceState.atom, {
    ...mockedUserData.currentWorkspace,
    workspaceCustomApplication:
      mockedUserData.currentWorkspace.workspaceCustomApplication ?? null,
    installedApplications: [],
  });
  jotaiStore.set(
    currentWorkspaceMemberState.atom,
    mockedUserData.workspaceMember,
  );
  jotaiStore.set(
    currentUserWorkspaceState.atom,
    mockedUserData.currentUserWorkspace,
  );

  for (const recordId of [
    ON_DEMAND_FIELD_STORY_RECORD_ID,
    ON_DEMAND_FIELD_STORY_NEXT_RECORD_ID,
  ]) {
    jotaiStore.set(recordStoreFamilyState.atomFamily(recordId), {
      id: recordId,
      __typename: 'CallRecording',
      name: 'Customer call',
      updatedAt: ON_DEMAND_FIELD_STORY_UPDATED_AT,
      ...(Object.hasOwn(options, 'value') ? { transcript: options.value } : {}),
    });
  }
};
