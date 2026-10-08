import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { isOnDemandField } from '@/object-record/record-field/on-demand/utils/isOnDemandField';
import { filterDuplicatesById } from 'twenty-shared/utils';

export const getEagerRecordFieldMetadataItems = <
  TFieldMetadata extends Pick<
    FieldMetadataItem,
    'id' | 'universalIdentifier' | 'type' | 'isUIEditable'
  >,
>({
  visibleFieldMetadataItems,
  requiredFieldMetadataItems,
  isOnDemandFieldsEnabled,
}: {
  visibleFieldMetadataItems: TFieldMetadata[];
  requiredFieldMetadataItems: TFieldMetadata[];
  isOnDemandFieldsEnabled: boolean;
}): TFieldMetadata[] =>
  [
    ...visibleFieldMetadataItems.filter(
      (field) => !isOnDemandFieldsEnabled || !isOnDemandField(field),
    ),
    ...requiredFieldMetadataItems,
  ].filter(filterDuplicatesById);
