const clerkAppearance = {
  variables: {
    colorPrimary: "#0ea5e9", // Tailwind primary-500
    colorText: "#111827", // Tailwind gray-900
    colorBackground: "#fff",
    colorInputBackground: "#f9fafb", // Tailwind gray-50
    colorInputText: "#111827",
    colorInputBorder: "#e5e7eb", // Tailwind gray-200
    colorDanger: "#ef4444", // Tailwind red-500
    colorSuccess: "#22c55e", // Tailwind green-500
    borderRadius: "0.75rem", // Tailwind rounded-xl
    fontFamily: "Inter var, sans-serif",
    // Dark mode overrides
    colorTextOnDark: "#f3f4f6", // Tailwind gray-100
    colorBackgroundDark: "#1f2937", // Tailwind dark-card
    colorInputBackgroundDark: "#111827", // Tailwind dark-bg
    colorInputTextDark: "#f3f4f6", // Tailwind gray-100
    colorInputBorderDark: "#374151", // Tailwind dark-border
  },
  elements: {
    card: "bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm flex items-center justify-center min-h-[60vh] mx-auto my-auto max-w-md w-full",
    rootBox: "flex items-center justify-center min-h-screen w-full",
    formButtonPrimary:
      "bg-primary-600 hover:bg-primary-700 text-white rounded-lg",
    headerTitle: "text-2xl font-bold text-primary-600 dark:text-primary-400",
    headerSubtitle: "text-gray-600 dark:text-gray-300",
    socialButtonsBlockButton:
      "bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white border border-gray-200 dark:border-dark-border rounded-lg " +
      "hover:bg-primary-50 dark:hover:bg-gray-700 hover:border-primary-500 dark:hover:border-primary-400 " +
      "hover:shadow-md dark:hover:shadow-lg transition-all",
    formFieldInput:
      "bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-dark-border placeholder-gray-400 dark:placeholder-gray-400",
    formFieldLabel: "text-gray-700 dark:text-gray-200 font-medium",
    formFieldHint: "text-gray-500 dark:text-gray-400",
    formFieldErrorText: "text-red-500 dark:text-red-400",
    dividerText: "text-gray-500 dark:text-gray-200 font-semibold text-sm",
    footerActionText: "text-gray-700 dark:text-gray-100 font-semibold text-sm",
    
    // UserButton styles - IMPROVED for dark mode contrast
    userButtonBox: "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400",
    userButtonTrigger: "focus:outline-none",
    userButtonPopoverCard:
      "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg p-3 rounded-xl",
    userButtonPopoverActionButton:
      "w-full flex items-center justify-start py-2 px-3 hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-colors rounded-lg",
    userButtonPopoverActionButtonText: "text-gray-900 dark:text-white font-medium",
    userButtonPopoverActionButtonIcon: "text-primary-600 dark:text-primary-400 mr-2",
    userButtonPopoverFooter:
      "border-t border-gray-100 dark:border-gray-700 pt-2 mt-2",
    userButtonAvatarBox: "ring-2 ring-primary-500 dark:ring-primary-400",
    userButtonAvatarText: "font-medium text-white bg-primary-500",
    
    // Added/improved styles for user name and email display
    userButtonPopoverUserName: "text-gray-900 dark:text-white font-semibold text-base",
    userButtonPopoverUserEmail: "text-gray-500 dark:text-gray-300 text-sm",
    userPreviewMainIdentifier: "text-gray-900 dark:text-white font-medium",
    userPreviewSecondaryIdentifier: "text-gray-500 dark:text-gray-300 text-sm",
    userProfileMainIdentifier: "text-gray-900 dark:text-white font-bold text-lg",
    userProfileSecondaryIdentifier: "text-gray-600 dark:text-gray-300 text-sm",
    
    // "Secured by Clerk" branding styles
    footerActionLink: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold",
    footerAction: "flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mt-4",
    
    // Modal styles - REDUCED SIZE
    modalBackdrop: "bg-black/40 dark:bg-black/70 backdrop-blur-sm",
    modalContent:
      "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl p-4 max-w-md w-full mx-auto my-8",
    modalCloseButton:
      "text-gray-500 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400",
    
    // User Profile Specific Styles
    userProfile_root: "p-2", 
    userProfile_card:
      "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl p-3", 
    userProfile_profilePage__title:
      "text-xl font-bold text-gray-900 dark:text-white mb-3", 
    userProfile_navbar:
      "border-b border-gray-200 dark:border-gray-700 mb-3", 
    userProfile_navbarButton:
      "px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-600 dark:hover:border-primary-400 border-b-2 border-transparent transition-colors", 
    userProfile_navbarButton__active:
      "text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 font-semibold", 
    userProfile_formButtonPrimary:
      "bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-1.5 font-medium shadow-sm", 
    userProfile_formButtonReset:
      "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-lg px-3 py-1.5 shadow-sm", 
    userProfile_formFieldLabel:
      "text-gray-700 dark:text-gray-200 font-medium mb-1.5 block", 
    userProfile_formFieldInput:
      "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg w-full p-2 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400", 
    userProfile_badge:
      "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-medium px-2 py-0.5 rounded-full", 
    userProfile_scrollBox: "text-gray-800 dark:text-gray-100", 
    userProfile_accordionTriggerButton: 
      "text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium", 
    userProfile_profileSectionTitleText:
      "text-base font-semibold text-gray-800 dark:text-white mb-2", 
    userProfile_profileSectionContent:
      "text-gray-700 dark:text-gray-200",
  },
};

export default clerkAppearance;