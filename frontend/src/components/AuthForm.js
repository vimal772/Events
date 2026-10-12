import {
  Form,
  Link,
  useSearchParams,
  json,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const [selectedQuery] = useSearchParams();

  const isLogin = selectedQuery.get("mode") === "login";
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>
        {data && data.errors && (
          <ul>
            {Object.values(data.errors).map((error) => {
              return <li key={error}>{error}</li>;
            })}
          </ul>
        )}
        {data && data.message && 
          <p>{data.message}</p>
        }
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button disabled={isSubmitting}>{isSubmitting ? 'Submitting..' : 'Save'}</button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;

export async function action({ request }) {
  const serachParams = new URL(request.url).searchParams;
  const mode = serachParams.get("mode") || "login";
  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode selected" }, { status: 422 });
  }

  const formData = await request.formData();
  const authBody = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authBody),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    return json(
      { message: "Failed authenticating the email & password" },
      { status: 422 },
    );
  }

  const data = await response.json()
  const token = data.token
  localStorage.setItem('authToken', token)

  return redirect("/");
}
