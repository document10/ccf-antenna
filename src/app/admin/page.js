"use client";

export default function Login() {
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  const validate = (e) => {
    e.preventDefault();
    const input = document.querySelector('input[type="password"]');
    const message = document.querySelector("#message");
    input.classList.remove("border-red-500", "border-green-500");
    if (input.value === password) {
      message.innerText = "Access granted! Redirecting to dashboard...";
      input.classList.add("border-green-500");
      setTimeout(() => {
        window.location.href = `/dashboard?password=${input.value}`;
      }, 1000);
    } else {
      message.innerText = "Access denied! Incorrect password.";
      input.classList.add("border-red-500");
    }
  }
  return (
    <div id="login-page">
      <form className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]" onSubmit={validate}>
        <h1 className="text-4xl font-bold text-center box-border p-3">Admin Panel</h1>
        <input type="password" placeholder="Password" className="text-center p-2 border rounded-md w-75 box-border transition-all duration-500 focus:outline-none"/>
        <p className="text-center text-gray-500 text-sm mt-2" id="message">Enter the admin password to access the dashboard.</p>
        <div className="flex flex-row justify-center items-center w-full max-w-md">
          <button className="text-2xl font-bold text-center p-3 text-gray-950 bg-white rounded-2xl m-2 cursor-pointer transition-all duration-500 hover:bg-gray-200 hover:text-gray-800" type="submit">Accept</button>
          <button className="text-2xl font-bold text-center p-3 text-gray-100 bg-blue-800 rounded-2xl m-2 cursor-pointer transition-all duration-500 hover:bg-blue-900 hover:text-gray-300" type="reset" onClick={() => window.location.href = "/"}>Return</button>
        </div>
      </form>
    </div>

  );
}
