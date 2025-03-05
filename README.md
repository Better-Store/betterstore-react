# Better Store SDK

🚀 **Better Store SDK** is a modern, developer-friendly eCommerce toolkit designed to help developers build flexible and powerful online stores with ease.

## ✨ Features

- 🛒 **Custom Checkout** – Build checkout flows that suit your business needs.
- 💳 **Payments** – Integrate with Stripe, PayPal, and custom gateways.
- 📦 **Product & Order Management** – API-driven store management.
- 🎨 **Customizable UI** – Prebuilt components and themes.
- 📡 **Webhooks & API Events** – Extend and automate eCommerce operations.
- 🚀 **Optimized for DX** – Built with TypeScript and fully documented.

## 📦 Installation

```sh
npm install better-store-sdk
```

## 🚀 Quick Start

```javascript
import { BetterStore } from "better-store-sdk";

const store = new BetterStore({ apiKey: "YOUR_API_KEY" });

store.checkout.start({
  cart: [{ id: "prod_1", name: "T-Shirt", price: 20 }],
  currency: "USD",
});
```

## 📚 Documentation

Full documentation is available at **[betterstore.dev](https://betterstore.dev)**.

## 🤝 Contributing

We welcome contributions! Please check the [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## ⚖️ License

This project is licensed under the [MIT License](./LICENSE).
