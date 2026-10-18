import Page from "@classes/Page";

export class Merch extends Page {
  constructor({ cart }) {
    super({
      element: ".merch",
      elements: {
        wrapper: ".merch__wrapper",
        product: ".merch__product",
        colorButtons: ".merch__color",
        sizeButtons: ".merch__size",
        addButton: ".merch__add",
        added: ".merch__added",
        success: ".merch__success",
      },
    });

    this.cart = cart;
  }

  create() {
    super.create();

    const params = new URLSearchParams(window.location.search);
    if (params.has("success")) {
      this.cart.clear();
      if (this.elements.success) this.elements.success.hidden = false;
    }
  }

  toArray(elements) {
    if (!elements) return [];
    return elements instanceof NodeList ? Array.from(elements) : [elements];
  }

  selected(elements) {
    return this.toArray(elements).find(
      (btn) => btn.getAttribute("aria-pressed") === "true"
    );
  }

  select(elements, clicked) {
    this.toArray(elements).forEach((btn) =>
      btn.setAttribute("aria-pressed", String(btn === clicked))
    );
  }

  addEventListeners() {
    this.toArray(this.elements.colorButtons).forEach((button) =>
      button.addEventListener("click", this.onColorClick)
    );
    this.toArray(this.elements.sizeButtons).forEach((button) =>
      button.addEventListener("click", this.onSizeClick)
    );
    this.elements.addButton?.addEventListener("click", this.onAddClick);
  }

  removeEventListeners() {
    this.toArray(this.elements.colorButtons).forEach((button) =>
      button.removeEventListener("click", this.onColorClick)
    );
    this.toArray(this.elements.sizeButtons).forEach((button) =>
      button.removeEventListener("click", this.onSizeClick)
    );
    this.elements.addButton?.removeEventListener("click", this.onAddClick);
  }

  onColorClick = (event) => {
    this.select(this.elements.colorButtons, event.currentTarget);
  };

  onSizeClick = (event) => {
    this.select(this.elements.sizeButtons, event.currentTarget);
    this.elements.addButton.disabled = false;
  };

  onAddClick = () => {
    const color = this.selected(this.elements.colorButtons)?.dataset.color;
    const size = this.selected(this.elements.sizeButtons)?.dataset.size;
    if (!color || !size) return;

    this.cart.add({
      color,
      size,
      price: Number(this.elements.product.dataset.price),
    });

    this.elements.added.hidden = false;
    clearTimeout(this.addedTimeout);
    this.addedTimeout = setTimeout(() => (this.elements.added.hidden = true), 2000);
  };
}
