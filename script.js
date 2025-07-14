// script.js - S&S Zip and Sip Frontend Logic

// Ensure all your JavaScript runs AFTER the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOMContentLoaded fired. Script is initializing...');

    // --- DEBUGGING: Initial Auth Token Check on Page Load ---
    // Changed this initial check to sessionStorage for consistency
    const initialAuthTokenCheck = sessionStorage.getItem('authToken');
    console.log('Initial authToken on page load:', initialAuthTokenCheck ? 'Token found (length: ' + initialAuthTokenCheck.length + ')' : 'No token found');
    // --- END DEBUGGING ---

    // --- 1. Global Element References ---
    // Get all necessary DOM elements once at the top of this scope
    const body = document.body;
    const contactForm = document.getElementById('contactForm'); // Your existing contact form
    const bookingForm = document.getElementById('booking-form'); // Your existing booking form
    const cart = document.querySelector('.cart'); // Your existing <aside class="cart">
    const cartIcon = document.getElementById('cart-icon'); // The cart icon in the header
    const cartCountSpan = document.getElementById('cart-count'); // The count bubble
    const cartItemsContainer = document.querySelector('.cart-items'); // Div where cart items are listed
    const checkoutBtn = document.querySelector('.checkout-btn'); // The checkout button in the cart sidebar
    const hamburger = document.getElementById('hamburger'); // Your hamburger icon
    const mobileMenu = document.querySelector('nav ul.menu'); // Your mobile menu ul

    // For Category Filtering (present on drink menu pages)
    const categoryButtons = document.querySelectorAll('.drink-categories li');
    const drinkCards = document.querySelectorAll('.drinks-grid .drink-card');
    const grid = document.querySelector('.drinks-grid'); // Get the grid once

    // For Scroll Animation
    const faders = document.querySelectorAll('.fade-in-section');

    // --- NEW: References for User Authentication UI & Forms ---
    const userDropdownToggle = document.getElementById('userDropdownToggle');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    const signupLink = document.getElementById('signupLink');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');

    const signupForm = document.getElementById('signupForm');
    const emailExistsModal = document.getElementById('emailExistsModal'); // Assuming you have a modal for this
    const modalMessage = document.getElementById('modalMessage'); // Message within the emailExistsModal
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    const stayHereBtn = document.getElementById('stayHereBtn');

    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModalOverlay = document.getElementById('forgotPasswordModalOverlay');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const cancelForgotPasswordBtn = document.getElementById('cancelForgotPassword');
    const forgotEmailInput = document.getElementById('forgotEmail');
    const confirmForgotEmailInput = document.getElementById('confirmForgotEmail');
    // --- END NEW Auth References ---

    // --- NEW: References for Checkout Modals & Form Fields ---
    const placeOrderBtn = document.getElementById('placeOrderBtn'); // The button on checkout.html
    const checkoutChoiceModal = document.getElementById('checkoutChoiceModal');
    const createAccountOptionBtn = document.getElementById('createAccountOptionBtn');
    const continueAsGuestOptionBtn = document.getElementById('continueAsGuestOptionBtn');
    const guestEmailModal = document.getElementById('guestEmailModal');
    const guestEmailInput = document.getElementById('guestEmailInput');
    const submitGuestEmailBtn = document.getElementById('submitGuestEmailBtn');
    const guestEmailModalCloseBtn = document.getElementById('guestEmailModalCloseBtn');

    // Checkout Page Specifics (Order Summary & Shipping)
    const orderSummaryColumn = document.getElementById('order-summary-column');
    const orderTotalsSummaryElement = document.getElementById('order-totals-summary');
    const shippingMethodSelect = document.getElementById('shippingMethod');

    // Checkout Form Field References (adjusted to match checkout.html)
    const checkoutForm = document.getElementById('checkout-form'); // Corrected ID from checkout.html
    const fullNameInput = document.getElementById('fullName'); // Matches checkout.html
    const shippingAddressInput = document.getElementById('shippingAddress'); // Matches checkout.html
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    // --- END NEW Checkout References ---

    // --- 2. Dynamic Overlay & Page Wrapper Creation ---
    // Create and append the overlay and page-wrapper here, ensuring they are children of body
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    body.appendChild(overlay);
    console.log('Overlay created and appended.');

    const pageWrapper = document.createElement('div');
    pageWrapper.id = 'page-wrapper';

    // Move all current body children (excluding the dynamically created overlay, cart, and script tags) into the wrapper
    const childrenToWrap = Array.from(body.children).filter(child =>
        child !== overlay &&
        child !== cart && // Exclude the cart itself, as it's a sibling of page-wrapper
        child.tagName !== 'SCRIPT' // Exclude script tags
    );

    childrenToWrap.forEach(child => {
        pageWrapper.appendChild(child);
    });
    body.insertBefore(pageWrapper, overlay); // Insert the wrapper before the overlay
    console.log('page-wrapper created and populated.');


    // --- 2.1 User Dropdown Toggle (for person icon in header) ---
    if (userDropdownToggle && userDropdownMenu) {
        userDropdownToggle.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            event.stopPropagation(); // Prevent click from bubbling up to document
            console.log('User dropdown toggle clicked.');
        });

        // Close the dropdown if the user clicks outside of it
        document.addEventListener('click', function(event) {
            if (!userDropdownMenu.contains(event.target) && !userDropdownToggle.contains(event.target)) {
                userDropdownMenu.style.display = ''; // Let CSS handle display for hover
                console.log('User dropdown closed by outside click.');
            }
        });

        // Prevent the dropdown menu itself from closing when clicked inside (e.g., clicking a link)
        userDropdownMenu.addEventListener('click', function(event) {
            event.stopPropagation(); // Keep the dropdown open when its content is clicked
        });

    } else {
        console.log('User dropdown elements not found. Skipping dropdown functionality.');
    }
    // --- END User Dropdown Toggle ---

    // --- 2.2 User Authentication State Management (Show/Hide Signup/Login/Logout Links) ---
    function updateAuthUI() {
        // Check for the presence of the authentication token in sessionStorage
        const authToken = sessionStorage.getItem('authToken');
        const isLoggedIn = !!authToken; // Convert to boolean

        // CHANGED: Get currentUserName from sessionStorage for consistency
        const currentUserName = sessionStorage.getItem('currentUserName'); 

        if (signupLink && loginLink && logoutLink) {
            if (isLoggedIn) {
                // User is logged in: Hide Sign Up and Log In, Show Log Out
                signupLink.style.display = 'none';
                loginLink.style.display = 'none';
                logoutLink.style.display = 'block'; // Or 'list-item' if it's an LI
                console.log('Auth UI updated: Logged in state (Signup/Login hidden, Logout visible).');

                // Optional: Update a "Hello, [User]" message if you have an element for it
                const helloMessageElement = document.getElementById('helloMessage'); // Assuming you have such an ID in your HTML
                if (helloMessageElement && currentUserName) {
                    helloMessageElement.textContent = `Hello, ${currentUserName}!`;
                    helloMessageElement.style.display = 'block';
                }

            } else {
                // User is logged out: Show Sign Up and Log In, Hide Log Out
                signupLink.style.display = 'block'; // Or 'list-item'
                loginLink.style.display = 'block'; // Or 'list-item'
                logoutLink.style.display = 'none';
                console.log('Auth UI updated: Logged out state (Signup/Login visible, Logout hidden).');

                const helloMessageElement = document.getElementById('helloMessage');
                if (helloMessageElement) {
                    helloMessageElement.style.display = 'none'; // Hide the hello message
                }
            }
        } else {
            console.warn('Auth links (signupLink, loginLink, logoutLink) not found. Cannot update auth UI dynamically.');
        }

        // The userDropdownToggle (person icon) will always be visible now, as it houses the menu.
        if (userDropdownToggle) {
            userDropdownToggle.style.display = 'block'; // Ensure the icon is always visible
        }
    }
    // --- END User Authentication State Management ---


    // --- 3. Shopping Cart Data & Persistence ---
    let cartItems = []; // Declare global array to store cart items

    // Backend Base URL
    const BACKEND_URL = 'http://localhost:3000'; // Make sure this matches your backend server URL

    // Function to Save Cart to Backend
    async function saveCartToBackend() {
        // --- DEBUGGING: Check authToken before saving to backend ---
        console.log('DEBUG: saveCartToBackend - Checking authToken. Value:', sessionStorage.getItem('authToken') ? 'PRESENT' : 'NOT PRESENT');
        // --- END DEBUGGING ---

        const authToken = sessionStorage.getItem('authToken');
        if (!authToken) {
            // If not logged in, just save to local storage as fallback
            saveCartToLocalStorage();
            return;
        }

        try {
            console.log('Saving cart to backend...', cartItems);
            const response = await fetch(`${BACKEND_URL}/api/users/cart`, {
                method: 'PUT', // Use PUT to update the entire cart
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ cartItems: cartItems }) // Send the whole cart array
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Cart successfully saved to backend:', data.cart);
                // After successful save to backend, also update local storage
                // This ensures consistency and offline access if user logs out later
                saveCartToLocalStorage();
            } else {
                console.error('Failed to save cart to backend:', data.message);
                showToast('Failed to save cart to your account. Please try again.', 'error');
                // Even on backend failure, save to local storage as fallback
                saveCartToLocalStorage();
            }
        } catch (error) {
            console.error('Network error saving cart to backend:', error);
            showToast('Network error while saving cart. Check your connection.', 'error');
            // Even on network failure, save to local storage as fallback
            saveCartToLocalStorage();
        }
    }

    // Function to Load Cart from Backend
    async function loadCartFromBackend() {
        const authToken = sessionStorage.getItem('authToken');
        if (!authToken) {
            // If not logged in, load from local storage
            loadCartFromLocalStorage();
            return;
        }

        try {
            console.log('Attempting to load cart from backend...');
            const response = await fetch(`${BACKEND_URL}/api/users/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                cartItems = data.cart || []; // If backend sends no cart, default to empty array
                console.log('Cart loaded from backend:', cartItems);
                // Also update local storage with the backend cart
                saveCartToLocalStorage();
            } else {
                console.error('Failed to load cart from backend:', data.message);
                showToast('Failed to load your cart from your account. Loading local cart.');
                // On backend failure, fall back to local storage
                loadCartFromLocalStorage();
            }
        } catch (error) {
            console.error('Network error loading cart from backend:', error);
            showToast('Network error while loading cart. Loading local cart.');
            // On network failure, fall back to local storage
            loadCartFromLocalStorage();
        }
    }

    // Helper functions for localStorage (original but now called by backend functions)
function saveCartToLocalStorage() {
    sessionStorage.setItem('zipAndSipCart', JSON.stringify(cartItems));
    console.log('Cart saved to SessionStorage (fallback/sync):', JSON.parse(sessionStorage.getItem('zipAndSipCart')));
}

    function loadCartFromLocalStorage() {
    console.log('Attempting to load cart from SessionStorage (fallback)...'); // CHANGE 1
    const storedCart = sessionStorage.getItem('zipAndSipCart'); // CHANGE 2
    if (storedCart) {
        cartItems = JSON.parse(storedCart);
        console.log('Cart loaded from SessionStorage (fallback):', cartItems); // CHANGE 3
    } else {
        cartItems = [];
        console.log('No cart found in SessionStorage. Initializing empty cart.'); // CHANGE 4
    }
}

    // --- 4. Cart UI & Functionality (Centralized Toggle) ---

    // Consolidated function to open/close the cart
    function toggleCart() {
        // Ensure elements exist before manipulating classes
        if (cart) cart.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        if (pageWrapper) pageWrapper.classList.toggle('page-dim'); // Dim the page behind
        body.classList.toggle('no-scroll'); // Prevent scrolling
        console.log('Cart toggled. Current state:', cart.classList.contains('active') ? 'OPEN' : 'CLOSED');
    }

    // This function will now fully render the cart based on the `cartItems` array
    function updateCartDisplay() {
        console.log('Updating cart display. Current cartItems array:', cartItems);
        if (cartItemsContainer) { // Check if cartItemsContainer exists before manipulating
            cartItemsContainer.innerHTML = ''; // Clear current display first
        }
        let totalOverallItems = 0; // To update the cart count span
        let totalCartValue = 0; // For checkout total

        if (cartItems.length === 0) {
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = '<p>No items in cart.</p>';
            }
            console.log('Cart is empty. Displaying "No items".');
        } else {
            cartItems.forEach((item, index) => {
                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 10px; margin-bottom: 8px;">
                    <div class="cart-item-details">
                        <div class="cart-item-top">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-right">
                                <button class="remove-btn" data-index="${index}" style="margin-bottom: 6px;">Remove</button>
                                <div class="cart-item-price">${item.price}</div>
                            </div>
                        </div>
                        <div class="qty-controls" style="margin-top: 10px;">
                            <button class="qty-btn minus-btn" data-index="${index}">−</button>
                            <span class="cart-item-qty" style="margin: 0 10px;">${item.quantity}</span>
                            <button class="qty-btn plus-btn" data-index="${index}">+</button>
                        </div>
                    </div>
                `;
                if (cartItemsContainer) { // Ensure container exists before appending
                    cartItemsContainer.appendChild(cartItemEl);
                }

                totalOverallItems += item.quantity;
                totalCartValue += parseFloat(item.price.replace('$', '')) * item.quantity;
            });
            console.log('Cart items rendered. Total overall items:', totalOverallItems);
        }

        // Update the header cart count span
        if (cartCountSpan) { // Check if span exists
            cartCountSpan.textContent = totalOverallItems;
            cartCountSpan.style.display = totalOverallItems > 0 ? 'flex' : 'none';
            console.log('Cart count span updated to:', totalOverallItems);
        }

        // --- UPDATED CODE FOR CHECKOUT BUTTON'S DISABLED STATE ---
        if (checkoutBtn) {
            if (cartItems.length === 0) {
                checkoutBtn.classList.add('is-disabled'); // Add the disabled class
                console.log('Checkout button set to is-disabled class (disabled).');
            } else {
                checkoutBtn.classList.remove('is-disabled'); // Remove the disabled class
                console.log('Checkout button removed is-disabled class (enabled).');
            }
        }
        // --- END OF UPDATED CODE ---

        // Update the total cart value displayed in the cart sidebar
        const cartTotalElement = document.getElementById('cart-total'); // Make sure you have this element in your cart HTML!
        if (cartTotalElement) {
            cartTotalElement.textContent = totalCartValue.toFixed(2);
            console.log('Cart total updated to:', totalCartValue.toFixed(2));
        }
    }


    // --- 4.1 Custom Modal Functionality (for Email Exists Prompt on signup.html) ---
    // Function to show the custom modal
    function showEmailExistsPrompt() {
        if (emailExistsModal && modalMessage) {
            modalMessage.textContent = 'An account with this email already exists. Would you like to go to the Log In page?';
            emailExistsModal.classList.add('active'); // Show modal
            body.classList.add('no-scroll'); // Prevent background scrolling
            console.log('Email exists modal shown.');
        } else {
            console.warn('Modal elements for email exists prompt not found.');
            showToast('An account with this email already exists. Please log in or use a different email.'); // Fallback
        }
    }

    // Function to hide the custom modal
    function hideEmailExistsPrompt() {
        if (emailExistsModal) {
            emailExistsModal.classList.remove('active'); // Hide modal
            body.classList.remove('no-scroll'); // Re-enable background scrolling
            console.log('Email exists modal hidden.');
        }
    }

    // Attach listeners for modal buttons if modal elements exist
    if (goToLoginBtn && stayHereBtn) {
        goToLoginBtn.addEventListener('click', function() {
            hideEmailExistsPrompt();
            window.location.href = 'login.html';
        });

        stayHereBtn.addEventListener('click', function() {
            hideEmailExistsPrompt();
        });
    }

    // Hide if clicking on the modal background itself (overlay)
    if (emailExistsModal) {
        emailExistsModal.addEventListener('click', function(event) {
            if (event.target === emailExistsModal) { // Only if clicked directly on the overlay
                hideEmailExistsPrompt();
            }
        });
    }
    // --- END Custom Modal Functionality ---


    // --- 5. Add to Cart Logic ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
        console.log('Found Add To Cart Buttons:', addToCartButtons.length);

        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Add to Cart button clicked!');
                const drinkCard = button.closest('.drink-card');
                const drinkName = drinkCard.querySelector('.drink-name').textContent;
                const drinkPrice = drinkCard.querySelector('.price').textContent;
                const imgSrc = drinkCard.querySelector('img').src;

                const existingItem = cartItems.find(item => item.name === drinkName);

                if (existingItem) {
                    existingItem.quantity++;
                    console.log(`Incremented quantity for ${drinkName}. New quantity: ${existingItem.quantity}`);
                } else {
                    cartItems.push({
                        name: drinkName,
                        price: drinkPrice,
                        imgSrc: imgSrc,
                        quantity: 1
                    });
                    console.log(`Added new item to cart: ${drinkName}`);
                }

                saveCartToBackend(); // *** IMPORTANT: Now saves to backend first, which then calls localStorage ***
                updateCartDisplay();
                // toggleCart(); // Consider if you want the cart to open automatically
            });
        });
    } else {
        console.log('No Add To Cart buttons found on this page.');
    }


    // --- 6. Event Listeners for Cart Item Management (Delegation) ---
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('qty-btn')) {
                const index = parseInt(target.dataset.index);
                if (target.classList.contains('minus-btn')) {
                    if (cartItems[index].quantity > 1) {
                        cartItems[index].quantity--;
                        console.log(`Decremented quantity for ${cartItems[index].name}. New quantity: ${cartItems[index].quantity}`);
                    }
                } else if (target.classList.contains('plus-btn')) {
                    cartItems[index].quantity++;
                    console.log(`Incremented quantity for ${cartItems[index].name}. New quantity: ${cartItems[index].quantity}`);
                }
                saveCartToBackend(); // *** IMPORTANT: Now saves to backend after quantity change ***
                updateCartDisplay();
            } else if (target.classList.contains('remove-btn')) {
                const index = parseInt(target.dataset.index);
                const removedItemName = cartItems[index].name;
                cartItems.splice(index, 1);
                console.log(`Removed item from cart: ${removedItemName}`);
                saveCartToBackend(); // *** IMPORTANT: Now saves to backend after item removal ***
                updateCartDisplay();
            }
        });
    }


    // --- 7. Main UI Event Listeners ---

    // Event listener for cart icon (to open cart)
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
        console.log('Cart icon listener attached.');
    } else {
        console.warn('Cart icon (#cart-icon) not found on this page.');
    }

    // Event listener for overlay (to close cart AND mobile menu AND new modals when clicking outside)
    if (overlay) {
        overlay.addEventListener('click', () => {
            // If the cart is open, toggle it closed
            if (cart && cart.classList.contains('active')) {
                toggleCart(); // This calls the function to close the cart and its associated overlay state
            }
            // If the mobile menu is open, toggle it closed
            if (mobileMenu && (mobileMenu.classList.contains('menu-open') || mobileMenu.classList.contains('show'))) {
                mobileMenu.classList.remove('menu-open');
                mobileMenu.classList.remove('show');
                if (hamburger) hamburger.classList.remove('active'); // Also deactivate hamburger icon if it has an active state
                body.classList.remove('no-scroll'); // Re-enable scrolling if menu was blocking it
                if (overlay) overlay.classList.remove('active'); // Explicitly remove overlay if only menu was open
                console.log('Mobile menu closed via overlay click.');
            }
            // Ensure any custom modals are also closed if open via overlay click
            if (emailExistsModal && emailExistsModal.classList.contains('active')) {
                hideEmailExistsPrompt();
            }
            // Close checkout modals via overlay click
            if (checkoutChoiceModal && checkoutChoiceModal.classList.contains('active')) {
                hideCheckoutChoiceModal();
            }
            if (guestEmailModal && guestEmailModal.classList.contains('active')) {
                hideGuestEmailModal();
            }
            // Close forgot password modal via overlay click
            if (forgotPasswordModalOverlay && forgotPasswordModalOverlay.classList.contains('active')) {
                forgotPasswordModalOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
                forgotPasswordForm.reset();
            }
        });
        console.log('Overlay listener attached.');
    } else {
        console.warn('Overlay not found (should be created by script).');
    }

    // Event listener for the hamburger menu
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('menu-open'); // Or .show (keep what you use in CSS)
            hamburger.classList.toggle('active'); // Optional: for animating hamburger
            body.classList.toggle('no-scroll'); // Prevent background scrolling

            // NEW: Toggle the overlay here when the hamburger menu opens/closes
            // Ensure cart is NOT open before toggling overlay
            if (overlay && !(cart && cart.classList.contains('active'))) {
                overlay.classList.toggle('active');
            }
            console.log('Hamburger menu toggled.');
        });
    }


    // --- 8. Swipe to close cart functionality ---
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    if (cart) {
        cart.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        cart.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        });
        console.log('Swipe listeners attached to cart.');
    }

    function handleSwipeGesture() {
        if (!cart.classList.contains('active')) {
            return;
        }
        const swipeDistance = touchEndX - touchStartX;
        if (swipeDistance > minSwipeDistance) {
            toggleCart(); // This will close the cart
            console.log('Swipe right detected. Cart closed.');
        }
    }

    // --- 9. Scroll Animation (Fade-in Sections) ---
    if (faders.length > 0) {
        const appearOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // If you want it to only appear once, uncomment the line below
                    // appearOnScroll.unobserve(entry.target);
                } else {
                    // Optional: Remove 'visible' if you want elements to fade out when scrolled away
                    // entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        faders.forEach(el => appearOnScroll.observe(el));
        console.log('Scroll animation observer initialized.');
    } else {
        console.log('No fade-in-section elements found for scroll animation.');
    }


    // --- 10. Category Filtering with Animation ---
    let lastCategoryIndex = 0; // This variable seems unused after initial declaration based on your provided code

    if (categoryButtons.length > 0 && drinkCards.length > 0) {
        console.log('Category buttons found:', categoryButtons.length, 'Drink cards found:', drinkCards.length);

        categoryButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const newCategory = button.getAttribute('data-category');

                if (!grid) {
                    console.warn("No .drinks-grid found for category filtering animation.");
                    return;
                }

                // First, make the grid fade out
                grid.style.transition = 'opacity 0.4s ease'; // Only transition opacity for now
                grid.style.opacity = '0'; // Make it invisible
                grid.style.pointerEvents = 'none'; // Make it unclickable while fading out
                console.log('Animating grid out (fade).');

                // Now, after it has faded out (matching the 0.4s transition duration)
                setTimeout(() => {
                    // 1. Filter (hide/show cards) - This happens while it's invisible
                    drinkCards.forEach(card => {
                        if (card.getAttribute('data-category') === newCategory) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    console.log(`Category filter applied: ${newCategory}`);

                    // 2. Ensure grid is at its default position
                    grid.style.transform = 'translateX(0)';

                    // 3. Recalculate and settle the height while it's invisible
                    grid.style.height = 'auto';
                    void grid.offsetHeight; // FORCE the browser to apply that height

                    // 4. Now, re-enable transitions and make it fade back in
                    grid.style.transition = 'opacity 0.4s ease'; // Just fade it back in
                    grid.style.opacity = '1'; // Make it visible again
                    grid.style.pointerEvents = 'auto'; // Make it clickable again
                    console.log('Animating grid in (fade).');

                }, 400); // This delay should match your fade-out transition duration (0.4s = 400ms)

                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                lastCategoryIndex = index; // This is the only place it's assigned after initialization
            });
        });

        const activeButton = document.querySelector('.drink-categories li.active');
        if (activeButton) {
            const selectedCategory = activeButton.getAttribute('data-category');
            drinkCards.forEach(card => {
                if (card.getAttribute('data-category') === selectedCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            console.log('Initial category filter applied on page load.');
        }
    } else {
        console.log('Category filtering section skipped: No category buttons or drink cards found on this page.');
    }


    // --- 11. Add Another Drink Functionality (for bookanevent.html) ---
    const addDrinkButton = document.getElementById('add-drink-btn'); // Corrected ID reference
    const drinkEntriesContainer = document.getElementById('drink-entries');

    if (addDrinkButton && drinkEntriesContainer) {
        console.log('Add Another Drink button and container found. Initializing...');

        // Initialize counter based on existing entries to ensure unique IDs
        let drinkEntryCounter = 1;

        function initializeDrinkCounter() {
            const existingEntries = drinkEntriesContainer.querySelectorAll('.drink-entry');
            if (existingEntries.length > 0) {
                let maxCount = 0;
                existingEntries.forEach(entry => {
                    const elementsWithId = entry.querySelectorAll('[id]');
                    elementsWithId.forEach(element => {
                        const id = element.id;
                        if (id) {
                            // Extracts the number from IDs like "drink-title-1"
                            const match = id.match(/-\d+$/);
                            if (match) {
                                const currentNum = parseInt(match[0].substring(1)); // get number after hyphen
                                if (currentNum > maxCount) {
                                    maxCount = currentNum;
                                }
                            }
                        }
                    });
                });
                drinkEntryCounter = maxCount > 0 ? maxCount + 1 : 1; // Start from next available number
                console.log('Initialized drinkEntryCounter to:', drinkEntryCounter);
            }
        }

        initializeDrinkCounter(); // Call on page load to set initial counter

        addDrinkButton.addEventListener('click', () => {
            console.log('Add Another Drink button clicked!');

            // Get the last existing drink entry to clone
            const lastDrinkEntry = drinkEntriesContainer.querySelector('.drink-entry:last-child');
            if (!lastDrinkEntry) {
                console.warn('No initial drink entry found to clone. Cannot add another.');
                return;
            }

            // Clone with all children
            const newDrinkEntry = lastDrinkEntry.cloneNode(true);

            // Assign a unique counter for the new entry
            const currentCounter = drinkEntryCounter++;

            // Update IDs and clear input values for the new cloned elements
            newDrinkEntry.querySelectorAll('[id], [name]').forEach(element => {
                // Update IDs to ensure uniqueness for client-side JavaScript/labels
                // This replaces the number at the end of an ID (e.g., -1) with the new counter
                if (element.id) {
                    element.id = element.id.replace(/-\d+$/, '') + '-' + currentCounter;
                }

                // If it's a label, update its 'for' attribute to match the new input ID
                if (element.tagName === 'LABEL' && element.htmlFor) {
                    element.htmlFor = element.htmlFor.replace(/-\d+$/, '') + '-' + currentCounter;
                }

                // Update 'name' attributes for form submission
                if (element.name) {
                    element.name = element.name.replace(/-\d+$/, '') + '-' + currentCounter;
                }

                // Clear input values
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = '';
                } else if (element.tagName === 'SELECT') {
                    element.selectedIndex = 0; // Reset select dropdowns
                }
            });

            // Create the 'remove' button and its container for this NEW entry
            const removeButtonDiv = document.createElement('div');
            removeButtonDiv.classList.add('form-group', 'remove-button-group');

            const removeButton = document.createElement('button');
            removeButton.type = 'button'; // Prevents accidental form submission
            removeButton.classList.add('remove-entry-btn'); // This class is targeted by the event listener below
            removeButton.textContent = 'X'; // The text/symbol displayed on the button

            removeButtonDiv.appendChild(removeButton); // Put the button inside its container div
            newDrinkEntry.appendChild(removeButtonDiv); // Append the button container to the new drink entry

            drinkEntriesContainer.appendChild(newDrinkEntry); // Now append the complete new entry (which includes the button)
            console.log('New drink entry added. Counter is now:', drinkEntryCounter);
        });

        // Event listener for removing a drink entry from the booking form
        // This part remains as it was, using event delegation to catch clicks on dynamically added buttons
        drinkEntriesContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-entry-btn')) { // Targets the button by its class
                const drinkEntryToRemove = event.target.closest('.drink-entry');

                if (drinkEntryToRemove) {
                    const allDrinkEntries = drinkEntriesContainer.querySelectorAll('.drink-entry');
                    if (allDrinkEntries.length > 1) { // Only remove if there's more than one entry
                        drinkEntryToRemove.remove();
                        console.log('Drink entry removed from booking form!');
                        initializeDrinkCounter(); // Re-initialize counter after removal to keep IDs correct
                    } else {
                        showToast('You must have at least one estimated drink order.');
                    }
                }
            }
        });

    } else {
        console.log('Add Another Drink button or container not found on this page. Functionality skipped.');
    }


    // --- 12. Order Summary Rendering (for checkout.html) ---
    // This function will render the order summary in the designated column.
    function renderOrderSummary(cartItems, shippingCost = 0) {
        if (!orderSummaryColumn) {
            console.log('Order summary column (#order-summary-column) not found. Skipping rendering.');
            return;
        }
        // NEW: Check if the new totals element exists
        if (!orderTotalsSummaryElement) {
            console.log('Order totals summary element (#order-totals-summary) not found. Cannot render totals separately.');
            return;
        }

        // Clear only the item list area. The heading is now in HTML, outside this div.
        orderSummaryColumn.innerHTML = '';

        let subtotal = 0;

        if (cartItems.length === 0) {
            orderSummaryColumn.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cartItems.forEach(item => {
                // Ensure price is a number for calculation
                const itemPrice = parseFloat(item.price.replace('$', ''));
                const itemTotal = itemPrice * item.quantity;
                subtotal += itemTotal;

                // Create HTML for each cart item
                const itemHTML = `
                    <div class="order-item">
                        <img src="${item.imgSrc}" alt="${item.name}" />
                        <div class="order-item-details">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-qty-price">${item.quantity} x $${itemPrice.toFixed(2)}</div>
                        </div>
                    </div>
                `;
                orderSummaryColumn.innerHTML += itemHTML;
            });
        }

        // Calculate totals
        const grandTotal = subtotal + shippingCost;

        // Render totals in the separate element
        orderTotalsSummaryElement.innerHTML = `
            <div class="order-total-summary">
                <div><span class="total-label">Subtotal:</span><span class="total-value">$${subtotal.toFixed(2)}</span></div>
                <div><span class="total-label">Shipping:</span><span class="total-value">$${shippingCost.toFixed(2)}</span></div>
                <div><span class="total-label grand-total">Grand Total:</span><span class="total-value grand-total">$${grandTotal.toFixed(2)}</span></div>
            </div>
        `;
        console.log('Order summary items rendered, totals rendered separately with shipping:', shippingCost.toFixed(2));
    }


    // --- 13. Initial Setup on Page Load ---
    // These should run after all elements and functions are defined
    await loadCartFromBackend(); // Attempt to load cart from backend (which falls back to localStorage)
    updateCartDisplay();
    updateAuthUI(); // Call this on page load to set initial auth UI state
    fetchUserProfile(); // Fetch profile based on initial auth state
    console.log('Cart data loaded and display updated on initial load.');

    // --- 13.1 Event Listener for Shipping Method Selection (on checkout.html) ---
    if (shippingMethodSelect) { // Check if the shipping dropdown element exists on this page
        shippingMethodSelect.addEventListener('change', function() {
            let selectedShippingCost = 0;
            // Get the 'value' from the currently selected <option>
            const selectedOptionValue = this.value; // This will be '', 'standard', or 'express'

            switch (selectedOptionValue) {
                case 'standard':
                    selectedShippingCost = 5.00;
                    break;
                case 'express':
                    selectedShippingCost = 15.00;
                    break;
                case '': // This is the value for "No delivery (Pick Up Order)"
                default: // Catch-all for any other unexpected value, defaults to 0
                    selectedShippingCost = 0;
                    break;
            }
            console.log('Shipping method changed to:', selectedOptionValue, 'Cost:', selectedShippingCost.toFixed(2));

            // Re-render the order summary with the new shipping cost
            renderOrderSummary(cartItems, selectedShippingCost);
        });
        console.log('Shipping method select listener attached.');

        // Trigger the 'change' event once on page load to set the initial shipping cost
        // This ensures the default value from your HTML (<option value="">No delivery</option>)
        // is correctly reflected in the summary when the page first loads.
        const initialChangeEvent = new Event('change');
        shippingMethodSelect.dispatchEvent(initialChangeEvent);

    } else if (orderSummaryColumn && orderTotalsSummaryElement) {
        // Fallback: If shippingMethodSelect isn't found (e.g., not on checkout page)
        // but order summary elements are, render with default 0 shipping.
        renderOrderSummary(cartItems, 0);
    } else {
        console.log('Order summary elements or shipping method select not found on this page. Skipping order summary setup.');
    }

    // --- NEW: Payment Form Formatting with Cleave.js ---
