/**
 * Dark Storefront Interactive Scripts - CMS Model 3D
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        try { initCartDropdown(); } catch (e) { console.warn('Cart error:', e); }
        try { initMarqueeInteraction(); } catch (e) { console.warn('Marquee error:', e); }
        try { initRelatedProductsClick(); } catch (e) { console.warn('Related products error:', e); }
        try { initGalleryThumbnails(); } catch (e) { console.warn('Gallery error:', e); }
        try { initShopeeVariations(); } catch (e) { console.warn('Variations error:', e); }
        try { initAjaxAddToCart(); } catch (e) { console.warn('Ajax add to cart error:', e); }
        try { initAuthPage(); } catch (e) { console.warn('Auth page error:', e); }
    });

    /**
     * Shopping Cart Dropdown & Popover Handling
     */
    function initCartDropdown() {
        var cartWrapper = document.getElementById('dsCartWrapper');
        var cartBtn = document.getElementById('dsCartBtn');
        var cartDropdown = document.getElementById('dsCartDropdown');
        var cartClose = document.getElementById('dsCartClose');

        if (!cartWrapper || !cartDropdown) {
            return;
        }

        var closeTimeout = null;

        // Open on hover with safety delay
        cartWrapper.addEventListener('mouseenter', function() {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            cartWrapper.classList.add('is-open');
        });

        cartWrapper.addEventListener('mouseleave', function() {
            closeTimeout = setTimeout(function() {
                cartWrapper.classList.remove('is-open');
            }, 250);
        });

        // Toggle on click (essential for touch devices and explicit clicks)
        if (cartBtn) {
            cartBtn.addEventListener('click', function(e) {
                // If clicked on desktop/mobile, toggle dropdown
                e.preventDefault();
                cartWrapper.classList.toggle('is-open');
            });
        }

        // Close button inside dropdown
        if (cartClose) {
            cartClose.addEventListener('click', function(e) {
                e.stopPropagation();
                cartWrapper.classList.remove('is-open');
            });
        }

        // Close when clicking anywhere outside
        document.addEventListener('click', function(e) {
            if (!cartWrapper.contains(e.target)) {
                cartWrapper.classList.remove('is-open');
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                cartWrapper.classList.remove('is-open');
            }
        });
    }

    /**
     * Running Blog Posts Marquee Pause on Hover/Touch
     */
    function initMarqueeInteraction() {
        var marqueeTrack = document.querySelector('.ds-marquee-track');
        if (!marqueeTrack) return;

        // Clone items once more if track is too short for wide screens
        var cards = marqueeTrack.querySelectorAll('.ds-post-card');
        if (cards.length > 0 && cards.length < 8) {
            cards.forEach(function(card) {
                var clone = card.cloneNode(true);
                marqueeTrack.appendChild(clone);
            });
        }
    }

    /**
     * Related Products Redirection Handler
     * Ensures any click on a related product card or its button seamlessly navigates to the related product page.
     */
    function initRelatedProductsClick() {
        var relatedCards = document.querySelectorAll('.related.products ul.products li.product');
        if (!relatedCards || relatedCards.length === 0) return;

        relatedCards.forEach(function(card) {
            card.style.cursor = 'pointer';

            // Click on the card container
            card.addEventListener('click', function(e) {
                // If the user already clicked an <a> tag directly, let it navigate naturally
                if (e.target.closest('a')) {
                    return;
                }

                // Find the main product link inside the card
                var primaryLink = card.querySelector('a.woocommerce-LoopProduct-link') ||
                                  card.querySelector('a.ds-related-redirect-btn') ||
                                  card.querySelector('a');

                if (primaryLink && primaryLink.href) {
                    window.location.href = primaryLink.href;
                }
            });
        });
    }

    /**
     * Product Gallery Multi-angle Thumbnails Switcher
     * Supports clicking any of the 4 angle thumbnails to smoothly switch the main image
     */
    function initGalleryThumbnails() {
        var gallery = document.querySelector('.woocommerce-product-gallery');
        if (!gallery) return;

        function goToSlide(targetIndex) {
            var thumbs = gallery.querySelectorAll('.flex-control-thumbs li img');
            var slides = gallery.querySelectorAll('.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image');
            var wrapper = gallery.querySelector('.woocommerce-product-gallery__wrapper');
            var viewport = gallery.querySelector('.flex-viewport');

            // 1. Update thumbnail visual active state
            if (thumbs.length > 0) {
                thumbs.forEach(function(t, idx) {
                    if (idx === targetIndex) {
                        t.classList.add('flex-active');
                    } else {
                        t.classList.remove('flex-active');
                    }
                });
            }

            // 2. Call FlexSlider API if active
            if (window.jQuery) {
                var $gallery = window.jQuery(gallery);
                var slider = $gallery.data('flexslider');
                if (slider && typeof slider.flexAnimate === 'function') {
                    slider.flexAnimate(targetIndex);
                } else if (typeof $gallery.flexslider === 'function') {
                    $gallery.flexslider(targetIndex);
                }
            }

            // 3. Guaranteed DOM translation & slide class update
            if (slides.length > targetIndex) {
                slides.forEach(function(s, idx) {
                    if (idx === targetIndex) {
                        s.classList.add('flex-active-slide');
                    } else {
                        s.classList.remove('flex-active-slide');
                    }
                });

                if (wrapper) {
                    var slideWidth = (viewport ? viewport.offsetWidth : 0) || slides[0].offsetWidth || gallery.offsetWidth;
                    if (slideWidth > 0) {
                        wrapper.style.transform = 'translate3d(-' + (targetIndex * slideWidth) + 'px, 0px, 0px)';
                        wrapper.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                    }
                }
            }
        }

        // Global delegated click listener on gallery
        gallery.addEventListener('click', function(e) {
            var thumb = e.target.closest('.flex-control-thumbs li');
            if (!thumb) return;

            var allLis = Array.from(gallery.querySelectorAll('.flex-control-thumbs li'));
            var index = allLis.indexOf(thumb);
            if (index !== -1) {
                goToSlide(index);
            }
        });

        // Set titles on thumbnails for accessibility & tooltip
        var checkThumbs = setInterval(function() {
            var thumbs = gallery.querySelectorAll('.flex-control-thumbs li img');
            if (thumbs.length > 0) {
                clearInterval(checkThumbs);
                thumbs.forEach(function(thumb, idx) {
                    thumb.setAttribute('title', 'Xem góc chụp ' + (idx + 1));
                    thumb.parentElement.style.cursor = 'pointer';
                });
            }
        }, 150);

        setTimeout(function() { clearInterval(checkThumbs); }, 6000);
    }

    /**
     * Shopee-Style In-Place Variation Switcher
     * 1. Homepage Card: Updates price, badge, thumbnail image, format pill, and description dynamically in-place WITHOUT navigating away.
     * 2. Single Product Page: Connects custom pill buttons to WooCommerce variable select form and triggers in-place variation updates.
     */
    function initShopeeVariations() {
        // === 1. Homepage Card-level Variation Switcher ===
        var cardButtons = document.querySelectorAll('.ds-card-opt-btn');
        if (cardButtons.length > 0) {
            cardButtons.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var card = btn.closest('.ds-product-card') || document.getElementById('card-swordsman');
                    if (!card) return;

                    // Update button active states
                    var parentGroup = btn.closest('.ds-shopee-btns');
                    if (parentGroup) {
                        parentGroup.querySelectorAll('.ds-card-opt-btn').forEach(function(b) {
                            b.classList.remove('active');
                        });
                    }
                    btn.classList.add('active');

                    // Read attributes from button
                    var size       = btn.getAttribute('data-size') || '30cm';
                    var priceDel   = btn.getAttribute('data-price-del');
                    var priceCur   = btn.getAttribute('data-price-cur');
                    var priceLabel = btn.getAttribute('data-price-label');
                    var badgeText  = btn.getAttribute('data-badge');
                    var pillText   = btn.getAttribute('data-pill');
                    var pillType   = btn.getAttribute('data-pill-type') || (size === '30cm' ? 'vip' : 'standard');
                    var ratingText = btn.getAttribute('data-rating');
                    var descText   = btn.getAttribute('data-desc');
                    var imgSrc     = btn.getAttribute('data-img');

                    // 1. Badge update
                    var badgeEl = card.querySelector('.ds-dyn-badge');
                    if (badgeEl && badgeText) {
                        badgeEl.textContent = badgeText;
                    }

                    // 2. Card theme class & glow
                    if (size === '16cm') {
                        card.classList.remove('ds-product-card-vip');
                        card.classList.add('ds-product-card-standard');
                    } else {
                        card.classList.remove('ds-product-card-standard');
                        card.classList.add('ds-product-card-vip');
                    }

                    // 3. Thumbnail image crossfade
                    var imgEl = card.querySelector('.ds-dyn-thumb-img');
                    if (imgEl && imgSrc && imgEl.src !== imgSrc) {
                        imgEl.style.transition = 'opacity 0.25s ease';
                        imgEl.style.opacity = '0.35';
                        var preloadImg = new Image();
                        preloadImg.onload = function() {
                            imgEl.src = imgSrc;
                            imgEl.style.opacity = '1';
                        };
                        preloadImg.src = imgSrc;
                    }

                    // 4. Format pill update
                    var pillEl = card.querySelector('.ds-dyn-format');
                    if (pillEl && pillText) {
                        pillEl.textContent = pillText;
                        if (pillType === 'vip') {
                            pillEl.className = 'ds-dyn-format ds-dyn-pill-vip';
                            pillEl.style.background = 'rgba(250, 204, 21, 0.15)';
                            pillEl.style.color = '#facc15';
                            pillEl.style.borderColor = 'rgba(250, 204, 21, 0.4)';
                        } else {
                            pillEl.className = 'ds-dyn-format ds-dyn-pill-std';
                            pillEl.style.background = 'rgba(56, 189, 248, 0.15)';
                            pillEl.style.color = '#38bdf8';
                            pillEl.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                        }
                    }

                    // 5. Rating text update
                    var ratingEl = card.querySelector('.ds-dyn-rating');
                    if (ratingEl && ratingText) {
                        ratingEl.textContent = ratingText;
                    }

                    // 6. Excerpt text update
                    var descEl = card.querySelector('.ds-dyn-desc');
                    if (descEl && descText) {
                        descEl.innerHTML = descText;
                    }

                    // 7. Price label & amount update with smooth glow flash
                    var priceLabelEl = card.querySelector('.ds-dyn-price-label');
                    if (priceLabelEl && priceLabel) {
                        priceLabelEl.textContent = priceLabel;
                    }

                    var delEl = card.querySelector('.ds-dyn-del');
                    if (delEl && priceDel) {
                        delEl.textContent = priceDel;
                    }

                    var curEl = card.querySelector('.ds-dyn-cur');
                    if (curEl && priceCur) {
                        curEl.textContent = priceCur;
                    }

                    var priceBox = card.querySelector('.ds-product-price');
                    if (priceBox) {
                        priceBox.classList.remove('ds-price-flash');
                        void priceBox.offsetWidth; // Trigger reflow
                        priceBox.classList.add('ds-price-flash');
                    }
                });
            });
        }

        // === 2. Single Product Page Shopee Switcher ===
        var singleButtons = document.querySelectorAll('.ds-shopee-single-p .ds-shopee-btn');
        if (singleButtons.length > 0) {
            var getVariationSelect = function() {
                return document.querySelector('form.variations_form select[name="attribute_phan-loai"]') ||
                       document.querySelector('form.variations_form select#phan-loai') ||
                       document.querySelector('select[name^="attribute_"]');
            };

            singleButtons.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();

                    var val = btn.getAttribute('data-val');
                    if (!val) return;

                    // Toggle visual active class
                    singleButtons.forEach(function(b) { b.classList.remove('active'); });
                    btn.classList.add('active');

                    // Synchronize with WooCommerce variable product select
                    var select = getVariationSelect();
                    if (select) {
                        select.value = val;

                        // Trigger native change event
                        var evt = new Event('change', { bubbles: true });
                        select.dispatchEvent(evt);

                        // Trigger jQuery change event for WooCommerce's add-to-cart-variation.js
                        if (window.jQuery) {
                            window.jQuery(select).val(val).trigger('change');
                        }
                    }

                    // Instant UI feedback for single product price if variation form takes a moment
                    var singlePrice = btn.getAttribute('data-price');
                    var singleReg   = btn.getAttribute('data-reg');
                    if (singlePrice) {
                        var mainPriceEl = document.querySelector('.woocommerce-variation-price') ||
                                          document.querySelector('.summary.entry-summary p.price');
                        if (mainPriceEl) {
                            var html = '';
                            if (singleReg) {
                                html += '<del style="font-size: 0.95rem; color: #64748b; font-weight: normal; margin-right: 6px;"><span class="woocommerce-Price-amount amount"><bdi>' + singleReg + '</bdi></span></del> ';
                            }
                            html += '<ins style="text-decoration: none;"><span class="woocommerce-Price-amount amount"><bdi>' + singlePrice + '</bdi></span></ins>';
                            mainPriceEl.innerHTML = html;
                            mainPriceEl.classList.remove('ds-price-flash');
                            void mainPriceEl.offsetWidth;
                            mainPriceEl.classList.add('ds-price-flash');
                        }
                    }
                });
            });

            // If WooCommerce selects a variation programmatically, sync buttons
            if (window.jQuery) {
                window.jQuery('form.variations_form').on('found_variation', function(event, variation) {
                    if (variation && variation.attributes) {
                        var chosenVal = variation.attributes['attribute_phan-loai'] || variation.attributes[Object.keys(variation.attributes)[0]];
                        if (chosenVal) {
                            singleButtons.forEach(function(b) {
                                if (b.getAttribute('data-val') === chosenVal) {
                                    b.classList.add('active');
                                } else {
                                    b.classList.remove('active');
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
     * AJAX Add to Cart & Live Mini-Cart Synchronizer
     * - Intercepts single product and archive add-to-cart buttons
     * - Prevents page reloads
     * - Updates header cart count & subtotal in-place
     * - Renders updated mini-cart dropdown items
     * - Displays a sleek, floating Toast Notification with product info and checkout buttons
     */
    function initAjaxAddToCart() {
        var $ = window.jQuery;
        if (!$) return;

        // Check if user is logged in before allowing purchase
        function checkGuestPurchase(e) {
            // Standalone mode: allow guest purchases and fast checkout seamlessly
            return false;
        }

        // 1. Intercept Single Product Page form.cart submit
        $(document).on('submit', 'form.cart', function(e) {
            if (checkGuestPurchase(e)) {
                return false;
            }
            e.preventDefault();

            var $form = $(this);
            var $btn = $form.find('button.single_add_to_cart_button, button[type="submit"]');

            if ($btn.hasClass('ds-loading')) {
                return false;
            }

            var formData = new FormData($form[0]);
            formData.append('action', 'cms_add_to_cart');
            // Remove 'add-to-cart' from formData so WooCommerce WC_Form_Handler does not trigger duplicate add_to_cart_action
            formData.delete('add-to-cart');

            var qtyVal = $form.find('input[name="quantity"]').val() || 1;
            formData.set('quantity', qtyVal);

            if (window.cms_store_vars && window.cms_store_vars.nonce) {
                formData.append('security', window.cms_store_vars.nonce);
            }

            // Ensure product_id is detected
            var productId = $form.find('input[name="product_id"]').val() ||
                            $form.find('input[name="add-to-cart"]').val() ||
                            $form.find('button[name="add-to-cart"]').val() ||
                            $form.data('product_id');

            if (productId) {
                formData.set('product_id', productId);
            }

            // If variable product, ensure active Shopee button value is populated if select is empty
            var $selectPhanLoai = $form.find('select[name="attribute_phan-loai"], select#phan-loai');
            if ($selectPhanLoai.length > 0 && (!$selectPhanLoai.val() || $selectPhanLoai.val() === '')) {
                var activeShopeeVal = $('.ds-shopee-single-p .ds-shopee-btn.active').attr('data-val');
                if (activeShopeeVal) {
                    $selectPhanLoai.val(activeShopeeVal);
                    formData.set('attribute_phan-loai', activeShopeeVal);
                }
            }

            // Visual loading state on button
            var origBtnHtml = $btn.html();
            $btn.addClass('ds-loading').prop('disabled', true).html('<span class="ds-cart-spin"></span> Đang thêm vào giỏ...');

            var ajaxUrl = (window.cms_store_vars && window.cms_store_vars.ajax_url) ? window.cms_store_vars.ajax_url : '/wp-admin/admin-ajax.php';

            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function(response) {
                    if (response && response.success && response.data) {
                        var data = response.data;

                        // Visual success confirmation on button
                        $btn.html('✓ Đã thêm vào giỏ hàng!').addClass('ds-btn-success-state');
                        setTimeout(function() {
                            $btn.removeClass('ds-loading ds-btn-success-state').prop('disabled', false).html(origBtnHtml);
                        }, 2200);

                        // Update header cart count, total, and dropdown body
                        updateHeaderCart(data);

                        // Show sleek floating Toast Notification
                        showCartToast(data);

                        // Temporarily reveal mini-cart dropdown so user sees the product entered cart
                        revealMiniCartTemporarily();
                    } else {
                        var errMsg = (response && response.data && response.data.message) ? response.data.message : 'Có lỗi khi thêm vào giỏ hàng.';
                        showCartErrorToast(errMsg);
                        $btn.removeClass('ds-loading').prop('disabled', false).html(origBtnHtml);
                    }
                },
                error: function() {
                    showCartErrorToast('Lỗi kết nối máy chủ. Vui lòng thử lại.');
                    $btn.removeClass('ds-loading').prop('disabled', false).html(origBtnHtml);
                }
            });

            return false;
        });

        // 2. Intercept Loop Add to Cart Buttons (.ajax_add_to_cart, .ds-btn-buy, etc.)
        $(document).on('click', '.ajax_add_to_cart, a.add_to_cart_button, .ds-btn-buy, .single_add_to_cart_button', function(e) {
            if (checkGuestPurchase(e)) {
                return false;
            }
            var $btn = $(this);
            var productId = $btn.data('product_id') || $btn.attr('data-product_id');

            if (!productId) return;

            // Let WooCommerce or our handler process AJAX
            $btn.addClass('ds-loading');
        });

        // Listen to WooCommerce native added_to_cart event for fragments sync
        $(document.body).on('added_to_cart', function(event, fragments, cart_hash, $button) {
            if (window.cms_store_vars) {
                $.post(window.cms_store_vars.ajax_url, {
                    action: 'cms_add_to_cart',
                    product_id: $button ? ($button.data('product_id') || 0) : 0,
                    quantity: 0 // Just refresh data
                }, function(res) {
                    if (res && res.success && res.data) {
                        updateHeaderCart(res.data);
                        showCartToast(res.data);
                        revealMiniCartTemporarily();
                    }
                }, 'json');
            }
        });

        // 3. Mini-Cart Dropdown Item Removal via AJAX (Zero page reload)
        $(document).on('click', '.ds-cart-item-remove', function(e) {
            var $btn = $(this);
            var cartKey = $btn.data('cart-key') || $btn.closest('.ds-cart-item').data('cart-key');

            if (cartKey) {
                e.preventDefault();
                e.stopPropagation();

                var $item = $btn.closest('.ds-cart-item');
                $item.css({ opacity: '0.3', transition: 'all 0.2s ease', transform: 'scale(0.95)' });

                var ajaxUrl = (window.cms_store_vars && window.cms_store_vars.ajax_url) ? window.cms_store_vars.ajax_url : '/wp-admin/admin-ajax.php';

                $.post(ajaxUrl, {
                    action: 'cms_remove_from_cart',
                    cart_item_key: cartKey
                }, function(response) {
                    if (response && response.success && response.data) {
                        updateHeaderCart(response.data);
                    } else {
                        // Fallback to normal remove URL if AJAX fails
                        window.location.href = $btn.attr('href');
                    }
                }, 'json').fail(function() {
                    window.location.href = $btn.attr('href');
                });
            }
        });
    }

    /**
     * Updates header cart badge, subtotal, and dropdown body in-place
     */
    function updateHeaderCart(data) {
        // 1. Badge count with pulse bump animation
        var badge = document.getElementById('dsCartBadge');
        if (badge) {
            badge.textContent = data.cart_count;
            badge.classList.remove('ds-cart-bump');
            void badge.offsetWidth; // Trigger reflow
            badge.classList.add('ds-cart-bump');
        }

        document.querySelectorAll('.ds-cart-count-num, .ds-cart-badge').forEach(function(el) {
            el.textContent = data.cart_count;
        });

        // 2. Subtotal texts
        if (data.cart_total) {
            document.querySelectorAll('.ds-cart-total, .ds-cart-subtotal-val, .ds-cart-subtotal strong').forEach(function(el) {
                el.innerHTML = data.cart_total;
            });
        }

        // 3. Dropdown body HTML
        if (data.dropdown_html) {
            document.querySelectorAll('.ds-cart-dropdown-body').forEach(function(body) {
                body.innerHTML = data.dropdown_html;
            });
        }
    }

    /**
     * Reveals the mini-cart dropdown popover temporarily (2.8s) so user clearly sees the item entered cart
     */
    function revealMiniCartTemporarily() {
        var wrapper = document.getElementById('dsCartWrapper');
        if (!wrapper) return;

        wrapper.classList.add('is-open');
        wrapper.classList.add('ds-cart-highlight');

        setTimeout(function() {
            wrapper.classList.remove('ds-cart-highlight');
            // Only auto-close if user is not currently hovering over it
            if (!wrapper.matches(':hover')) {
                wrapper.classList.remove('is-open');
            }
        }, 2800);
    }

    /**
     * Floating Toast Notification on Successful Add to Cart
     */
    function showCartToast(data) {
        var container = document.getElementById('dsCartToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'dsCartToastContainer';
            container.className = 'ds-cart-toast-container';
            document.body.appendChild(container);
        }

        var toast = document.createElement('div');
        toast.className = 'ds-cart-toast';

        var cartUrl = data.cart_url || (window.cms_store_vars ? window.cms_store_vars.cart_url : '/cart/');
        var checkoutUrl = data.checkout_url || (window.cms_store_vars ? window.cms_store_vars.checkout_url : '/checkout/');

        var thumbHtml = data.product_thumb ? '<div class="ds-toast-thumb"><img src="' + data.product_thumb + '" alt="' + (data.product_name || '') + '"></div>' : '';
        var variantHtml = data.variation_label ? '<div class="ds-toast-variant">⚡ ' + data.variation_label + '</div>' : '';

        toast.innerHTML = 
            '<div class="ds-toast-inner">' +
                '<div class="ds-toast-top">' +
                    '<div class="ds-toast-badge-wrap">' +
                        '<span class="ds-toast-check-icon">✓</span>' +
                        '<span class="ds-toast-status">ĐÃ THÊM VÀO GIỎ HÀNG THÀNH CÔNG!</span>' +
                    '</div>' +
                    '<button type="button" class="ds-toast-close-btn" title="Đóng">&times;</button>' +
                '</div>' +
                '<div class="ds-toast-content">' +
                    thumbHtml +
                    '<div class="ds-toast-details">' +
                        '<h5 class="ds-toast-title">' + (data.product_name || 'Sản phẩm 3D') + '</h5>' +
                        variantHtml +
                        '<div class="ds-toast-price-row">' +
                            '<span class="ds-toast-qty">Số lượng: <strong>' + (data.quantity || 1) + '</strong></span>' +
                            '<span class="ds-toast-price">' + (data.product_price || '') + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="ds-toast-actions">' +
                    '<a href="' + cartUrl + '" class="ds-toast-btn ds-toast-btn-outline">🛒 Xem Giỏ Hàng (' + data.cart_count + ')</a>' +
                    '<a href="' + checkoutUrl + '" class="ds-toast-btn ds-toast-btn-primary">⚡ Thanh Toán Ngay →</a>' +
                '</div>' +
                '<div class="ds-toast-progress"></div>' +
            '</div>';

        container.appendChild(toast);

        // Slide in
        requestAnimationFrame(function() {
            toast.classList.add('is-active');
        });

        var autoDismiss = null;
        function dismiss() {
            if (autoDismiss) clearTimeout(autoDismiss);
            toast.classList.remove('is-active');
            toast.classList.add('is-hiding');
            setTimeout(function() {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 350);
        }

        var closeBtn = toast.querySelector('.ds-toast-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', dismiss);
        }

        autoDismiss = setTimeout(dismiss, 4500);
    }

    /**
     * Floating Toast for Errors
     */
    function showCartErrorToast(msg) {
        var container = document.getElementById('dsCartToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'dsCartToastContainer';
            container.className = 'ds-cart-toast-container';
            document.body.appendChild(container);
        }

        var toast = document.createElement('div');
        toast.className = 'ds-cart-toast ds-cart-toast-error';
        toast.innerHTML = 
            '<div class="ds-toast-inner">' +
                '<div class="ds-toast-top">' +
                    '<div class="ds-toast-badge-wrap">' +
                        '<span class="ds-toast-check-icon ds-toast-err-icon">!</span>' +
                        '<span class="ds-toast-status" style="color: #f87171;">KHÔNG THỂ THÊM VÀO GIỎ HÀNG</span>' +
                    '</div>' +
                    '<button type="button" class="ds-toast-close-btn" title="Đóng">&times;</button>' +
                '</div>' +
                '<div class="ds-toast-content">' +
                    '<p class="ds-toast-err-msg">' + msg + '</p>' +
                '</div>' +
            '</div>';

        container.appendChild(toast);

        requestAnimationFrame(function() { toast.classList.add('is-active'); });

        setTimeout(function() {
            toast.classList.remove('is-active');
            toast.classList.add('is-hiding');
            setTimeout(function() {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 350);
        }, 4000);
    }

    /**
     * Account Auth Page Interactions (Login / Register Tabs & AJAX on /my-account/)
     */
    function initAuthPage() {
        var userWrapper = document.getElementById('dsUserWrapper');
        var userBtn = document.getElementById('dsUserBtn');

        // 1. Logged-in user dropdown interactions (hover & click)
        if (userWrapper) {
            var userDropdown = document.getElementById('dsUserDropdown');

            if (userBtn) {
                userBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    userWrapper.classList.toggle('is-open');
                });
            }

            document.addEventListener('click', function(e) {
                if (!userWrapper.contains(e.target)) {
                    userWrapper.classList.remove('is-open');
                }
            });
        }

        // 2. Dedicated Auth Page Tab Switching
        var tabBtns = document.querySelectorAll('.ds-auth-tab-btn');
        var feedbackEl = document.getElementById('dsAuthFeedback');
        var loginForm = document.getElementById('dsAjaxLoginForm');
        var registerForm = document.getElementById('dsAjaxRegisterForm');

        function switchTab(tabName) {
            if (typeof window.dsSwitchTab === 'function') {
                window.dsSwitchTab(tabName);
                return;
            }

            tabBtns.forEach(function(btn) {
                if (btn.getAttribute('data-tab') === tabName || btn.id === ('dsTab' + (tabName === 'login' ? 'LoginBtn' : 'RegisterBtn'))) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            var panelLogin = document.getElementById('dsPanelLogin');
            var panelRegister = document.getElementById('dsPanelRegister');

            if (tabName === 'login') {
                if (panelLogin) {
                    panelLogin.classList.add('active');
                    panelLogin.style.setProperty('display', 'block', 'important');
                }
                if (panelRegister) {
                    panelRegister.classList.remove('active');
                    panelRegister.style.setProperty('display', 'none', 'important');
                }
                var uField = document.getElementById('dsLoginUsername');
                if (uField) setTimeout(function() { uField.focus(); }, 100);
            } else {
                if (panelRegister) {
                    panelRegister.classList.add('active');
                    panelRegister.style.setProperty('display', 'block', 'important');
                }
                if (panelLogin) {
                    panelLogin.classList.remove('active');
                    panelLogin.style.setProperty('display', 'none', 'important');
                }
                var rField = document.getElementById('dsRegFullName');
                if (rField) setTimeout(function() { rField.focus(); }, 100);
            }

            if (feedbackEl) {
                feedbackEl.style.display = 'none';
                feedbackEl.className = 'ds-auth-feedback';
                feedbackEl.textContent = '';
            }
        }

        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var tab = this.getAttribute('data-tab') || (this.id === 'dsTabRegisterBtn' ? 'register' : 'login');
                switchTab(tab);
            });
        });

        // Helper to show message in auth feedback box
        function showFeedback(type, message) {
            if (!feedbackEl) return;
            feedbackEl.className = 'ds-auth-feedback ds-auth-feedback-' + type;
            feedbackEl.innerHTML = (type === 'success' ? '✓ ' : '⚠️ ') + message;
            feedbackEl.style.display = 'block';
        }

        // Password Show / Hide Eye Toggle
        var passToggles = document.querySelectorAll('.ds-password-toggle');
        passToggles.forEach(function(toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var targetId = this.getAttribute('data-target');
                var input = document.getElementById(targetId);
                if (!input) return;
                var eyeIcon = this.querySelector('.ds-icon-eye');
                var eyeOffIcon = this.querySelector('.ds-icon-eye-off');
                if (input.type === 'password') {
                    input.type = 'text';
                    this.classList.add('is-visible');
                    this.setAttribute('title', 'Ẩn mật khẩu');
                    if (eyeIcon) eyeIcon.style.display = 'none';
                    if (eyeOffIcon) eyeOffIcon.style.display = 'inline-block';
                } else {
                    input.type = 'password';
                    this.classList.remove('is-visible');
                    this.setAttribute('title', 'Hiện mật khẩu');
                    if (eyeIcon) eyeIcon.style.display = 'inline-block';
                    if (eyeOffIcon) eyeOffIcon.style.display = 'none';
                }
            });
        });

        // Handle AJAX Login Submit
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var submitBtn = document.getElementById('dsLoginSubmitBtn');
                var origText = submitBtn ? submitBtn.innerHTML : '';

                var username = (document.getElementById('dsLoginUsername') || {}).value || '';
                var password = (document.getElementById('dsLoginPassword') || {}).value || '';
                var rememberme = (loginForm.querySelector('input[name="rememberme"]') || {}).checked ? 'forever' : '';
                var redirectVal = (loginForm.querySelector('input[name="redirect_to"]') || {}).value || '/';

                if (!username || !password) {
                    showFeedback('error', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
                    return;
                }

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('is-loading');
                    submitBtn.innerHTML = '<span class="ds-spinner"></span> Đang xác thực...';
                }

                var formData = new URLSearchParams();
                formData.append('action', 'cms_ajax_login');
                formData.append('security', (window.cms_store_vars && window.cms_store_vars.nonce) ? window.cms_store_vars.nonce : '');
                formData.append('username', username);
                formData.append('password', password);
                formData.append('rememberme', rememberme);

                var ajaxUrl = (window.cms_store_vars && window.cms_store_vars.ajax_url) ? window.cms_store_vars.ajax_url : '/wp-admin/admin-ajax.php';

                fetch(ajaxUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: formData.toString()
                })
                .then(function(res) { return res.json(); })
                .then(function(res) {
                    if (res.success) {
                        showFeedback('success', (res.data && res.data.message) ? res.data.message : 'Đăng nhập thành công! Đang chuyển hướng...');
                        setTimeout(function() {
                            window.location.href = redirectVal || (res.data && res.data.redirect_url) || '/';
                        }, 500);
                    } else {
                        showFeedback('error', (res.data && res.data.message) ? res.data.message : 'Đăng nhập thất bại.');
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.classList.remove('is-loading');
                            submitBtn.innerHTML = origText;
                        }
                    }
                })
                .catch(function() {
                    showFeedback('error', 'Có lỗi mạng xảy ra khi kết nối máy chủ.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('is-loading');
                        submitBtn.innerHTML = origText;
                    }
                });
            });
        }

        // Handle AJAX Register Submit
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var submitBtn = document.getElementById('dsRegisterSubmitBtn');
                var origText = submitBtn ? submitBtn.innerHTML : '';

                var fullname = (document.getElementById('dsRegFullName') || {}).value || '';
                var phone = (document.getElementById('dsRegPhone') || {}).value || '';
                var email = (document.getElementById('dsRegEmail') || {}).value || '';
                var password = (document.getElementById('dsRegPassword') || {}).value || '';
                var confirmPass = (document.getElementById('dsRegPasswordConfirm') || {}).value || '';
                var redirectVal = (registerForm.querySelector('input[name="redirect_to"]') || {}).value || '/';

                if (!fullname.trim() || !phone.trim() || !email.trim() || !password || !confirmPass) {
                    showFeedback('error', 'Vui lòng điền đầy đủ tất cả các trường thông tin.');
                    return;
                }

                if (password.length < 6) {
                    showFeedback('error', 'Mật khẩu phải có độ dài tối thiểu từ 6 ký tự.');
                    return;
                }

                if (password !== confirmPass) {
                    showFeedback('error', 'Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
                    return;
                }

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('is-loading');
                    submitBtn.innerHTML = '<span class="ds-spinner"></span> Đang tạo tài khoản...';
                }

                var formData = new URLSearchParams();
                formData.append('action', 'cms_ajax_register');
                formData.append('security', (window.cms_store_vars && window.cms_store_vars.nonce) ? window.cms_store_vars.nonce : '');
                formData.append('fullname', fullname.trim());
                formData.append('phone', phone.trim());
                formData.append('email', email.trim());
                formData.append('password', password);
                formData.append('confirm_password', confirmPass);

                var ajaxUrl = (window.cms_store_vars && window.cms_store_vars.ajax_url) ? window.cms_store_vars.ajax_url : '/wp-admin/admin-ajax.php';

                fetch(ajaxUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: formData.toString()
                })
                .then(function(res) { return res.json(); })
                .then(function(res) {
                    if (res.success) {
                        showFeedback('success', (res.data && res.data.message) ? res.data.message : 'Tạo tài khoản thành công! Đang chuyển hướng...');
                        setTimeout(function() {
                            window.location.href = redirectVal || (res.data && res.data.redirect_url) || '/';
                        }, 500);
                    } else {
                        showFeedback('error', (res.data && res.data.message) ? res.data.message : 'Không thể tạo tài khoản.');
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.classList.remove('is-loading');
                            submitBtn.innerHTML = origText;
                        }
                    }
                })
                .catch(function() {
                    showFeedback('error', 'Có lỗi mạng xảy ra khi kết nối máy chủ.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('is-loading');
                        submitBtn.innerHTML = origText;
                    }
                });
            });
        }
    }

    /**
     * Account Dropdown Interaction (Click/Touch support & Outside Click Close)
     */
    function initAccountDropdown() {
        var wrapper = document.getElementById('dsUserWrapper') || document.getElementById('dsGuestAuthWrapper');
        var btn = document.getElementById('dsUserBtn') || document.getElementById('dsAuthBtn');

        if (!wrapper || !btn) return;

        // Click on trigger button on touch/click devices
        btn.addEventListener('click', function(e) {
            // On touch devices or when user wants to toggle via click
            if (window.matchMedia('(hover: none)').matches || e.pointerType === 'touch') {
                e.preventDefault();
                wrapper.classList.toggle('is-open');
            }
        });

        // Close on clicking outside
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('is-open');
            }
        });

        // Ensure menu links navigate smoothly without any obstruction
        var menuItems = wrapper.querySelectorAll('.ds-acc-menu-item, .ds-btn-g-login, .ds-btn-g-reg');
        menuItems.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                // Let the browser follow href normally
            });
        });
    }

    // Call on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccountDropdown);
    } else {
        initAccountDropdown();
    }

})();


