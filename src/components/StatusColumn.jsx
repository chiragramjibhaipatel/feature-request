import { BlockStack, Text, Badge, Box, InlineStack } from '@shopify/polaris';
import { FeatureRequestCard } from './FeatureRequestCard';

export function StatusColumn({ status, label, features, currentUserId, onUpvote, icon }) {
  const count = features.length;

  const statusIconMap = {
    pending: '⏱️',
    approved: '👍',
    assigned: '📋',
    'in-progress': '⚙️',
    done: '✅',
    archived: '❌',
  };

  const statusToneMap = {
    pending: 'warning',
    approved: 'info',
    assigned: 'info',
    'in-progress': 'attention',
    done: 'success',
    archived: undefined,
  };

  return (
    <Box
      background="bg-surface-secondary"
      padding="400"
      borderRadius="200"
      minHeight="500px"
    >
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="200" blockAlign="center">
            <Text variant="headingMd" as="h2">
              {icon || statusIconMap[status]} {label}
            </Text>
            <Badge tone={statusToneMap[status]}>{count}</Badge>
          </InlineStack>
        </InlineStack>

        <BlockStack gap="300">
          {features.map((feature) => (
            <FeatureRequestCard
              key={feature.id}
              feature={feature}
              currentUserId={currentUserId}
              onUpvote={onUpvote}
            />
          ))}
        </BlockStack>
      </BlockStack>
    </Box>
  );
}
