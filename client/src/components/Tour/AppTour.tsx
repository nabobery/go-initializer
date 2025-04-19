import React from "react"; // Import React
import Joyride, {
  Step,
  CallBackProps,
  TooltipRenderProps,
  Styles, // Import Styles type
} from "react-joyride";
import { useConfigStore } from "../../store/useConfigStore";

interface AppTourProps {
  run: boolean;
  onTourComplete: () => void;
}

// CustomTooltip Component (Using Tailwind dark: variants)
function CustomTooltip(props: TooltipRenderProps) {
  const {
    backProps, closeProps, index, primaryProps, skipProps,
    step, tooltipProps, size, isLastStep,
  } = props;

  // Read themeMode ONLY for SVG colors that cannot be styled via Tailwind classes
  const themeMode = useConfigStore((state) => state.themeMode);
  const isDark = themeMode === "dark";
  // Define arrow colors based on themeMode
  const arrowFillColor = isDark ? "#1f2937" : "#ffffff"; // Corresponds to dark:bg-dark-card or bg-white
  const arrowBorderColor = isDark ? "#374151" : "#e5e7eb"; // Corresponds to dark:border-dark-border or border-gray-200

  // --- Arrow Positioning Logic ---
  const placement = step.placement;
  let arrowStyle: React.CSSProperties = {};
  let arrowSvg: React.ReactNode = null;

  const baseArrowStyle: React.CSSProperties = {
    position: "absolute",
    overflow: "hidden",
    zIndex: 1, // Ensure arrow is visually connected, might need adjustment
  };

  // Calculate placement-specific styles and SVG
  if (placement === "top" || placement === "top-start" || placement === "top-end") {
    arrowStyle = {
      ...baseArrowStyle,
      bottom: -15, // Overlap border slightly
      left: '50%',
      transform: 'translateX(-50%)',
      width: 32,
      height: 16,
    };
    arrowSvg = (
      <svg width="32" height="16">
        {/* Arrow pointing down */}
        <polygon points="0,0 16,16 32,0" fill={arrowFillColor} stroke={arrowBorderColor} strokeWidth="1" />
      </svg>
    );
  } else if (placement === "bottom" || placement === "bottom-start" || placement === "bottom-end") {
     arrowStyle = {
      ...baseArrowStyle,
      top: -15, // Overlap border slightly
      left: '50%',
      transform: 'translateX(-50%)',
      width: 32,
      height: 16,
    };
    arrowSvg = (
      <svg width="32" height="16">
         {/* Arrow pointing up */}
        <polygon points="0,16 16,0 32,16" fill={arrowFillColor} stroke={arrowBorderColor} strokeWidth="1"/>
      </svg>
    );
  } else if (placement === "left" || placement === "left-start" || placement === "left-end") {
    arrowStyle = {
      ...baseArrowStyle,
      top: '50%',
      transform: 'translateY(-50%)',
      right: -15, // Overlap border slightly
      width: 16,
      height: 32,
    };
    arrowSvg = (
      <svg width="16" height="32">
        {/* Arrow pointing left */}
        <polygon points="0,16 16,0 16,32" fill={arrowFillColor} stroke={arrowBorderColor} strokeWidth="1"/>
      </svg>
    );
  } else if (placement === "right" || placement === "right-start" || placement === "right-end") {
    arrowStyle = {
      ...baseArrowStyle,
      top: '50%',
      transform: 'translateY(-50%)',
      left: -15, // Overlap border slightly
      width: 16,
      height: 32,
    };
    arrowSvg = (
      <svg width="16" height="32">
        {/* Arrow pointing right */}
        <polygon points="16,16 0,0 0,32" fill={arrowFillColor} stroke={arrowBorderColor} strokeWidth="1"/>
      </svg>
    );
  } else { // Default to bottom placement if undefined
    arrowStyle = {
      ...baseArrowStyle,
      top: -15,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 32,
      height: 16,
    };
    arrowSvg = (
      <svg width="32" height="16">
        <polygon points="0,16 16,0 32,16" fill={arrowFillColor} stroke={arrowBorderColor} strokeWidth="1"/>
      </svg>
    );
  }
  // --- End Arrow Positioning Logic ---

  return (
    <div
      {...tooltipProps}
      // Apply base and dark: variant classes directly using Tailwind's dark mode strategy
      className={`
        rounded-2xl shadow-2xl border z-50 relative p-6 max-w-md
        bg-white border-gray-200 text-gray-900
        dark:bg-dark-card dark:border-dark-border dark:text-gray-100
      `}
      style={{
        minWidth: 320,
        maxWidth: 420,
        fontFamily: "Inter var, sans-serif",
      }}
    >
      {/* Custom Arrow SVG */}
      <div style={arrowStyle}>{arrowSvg}</div>

      {/* Close Button */}
      <button
        {...closeProps}
        className="absolute top-3 right-3 text-xl text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
        aria-label="Close"
        style={{ zIndex: 10 }} // Ensure close button is clickable
      >
        ×
      </button>

      {/* Content */}
      <div className="mb-4 text-base leading-relaxed">
        {step.content}
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between mt-4 gap-2">
        {/* Skip Button */}
        <button
          {...skipProps}
          // Added dark mode focus ring offset
          className="text-red-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-card rounded"
        >
          {skipProps.title}
        </button>
        <div className="flex gap-2 ml-auto items-center">
          {/* Back Button */}
          {index > 0 && (
            <button
              {...backProps}
              // Added dark mode focus ring offset
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-card rounded px-2 py-1"
            >
              {backProps.title}
            </button>
          )}
          {/* Primary (Next/Finish) Button */}
          <button
            {...primaryProps}
             // Added dark mode focus ring offset
            className="bg-primary-600 text-white rounded-lg px-4 py-2 font-semibold shadow hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-card"
          >
             {/* Use title prop for Next/Finish text, conditionally add step count */}
            {primaryProps.title} {index + 1 !== size && !isLastStep ? `(${index + 1}/${size})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

// AppTour Component (Main logic, styles, and steps)
function AppTour({ run, onTourComplete }: AppTourProps) {
  // Define the tour steps
  const steps: Step[] = [
    {
      target: "#metadata-input-group",
      content: "First, specify your Go module path and project name.",
      placement: "right-start",
      disableBeacon: true,
    },
    {
      target: "#framework-selector",
      content: "Choose your preferred web framework: Gin or Echo.",
      placement: "right-start",
      disableBeacon: true,
    },
    {
      target: "#database-selector",
      content:
        "Select a database (or none). GORM (for SQL) or the official driver (for MongoDB) will be included automatically.",
      placement: "right-start",
      disableBeacon: true,
    },
    {
      target: "#feature-selector",
      content: "Optionally, add common libraries for logging and testing.",
      placement: "right-start",
      disableBeacon: true,
    },
    {
      target: "#code-preview-area",
      content:
        'Click "Preview Code" to see the generated files here before downloading.',
      placement: "left-start",
      disableBeacon: true,
    },
    {
      target: "#download-button",
      content:
        "Finally, click here to generate and download your project as a ZIP file!",
      placement: "left-start",
      disableBeacon: true,
    },
    {
      target: "#tour-help-button",
      content: "You can always restart this tour by clicking here!",
      placement: "left-start",
      disableBeacon: true,
    },
  ];

  // Callback function for Joyride events
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = ["finished", "skipped"];
    // Call onTourComplete when the tour finishes or is skipped
    if (finishedStatuses.includes(status) || type === "tour:end") {
      onTourComplete();
    }
  };

  // Joyride styles configuration (using Partial<Styles> to only override specific parts)
  // Hides the default arrow and ensures the tooltip container is transparent
  const joyrideStyles: Partial<Styles> = {
    options: {
      zIndex: 1200, // Ensure tour is above most elements
      // Let the CustomTooltip handle background/theming
      backgroundColor: "transparent",
      // Hide the default Joyride arrow element entirely
      arrowColor: "transparent",
    },
    // Optional: Further ensure default tooltip doesn't interfere
    // tooltip: {
    //   padding: 0,
    // },
    // buttonClose: {
    //   display: 'none', // We have a custom close button
    // }
  };

  return (
    <Joyride
      // No key needed here anymore, theming handled by CSS
      steps={steps}
      run={run} // Control tour visibility via prop
      continuous={true} // Go to next step on clicking primary button
      callback={handleJoyrideCallback} // Handle tour end/skip events
      tooltipComponent={CustomTooltip} // Use our custom tooltip component
      styles={joyrideStyles} // Apply styles to hide default arrow etc.
      locale={{ // Text for buttons (used by CustomTooltip via props)
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip Tour",
      }}
      disableOverlayClose={true} // Prevent closing tour by clicking overlay
    />
  );
}

export default AppTour;