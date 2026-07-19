"use strict";

const galleryFile = document.body.dataset.galleryFile;

const thumbnailGrid = document.getElementById("thumbnail-grid");
const featuredImage = document.getElementById("featured-image");
const featuredButton = document.getElementById("featured-button");

const itemTitle = document.getElementById("item-title");
const itemDescription = document.getElementById("item-description");

const currentNumber = document.getElementById("current-number");
const totalNumber = document.getElementById("total-number");

const previousButton = document.getElementById("previous-item");
const nextButton = document.getElementById("next-item");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");

let galleryItems = [];
let currentIndex = 0;

async function loadGallery() {
    try {
        const response = await fetch(galleryFile);

        if (!response.ok) {
            throw new Error(`Could not load ${galleryFile}`);
        }

        galleryItems = await response.json();

        if (!Array.isArray(galleryItems) || galleryItems.length === 0) {
            throw new Error("The gallery list is empty.");
        }

        createThumbnails();
        selectItem(0);
    } catch (error) {
        console.error(error);

        itemTitle.textContent = "Gallery could not load";

        itemDescription.textContent =
            "Open this website using Live Server instead of double-clicking the HTML file.";
    }
}

function createThumbnails() {
    thumbnailGrid.innerHTML = "";

    galleryItems.forEach((item, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "thumbnail";
        button.setAttribute(
            "aria-label",
            `View ${item.title || `item ${index + 1}`}`
        );

        const image = document.createElement("img");

        image.src = item.image;
        image.alt = item.title || `Gallery image ${index + 1}`;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            button.classList.add("image-error");
            image.alt = `Missing image: ${item.image}`;
        });

        button.appendChild(image);

        button.addEventListener("click", () => {
            selectItem(index);
        });

        thumbnailGrid.appendChild(button);
    });

    totalNumber.textContent = String(galleryItems.length);
}

function selectItem(index) {
    if (galleryItems.length === 0) {
        return;
    }

    if (index < 0) {
        currentIndex = galleryItems.length - 1;
    } else if (index >= galleryItems.length) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }

    const item = galleryItems[currentIndex];

    featuredImage.classList.add("is-fading");

    window.setTimeout(() => {
        featuredImage.src = item.image;
        featuredImage.alt = item.title || "Selected gallery image";

        itemTitle.textContent =
            item.title || `Item ${currentIndex + 1}`;

        itemDescription.textContent =
            item.description || "";

        currentNumber.textContent = String(currentIndex + 1);

        const thumbnails =
            thumbnailGrid.querySelectorAll(".thumbnail");

        thumbnails.forEach((thumbnail, thumbnailIndex) => {
            const selected = thumbnailIndex === currentIndex;

            thumbnail.classList.toggle("selected", selected);

            thumbnail.setAttribute(
                "aria-current",
                selected ? "true" : "false"
            );
        });

        thumbnails[currentIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest"
        });

        if (featuredImage.complete) {
            featuredImage.classList.remove("is-fading");
        } else {
            featuredImage.addEventListener(
                "load",
                () => {
                    featuredImage.classList.remove("is-fading");
                },
                { once: true }
            );
        }
    }, 100);
}function openLightbox() {
    lightboxImage.src = featuredImage.src;
    lightboxImage.alt = featuredImage.alt;

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";

    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";

    featuredButton.focus();
}

previousButton.addEventListener("click", () => {
    selectItem(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
    selectItem(currentIndex + 1);
});

featuredButton.addEventListener("click", openLightbox);
lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !lightbox.hidden) {
        closeLightbox();
        return;
    }

    if (!lightbox.hidden) {
        return;
    }

    if (event.key === "ArrowLeft") {
        selectItem(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
        selectItem(currentIndex + 1);
    }
});

loadGallery();