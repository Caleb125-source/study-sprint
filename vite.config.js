import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.js",
    include: [
      "src/tests/SettingsPage.test.jsx",
      "src/tests/ProgressPage.test.jsx",
      "src/tests/LoginPage.test.jsx",
      "src/tests/SignupPage.test.jsx",

    ],
  },
});