// This logic will only run if these elements exist on the current page.

// Find the Card Number input on the page
const cleaveCard = document.getElementById('cardNumber');
if (cleaveCard) {
    // Automatically formats the input for credit cards, adding spaces as you type
    new Cleave(cleaveCard, {
        creditCard: true,
    });
}

// Find the Expiry Date input on the page
const cleaveDate = document.getElementById('expiryDate');
if (cleaveDate) {
    // Automatically formats as MM / YY and adds the slash
    new Cleave(cleaveDate, {
        date: true,
        datePattern: ['m', 'y']
    });
}

// Find the CVV input on the page
const cleaveCvv = document.getElementById('cvv');
if (cleaveCvv) {
    // Allows only numbers and limits the length to 4 digits
    new Cleave(cleaveCvv, {
        numericOnly: true,
        blocks: [4]
    });
}


    // --- 14. Sign-Up Form Functionality (for signup.html) ---
    if (signupForm) {
        console.log('Sign-up form found. Attaching listener...');

        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const firstNameInputSignup = document.getElementById('firstName');
            const lastNameInputSignup = document.getElementById('lastName'); // Assuming this exists
            const emailInput = document.getElementById('signupEmail');
            const confirmEmailInput = document.getElementById('confirmEmail'); // Assuming this exists
            const passwordInput = document.getElementById('signupPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            const firstName = firstNameInputSignup ? firstNameInputSignup.value.trim() : '';
            const lastName = lastNameInputSignup ? lastNameInputSignup.value.trim() : '';
            const email = emailInput.value.trim();
            const confirmedEmail = confirmEmailInput ? confirmEmailInput.value.trim() : '';
            const password = passwordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            // Basic Client-Side Validation
            if (!firstName || !lastName || !email || !confirmedEmail || !password || !confirmPassword) {
                showToast('Please fill in all fields.');
                return;
            }
            if (email !== confirmedEmail) {
                showToast('Email addresses do not match.');
                return;
            }
            if (password !== confirmPassword) {
                showToast('Passwords do not match.');
                return;
            }
            if (password.length < 6) {
                showToast('Password must be at least 6 characters long.');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ firstName, lastName, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('Sign up successful! You are now logged in.');
                    // --- CHANGED THESE LINES TO sessionStorage ---
                    sessionStorage.setItem('authToken', data.token); // Store the JWT in sessionStorage
                    // --- DEBUGGING: After signup ---
                    console.log('DEBUG: After signup - AuthToken set in sessionStorage. Value present:', sessionStorage.getItem('authToken') ? 'YES' : 'NO');
                    console.log('DEBUG: After signup - Token value length:', data.token ? data.token.length : 'N/A');
                    // --- END DEBUGGING ---

                    sessionStorage.setItem('currentUserEmail', email); // Store user email in sessionStorage
                    sessionStorage.setItem('currentUserName', firstName); // Store first name in sessionStorage
                    updateAuthUI(); // Update UI immediately after successful signup/login

                    // Conditional redirect after signup
                    const checkoutData = sessionStorage.getItem('checkoutDataFromCheckout');
                    if (checkoutData) {
                        console.log('Redirecting to checkout.html after signup (came from checkout flow).');
                        sessionStorage.removeItem('checkoutDataFromCheckout');
                        window.location.href = 'checkout.html';
                    } else {
                        console.log('Redirecting to index.html after signup (standard signup).');
                        window.location.href = 'index.html';
                    }
                } else {
                    if (response.status === 409) { // Conflict: Email already exists
                        showEmailExistsPrompt(); // Show the custom modal if email exists
                    } else {
                        showToast(data.message || 'Registration failed. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Error during registration:', error);
                showToast('Network error or server unavailable. Please try again later.');
            }
        });
        console.log('Sign-up form listener attached successfully.');
    } else {
        console.log('Sign-up form (#signupForm) not found. Skipping sign-up functionality setup.');
    }
    // --- END Sign-Up Form Functionality ---


    // --- 15. Login Form Functionality (for login.html) ---
