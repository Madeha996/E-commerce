(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector(".typed");
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll(".skills-animation");
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: "80%",
      handler: function (direction) {
        let progress = item.querySelectorAll(".progress .progress-bar");
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(
        isotopeItem.querySelector(".isotope-container"),
        {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active");
            this.classList.add("filter-active");
            initIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
            if (typeof aosInit === "function") {
              aosInit();
            }
          },
          false
        );
      });
  });
})();

// Shopping Cart Functionality
// Function to add item to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === product.id);
  console.log("existingItem", existingItem);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Event listener for "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    const product = {
      id: e.target.dataset.id,
      name: e.target.dataset.name,
      price: parseFloat(e.target.dataset.price),
    };
    addToCart(product);
  });
});

// Step 4: Update Cart Count in the Navigation
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").innerText = totalCount;
}

// Run update on page load
window.addEventListener("load", updateCartCount);

// Step 5: Remove Items from Cart
// Function to remove item from cart
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-item")) {
    const itemId = e.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== itemId);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems(); // Refresh cart items on the page
    updateCartCount(); // Update cart count in the navigation
  }
});

const products = [
  {
    id: 1,
    name: "Product A",
    price: 19.99,
    image: "assets/img/services.jpg",
    description: "Description for product A",
  },
  {
    id: 2,
    name: "Product B",
    price: 29.99,
    image: "assets/img/services.jpg",
    description: "Description for product B",
  },
  {
    id: 3,
    name: "Product C",
    price: 39.99,
    image: "assets/img/services.jpg",
    description: "Description for product C",
  },
  // Add more products as needed
];

function displayProducts() {
  const productList = document.getElementById("product-list");

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("col-lg-3", "col-md-10", "portfolio-item");

    productCard.innerHTML = `
      <div
              >
                <div class="portfolio-content h-100">
                  <img
                    src=${product.image}
                    class="img-fluid"
                    alt=""
                  />
                  <div class="portofolio-content-details">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <p>${product.price}</p>
                  </div>
              <button
                  class="product-content-btn add-to-cart"
                  data-id="${product.id}"
                  data-name="${product.name}"
                  data-price="${product.price}">
                Add to Cart
              </button>
                </div>
              </div>
    `;

    productList.appendChild(productCard);
  });
}

window.addEventListener("DOMContentLoaded", displayProducts);

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = parseInt(e.target.dataset.id);
    addToCart(productId);
  }
});

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  }
}
