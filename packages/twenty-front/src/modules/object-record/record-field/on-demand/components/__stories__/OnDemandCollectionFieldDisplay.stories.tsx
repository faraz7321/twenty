import { OnDemandCollectionFieldStory } from '@/object-record/record-field/on-demand/testing/OnDemandCollectionFieldStory';
import {
  ON_DEMAND_FIELD_STORY_RESPONSE,
  ON_DEMAND_FIELD_STORY_TRANSCRIPT_TEXT,
} from '@/object-record/record-field/on-demand/testing/onDemandFieldStoryResponse';
import { seedOnDemandCollectionFieldStory } from '@/object-record/record-field/on-demand/testing/seedOnDemandCollectionFieldStory';
import { ON_DEMAND_FIELD_STORY_RECORD_ID } from '@/object-record/record-field/on-demand/testing/seedOnDemandFieldStory';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { graphql, HttpResponse } from 'msw';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CatalogDecorator, type CatalogStory } from 'twenty-ui/testing';
import { MemoryRouterDecorator } from '~/testing/decorators/MemoryRouterDecorator';
import { ToastDecorator } from '~/testing/decorators/ToastDecorator';

const requestValue = fn();

const meta: Meta<typeof OnDemandCollectionFieldStory> = {
  title: 'Modules/ObjectRecord/RecordField/OnDemandCollectionFieldDisplay',
  component: OnDemandCollectionFieldStory,
  decorators: [MemoryRouterDecorator, ToastDecorator],
  args: { onRecordClick: fn() },
  beforeEach: () => {
    requestValue.mockClear();
    seedOnDemandCollectionFieldStory();
  },
  parameters: {
    msw: {
      handlers: [
        graphql.query('FindOneCallRecording', ({ variables }) => {
          requestValue(variables.objectRecordId);
          return HttpResponse.json(ON_DEMAND_FIELD_STORY_RESPONSE);
        }),
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OnDemandCollectionFieldStory>;

export const Catalog: CatalogStory<Story, typeof OnDemandCollectionFieldStory> =
  {
    decorators: [CatalogDecorator],
    parameters: {
      catalog: {
        dimensions: [
          {
            name: 'surface',
            values: ['cell', 'inline', 'list', 'table'],
            props: (surface: 'cell' | 'inline' | 'list' | 'table') => ({
              surface,
            }),
          },
        ],
      },
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      expect(
        await canvas.findAllByRole('button', { name: 'View value' }),
      ).toHaveLength(4);
      expect(requestValue).not.toHaveBeenCalled();
    },
  };

export const CellFieldLoadsOnlyOnClick: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = await canvas.findByRole('button', { name: 'View value' });

    expect(requestValue).not.toHaveBeenCalled();
    await userEvent.click(trigger);

    expect(
      await body.findByText(ON_DEMAND_FIELD_STORY_TRANSCRIPT_TEXT),
    ).toBeVisible();
    expect(requestValue).toHaveBeenCalledTimes(1);
    expect(requestValue).toHaveBeenCalledWith(ON_DEMAND_FIELD_STORY_RECORD_ID);
    expect(args.onRecordClick).not.toHaveBeenCalled();

    await userEvent.keyboard('{Escape}');
    expect(body.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(
      canvas.queryByText(ON_DEMAND_FIELD_STORY_TRANSCRIPT_TEXT),
    ).not.toBeInTheDocument();
  },
};

export const InlineCellRetainsUnloadedField: Story = {
  args: { surface: 'inline' },
  play: CellFieldLoadsOnlyOnClick.play,
};

export const ListFieldIsActionable: Story = {
  args: { surface: 'list' },
  play: CellFieldLoadsOnlyOnClick.play,
};

export const ForbiddenFieldCannotLoad: Story = {
  args: { isForbidden: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText('Not shared')).toBeVisible();
    expect(
      canvas.queryByRole('button', { name: 'View value' }),
    ).not.toBeInTheDocument();
    expect(requestValue).not.toHaveBeenCalled();
  },
};