if (loginForm) {
    console.log('Login form found. Attaching listener...');
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const loginEmailInput = document.getElementById('loginEmail');
        const loginPasswordInput = document.getElementById('loginPassword');

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (!email || !password) {
            showToast('Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Login successful!');
                // --- THIS IS WHERE YOU MAKE THE CHANGES ---
                sessionStorage.setItem('authToken', data.token); // Store the JWT in sessionStorage

                // --- DEBUGGING: After login ---
                console.log('DEBUG: After login - AuthToken set in sessionStorage. Value present:', sessionStorage.getItem('authToken') ? 'YES' : 'NO');
                console.log('DEBUG: After login - Token value length:', data.token ? data.token.length : 'N/A');
                // --- END DEBUGGING ---

                sessionStorage.setItem('currentUserEmail', email); // Store user email in sessionStorage

                // Assuming login response might include firstName if successful
                if (data.firstName) {
                    sessionStorage.setItem('currentUserName', data.firstName); // Store user name in sessionStorage
                } else {
                    sessionStorage.removeItem('currentUserName'); // Clear if not provided from sessionStorage
                }

                updateAuthUI(); // Update UI immediately after successful login

                // Conditional redirect after login
                const checkoutData = sessionStorage.getItem('checkoutDataFromCheckout');
                if (checkoutData) {
                    console.log('Redirecting to checkout.html after login (came from checkout flow).');
                    sessionStorage.removeItem('checkoutDataFromCheckout');
                    window.location.href = 'checkout.html';
                } else {
                    console.log('Redirecting to index.html after login (standard login).');
                    window.location.href = 'index.html';
                }
            } else {
                showToast(data.message || 'Login failed. Invalid credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showToast('Network error or server unavailable. Please try again later.');
        }
    });
} else {
    console.log('Login form (#loginForm) not found. Skipping login functionality setup.');
}
// --- END Login Form Functionality ---


    // --- 16. Logout Functionality ---
    // The logoutLink global constant is already defined at the top.
    // The logoutLink global constant is already defined at the top.
