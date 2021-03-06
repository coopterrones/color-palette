import { render, screen, act, waitFor } from "@testing-library/react";
import App from "./index";
import React from "react";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { apiCalls } from "../../apiCalls";
import mockData from "../../TestData/_mockData";
import userEvent from "@testing-library/user-event";

jest.mock("../../apiCalls");

describe("App", () => {
  beforeEach(() => {
    apiCalls.getRandomPalette.mockResolvedValue(mockData.colorsForIntegration);
  });

  it("should render correct url", async () => {
    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    await waitFor(() => expect(history.location.pathname).toBe("/"));
  });

  it("Should call get random palette function on initial load", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(apiCalls.getRandomPalette).toHaveBeenCalledTimes(1)
    );

    await act(() => Promise.resolve());
  });

  it("Should render color cards correctly", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getAllByTestId("color-window")).toHaveLength(5)
    );
  });

  it("Should render color cards correctly with a user input", async () => {
    apiCalls.getRandomPaletteFromInput.mockResolvedValue(
      mockData.colorsForIntegration
    );
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getAllByTestId("color-window")).toHaveLength(5)
    );

    await act(() => Promise.resolve());
  });

  it("Should render all correct rgb values ", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("214, 78, 69")));
    await waitFor(() => expect(screen.getByText("247, 242, 163")));
    await waitFor(() => expect(screen.getByText("201, 216, 147")));
    await waitFor(() => expect(screen.getByText("57, 141, 112")));
    await waitFor(() => expect(screen.getByText("62, 80, 64")));

    await act(() => Promise.resolve());
  });

  it("should render all the correct hex code values", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
    });

    await waitFor(() => expect(screen.getByText("#D64E45")));
    await waitFor(() => expect(screen.getByText("#F7F2A3")));
    await waitFor(() => expect(screen.getByText("#C9D893")));
    await waitFor(() => expect(screen.getByText("#398D70")));
    await waitFor(() => expect(screen.getByText("#3E5040")));

    await act(() => Promise.resolve());
  });

  it("Should display the save palette form on click of save palette button", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      userEvent.click(screen.getByText("Save this palette?"))
    );

    expect(screen.getByTestId("save-palette-form"));

    await act(() => Promise.resolve());
  });

  it("Should route correctly to user favorites on click of Save Palettes button", async () => {
    const history = createMemoryHistory();

    await act(async () => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    });

    userEvent.click(screen.getByTestId("saved-palettes-link"));

    expect(screen.getByText("Please add some palettes to your list."));

    await act(() => Promise.resolve());
  });
});
