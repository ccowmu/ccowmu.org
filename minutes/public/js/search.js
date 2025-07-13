// Enhanced Minutes Search with Modern UI
class MinutesSearch {
    constructor() {
        this.index = null;
        this.allMinutes = [];
        this.currentView = 'card';
        this.currentFilter = 'all';
        this.currentSearch = '';
        
        this.initializeElements();
        this.setupEventListeners();
        this.buildSearchIndex();
        this.updateResultCount();
    }
    
    initializeElements() {
        this.searchInput = document.getElementById('search');
        this.searchClear = document.getElementById('search-clear');
        this.yearFilter = document.getElementById('year-filter');
        this.viewToggle = document.getElementById('view-toggle');
        this.minutesContainer = document.getElementById('minutes-container');
        this.noResults = document.getElementById('no-results');
        this.resultCount = document.getElementById('result-count');
        this.visibleCount = document.getElementById('visible-count');
        this.totalCount = document.getElementById('total-count');
        this.clearFiltersBtn = document.getElementById('clear-filters');
        
        // Get all minutes cards
        this.allMinutes = Array.from(document.querySelectorAll('.minutes-card'));
        
        // Set initial counts
        if (this.totalCount) {
            this.totalCount.textContent = this.allMinutes.length;
        }
    }
    
    setupEventListeners() {
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase().trim();
                this.updateSearchClearButton();
                this.filterMinutes();
            });
            
            // Clear search on Escape
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }
        
        // Search clear button
        if (this.searchClear) {
            this.searchClear.addEventListener('click', () => {
                this.clearSearch();
            });
        }
        
        // Year filter
        if (this.yearFilter) {
            this.yearFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.filterMinutes();
            });
        }
        
        // View toggle
        if (this.viewToggle) {
            this.viewToggle.addEventListener('click', (e) => {
                if (e.target.classList.contains('view-button')) {
                    const view = e.target.dataset.view;
                    this.switchView(view);
                }
            });
        }
        
        // Clear all filters
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }
    
    buildSearchIndex() {
        if (typeof FlexSearch === 'undefined') {
            console.warn('FlexSearch not loaded, falling back to simple search');
            return;
        }
        
        this.index = new FlexSearch.Index({
            charset: "latin:extra",
            tokenize: "forward",
            resolution: 9
        });
        
        this.allMinutes.forEach((card, i) => {
            const title = card.dataset.title || '';
            const content = card.dataset.content || '';
            const searchText = `${title} ${content}`;
            this.index.add(i, searchText);
        });
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.currentSearch = '';
        this.updateSearchClearButton();
        this.filterMinutes();
        this.searchInput.focus();
    }
    
    updateSearchClearButton() {
        if (this.searchClear) {
            if (this.currentSearch.length > 0) {
                this.searchClear.classList.add('visible');
            } else {
                this.searchClear.classList.remove('visible');
            }
        }
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update active button
        this.viewToggle.querySelectorAll('.view-button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.viewToggle.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Update container class
        if (view === 'list') {
            this.minutesContainer.classList.remove('minutes-grid');
            this.minutesContainer.classList.add('minutes-list');
        } else {
            this.minutesContainer.classList.remove('minutes-list');
            this.minutesContainer.classList.add('minutes-grid');
        }
        
        // Save preference
        localStorage.setItem('minutes-view', view);
    }
    
    filterMinutes() {
        let visibleCount = 0;
        
        this.allMinutes.forEach((card, index) => {
            let shouldShow = true;
            
            // Year filter
            if (this.currentFilter !== 'all') {
                const cardYear = card.dataset.year;
                if (cardYear !== this.currentFilter) {
                    shouldShow = false;
                }
            }
            
            // Search filter
            if (this.currentSearch && shouldShow) {
                if (this.index) {
                    // Use FlexSearch if available
                    const results = this.index.search(this.currentSearch);
                    shouldShow = results.includes(index);
                } else {
                    // Fallback to simple text search
                    const title = card.dataset.title || '';
                    const content = card.dataset.content || '';
                    const searchText = `${title} ${content}`;
                    shouldShow = searchText.includes(this.currentSearch);
                }
            }
            
            // Show/hide card
            if (shouldShow) {
                card.style.display = '';
                visibleCount++;
                
                // Highlight search terms
                if (this.currentSearch) {
                    this.highlightSearchTerms(card);
                } else {
                    this.removeHighlights(card);
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update result count
        this.updateResultCount(visibleCount);
        
        // Show/hide no results message
        this.toggleNoResults(visibleCount === 0);
    }
    
    highlightSearchTerms(card) {
        const searchTerms = this.currentSearch.split(' ').filter(term => term.length > 0);
        const titleElement = card.querySelector('.card-title .card-link');
        const excerptElement = card.querySelector('.card-excerpt');
        
        if (titleElement) {
            this.highlightInElement(titleElement, searchTerms);
        }
        
        if (excerptElement) {
            this.highlightInElement(excerptElement, searchTerms);
        }
    }
    
    highlightInElement(element, searchTerms) {
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
        
        let text = element.dataset.originalText;
        
        searchTerms.forEach(term => {
            if (term.length > 1) {
                const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
                text = text.replace(regex, '<span class="search-highlight">$1</span>');
            }
        });
        
        element.innerHTML = text;
    }
    
    removeHighlights(card) {
        const highlightedElements = card.querySelectorAll('[data-original-text]');
        highlightedElements.forEach(element => {
            if (element.dataset.originalText) {
                element.textContent = element.dataset.originalText;
            }
        });
    }
    
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    updateResultCount(visibleCount = null) {
        if (visibleCount === null) {
            visibleCount = this.allMinutes.filter(card => 
                card.style.display !== 'none'
            ).length;
        }
        
        if (this.visibleCount) {
            this.visibleCount.textContent = visibleCount;
        }
    }
    
    toggleNoResults(show) {
        if (this.noResults && this.minutesContainer) {
            if (show) {
                this.noResults.style.display = 'block';
                this.minutesContainer.style.display = 'none';
            } else {
                this.noResults.style.display = 'none';
                this.minutesContainer.style.display = 'grid';
            }
        }
    }
    
    clearAllFilters() {
        this.clearSearch();
        
        if (this.yearFilter) {
            this.yearFilter.value = 'all';
            this.currentFilter = 'all';
        }
        
        this.filterMinutes();
    }
    
    // Initialize with saved preferences
    initializePreferences() {
        // Restore view preference
        const savedView = localStorage.getItem('minutes-view');
        if (savedView && ['card', 'list'].includes(savedView)) {
            this.switchView(savedView);
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const search = new MinutesSearch();
    search.initializePreferences();
    
    // Add smooth scroll to search input when linked from other pages
    if (window.location.hash === '#search') {
        setTimeout(() => {
            const searchInput = document.getElementById('search');
            if (searchInput) {
                searchInput.scrollIntoView({ behavior: 'smooth' });
                searchInput.focus();
            }
        }, 100);
    }
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinutesSearch;
}