if (logoutLink) {
    logoutLink.addEventListener('click', async function(event) {
        event.preventDefault();

        const authToken = sessionStorage.getItem('authToken');
        if (!authToken) {
            console.log('No token found, already logged out or never logged in.');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('currentUserEmail');
            sessionStorage.removeItem('currentUserName');
            // *** ADD THIS LINE TO CLEAR THE SPECIFIC CART ITEM ***
            sessionStorage.removeItem('zipAndSipCart'); // <-- ADD THIS LINE
            cartItems = []; // Also reset the in-memory cart array
            updateCartDisplay();
            updateAuthUI();
            showToast('You have been logged out.');
            window.location.href = 'index.html';
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // Send the token for logout validation
                }
            });

            // Even if the backend confirms logout, clear local storage regardless
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('currentUserEmail');
            sessionStorage.removeItem('currentUserName');
            // *** ADD THIS LINE TO CLEAR THE SPECIFIC CART ITEM ***
            sessionStorage.removeItem('zipAndSipCart'); // <-- ADD THIS LINE
            cartItems = []; // Also reset the in-memory cart array to be empty immediately

            const data = await response.json();

            if (response.ok) {
                showToast(data.message || 'You have been logged out successfully.');
            } else {
                showToast(data.message || 'Logout failed on server, but you have been logged out locally.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            showToast('Network error during logout, but you have been logged out locally.');
        } finally {
            updateAuthUI();
            updateCartDisplay();

            // --- MODIFIED: Add a small delay before redirect ---
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 100);
            // --- END MODIFIED ---
        }
        });
    }
    // --- END Logout Functionality ---


    // --- 17. Checkout Page "Place Order" Modals (for checkout.html) ---
    // Function to show the "Create Account or Guest" choice modal
    function showCheckoutChoiceModal() {
        if (checkoutChoiceModal) {
            checkoutChoiceModal.classList.add('active');
            body.classList.add('no-scroll');
            if (overlay) overlay.classList.add('active'); // Activate main overlay too
            console.log('Checkout choice modal shown.');
        }
    }

    // Function to hide the "Create Account or Guest" choice modal
    function hideCheckoutChoiceModal() {
        if (checkoutChoiceModal) {
            checkoutChoiceModal.classList.remove('active');
            // Check if no other overlays are active before removing no-scroll and main overlay
            if (!(cart && cart.classList.contains('active')) && !(mobileMenu && mobileMenu.classList.contains('menu-open')) && !(emailExistsModal && emailExistsModal.classList.contains('active')) && !(guestEmailModal && guestEmailModal.classList.contains('active')) && !(forgotPasswordModalOverlay && forgotPasswordModalOverlay.classList.contains('active'))) {
                body.classList.remove('no-scroll');
                if (overlay) overlay.classList.remove('active');
            }
            console.log('Checkout choice modal hidden.');
        }
    }

    // Function to show the "Guest Email" modal
    function showGuestEmailModal() {
        if (guestEmailModal) {
            guestEmailModal.classList.add('active');
            body.classList.add('no-scroll');
            if (overlay) overlay.classList.add('active'); // Activate main overlay too
            console.log('Guest email modal shown.');
        }
    }

    // Function to hide the "Guest Email" modal
    function hideGuestEmailModal() {
        if (guestEmailModal) {
            guestEmailModal.classList.remove('active');
            // Check if no other overlays are active before removing no-scroll and main overlay
            if (!(cart && cart.classList.contains('active')) && !(mobileMenu && mobileMenu.classList.contains('menu-open')) && !(emailExistsModal && emailExistsModal.classList.contains('active')) && !(checkoutChoiceModal && checkoutChoiceModal.classList.contains('active')) && !(forgotPasswordModalOverlay && forgotPasswordModalOverlay.classList.contains('active'))) {
                body.classList.remove('no-scroll');
                if (overlay) overlay.classList.remove('active');
            }
            console.log('Guest email modal hidden.');
        }
    }

    // Add this new function to your script.js

