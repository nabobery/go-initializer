import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useConfigStore } from "./useConfigStore";

describe("useConfigStore", () => {
  it("sets and gets projectName", () => {
    const { result } = renderHook(() => useConfigStore());
    act(() => {
      result.current.setProjectName("myginapp");
    });
    expect(result.current.projectName).toBe("myginapp");
  });

  // Add more tests for other actions and state
});
