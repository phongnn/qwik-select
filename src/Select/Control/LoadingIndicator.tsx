import { component$ } from "@builder.io/qwik";

const LoadingIndicator = component$(() => {
  return (
    <div class="qs-spinner">
      <svg class="qs-spinner-icon" viewBox="25 25 50 50">
        <circle
          class="qs-spinner-path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-miterlimit="10"
        />
      </svg>
    </div>
  );
});

export default LoadingIndicator;