async function submitAuthenticatedOrder() {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        showToast('You must be logged in to place this order.');
        return;
    }

    console.log('Submitting order as a logged-in user...');

    // Gather shipping data from the form
    const shippingMethod = document.getElementById('shippingMethod')?.value;
    const shippingAddress = document.getElementById('shippingAddress')?.value;

    const orderData = {
        cartItems: cartItems, // Use the global cartItems array
        shippingAddress: shippingAddress,
        shippingMethod: shippingMethod
    };

    try {
        const response = await fetch(`${BACKEND_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Send the auth token!
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Order placed successfully! A receipt has been sent to your email.');
            // Clear the cart and redirect
            cartItems = [];
            saveCartToBackend(); // This will save an empty cart to the backend
            updateCartDisplay();
            window.location.href = 'index.html';
        } else {
            showToast(data.message || 'Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Network error placing authenticated order:', error);
        showToast('There was a network error. Please try again.');
    }
}


// Replace your existing listener block with this updated version
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Stop the form from reloading the page

        // First, validate the form fields
        const form = document.getElementById('checkout-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (cartItems.length === 0) {
            showToast('Your cart is empty.');
            return;
        }

        // --- THE SMART LOGIC ---
        // Check if an auth token exists
        const authToken = sessionStorage.getItem('authToken');

        if (authToken) {
            // If user IS logged in, submit the order directly
            submitAuthenticatedOrder();
        } else {
            // If user is NOT logged in, show the guest/create account modal
            showCheckoutChoiceModal();
        }
    });
}

    // Event Listener for "Create an Account" option
    if (createAccountOptionBtn) {
        createAccountOptionBtn.addEventListener('click', function() {
            console.log('Create an account option selected. Capturing checkout data and redirecting to signup.html...');

            // --- Capture Checkout Form Data (UPDATED to match checkout.html fields) ---
            const checkoutData = {
                cameFromCheckout: true, // Flag to indicate origin
                fullName: fullNameInput ? fullNameInput.value.trim() : '',
                shippingAddress: shippingAddressInput ? shippingAddressInput.value.trim() : '',
                shippingMethod: shippingMethodSelect ? shippingMethodSelect.value : '',
                cardNumber: cardNumberInput ? cardNumberInput.value.trim() : '',
                expiryDate: expiryDateInput ? expiryDateInput.value.trim() : '',
                cvv: cvvInput ? cvvInput.value.trim() : ''
            };
            sessionStorage.setItem('checkoutDataFromCheckout', JSON.stringify(checkoutData));
            console.log('Checkout data saved to sessionStorage:', checkoutData);
            // --- END Capture Checkout Form Data ---

            hideCheckoutChoiceModal();
            window.location.href = 'signup.html'; // Redirect to signup.html
        });
    }

    // Event Listener for "Continue as Guest" option
    if (continueAsGuestOptionBtn) {
        continueAsGuestOptionBtn.addEventListener('click', function() {
            console.log('Continue as guest option selected. Showing guest email modal...');
            hideCheckoutChoiceModal();
            showGuestEmailModal();
        });
    }

    // Event Listener for submitting guest email
    if (submitGuestEmailBtn) {
        submitGuestEmailBtn.addEventListener('click', async function() { // Added async
            const email = guestEmailInput.value.trim();
            if (email && email.includes('@') && email.includes('.')) { // Basic email validation
                console.log(`Guest order placed. Receipt sent to: ${email}`);

                // Send guest order to backend
                try {
                    const guestOrderData = {
                        customerEmail: email,
                        cartItems: cartItems,
                        // Capture other checkout form fields if needed for guest order
                        fullName: fullNameInput ? fullNameInput.value.trim() : '',
                        shippingAddress: shippingAddressInput ? shippingAddressInput.value.trim() : '',
                        shippingMethod: shippingMethodSelect ? shippingMethodSelect.value : ''
                    };
                    const response = await fetch(`${BACKEND_URL}/api/orders/guest`, { // New endpoint for guest orders
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(guestOrderData)
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showToast(`Order placed successfully! A receipt has been sent to ${email}.`);
                        hideGuestEmailModal();
                        // Clear the cart after a successful guest order
                        cartItems = [];
                        saveCartToBackend(); // Updates backend (will clear for logged-in user or save empty local for guest)
                        updateCartDisplay(); // Update UI
                        window.location.href = 'index.html'; // Redirect to homepage
                    } else {
                        showToast(data.message || 'Failed to place guest order. Please try again.');
                    }
                } catch (error) {
                    console.error('Network error placing guest order:', error);
                    showToast('Network error while placing guest order. Please check your connection.');
                }

            } else {
                showToast('Please enter a valid email address.');
            }
        });
    }

    // Event Listener for closing guest email modal via close button
    if (guestEmailModalCloseBtn) {
        guestEmailModalCloseBtn.addEventListener('click', hideGuestEmailModal);
    }
    // --- END Checkout Page "Place Order" Modals ---


    // --- 18. Pre-fill Checkout Form from sessionStorage (on checkout.html) ---
    // This runs when checkout.html page loads.
    if (window.location.pathname.includes('checkout.html') || window.location.pathname.includes('checkout')) {
        const savedCheckoutDataString = sessionStorage.getItem('checkoutDataFromCheckout');

        if (savedCheckoutDataString) {
            try {
                const savedCheckoutData = JSON.parse(savedCheckoutDataString);
                console.log('Found saved checkout data in sessionStorage. Pre-filling form:', savedCheckoutData);

                // --- Pre-fill Form Fields (UPDATED to match checkout.html fields) ---
                if (fullNameInput && savedCheckoutData.fullName) fullNameInput.value = savedCheckoutData.fullName;
                if (shippingAddressInput && savedCheckoutData.shippingAddress) shippingAddressInput.value = savedCheckoutData.shippingAddress;
                if (shippingMethodSelect && savedCheckoutData.shippingMethod) shippingMethodSelect.value = savedCheckoutData.shippingMethod;
                if (cardNumberInput && savedCheckoutData.cardNumber) cardNumberInput.value = savedCheckoutData.cardNumber;
                if (expiryDateInput && savedCheckoutData.expiryDate) expiryDateInput.value = savedCheckoutData.expiryDate;
                if (cvvInput && savedCheckoutData.cvv) cvvInput.value = savedCheckoutData.cvv;
                // --- END Pre-fill Form Fields ---

                sessionStorage.removeItem('checkoutDataFromCheckout'); // Clear the data after use
                console.log('Checkout data cleared from sessionStorage after pre-filling.');
            } catch (error) {
                console.error('Error parsing saved checkout data from sessionStorage:', error);
                sessionStorage.removeItem('checkoutDataFromCheckout'); // Clear invalid data
            }
        } else {
            console.log('No saved checkout data found in sessionStorage on checkout.html load.');
        }
    }
    // --- END Pre-fill Checkout Form ---


    // --- 19. Forgot Password Modal Logic ---
    // Check if all elements exist before adding event listeners
    if (forgotPasswordLink && forgotPasswordModalOverlay && forgotPasswordForm && cancelForgotPasswordBtn && forgotEmailInput && confirmForgotEmailInput) {

        // When the "Forgot password?" link is clicked
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior (e.g., navigating to #)
            forgotPasswordModalOverlay.classList.add('active'); // Add 'active' class to show the modal
            document.body.classList.add('modal-open'); // Add class to body to prevent background scrolling
        });

        // When the "Cancel" button in the modal is clicked
        cancelForgotPasswordBtn.addEventListener('click', () => {
            forgotPasswordModalOverlay.classList.remove('active'); // Remove 'active' class to hide the modal
            document.body.classList.remove('modal-open'); // Allow background scrolling
            forgotPasswordForm.reset(); // Clear form fields
        });

        // When clicking outside the modal content (on the overlay itself)
        forgotPasswordModalOverlay.addEventListener('click', (e) => {
            // Check if the click target is the overlay itself, not its children
            if (e.target === forgotPasswordModalOverlay) {
                forgotPasswordModalOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
                forgotPasswordForm.reset(); // Clear form fields
            }
        });

        // When the "Send Reset Link" form in the modal is submitted
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent actual form submission (which would reload the page)

            const email = forgotEmailInput.value.trim();
            const confirmEmail = confirmForgotEmailInput.value.trim();

            if (email === '' || confirmEmail === '') {
                showToast('Please fill in both email fields.');
                return;
            }

            if (email !== confirmEmail) {
                showToast('Emails do not match. Please ensure both fields have the same email address.');
                confirmForgotEmailInput.focus(); // Focus on the confirm field to correct
                return;
            }

            // Basic email format validation (more robust validation typically on backend)
            if (!email.includes('@') || !email.includes('.')) {
                showToast('Please enter a valid email address.');
                forgotEmailInput.focus();
                return;
            }

            // --- IMPORTANT: This is the actual backend integration for forgot password ---
            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, { // Replace with your actual backend endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });

                const data = await response.json();

                if (response.ok) { // Your backend should send a success flag or HTTP 200 OK
                    showToast(data.message || 'A password reset link has been sent to your email.');
                } else {
                    showToast(data.message || 'Error sending reset link. Please try again.'); // Display backend error message
                }
            } catch (error) {
                console.error('Network or server error:', error);
                showToast('An error occurred. Please try again later.');
            } finally {
                // Always hide modal and clear form after attempt, regardless of success/failure for UX
                forgotPasswordModalOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
                forgotPasswordForm.reset(); // Clear form fields after "submission"
            }
        });
    }


    // --- 20. Fetch User Profile Functionality ---
    async function fetchUserProfile() {
        const authToken = sessionStorage.getItem('authToken');
        const userProfileDisplay = document.getElementById('userProfileDisplay'); // Ensure this ID exists if you want to display profile
        const displayedUserName = document.getElementById('displayedUserName'); // Child elements for name/email
        const displayedUserEmail = document.getElementById('displayedUserEmail');

        if (!authToken) {
            // No token, user is not logged in, hide the display area
            if (userProfileDisplay) userProfileDisplay.style.display = 'none';
            console.log('No auth token found. User profile fetch skipped.');
            return;
        }

        try {
            console.log('Attempting to fetch user profile...');
            const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` // IMPORTANT: Send the token!
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log('User profile fetched successfully:', data.user);
                // Display the user data on the page
                if (userProfileDisplay) userProfileDisplay.style.display = 'block';
                if (userProfileDisplay) userProfileDisplay.classList.add('visible'); // For fade-in effect if needed
                if (displayedUserName && data.user.firstName) {
                    displayedUserName.textContent = data.user.firstName;
                } else if (displayedUserName) {
                    displayedUserName.textContent = 'User'; // Fallback if firstName is missing
                }
                if (displayedUserEmail && data.user.email) {
                    displayedUserEmail.textContent = data.user.email;
                }
            } else {
                console.error('Failed to fetch user profile:', data.message);
                // If token is invalid/expired, log out the user on the frontend
                if (response.status === 401) {
                    sessionStorage.removeItem('authToken');
                    sessionStorage.removeItem('currentUserEmail');
                    sessionStorage.removeItem('currentUserName');
                    updateAuthUI(); // Update UI to reflect logged-out state
                    showToast(data.message || 'Session expired. Please log in again.');
                }
                if (userProfileDisplay) userProfileDisplay.style.display = 'none';
            }
        } catch (error) {
            console.error('Network error fetching user profile:', error);
            showToast('Could not connect to the server to fetch profile. Please check your network.');
            if (userProfileDisplay) userProfileDisplay.style.display = 'none';
        }
    }


    // Replace your test booking form handler with this final version

