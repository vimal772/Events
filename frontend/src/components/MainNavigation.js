import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import NewsletterSignup from "./NewsletterSignup";

const navTabs = [
  { to: "/", title: "Home" },
  { to: "/events", title: "Events" },
  { to: "/newsletter", title: "Newsletter" },
  { to: "/Auth?mode=login", title: "Authentication" },
];

function MainNavigation() {
  const token = useRouteLoaderData("root");
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          {navTabs.map((tab) => {
            if (tab.title === "Authentication" && token) {
              return null;
            }
            return (
              <li>
                <NavLink
                  to={tab.to}
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  end
                >
                  {tab.title}
                </NavLink>
              </li>
            );
          })}
          {token && (
            <li>
              <Form action="/logout" method="post">
                <button>Logout</button>
              </Form>
            </li>
          )}
        </ul>
      </nav>
      <NewsletterSignup />
    </header>
  );
}

export default MainNavigation;
