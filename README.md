# Better Store SDK

🚀 **Better Store SDK** is a modern, developer-friendly sdk toolkit designed to help developers build flexible and powerful e-commerce stores with ease.

## 📦 Installation

```sh
npm install @betterstore/sdk
```

## 🚀 Quick Start

```javascript
import { BetterStore } from "@betterstore/sdk";

const betterStore = new BetterStore("YOUR_API_KEY");

betterStore.checkout.create({
  type: "hosted",
  lineItems: [{ productId: "example_id", quantity: 1 }],
});
```

## 📚 Documentation

Full documentation is available at **[betterstore.io](https://betterstore.io)**.

## 🤝 Contributing

We welcome contributions! Please check the [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## ⚖️ License

This project is licensed under the [MIT License](./LICENSE).