if (bookingForm) {
    bookingForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Stop page from reloading

        const submitButton = document.getElementById('submit-booking-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // 1. Gather the main contact and event details from your HTML form
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const eventName = document.getElementById('event-name').value;
            const contactEmail = document.getElementById('email').value;
            const contactPhone = document.getElementById('phone').value;
            const eventDate = document.getElementById('event-date').value;
            const eventTime = document.getElementById('event-time').value;
            const eventAddress = document.getElementById('event-address').value;

            // 2. Gather all the dynamically added drink entries
            const drinkEntries = [];
            const drinkEntryElements = document.querySelectorAll('.drink-entry');

            drinkEntryElements.forEach(entry => {
                // Find each input within the drink entry div by its 'name' attribute
                const drinkType = entry.querySelector('[name="drink_title[]"]').value;
                const drinkName = entry.querySelector('[name="drink_name[]"]').value;
                const ounce = entry.querySelector('[name="drink_ounce[]"]').value;
                const quantity = entry.querySelector('[name="drink_quantity[]"]').value;
                const notes = entry.querySelector('[name="special-requests[]"]').value;
                
                drinkEntries.push({
                    drinkType: `${drinkType} (${ounce})`, // Combine title and size for the email
                    drinkName: drinkName,
                    quantity: quantity,
                    notes: notes
                });
            });

            // 3. Combine all data into a single object
            const formData = {
                contactName: `${firstName} ${lastName}`,
                eventName: eventName,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                eventDate: eventDate, // Sends date, e.g., "2025-06-20"
                eventTime: eventTime, // Sends time, e.g., "17:34"
                eventDetails: eventAddress,
                drinkEntries: drinkEntries
            };

            // 4. Send the data to your new backend endpoint
            const response = await fetch(`${BACKEND_URL}/api/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // If the server responded with an error, show it
                throw new Error(data.message || 'An unknown server error occurred.');
            }
            
            // 5. If successful, show a success message and clear the form
            showToast('Thank you! Your booking request has been sent successfully. We will be in touch soon.');
            bookingForm.reset();

        } catch (error) {
            console.error('Failed to submit booking form:', error);
            showToast(`Error: Could not send your booking request. ${error.message}`);
        } finally {
            // 6. Restore the submit button's text and state (whether it succeeded or failed)
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Add this new block to the end of script.js for the Contact Us form

if (contactForm) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Stop the page from reloading

        const submitButton = document.getElementById('submit-contact-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // 1. Get the values from the form inputs using their IDs
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const fromEmail = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // 2. Combine the data into a single object
            const formData = {
                fromName: `${firstName} ${lastName}`,
                fromEmail: fromEmail,
                message: message
            };

            // 3. Send the data to your new backend endpoint
            const response = await fetch(`${BACKEND_URL}/api/booking/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An unknown server error occurred.');
            }

            // 4. Handle the success
            showToast('Thank you for your message! We will get back to you soon.');
            contactForm.reset();

        } catch (error) {
            console.error('Failed to submit contact form:', error);
            showToast(`Error: ${error.message}`);
        } finally {
            // 5. Restore the button's original state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}


// This function will display a toast notification
function showToast(message, type = 'success') {
    // 1. Get the toast container element
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        console.error('Toast container not found! Make sure <div id="toast-container"> is in your HTML.');
        return; // Exit if container isn't there
    }

    // 2. Create a new div element for the toast message
    const toast = document.createElement('div');
    toast.classList.add('toast'); // Add the base 'toast' class for styling

    // 3. Add type-specific class (e.g., 'error', 'info')
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'info') {
        toast.classList.add('info');
    } // 'success' is default and doesn't need a specific class unless styled differently

    // 4. Set the message text
    toast.textContent = message;

    // 5. Append the toast to the container
    toastContainer.appendChild(toast);

    // 6. Trigger the show animation (using a small delay to ensure CSS transition)
    // RequestAnimationFrame is generally better for visual updates
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 7. Set a timeout to hide and remove the toast after a few seconds
    setTimeout(() => {
        toast.classList.remove('show'); // Start hide animation
        toast.classList.add('hide');    // Apply hide class if you want a separate exit animation

        // Listen for the end of the transition to remove the element from the DOM
        // This prevents the DOM from accumulating hidden toast elements
        toast.addEventListener('transitionend', () => {
            toast.remove(); // Remove the element after the animation finishes
        }, { once: true }); // Ensure this listener only runs once
    }, 3000); // Toast will be visible for 3 seconds (3000 milliseconds)
}



}); // End of DOMContentLoaded