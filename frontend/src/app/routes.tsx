import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./screens/Home";
import { PracticeHub } from "./screens/PracticeHub";
import { Practice } from "./screens/Practice";
import { SendMoney } from "./screens/practice/SendMoney";
import { QRPay } from "./screens/practice/QRPay";
import { Password } from "./screens/practice/Password";
import { InstallApp } from "./screens/practice/InstallApp";
import { OrderBlinkit } from "./screens/practice/OrderBlinkit";
import { SymbolLiteracy } from "./screens/practice/SymbolLiteracy";
import { AadhaarModule } from "./screens/practice/AadhaarModule";
import { SafetyHub } from "./screens/SafetyHub";
import { Detect } from "./screens/Detect";
import { DetectDeepfakes } from "./screens/DetectDeepfakes";
import { Simulator } from "./screens/Simulator";
import { OTPScam } from "./screens/safety/OTPScam";
import { FakeLink } from "./screens/safety/FakeLink";
import { FakeApp } from "./screens/safety/FakeApp";
import { SocialEngineering } from "./screens/safety/SocialEngineering";
import { Progress } from "./screens/Progress";
import { CommunitySiren } from "./screens/CommunitySiren";
import { CommunityQuiz } from "./screens/CommunityQuiz";
import { EmergencyContacts } from "./screens/EmergencyContacts";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      // Practice mode
      { path: "practice", Component: PracticeHub },
      { path: "practice/upi-pin", Component: Practice },
      { path: "practice/send-money", Component: SendMoney },
      { path: "practice/qr-pay", Component: QRPay },
      { path: "practice/password", Component: Password },
      { path: "practice/install-app", Component: InstallApp },
      { path: "practice/order-blinkit", Component: OrderBlinkit },
      { path: "practice/symbol-literacy", Component: SymbolLiteracy },
      { path: "practice/aadhaar", Component: AadhaarModule },
      // Safety mode
      { path: "safety", Component: SafetyHub },
      { path: "detect", Component: Detect },
      { path: "detect-deepfakes", Component: DetectDeepfakes },
      { path: "chat", Component: Simulator },
      { path: "safety/otp-scam", Component: OTPScam },
      { path: "safety/fake-link", Component: FakeLink },
      { path: "safety/fake-app", Component: FakeApp },
      { path: "safety/social-eng", Component: SocialEngineering },
      // Progress
      { path: "progress", Component: Progress },
      { path: "community-siren", Component: CommunitySiren },
      { path: "community-quiz", Component: CommunityQuiz },
      { path: "emergency-contacts", Component: EmergencyContacts },
    ],
  },
]);
