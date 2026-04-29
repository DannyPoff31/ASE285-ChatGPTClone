import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ListItem from '../src/Dashboard/Sidebar/ListItem'

describe("ListItem", () => {
  it("renders the title", () => {
    render(
      <ListItem
        title="Test Conversation"
        handleSetSelectedChat={vi.fn()}
        conversationId="123"
      />
    );

    expect(screen.getByText("Test Conversation")).toBeInTheDocument();
  });

  it("calls handleSetSelectedChat when clicked", () => {
    const mockHandleSetSelectedChat = vi.fn();

    render(
      <ListItem
        title="Test Conversation"
        handleSetSelectedChat={mockHandleSetSelectedChat}
        conversationId="123"
      />
    );

    const listItem = screen.getByText("Test Conversation").closest(".list_item");

    expect(listItem).not.toBeNull();

    fireEvent.click(listItem!);

    expect(mockHandleSetSelectedChat).toHaveBeenCalledTimes(1);
  });

  it("passes the correct conversationId when clicked", () => {
    const mockHandleSetSelectedChat = vi.fn();

    render(
      <ListItem
        title="Test Conversation"
        handleSetSelectedChat={mockHandleSetSelectedChat}
        conversationId="abc-456"
      />
    );

    const listItem = screen.getByText("Test Conversation").closest(".list_item");

    expect(listItem).not.toBeNull();

    fireEvent.click(listItem!);

    expect(mockHandleSetSelectedChat).toHaveBeenCalledWith("abc-456");
  });
});