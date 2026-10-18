import EventEmitter from "events";
import gsap from "gsap";

const STORAGE_KEY = "22c-cart";
const MAX_QUANTITY = 10;

const COLOR_LABELS = { noir: "Noir", blanc: "Blanc" };

export class Cart extends EventEmitter {
  constructor() {
    super();
    this.button = document.querySelector(".nav__cart__btn");
    this.indicator = document.querySelector(".nav__cart__indicator");
    this.drawer = document.querySelector(".cart");
    this.list = document.querySelector(".cart__items");
    this.empty = document.querySelector(".cart__empty");
    this.total = document.querySelector(".cart__total");
    this.checkoutBtn = document.querySelector(".cart__checkout");
    this.closeBtn = document.querySelector(".cart__close");
    this.error = document.querySelector(".cart__error");

    this.items = this.load();
    this.isOpen = false;

    this.addEventListeners();
    this.render();
  }

  /*
   * State
   */

  load() {
    try {
      const items = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }

  save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {}
  }

  find(color, size) {
    return this.items.find(
      (item) => item.color === color && item.size === size,
    );
  }

  add({ color, size, price }) {
    const item = this.find(color, size);

    if (item) {
      item.quantity = Math.min(item.quantity + 1, MAX_QUANTITY);
    } else {
      this.items.push({ color, size, price, quantity: 1 });
    }

    this.update();
  }

  setQuantity(color, size, quantity) {
    if (quantity <= 0) {
      this.items = this.items.filter(
        (item) => !(item.color === color && item.size === size),
      );
    } else {
      this.find(color, size).quantity = Math.min(quantity, MAX_QUANTITY);
    }

    this.update();
  }

  clear() {
    this.items = [];
    this.update();
  }

  get quantity() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  update() {
    this.save();
    this.render();
    this.emit("change", this.items);
  }

  /*
   * Rendering
   */

  render() {
    const quantity = this.quantity;
    this.indicator?.classList.toggle("is-filled", quantity > 0);
    this.button?.setAttribute(
      "aria-label",
      quantity > 0 ? `Ouvrir le panier (${quantity} article${quantity > 1 ? "s" : ""})` : "Ouvrir le panier (vide)",
    );
    if (!this.list) return;

    this.list.replaceChildren(
      ...this.items.map((item) => this.renderItem(item)),
    );

    const isEmpty = this.items.length === 0;
    this.empty.hidden = !isEmpty;
    this.checkoutBtn.disabled = isEmpty;

    const total = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    this.total.textContent = isEmpty ? "" : `Total : ${total}€`;
  }

  renderItem({ color, size, quantity, price }) {
    const li = document.createElement("li");
    li.className = "cart__item";
    li.innerHTML = `
      <p class="cart__item__name">T-shirt Araignée — ${COLOR_LABELS[color]} / ${size}</p>
      <div class="cart__item__quantity">
        <button type="button" data-action="decrement" aria-label="Retirer un">−</button>
        <span>${quantity}</span>
        <button type="button" data-action="increment" aria-label="Ajouter un"
          ${quantity >= MAX_QUANTITY ? "disabled" : ""}>+</button>
      </div>
      <p class="cart__item__price">${price * quantity}€</p>
    `;
    li.dataset.color = color;
    li.dataset.size = size;
    return li;
  }

  /*
   * Drawer
   */

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.drawer.style.display = "flex";
    gsap.to(this.drawer, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    gsap.to(this.drawer, {
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => (this.drawer.style.display = "none"),
    });
  }

  /*
   * Checkout
   */

  async checkout() {
    if (!this.items.length) return;

    this.checkoutBtn.disabled = true;
    this.error.hidden = true;

    try {
      const response = await window.fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: this.items.map(({ color, size, quantity }) => ({
            color,
            size,
            quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "checkout session request failed");

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      this.error.textContent =
        error.message || "Une erreur est survenue, réessaie.";
      this.error.hidden = false;
      this.checkoutBtn.disabled = false;
    }
  }

  /*
   * Events
   */

  onListClick = (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const { color, size } = button.closest(".cart__item").dataset;
    const item = this.find(color, size);
    const delta = button.dataset.action === "increment" ? 1 : -1;
    this.setQuantity(color, size, item.quantity + delta);
  };

  addEventListeners() {
    this.button?.addEventListener("click", () => this.open());
    this.closeBtn?.addEventListener("click", () => this.close());
    this.checkoutBtn?.addEventListener("click", () => this.checkout());
    this.list?.addEventListener("click", this.onListClick);

    this.drawer?.addEventListener("click", (event) => {
      if (event.target === this.drawer) this.close();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.close();
    });

    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      this.items = this.load();
      this.render();
    });
  }
}
