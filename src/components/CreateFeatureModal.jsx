import { useState, useCallback } from 'react';
import {
  Modal,
  FormLayout,
  TextField,
  Button,
  InlineStack,
  Tag,
} from '@shopify/polaris';

export function CreateFeatureModal({ active, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }, [tags]);

  const handleSubmit = useCallback(() => {
    if (title && description) {
      onSubmit({ title, description, tags });
      setTitle('');
      setDescription('');
      setTags([]);
      setTagInput('');
    }
  }, [title, description, tags, onSubmit]);

  const handleTagInputKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  return (
    <Modal
      open={active}
      onClose={onClose}
      title="New Feature Request"
      primaryAction={{
        content: 'Create Request',
        onAction: handleSubmit,
        disabled: !title || !description,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Title"
            value={title}
            onChange={setTitle}
            autoComplete="off"
            placeholder="Enter feature title"
          />

          <TextField
            label="Description"
            value={description}
            onChange={setDescription}
            multiline={4}
            autoComplete="off"
            placeholder="Describe the feature request"
          />

          <FormLayout.Group condensed>
            <TextField
              label="Tags"
              value={tagInput}
              onChange={setTagInput}
              autoComplete="off"
              placeholder="Add a tag"
              onKeyPress={handleTagInputKeyPress}
              connectedRight={
                <Button onClick={handleAddTag}>Add</Button>
              }
            />
          </FormLayout.Group>

          {tags.length > 0 && (
            <InlineStack gap="200">
              {tags.map((tag) => (
                <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </InlineStack>
          )}
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}
