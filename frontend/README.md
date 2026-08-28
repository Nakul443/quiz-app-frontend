# Quiz & Assessment App (Frontend)

A modern, high-performance, and fully responsive React Native application built with **TypeScript**, **NativeWind (Tailwind CSS)**, and **React Query (TanStack Query)**. This application represents the frontend layer of a dual-repo Quiz/Assessment system.

---

## 🚀 Key Features

### 🔐 Authentication & Session Guarding
*   **Role-Based Access Control**: Separate, clean navigation hierarchies for **Admins** and **Users**.
*   **Token Persistence**: Encrypted JWT storage using `react-native-keychain` with client-side expiration checks on application boot.
*   **Global Interceptor Pipelines**: Complete Axios client integration automatically attaching credentials and responding to `401 Unauthorized` errors with graceful logouts.

### 👑 Admin Console (Management System)
*   **Quiz CRUD Dashboard**: Complete creation and deletion capabilities for assessments.
*   **Active Status Toggling**: Instantly activate (`is_active: true`) or deactivate quizzes.
*   **Granular Question Management**:
    *   Interactive multiple-choice forms supporting up to 10 choices.
    *   Radio-style correct option indicators mapping to strict `is_correct` boolean option payloads.
    *   Sequential `order_index` generation for structured presentation.
*   **Submissions Review**: Real-time listing of candidate scores, emails, and exact timestamps.

### 👨‍🎓 User Portal (Exam Engine)
*   **Interactive Lobby**: Browse published quizzes and view time limits, instructions, and question counts.
*   **Exam Progression Dashboard**:
    *   Clean side-to-side navigation through assessment sections.
    *   **Dynamic Countdown Timer**: Styled color changes reflecting high visual urgency as time runs low.
    *   **Graceful Auto-Submit**: Triggers instant background submissions immediately when the timer hits zero.
    *   **Background Session Resilience**: Active React Native AppState listeners to automatically fetch, validate, and adjust remaining duration upon returning to the app.
    *   **Real-Time Back-up**: Auto-persists selected choices on every click to eliminate test-taking data loss.
*   **Detailed Results feedback**:
    *   Aggregated scorecards highlighting Pass/Fail thresholds.
    *   Detailed review showing correct vs. incorrect answers and question metadata.
*   **Attempt History**: Review past scores, timestamps, and performance metrics.

---

## 🛠️ Stack & Technologies

*   **Runtime**: React Native
*   **Language**: TypeScript (Strict compile checks)
*   **Styling**: NativeWind (Tailwind CSS engine)
*   **Data Fetching & Caching**: TanStack React Query (v5)
*   **State Management**: React Context API (Auth session states)
*   **Forms & Validation**: React Hook Form + Zod (Strict schema guards)
*   **Networking**: Axios (HTTP Interceptors)

---

## 📁 Workspace Structure

```
src/
├── config/                 # Environment & API Configurations
├── constants/              # Application roles and theme configuration
├── types/                  # Typed representations (API payloads & Router params)
├── utils/                  # Encrypted storage, JWT Decoders, and Error formatting
├── services/               # Axios HttpClient & Resource-specific API wrappers
├── context/                # Global Auth Session providers
├── hooks/                  # React Query wrapper hooks (Queries & Mutations)
├── validators/             # Zod form-level schemas (Auth, Quiz, Questions)
├── components/             # Reusable atomic UI (Button, Input, QuestionCard, Timer, etc.)
├── navigation/             # Navigation stacks and tabs (RootNavigator, AuthStack, Tabs)
└── screens/                # Core screens organized by Auth, Admin, and User folders
```

---

## ⚡ Setup & Installation

### 1. Prerequisites
Ensure you have the React Native environment set up correctly on your machine. You can follow the [Official React Native Environment Setup Guide](https://reactnative.dev/docs/set-up-your-environment).

### 2. Install Dependencies
Clone this repository, navigate to the `frontend/` subdirectory, and install the npm packages:
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `frontend/` directory (you can copy `.env.example` as a template):
```env
API_BASE_URL=http://localhost:5000/api
```
*Note: A valid, configured `API_BASE_URL` is **strictly required**. The application will fail loudly on boot if it is missing, protecting against silent connection issues.*

### 4. Running the Application

Start the **Metro Bundler**:
```bash
npm start
```

Build and launch the native shells:

#### Android
```bash
npm run android
```

#### iOS
```bash
# Install native CocoaPods dependencies first (macOS only)
bundle install && bundle exec pod install

# Build and run iOS simulator
npm run ios
```

---

## 🔒 Security & Data Integrity Safeguards

1.  **Auth Routing Guard**: Routing boundaries are resolved strictly inside `RootNavigator` based on verified JWT roles, preventing visual access to admin menus by users.
2.  **State-Proof Attempt Saving**: Unlike batched forms, every selected option patches the server in real-time. If a device crashes, restarts, or loses connectivity, reloading the attempt instantly restores the student's exact state.
3.  **Autoritative Clock**: The timer countdown operates purely as a visual indicator. If a user tries to freeze or tamper with their client-side clock, the backend's lazy-expiry check on next request will automatically finalize the attempt.
