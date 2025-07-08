"use client";

export default function Home() {
  const password = "admin123";
  const validate = (e) => {
    e.preventDefault();
    const input = document.querySelector('input[type="password"]');
    input.classList.remove("border-red-500", "border-green-500");
    if (input.value === password) {
      document.querySelector("#message").innerText = "Access granted! Redirecting to dashboard...";
      input.classList.add("border-green-500");
    } else {
      document.querySelector("#message").innerText = "Access denied! Incorrect password.";
      input.classList.add("border-red-500");
    }
  }
  return (
    <form className="grid items-center justify-items-center min-h-screen place-content-center font-[family-name:var(--font-geist-sans)]" onSubmit={validate}>
      <h1 className="text-4xl font-bold text-center box-border p-3">Admin Panel</h1>
      <input type="password" placeholder="password" className="text-center p-2 border rounded-md w-75 box-border transition-all duration-500" />
      <p className="text-center text-gray-500 text-sm mt-2 transition-all duration-500" id="message">Enter the admin password to access the dashboard.</p>
      <div className="flex flex-row justify-center items-center w-full max-w-md">
        <button className="text-2xl font-bold text-center p-3 text-black bg-white rounded-2xl m-2 cursor-pointer transition-all duration-500" type="submit">Accept</button>
        <button className="text-2xl font-bold text-center p-3 text-white bg-black rounded-2xl m-2 cursor-pointer transition-all duration-500" type="reset" onClick={() => window.location.href = "/"}>Return</button>
      </div>
    </form>

  );
}
