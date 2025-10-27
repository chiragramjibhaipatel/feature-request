import { useState, useEffect, useCallback } from 'react';
import {
  AppProvider,
  Page,
  Layout,
  Button,
  EmptyState,
  Frame,
  Banner,
  BlockStack,
  InlineGrid,
} from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import '@shopify/polaris/build/esm/styles.css';
import './App.css';
import { StatusColumn } from './components/StatusColumn';
import { CreateFeatureModal } from './components/CreateFeatureModal';
import { FeatureRequestService } from './services/featureRequestService';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending', icon: '⏱️' },
  { label: 'Approved', value: 'approved', icon: '👍' },
  { label: 'Assigned', value: 'assigned', icon: '📋' },
  { label: 'In Progress', value: 'in-progress', icon: '⚙️' },
  { label: 'Done', value: 'done', icon: '✅' },
  { label: 'Archived', value: 'archived', icon: '❌' },
];

const MOCK_DATA = [
  {
    id: '1',
    title: 'HTML Customization',
    description: 'I would like you to add customization feature on the app, in that way anybody could customize their bundles',
    tags: ['New feature', 'Improvement'],
    upvotes: ['user_123', 'user_456', 'user_789'],
    status: 'pending',
  },
  {
    id: '2',
    title: 'Change fonts',
    description: 'Being able to use system fonts and inherit fonts of the theme',
    tags: ['Improvement'],
    upvotes: ['user_789', 'user_123'],
    status: 'pending',
  },
  {
    id: '3',
    title: 'Free gift feature + single product does not work optimally',
    description: 'The app allows you to bundle products and offer a free gift. However, the "free gift price" does not display the original price of the product.',
    tags: [],
    upvotes: ['user_123'],
    status: 'approved',
  },
  {
    id: '4',
    title: 'Add Variant-Specific Bundling Feature or Product Discounts',
    description: 'Currently, Kaching Bundles applies bundles across all variants of a product, which limits options for users who want to target specific variants.',
    tags: ['New feature'],
    upvotes: ['user_456', 'user_abc'],
    status: 'approved',
  },
  {
    id: '5',
    title: 'A/B tests history',
    description: 'Show the result to former a/b tests',
    tags: [],
    upvotes: Array.from({ length: 189 }, (_, i) => `user_${i}`),
    status: 'in-progress',
  },
  {
    id: '6',
    title: 'Cart tips',
    description: 'Add info to cart items to let users know that they can get higher discount if they increase quantity',
    tags: [],
    upvotes: Array.from({ length: 302 }, (_, i) => `user_${i}`),
    status: 'done',
  },
  {
    id: '7',
    title: 'Different product bundles',
    description: 'Adding different products bundles or upselling different items to the same product volume bundles.',
    tags: ['New feature'],
    upvotes: Array.from({ length: 167 }, (_, i) => `user_${i}`),
    status: 'done',
  },
  {
    id: '8',
    title: 'Limited inventory',
    description: 'Limited Inventory Feature – Know Before It\'s Gone! Our Limited Inventory feature lets you see real-time stock levels.',
    tags: [],
    upvotes: Array.from({ length: 45 }, (_, i) => `user_${i}`),
    status: 'in-progress',
  },
  {
    id: '9',
    title: 'Subscription integrations',
    description: 'Please create or integrate/partner with other companies with subscriptions',
    tags: ['New feature'],
    upvotes: Array.from({ length: 154 }, (_, i) => `user_${i}`),
    status: 'done',
  },
];

function App({ customerId = 'something1.myshopify.com' }) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = await FeatureRequestService.getAllRequests();
      setFeatures(requests);
      setUseMockData(false);
    } catch (err) {
      console.warn('Using mock data:', err);
      setFeatures(MOCK_DATA);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeature = useCallback(async (featureData) => {
    try {
      const newFeature = await FeatureRequestService.createRequest({
        ...featureData,
        customerId,
      });
      setFeatures([newFeature, ...features]);
      setModalActive(false);
    } catch (err) {
      console.error('Error creating feature:', err);
      const mockFeature = {
        id: Date.now().toString(),
        ...featureData,
        upvotes: [],
        status: 'pending',
      };
      setFeatures([mockFeature, ...features]);
      setModalActive(false);
    }
  }, [customerId, features]);

  const handleUpvote = useCallback(async (featureId) => {
    const feature = features.find((f) => f.id === featureId);
    if (!feature) return;

    const hasUpvoted = feature.upvotes.includes(customerId);

    // Optimistic update
    const updatedFeatures = features.map((f) =>
      f.id === featureId
        ? {
            ...f,
            upvotes: hasUpvoted
              ? f.upvotes.filter((id) => id !== customerId)
              : [...f.upvotes, customerId],
          }
        : f
    );
    setFeatures(updatedFeatures);

    try {
      const result = await FeatureRequestService.toggleUpvote(
        featureId,
        hasUpvoted,
        customerId
      );

      // Update with server response
      setFeatures((prevFeatures) =>
        prevFeatures.map((f) =>
          f.id === featureId ? { ...f, upvotes: result.upvotes } : f
        )
      );
    } catch (err) {
      console.error('Error toggling upvote:', err);
      // Revert on error
      setFeatures(features);
    }
  }, [features, customerId]);

  const toggleModal = useCallback(() => {
    setModalActive(!modalActive);
  }, [modalActive]);

  const getFeaturesByStatus = useCallback((status) => {
    return features.filter((feature) => feature.status === status);
  }, [features]);

  return (
    <AppProvider>
      <Frame>
        <Page
          fullWidth
          title="Feature Requests"
          primaryAction={{
            content: 'New Request',
            icon: PlusIcon,
            onAction: toggleModal,
          }}
        >
          <BlockStack gap="400">
            {useMockData && (
              <Banner tone="warning">
                Using demo data. API connection unavailable.
              </Banner>
            )}

            {loading ? (
              <EmptyState
                heading="Loading feature requests..."
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              />
            ) : features.length === 0 ? (
              <EmptyState
                heading="No feature requests yet"
                action={{
                  content: 'New Request',
                  onAction: toggleModal,
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Click "New Request" to add your first feature request</p>
              </EmptyState>
            ) : (
              <div className="kanban-container">
                <div className="kanban-columns">
                  {STATUS_OPTIONS.map((status) => (
                    <div key={status.value} className="kanban-column">
                      <StatusColumn
                        status={status.value}
                        label={status.label}
                        icon={status.icon}
                        features={getFeaturesByStatus(status.value)}
                        currentUserId={customerId}
                        onUpvote={handleUpvote}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </BlockStack>
        </Page>

        <CreateFeatureModal
          active={modalActive}
          onClose={toggleModal}
          onSubmit={handleCreateFeature}
        />
      </Frame>
    </AppProvider>
  );
}

export default App;
