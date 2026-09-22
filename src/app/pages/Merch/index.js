import Page from "@classes/Page";

export class Merch extends Page {
  constructor() {
    super({
      element: ".merch",
      elements: {
        wrapper: ".merch__wrapper",
        sizeButtons: ".merch__size",
        error: ".merch__error",
      },
    });
  }

  create() {
    super.create();
  }

  toButtonArray() {
    if (!this.elements.sizeButtons) return [];
    return this.elements.sizeButtons instanceof NodeList
      ? Array.from(this.elements.sizeButtons)
      : [this.elements.sizeButtons];
  }

  addEventListeners() {
    this.onSizeClick = this.onSizeClick.bind(this);
    this.toButtonArray().forEach((button) =>
      button.addEventListener("click", this.onSizeClick)
    );
  }

  removeEventListeners() {
    this.toButtonArray().forEach((button) =>
      button.removeEventListener("click", this.onSizeClick)
    );
  }

  async onSizeClick(event) {
    const button = event.currentTarget;
    const { size } = button.dataset;

    if (button.disabled) return;

    this.toButtonArray().forEach((btn) => (btn.disabled = true));
    if (this.elements.error) this.elements.error.hidden = true;

    try {
      const response = await window.fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size }),
      });

      if (!response.ok) throw new Error("checkout session request failed");

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      if (this.elements.error) this.elements.error.hidden = false;
      this.toButtonArray().forEach((btn) => (btn.disabled = false));
    }
  }
}
