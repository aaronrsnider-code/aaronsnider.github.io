"use strict";

function updateCaliforniaClock() {
    const clock = document.querySelector("#clock");

    if (!clock) {
        return;
    }

    const now = new Date();

    const date = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    }).format(now);

    const time = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }).format(now);

    clock.textContent = `${date} ${time} Cali`;
}

function initializeCopyrightYear() {
    const yearElement = document.querySelector("#copyright-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function initializeGallery() {
    const thumbnails = Array.from(
        document.querySelectorAll(".thumbnail")
    );

    const featuredImage = document.querySelector("#featured-image");
    const featuredButton = document.querySelector(".featured-button");
    const title = document.querySelector("#item-title");
    const description = document.querySelector("#item-description");
    const currentNumber = document.querySelector("#current-number");
    const totalNumber = document.querySelector("#total-number");

    const previousButton = document.querySelector("#previous-item");
    const nextButton = document.querySelector("#next-item");

    const lightbox = document.querySelector("#lightbox");
    const lightboxImage = document.querySelector("#lightbox-image");
    const lightboxClose = document.querySelector("#lightbox-close");

    if (
        thumbnails.length === 0 ||
        !featuredImage ||
        !title ||
        !description
    ) {
        return;
    }

    let currentIndex = 0;

    if (totalNumber) {
        totalNumber.textContent = String(thumbnails.length);
    }

    function selectItem(index) {
        if (index < 0) {
            currentIndex = thumbnails.length - 1;
        } else if (index >= thumbnails.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const selectedThumbnail = thumbnails[currentIndex];
        const imagePath = selectedThumbnail.dataset.image;
        const itemTitle = selectedThumbnail.dataset.title;
        const itemDescription = selectedThumbnail.dataset.description;

        if (!imagePath) {
            return;
        }

        featuredImage.src = imagePath;
        featuredImage.alt = itemTitle || "Selected gallery image";

        title.textContent = itemTitle || `Item ${currentIndex + 1}`;
        description.textContent = itemDescription || "";

        thumbnails.forEach((thumbnail, thumbnailIndex) => {
            const isSelected = thumbnailIndex === currentIndex;

            thumbnail.classList.toggle("selected", isSelected);
            thumbnail.setAttribute(
                "aria-current",
                isSelected ? "true" : "false"
            );
        });

        if (currentNumber) {
            currentNumber.textContent = String(currentIndex + 1);
        }

        selectedThumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest"
        });
    }

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener("click", () => {
            selectItem(index);
        });
    });

    previousButton?.addEventListener("click", () => {
        selectItem(currentIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        selectItem(currentIndex + 1);
    });

    function openLightbox() {
        if (!lightbox || !lightboxImage) {
            return;
        }

        lightboxImage.src = featuredImage.src;
        lightboxImage.alt = featuredImage.alt;
        lightbox.hidden = false;

        document.body.style.overflow = "hidden";
        lightboxClose?.focus();
    }

    function closeLightbox() {
        if (!lightbox) {
            return;
        }

        lightbox.hidden = true;
        document.body.style.overflow = "";
        featuredButton?.focus();
    }

    featuredButton?.addEventListener("click", openLightbox);
    lightboxClose?.addEventListener("click", closeLightbox);

    lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" && lightbox?.hidden !== false) {
            selectItem(currentIndex - 1);
        }

        if (event.key === "ArrowRight" && lightbox?.hidden !== false) {
            selectItem(currentIndex + 1);
        }

        if (event.key === "Escape" && lightbox?.hidden === false) {
            closeLightbox();
        }
    });

    selectItem(0);
}

updateCaliforniaClock();
window.setInterval(updateCaliforniaClock, 1000);

initializeCopyrightYear();
initializeGallery();
"use strict";

/* ==========================================
   PAGE TRANSITIONS
   ========================================== */

function initializePageTransitions() {
    const body = document.body;

    body.classList.add("page-enter");

    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            body.classList.remove("page-enter");
        });
    });

    document.querySelectorAll("a[href]").forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            const opensNewTab = link.target === "_blank";

            const isSpecialLink =
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                href.startsWith("javascript:");

            const isExternal =
                link.hostname &&
                link.hostname !== window.location.hostname;

            /*
             * Same-page section links should scroll normally
             * without fading the entire page.
             */
            if (href.startsWith("#")) {
                const target = document.querySelector(href);

                if (target) {
                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    history.pushState(null, "", href);
                }

                return;
            }

            if (opensNewTab || isSpecialLink || isExternal) {
                return;
            }

            event.preventDefault();

            body.classList.add("page-exit");

            window.setTimeout(() => {
                window.location.href = href;
            }, 350);
        });
    });

    window.addEventListener("pageshow", () => {
        body.classList.remove("page-exit");
        body.classList.remove("page-enter");
    });
}

initializePageTransitions();