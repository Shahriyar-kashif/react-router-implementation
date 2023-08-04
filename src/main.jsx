import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root, {loader as rootLoader, action as rootAction} from './routes/root';
import ErrorPage from './error-page';
import Contact, {loader as contactLoader,} from './routes/contact';
import EditContact, {action as editAction} from './routes/edit';
import {action as destroyAction} from './routes/destroy';
import Index from './routes/index';

// To render Contact component within the Root layout, we add it as children for nested routes.
// i.e. we make the Contact route a child of the Root route.
// We also need to tell a route where we want to render its child routes. We do that with <Outlet />.
const router = createBrowserRouter([
  {
    path:'/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {index:true, element: <Index />},
      {
        path:"contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
      {
        path:"contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
      {
        path:"contacts/:contactId/destroy",
        action: destroyAction,
        errorElement: <div>Oops! There was an error</div>,
      }
    ]
  },
]);
/*This first route is what we often call the "root route"
   since the rest of our routes will render inside of it.
    It will serve as the root layout of the UI, we'll have nested layouts as we get farther along*/
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
