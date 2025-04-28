import { render, screen, fireEvent } from "@testing-library/react";
import FrameworkSelector from "./FrameworkSelector";
// Import the actual hook type for better mocking types if needed,
// but we'll primarily mock the implementation.
// import { useConfigStore } from "../../store/useConfigStore";

// Keep an external reference to the mock function for assertions
const mockSetFramework = jest.fn();

// Mock the Zustand store hook implementation using a factory
// The factory receives the selector function passed by the component
jest.mock("../../store/useConfigStore", () => ({
  // We are mocking the 'useConfigStore' export specifically
  useConfigStore: jest.fn((selector) => {
    // Define the mock state shape that the component expects
    const mockState = {
      framework: "gin", // Default state for the test suite
      setFramework: mockSetFramework, // Provide the mock function here
      // Add any other state properties or actions the component might need to select
      // e.g., other features, database, etc., if used by other selectors in the component
    };

    // If the component provided a selector function, call it with the mock state
    // Otherwise, assume the component wants the whole state object
    if (typeof selector === "function") {
      return selector(mockState);
    }
    // Return the whole mock state if no selector was provided (less common for Zustand hooks)
    return mockState;
  }),
}));

describe("FrameworkSelector", () => {
  beforeEach(() => {
    // Clear the mock function calls before each test
    mockSetFramework.mockClear();
    // Note: If tests need different initial 'framework' states,
    // you would reset the mock implementation here:
    // (useConfigStore as jest.Mock).mockImplementation(selector => { /* new mock state logic */ });
  });

  it("renders framework options", () => {
    render(<FrameworkSelector />);
    expect(
      screen.getByText(/Web Framework/i, { selector: "label" })
    ).toBeInTheDocument();

    expect(screen.getByRole("radio", { name: /Gin/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Echo/i })).toBeInTheDocument();
  });

  it("calls setFramework via store when a framework is selected", () => {
    render(<FrameworkSelector />);
    // fireEvent.click simulates user interaction
    fireEvent.click(screen.getByRole("radio", { name: /Echo/i }));

    // Check if the external mockSetFramework function was called with the correct value
    expect(mockSetFramework).toHaveBeenCalledWith("echo");
  });
});
