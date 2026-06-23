(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-before-after]").forEach((comparison) => {
    const range = comparison.querySelector(".comparison-range");
    if (!range) return;

    const updateComparison = () => {
      comparison.style.setProperty("--position", `${range.value}%`);
    };

    updateComparison();
    range.addEventListener("input", updateComparison);
  });

  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const startedAt = form.querySelector('[name="_startedAt"]');
  if (startedAt) startedAt.value = String(Date.now());

  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector('[type="submit"]');
  const apiBase = "__ANCHOR_FORMS_API_BASE__";
  const placeholderApiBase = ["__", "ANCHOR_FORMS_API_BASE", "__"].join("");
  const endpoint = `${apiBase.replace(/\/$/, "")}/api/forms/mower-man-qld`;

  function setFieldError(field, message) {
    field.classList.toggle("invalid", Boolean(message));
    let error = field.parentElement.querySelector(".error-message");
    if (message) {
      if (!error) {
        error = document.createElement("div");
        error.className = "error-message";
        field.parentElement.appendChild(error);
      }
      error.textContent = message;
    } else if (error) {
      error.remove();
    }
  }

  function setGroupError(fieldset, message) {
    fieldset.classList.toggle("invalid", Boolean(message));
    let error = fieldset.querySelector(".error-message");
    if (message) {
      if (!error) {
        error = document.createElement("div");
        error.className = "error-message";
        fieldset.appendChild(error);
      }
      error.textContent = message;
    } else if (error) {
      error.remove();
    }
  }

  function validateForm() {
    let valid = true;
    form.querySelectorAll("input[required], textarea[required]").forEach((field) => {
      const value = field.value.trim();
      let message = "";

      if (!value) {
        message = "This field is required";
      } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = "Please enter a valid email address";
      } else if (field.type === "tel" && !/^[\d\s+()-]{10,}$/.test(value)) {
        message = "Please enter a valid phone number";
      }

      setFieldError(field, message);
      if (message) valid = false;
    });

    form.querySelectorAll("[data-required-group]").forEach((fieldset) => {
      const groupName = fieldset.dataset.requiredGroup;
      const checked = fieldset.querySelectorAll(`input[name="${groupName}"]:checked`).length > 0;
      const message = checked ? "" : fieldset.dataset.errorMessage || "Please choose an option";
      setGroupError(fieldset, message);
      if (message) valid = false;
    });

    return valid;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      status.textContent = "Please check the highlighted fields.";
      status.className = "form-status error";
      return;
    }

    if (!apiBase || apiBase === placeholderApiBase) {
      status.textContent = "Online enquiries are being connected. Please call 0473 213 448 or email admin@mowermanqld.com.au.";
      status.className = "form-status error";
      return;
    }

    submit.disabled = true;
    status.textContent = "Sending enquiry...";
    status.className = "form-status";

    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (data[key]) {
        data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
      } else {
        data[key] = value;
      }
    }
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
      form.querySelectorAll(".invalid").forEach((field) => field.classList.remove("invalid"));
      form.querySelectorAll(".error-message").forEach((error) => error.remove());
      status.textContent = "Thanks, your enquiry has been sent.";
      status.className = "form-status success";
    } catch (error) {
      status.textContent = "Load failed. Please call 0473 213 448 or email admin@mowermanqld.com.au.";
      status.className = "form-status error";
    } finally {
      submit.disabled = false;
    }
  });
})();
