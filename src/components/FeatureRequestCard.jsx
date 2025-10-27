import { Card, Badge, Text, Button, InlineStack, BlockStack } from '@shopify/polaris';
import { ChevronUpIcon } from '@shopify/polaris-icons';

export function FeatureRequestCard({ feature, currentUserId, onUpvote }) {
  const hasUpvoted = feature.upvotes.includes(currentUserId);
  const upvoteCount = feature.upvotes.length;

  return (
    <Card>
      <BlockStack gap="300">
        <Text variant="headingSm" as="h3" fontWeight="semibold">
          {feature.title}
        </Text>

        <Text variant="bodySm" as="p" tone="subdued">
          {feature.description}
        </Text>

        {feature.tags.length > 0 && (
          <InlineStack gap="200" wrap={false}>
            {feature.tags.map((tag, index) => (
              <Badge key={index} tone="info">{tag}</Badge>
            ))}
          </InlineStack>
        )}

        <InlineStack align="start">
          <Button
            icon={ChevronUpIcon}
            onClick={() => onUpvote(feature.id)}
            variant={hasUpvoted ? 'primary' : 'secondary'}
            size="slim"
          >
            {upvoteCount}
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
