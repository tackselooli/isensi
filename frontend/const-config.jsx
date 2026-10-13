import logo from "./src/assets/home/girl.jpg";

import banner1 from "./src/assets/home/banner-1.jpg";
import banner2 from "./src/assets/home/banner-2.jpg";
import banner3 from "./src/assets/home/banner-3.png";
import banner4 from "./src/assets/home/banner-4.jpg";

// Gallery images — all 6 are now imported (previously only 3 were imported
// and image2 was duplicated to fill the array).
import image1 from "./src/assets/gallary/image1.png";
import image2 from "./src/assets/gallary/image2.png";
import image3 from "./src/assets/gallary/image3.jpg";
import image4 from "./src/assets/gallary/image4.jpg";
import image5 from "./src/assets/gallary/image5.jpg";
import image6 from "./src/assets/gallary/image6.jpg";

import {
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  FitnessCenterOutlined,
  PieChartOutline,
  RestaurantOutlined,
  ArticleOutlined,
  AssessmentOutlined,
  SettingsOutlined,
  LogoutOutlined,
} from "@mui/icons-material";

export const constConfig = {
  // base url for backend API
  baseUrl: "http://localhost:3000/",

  // logo site, title and tag
  siteLogoTitle: "Sajjad Rastkhiz",
  siteLogoTag: "isensi",
  siteLogoPath: logo,

  // fake user profile picture for testing
  profilePicture: image3,

  // Navigation link keys (translated via useLanguage).
  // The actual display labels are resolved at runtime.
  navLinkKeys: ["home", "instructors", "classes", "articles", "products"],

  // Home banner data
  bannerData: [
    {
      image: banner3,
      titleKey: "home.heroTitle",
      descriptionKey: "home.heroDesc",
      buttonTextKey: "home.joinNow",
      buttonText2Key: "home.moreDetails",
    },
    {
      image: banner4,
      titleKey: "home.heroTitle",
      descriptionKey: "home.heroDesc",
      buttonTextKey: "home.joinNow",
      buttonText2Key: "home.moreDetails",
    },
    {
      image: banner1,
      titleKey: "home.heroTitle",
      descriptionKey: "home.heroDesc",
      buttonTextKey: "home.joinNow",
      buttonText2Key: "home.moreDetails",
    },
    {
      image: banner2,
      titleKey: "home.heroTitle",
      descriptionKey: "home.heroDesc",
      buttonTextKey: "home.joinNow",
      buttonText2Key: "home.moreDetails",
    },
  ],

  // Gallery Data — now uses all 6 unique images
  galleryImages: [image1, image2, image3, image4, image5, image6],

  // FAQ question (Persian). English translations live in i18n/translations.js
  faqs: [
    {
      question: "چگونه می‌توانم در سایت ثبت‌نام کنم؟",
      answer:
        "برای ثبت‌نام در سایت، ابتدا بر روی دکمه ثبت‌نام کلیک کنید و فرم مربوطه را پر کنید. پس از تایید ایمیل، حساب کاربری شما ایجاد می‌شود.",
    },
    {
      question: "آیا می‌توانم برنامه تمرینی شخصی‌سازی شده دریافت کنم؟",
      answer:
        "بله، ما برنامه‌های تمرینی متناسب با اهداف و نیازهای شما ارائه می‌دهیم. کافی است با مربیان ما تماس بگیرید.",
    },
    {
      question: "چگونه می‌توانم از تخفیفات ویژه استفاده کنم؟",
      answer:
        "برای استفاده از تخفیفات ویژه، کد تخفیف را هنگام پرداخت وارد کنید. همچنین می‌توانید از پیشنهادات ویژه سایت استفاده کنید.",
    },
    {
      question: "چگونه عضله سازی کنم؟",
      answer:
        "برای عضله سازی باید تمرینات قدرتی انجام دهید و تغذیه مناسب داشته باشید.",
    },
    {
      question: "بهترین رژیم غذایی برای کاهش وزن چیست؟",
      answer:
        "رژیم غذایی متعادل و کم کالری همراه با ورزش منظم بهترین راه برای کاهش وزن است.",
    },
    {
      question: "چگونه استرس را مدیریت کنم؟",
      answer:
        "مدیتیشن، یوگا، ورزش و مدیریت زمان می توانند به کاهش استرس کمک کنند.",
    },
  ],

  // Dashboard navigation items — text is a translation key
  dashboardSidbarItems: [
    { textKey: "dashboard.home", icon: <HomeOutlined />, routeText: "/dashboard" },
    { textKey: "dashboard.users", icon: <Groups2Outlined />, routeText: "/dashboard/users" },
    { textKey: "dashboard.classes", icon: <ShoppingCartOutlined />, routeText: "/dashboard/classes" },
    { textKey: "dashboard.payments", icon: <ReceiptLongOutlined />, routeText: "/dashboard/payments" },
    { textKey: "dashboard.workoutPlans", icon: <FitnessCenterOutlined />, routeText: "/dashboard/workout-plans" },
    { textKey: "dashboard.dietPlans", icon: <RestaurantOutlined />, routeText: "/dashboard/diet-plans" },
    { textKey: "dashboard.articles", icon: <ArticleOutlined />, routeText: "/dashboard/articles" },
    { textKey: "dashboard.dailyReports", icon: <TodayOutlined />, routeText: "/dashboard/daily-reports" },
    { textKey: "dashboard.monthlyReports", icon: <CalendarMonthOutlined />, routeText: "/dashboard/monthly-reports" },
    { textKey: "dashboard.analytics", icon: <TrendingUpOutlined />, routeText: "/dashboard/analytics" },
    { textKey: "dashboard.admin", icon: <AdminPanelSettingsOutlined />, routeText: "/dashboard/admin" },
    { textKey: "dashboard.settings", icon: <SettingsOutlined />, routeText: "/dashboard/settings" },
    { textKey: "common.logout", icon: <LogoutOutlined />, routeText: "/logout" },
  ],
};
