(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const startedAt = form.querySelector('[name="_startedAt"]');
  if (startedAt) startedAt.value = String(Date.now());

  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector('[type="submit"]');
  const apiBase = "__ANCHOR_FORMS_API_BASE__";
  const endpoint = `${apiBase.replace(/\/$/, "")}/api/forms/mower-man-qld`;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!apiBase || apiBase.includes("__ANCHOR_FORMS_API_BASE__")) {
      status.textContent = "Online enquiries are being connected. Please call 0473 213 448 or email Admin@maryboroughmowerman.com.au.";
      status.className = "form-status error";
      return;
    }

    submit.disabled = true;
    status.textContent = "Sending enquiry...";
    status.className = "form-status";

    const data = Object.fromEntries(new FormData(form).entries());
    data._subject = "New Mower Man QLD enquiry";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to send enquiry");
      }

      form.reset();
      if (startedAt) startedAt.value = String(Date.now());
      status.textContent = "Thanks, your enquiry has been sent.";
      status.className = "form-status success";
    } catch (error) {
      status.textContent = "Load failed. Please call 0473 213 448 or email Admin@maryboroughmowerman.com.au.";
      status.className = "form-status error";
    } finally {
      submit.disabled = false;
    }
  });
})();
