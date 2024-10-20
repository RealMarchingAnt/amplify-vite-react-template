import React from "react";
import ReactDOM from "react-dom/client";
import Todos, { loader as todosLoader} from "./routes/Todos.tsx";
import ApiUsers from "./routes/ApiUsers.tsx";
import Root from "./routes/Root.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/todos/:username",
        element: <Todos />,
        loader: todosLoader,
      },
      {
        path: "/api-users",
        element: <ApiUsers />,
      }
    ]
  }
]);

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
