import { OnDemandJsonFieldValue } from '@/object-record/record-field/on-demand/components/OnDemandJsonFieldValue';
import { type OnDemandFieldLoadResult } from '@/object-record/record-field/on-demand/types/OnDemandFieldLoadResult';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { ExpandedFieldDisplay } from '@/ui/layout/expandable-list/components/ExpandedFieldDisplay';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { useContext, useRef } from 'react';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledViewer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  min-height: 0;
`;

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

type OnDemandJsonFieldViewerProps = {
  anchorElement?: HTMLElement;
  loadStatus: 'loading' | OnDemandFieldLoadResult;
  onClose: () => void;
  onRetry: () => void;
};

export const OnDemandJsonFieldViewer = ({
  anchorElement,
  loadStatus,
  onClose,
  onRetry,
}: OnDemandJsonFieldViewerProps) => {
  const { fieldDefinition, isForbidden } = useContext(FieldContext);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isReadForbidden = isForbidden || loadStatus === 'forbidden';
  const isError = loadStatus === 'error' || loadStatus === 'stale';
  const handleClose = () => {
    onClose();
    anchorElement?.focus();
  };

  const content = () => {
    if (isReadForbidden) {
      return (
        <span role="alert">{t`You do not have access to this value.`}</span>
      );
    }

    if (loadStatus === 'loading') {
      return <span role="status">{t`Loading value…`}</span>;
    }

    if (loadStatus === 'missing') {
      return <span role="alert">{t`Record not found.`}</span>;
    }

    if (isError) {
      return (
        <>
          <span role="alert">{t`Could not load this value.`}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              closeButtonRef.current?.focus();
              onRetry();
            }}
          >
            {t`Retry`}
          </Button>
        </>
      );
    }

    return <OnDemandJsonFieldValue />;
  };

  return (
    <ExpandedFieldDisplay
      anchorElement={anchorElement}
      onClickOutside={handleClose}
    >
      <StyledViewer
        role="dialog"
        aria-label={fieldDefinition.label}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          event.stopPropagation();

          if (event.key === 'Escape') {
            event.preventDefault();
            handleClose();
          }
        }}
      >
        <StyledHeader>
          <span>{fieldDefinition.label}</span>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="sm"
            onClick={handleClose}
            autoFocus
          >
            {t`Close`}
          </Button>
        </StyledHeader>
        {content()}
      </StyledViewer>
    </ExpandedFieldDisplay>
  );
};
