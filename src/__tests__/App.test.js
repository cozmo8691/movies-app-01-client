import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

window.alert = jest.fn();

const server = setupServer(
  rest.get(
    "https://3otogcf463.execute-api.eu-west-1.amazonaws.com/dev/ratings",
    (req, res, ctx) => {
      return res(ctx.json({ greeting: "hello there" }));
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const setup = () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
};

test("renders login and signup", () => {
  setup();

  const loginLink = screen.getByRole("link", { name: /login/i });
  expect(loginLink).toHaveAttribute("href", "/login");

  const signupLink = screen.getByRole("link", { name: /signup/i });
  expect(signupLink).toHaveAttribute("href", "/signup");
});

test("can navigate to login form", () => {
  setup();

  const loginLink = screen.getByRole("link", { name: /login/i });

  userEvent.click(loginLink);
  expect(screen.getByText(/email/i)).toBeVisible();
  expect(screen.getByText(/password/i)).toBeVisible();
});

test("user can login", async () => {
  setup();

  const loginLink = screen.getByRole("link", { name: /login/i });

  userEvent.click(loginLink);
  userEvent.type(
    screen.getByRole("textbox", { id: "email" }),
    "admin@example.com"
  );
  userEvent.type(screen.getByRole("textbox", { id: "password" }), "Passw0rd!");

  const btn = screen.getByRole("button", { name: /login/i });
  userEvent.click(btn);

  const heading = await screen.findByText(/ratings/i);
  expect(heading).toBeVisible();
});
