import { FeatureRequestService } from './feature-request-service.js';

/**
 * Feature Request Web Component
 * A custom element for managing feature requests
 */
class FeatureRequestComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.featureRequests = [];
    this.currentUserId = null;
    this.showForm = false;
    this.showMainModal = false;
  }

  connectedCallback() {
    // Get customer ID from tag attribute or use hardcoded value
    this.currentUserId = this.getAttribute('data-customer-id');
    this.render();
    this.attachEventListeners();
    this.loadFeatureRequests();
  }

  /**
   * Load feature requests from API
   */
  async loadFeatureRequests() {
    try {
      const requests = await FeatureRequestService.getAllRequests();
      this.featureRequests = requests;
      this.renderFeatureRequests();
    } catch (error) {
      // If API fails, use mock data for demo
      console.warn('Using mock data:', error);
      this.featureRequests = this.getMockData();
      this.renderFeatureRequests();
    }
  }

  /**
   * Mock data for demo purposes
   */
  getMockData() {
    return [
      {
        id: '1',
        title: 'Dark Mode Support',
        description: 'Add dark mode theme option to reduce eye strain during night usage',
        tags: ['UI', 'Enhancement'],
        upvotes: ['user_123', 'user_456'],
        status: 'in-progress'
      },
      {
        id: '2',
        title: 'Export to PDF',
        description: 'Allow users to export their data as PDF documents',
        tags: ['Feature', 'Export'],
        upvotes: ['user_789'],
        status: 'pending'
      },
      {
        id: '3',
        title: 'Mobile App',
        description: 'Create a native mobile application for iOS and Android',
        tags: ['Mobile', 'Feature'],
        upvotes: ['user_123', 'user_789', 'user_abc'],
        status: 'approved'
      }
    ];
  }

  /**
   * Render the component
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .floating-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: #4f46e5;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          transition: all 0.3s;
          z-index: 900;
        }

        .floating-btn:hover {
          background: #4338ca;
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5);
        }

        .main-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f5f7fa;
          z-index: 999;
          overflow-y: auto;
        }

        .main-modal.active {
          display: block;
        }

        .main-modal-header {
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .main-modal-title {
          font-size: 24px;
          margin: 0;
          color: #1a202c;
        }

        .main-close-btn {
          background: #f3f4f6;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #4a5568;
          transition: background 0.2s;
        }

        .main-close-btn:hover {
          background: #e5e7eb;
        }

        .main-modal-content {
          padding: 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        h1 {
          margin: 0;
          font-size: 28px;
          color: #1a202c;
        }

        .add-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
          font-weight: 500;
        }

        .add-btn:hover {
          background: #4338ca;
        }

        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }

        .modal.active {
          display: flex;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 24px;
          margin: 0;
          color: #1a202c;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #718096;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .close-btn:hover {
          background: #e2e8f0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #4a5568;
          font-weight: 500;
          font-size: 14px;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: #4f46e5;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .tag-input-container {
          display: flex;
          gap: 8px;
        }

        .tag-input-container input {
          flex: 1;
        }

        .add-tag-btn {
          background: #e2e8f0;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #4a5568;
          transition: background 0.2s;
        }

        .add-tag-btn:hover {
          background: #cbd5e0;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .tag-item {
          background: #eef2ff;
          color: #4f46e5;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tag-remove {
          background: none;
          border: none;
          color: #4f46e5;
          cursor: pointer;
          padding: 0;
          font-size: 16px;
          line-height: 1;
        }

        .submit-btn {
          width: 100%;
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
          font-weight: 500;
        }

        .submit-btn:hover {
          background: #4338ca;
        }

        .requests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .request-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .request-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 12px;
        }

        .request-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          flex: 1;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
          white-space: nowrap;
          margin-left: 12px;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-approved {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-assigned {
          background: #e0e7ff;
          color: #4338ca;
        }

        .status-in-progress {
          background: #ddd6fe;
          color: #5b21b6;
        }

        .status-done {
          background: #d1fae5;
          color: #065f46;
        }

        .status-archived {
          background: #f3f4f6;
          color: #6b7280;
        }

        .request-description {
          color: #4a5568;
          margin: 12px 0;
          line-height: 1.5;
          font-size: 14px;
        }

        .request-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 12px 0;
        }

        .tag {
          background: #f3f4f6;
          color: #4a5568;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
        }

        .request-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .upvote-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }

        .upvote-btn:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        .upvote-btn.upvoted {
          background: #eef2ff;
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .upvote-icon {
          font-size: 16px;
        }

        .upvote-count {
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #718096;
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #4a5568;
        }

        .empty-state-text {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .requests-grid {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .add-btn {
            width: 100%;
          }
        }
      </style>

      <button class="floating-btn" id="floatingBtn">💡</button>

      <div class="main-modal" id="mainModal">
        <div class="main-modal-header">
          <h2 class="main-modal-title">Feature Requests</h2>
          <button class="main-close-btn" id="mainCloseBtn">×</button>
        </div>
        <div class="main-modal-content">
          <div class="container">
            <div class="header">
              <h1>Feature Requests</h1>
              <button class="add-btn" id="addBtn">+ New Request</button>
            </div>

            <div class="requests-grid" id="requestsGrid">
              <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-title">No feature requests yet</div>
                <div class="empty-state-text">Click "New Request" to add your first feature request</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">New Feature Request</h2>
            <button class="close-btn" id="closeBtn">×</button>
          </div>
          <form id="featureForm">
            <div class="form-group">
              <label for="title">Title *</label>
              <input type="text" id="title" name="title" required placeholder="Enter feature title">
            </div>
            <div class="form-group">
              <label for="description">Description *</label>
              <textarea id="description" name="description" required placeholder="Describe the feature request"></textarea>
            </div>
            <div class="form-group">
              <label for="tagInput">Tags</label>
              <div class="tag-input-container">
                <input type="text" id="tagInput" placeholder="Add a tag">
                <button type="button" class="add-tag-btn" id="addTagBtn">Add</button>
              </div>
              <div class="tags-list" id="tagsList"></div>
            </div>
            <button type="submit" class="submit-btn">Create Request</button>
          </form>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const floatingBtn = this.shadowRoot.getElementById('floatingBtn');
    const mainModal = this.shadowRoot.getElementById('mainModal');
    const mainCloseBtn = this.shadowRoot.getElementById('mainCloseBtn');
    const addBtn = this.shadowRoot.getElementById('addBtn');
    const closeBtn = this.shadowRoot.getElementById('closeBtn');
    const modal = this.shadowRoot.getElementById('modal');
    const form = this.shadowRoot.getElementById('featureForm');
    const addTagBtn = this.shadowRoot.getElementById('addTagBtn');
    const tagInput = this.shadowRoot.getElementById('tagInput');

    floatingBtn.addEventListener('click', () => this.openMainModal());
    mainCloseBtn.addEventListener('click', () => this.closeMainModal());
    addBtn.addEventListener('click', () => this.openModal());
    closeBtn.addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });

    form.addEventListener('submit', (e) => this.handleSubmit(e));
    addTagBtn.addEventListener('click', () => this.addTag());
    tagInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addTag();
      }
    });
  }

  /**
   * Open main modal
   */
  openMainModal() {
    const mainModal = this.shadowRoot.getElementById('mainModal');
    mainModal.classList.add('active');
  }

  /**
   * Close main modal
   */
  closeMainModal() {
    const mainModal = this.shadowRoot.getElementById('mainModal');
    mainModal.classList.remove('active');
  }

  /**
   * Open modal
   */
  openModal() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.classList.add('active');
    this.currentTags = [];
    this.renderTags();
  }

  /**
   * Close modal
   */
  closeModal() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.classList.remove('active');
    const form = this.shadowRoot.getElementById('featureForm');
    form.reset();
    this.currentTags = [];
    this.renderTags();
  }

  /**
   * Add tag
   */
  addTag() {
    const tagInput = this.shadowRoot.getElementById('tagInput');
    const tag = tagInput.value.trim();
    
    if (tag && !this.currentTags.includes(tag)) {
      this.currentTags.push(tag);
      tagInput.value = '';
      this.renderTags();
    }
  }

  /**
   * Remove tag
   */
  removeTag(tag) {
    this.currentTags = this.currentTags.filter(t => t !== tag);
    this.renderTags();
  }

  /**
   * Render tags
   */
  renderTags() {
    const tagsList = this.shadowRoot.getElementById('tagsList');
    tagsList.innerHTML = this.currentTags.map(tag => `
      <span class="tag-item">
        ${tag}
        <button type="button" class="tag-remove" data-tag="${tag}">×</button>
      </span>
    `).join('');

    // Attach event listeners to remove buttons
    tagsList.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', () => this.removeTag(btn.dataset.tag));
    });
  }

  /**
   * Handle form submit
   */
  async handleSubmit(e) {
    e.preventDefault();
    
    const title = this.shadowRoot.getElementById('title').value;
    const description = this.shadowRoot.getElementById('description').value;

    const newRequest = {
      title,
      description,
      tags: this.currentTags,
      customerId: this.currentUserId,
    };

    try {
      const createdRequest = await FeatureRequestService.createRequest(newRequest);
      this.featureRequests.unshift(createdRequest);
      this.renderFeatureRequests();
      this.closeModal();
    } catch (error) {
      // If API fails, add to mock data
      const mockRequest = {
        id: Date.now().toString(),
        ...newRequest,
        upvotes: [],
        status: 'pending'
      };
      this.featureRequests.unshift(mockRequest);
      this.renderFeatureRequests();
      this.closeModal();
    }
  }

  /**
   * Toggle upvote
   */
  async toggleUpvote(requestId) {
    const request = this.featureRequests.find(r => r.id === requestId);
    if (!request) return;

    const hasUpvoted = request.upvotes.includes(this.currentUserId);

    // Optimistic update - update UI immediately
    if (hasUpvoted) {
      request.upvotes = request.upvotes.filter(id => id !== this.currentUserId);
    } else {
      request.upvotes.push(this.currentUserId);
    }
    this.renderFeatureRequests();

    try {
      // Send to API
      const result = await FeatureRequestService.toggleUpvote(requestId, hasUpvoted, this.currentUserId);

      // Update with server response
      const index = this.featureRequests.findIndex(r => r.id === requestId);
      if (index !== -1) {
        this.featureRequests[index].upvotes = result.upvotes;
        this.renderFeatureRequests();
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
      // Revert optimistic update on error
      if (hasUpvoted) {
        request.upvotes.push(this.currentUserId);
      } else {
        request.upvotes = request.upvotes.filter(id => id !== this.currentUserId);
      }
      this.renderFeatureRequests();
    }
  }

  /**
   * Render feature requests
   */
  renderFeatureRequests() {
    const grid = this.shadowRoot.getElementById('requestsGrid');
    
    if (this.featureRequests.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No feature requests yet</div>
          <div class="empty-state-text">Click "New Request" to add your first feature request</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.featureRequests.map(request => {
      const hasUpvoted = request.upvotes.includes(this.currentUserId);
      const upvoteCount = request.upvotes.length;
      
      return `
        <div class="request-card">
          <div class="request-header">
            <h3 class="request-title">${this.escapeHtml(request.title)}</h3>
            <span class="status-badge status-${request.status}">${request.status}</span>
          </div>
          <p class="request-description">${this.escapeHtml(request.description)}</p>
          ${request.tags.length > 0 ? `
            <div class="request-tags">
              ${request.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
            </div>
          ` : ''}
          <div class="request-footer">
            <button class="upvote-btn ${hasUpvoted ? 'upvoted' : ''}" data-id="${request.id}">
              <span class="upvote-icon">${hasUpvoted ? '▲' : '△'}</span>
              <span class="upvote-count">${upvoteCount}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach event listeners to upvote buttons
    grid.querySelectorAll('.upvote-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggleUpvote(btn.dataset.id));
    });
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Define the custom element
customElements.define('feature-request-component', FeatureRequestComponent);
