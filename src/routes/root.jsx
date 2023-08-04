//global layout of the app will be defined here
import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation } from "react-router-dom";
import { createContact, getContacts } from "../contacts";
// To use the data from the loader in our component, we use the useLoaderData hook
import { useEffect } from "react";
export default function Root() {
    const {contacts, q} = useLoaderData();
    const navigation = useNavigation();
    // useNavigation returns the current navigation state:
    // it can be one of "idle" | "submitting" | "loading".
    useEffect(() => {
        document.getElementById("q").value = q; //To set the value based on the search params in url
        //so that when the user presses the back button, the previous value doesnt persist.
        //using controlled component, this could get messy, if we would need to define a state
        // and then apply an eventHandler on the search field.
    }, [q])
    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue = {q}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={true}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
            {/* The vite server isnt configured to handle a post request so if we click this
            new button, out app would blow up. So intead we use the Form element provided by react
            router so that it can post the request to a route action (handling everything client side) */}
          </div>
          <nav>
                {/* With anchor tag, browser is doing a full document request for the next url
                instead of using react router. Client side routing using react-router allows us
                to update the URL without requesting another document from the server. We can do
                this using <Link>. Using link, you can check in the browser devtools network tab
                that no requests are being made for the document because this is handled by react-
                router using client side routing */}
                {contacts.length ? (
                    <ul>
                        {contacts.map((contact) => (
                            <li key={contact.id}>
                                <NavLink to={`contacts/${contact.id}`}
                                className={({isActive, isPending}) =>
                                    isActive
                                    ? "active"
                                    : isPending
                                    ? "pending"
                                    : ""
                                }>
                                    {contact.first || contact.last ? (
                                        <>
                                         {contact.first} {contact.last}
                                        </>
                                    ): (
                                        <i>No Name</i>
                                    )}{" "}
                                    {contact.favorite && <span>★</span>}
                                </NavLink>
                            </li>
                        ))}

            </ul>

            ):(
                <p>
                    <i>No contacts</i>
                </p>
            )}
          </nav>
        </div>
        <div id="detail"
        className={
            navigation.state === "loading" ? "loading" : ""
        }
        >
            <Outlet />
        </div>
      </>
    );
  }

  export async function loader({request}) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
  }
  // We have to configure this loader on the route
  export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
  }
