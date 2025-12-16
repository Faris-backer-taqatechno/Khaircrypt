# 🔐 KhairCrypt

**KhairCrypt** is a secure, modern web utility designed for encrypting and decrypting sensitive transaction payloads. It is built to strictly adhere to enterprise-grade security standards, utilizing **AES-256-CBC** encryption with **PBKDF2** key derivation.

![KhairCrypt Banner](./src/app/icon.png)

## ✨ Features

- **Robust Security**: Implements AES-256-CBC encryption with PBKDF2-HMAC-SHA256 for key derivation.
- **Dual Modes**: Seamlessly switch between Encryption (JSON -> Base64) and Decryption (Base64 -> JSON) modes.
- **Smart Inputs**:
    - Manage **Company IDs (Salts)** via a preset dropdown (Qatar, Kenya) or manual entry.
    - Real-time input validation.
- **Developer Experience**:
    - **Syntax Highlighting**: Beautifully formatted JSON output for readable debugging.
    - **One-Click Copy**: Quickly copy raw results to the clipboard.
    - **Swap Functionality**: Instantly swap output back to input for rapid testing cycles.
- **Modern UI**:
    - Fully responsive glassy design (Glassmorphism).
    - **Dark/Light Mode** support with a cyberpunk-inspired aesthetic.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (React Server Components)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Variables, Flexbox/Grid) with no external UI libraries.
- **Cryptography**: Node.js native `crypto` module.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/khaircrypt.git
    cd khaircrypt
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security Specifications

The application uses the following cryptographic parameters:

- **Algorithm**: `aes-256-cbc`
- **Key Derivation**: `pbkdf2`
    - **Digest**: `sha256`
    - **Iterations**: `65536`
    - **Key Length**: `32` bytes
    - **Salt**: Provided Company ID
- **IV (Initialization Vector)**: Randomly generated `16` bytes (prepended to the encrypted output).

---

© 2025 Khairgate. All rights reserved.
